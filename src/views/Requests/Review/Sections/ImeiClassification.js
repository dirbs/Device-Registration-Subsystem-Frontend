/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, {Component} from "react";
import {Card, CardBody, CardHeader, Input} from "reactstrap";
import {isEmpty, isNil} from "ramda";
import StepLoading from "../../../../components/Loaders/StepLoading";
import i18n from '../../../../i18n';
import {errors, getAuthHeader, getUserInfo, instance} from "../../../../utilities/helpers";
import {AUTHORITY} from "../../../../utilities/constants";
import FileSaver from "file-saver";

class ImeiClassification extends Component {
  constructor(props){
    super(props)
    this.state = {
      isReportVisible: false
    }
    this.updateTokenHOC = this.updateTokenHOC.bind(this)
    this.toggleReportVisibility = this.toggleReportVisibility.bind(this)
  }
  componentDidMount() {
    this.setState({
      isReportVisible: this.props.showReport
    })
  }

  /**
   * HOC function to update token
   * @param callingFunc
   */
  updateTokenHOC(callingFunc) {
    let config = null;
    if (this.props.kcProps.kc.isTokenExpired(0)) {
      this.props.kcProps.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kcProps.kc.token)
          config = {
            headers: getAuthHeader(this.props.kcProps.kc.token)
          }
          callingFunc(config);
        })
        .error(() => this.props.kcProps.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config);
    }
  }

  downloadReport = (config) => {
    let userId = getUserInfo().sub
    let userType = ''
    let userRole = this.props.userRole
    let requestType = this.props.viewType
    if(this.props.type==='view'){
      requestType = this.props.viewType==='registration'?'registration_request':'de_registration_request'
    }
    if (userRole === AUTHORITY) {
      userType = 'reviewer'
    }
    instance.get(`/report/download?request_type=${requestType}&request_id=${this.props.id}&user_type=${userType}&user_id=${userId}`, config)
      .then((response) => {
        if (response.status === 200) {
          try {
            let file = new File([response.data], `Report.tsv`);
            FileSaver.saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([response.data]);
            window.navigator.msSaveBlob(textFileAsBlob, 'Report.tsv');
          }
        }
      })
      .catch((error) => {
        errors(this, error)
      })
  }
  toggleReportVisibility(config){
    let requestType = this.props.viewType
    let userId = getUserInfo().sub
    let data = {
      "request_type":requestType,
      "request_id":`${this.props.id}`,
      "user_type":"reviewer",
      "user_id":userId,
    }
    instance.post(`/report/permission`,data,config)
      .then((response)=>{
        if(response.status===200){
          this.setState({
            isReportVisible : response.data.value
          })
          this.props.toggleReportStatus(response.data.value)
        }
      })
      .catch((error)=>{
        errors(this,error)
      })
  }
  render(){
    const {
      step3Data,
      stepReady,
      totalImeis,
      viewType,
      type,
      reportVisibility
    } = this.props
    return (
      <Card>
        <CardHeader>
          <b>{i18n.t('reviewRegistration.step3')}</b>
        </CardHeader>
        <CardBody className='steps-loading'>
          {(((!isNil(step3Data) && !isEmpty(step3Data)) && stepReady) &&
          <table className="table table-bordered table-sm mb-0">
            <tbody>
            {viewType === 'registration_request' &&
            <tr>
              <th>{i18n.t('totalImeis')}</th>
              <td>{totalImeis || 0}</td>
            </tr>
            }
            <tr>
              <th>{i18n.t('complianceStatus')}</th>
              <td>
                <ul className="tdlist">
                  <li>{i18n.t('complianceStatus.nonCompliant')}
                    ({(!isNil(step3Data.imei_compliance_status.non_compliant_imeis) && step3Data.imei_compliance_status.non_compliant_imeis.toLocaleString()) || 0})
                  </li>
                  <li>{i18n.t('complianceStatus.compliant')}
                    ({(!isNil(step3Data.imei_compliance_status.compliant_imeis) && step3Data.imei_compliance_status.compliant_imeis.toLocaleString()) || 0})
                  </li>
                  <li>{i18n.t('complianceStatus.provisional')}
                    ({(!isNil(step3Data.imei_compliance_status.provisional_complaint) && step3Data.imei_compliance_status.provisional_complaint.toLocaleString()) || 0})
                  </li>
                  <li>{i18n.t('complianceStatus.nonProvisional')}
                    ({(!isNil(step3Data.imei_compliance_status.provisional_non_complaint) && step3Data.imei_compliance_status.provisional_non_complaint.toLocaleString()) || 0})
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>{i18n.t('perConditionClassificationState')}</th>
              <td>{!isNil(step3Data.per_condition_classification_state) &&
              <ul className="tdlist">
                <li>Duplicate
                  ({(!isNil(step3Data.per_condition_classification_state.duplicate) && step3Data.per_condition_classification_state.duplicate.toLocaleString()) || 0})
                </li>
                <li>Duplicate large
                  ({(!isNil(step3Data.per_condition_classification_state.duplicate_large) && step3Data.per_condition_classification_state.duplicate_large.toLocaleString()) || 0})
                </li>
                <li>GSMA Not Found
                  ({(!isNil(step3Data.per_condition_classification_state.gsma_not_found) && step3Data.per_condition_classification_state.gsma_not_found.toLocaleString()) || 0})
                </li>
                <li>Local Stolen
                  ({(!isNil(step3Data.per_condition_classification_state.local_stolen) && step3Data.per_condition_classification_state.local_stolen.toLocaleString()) || 0})
                </li>
                <li>Malformed
                  ({(!isNil(step3Data.per_condition_classification_state.malformed) && step3Data.per_condition_classification_state.malformed.toLocaleString()) || 0})
                </li>
                <li>Not on registration list
                  ({(!isNil(step3Data.per_condition_classification_state.not_on_registration_list) && step3Data.per_condition_classification_state.not_on_registration_list.toLocaleString()) || 0})
                </li>
              </ul>
              }
              </td>
            </tr>
            <tr>
              <th>{i18n.t('lostStolen')}</th>
              <td>
                {(step3Data.lost_stolen_status &&
                <ul className="tdlist">
                  <li>{i18n.t('lostStolen.stolen')}({step3Data.lost_stolen_status && step3Data.lost_stolen_status.stolen})</li>
                  <li>{i18n.t('provisionalStolen')}({step3Data.lost_stolen_status && step3Data.lost_stolen_status.provisional_stolen})</li>
                </ul>) || 'N/A'
                }
              </td>
            </tr>
            <tr>
              <th>{i18n.t('associated') + ' ' + i18n.t('IMEI')}</th>
              <td>{(!isNil(step3Data.associated_imeis) && step3Data.associated_imeis.toLocaleString()) || 0}</td>
            </tr>
            <tr>
              <th>{i18n.t('seenOnNetwork')}</th>
              <td>{(!isNil(step3Data.seen_on_network) && step3Data.seen_on_network.toLocaleString()) || 0}</td>
            </tr>
            <tr>
              <th>{i18n.t('downloadReportLink')}</th>
              <td>
                <button className="btn-link" onClick={(e) => {
                  e.preventDefault()
                  this.updateTokenHOC(this.downloadReport)
                }}>
                  <b>{i18n.t('downloadReport')}</b>
                </button>
              </td>
            </tr>
            {(type!=='view' &&
            <tr>
              <th>{i18n.t('review.showReport')}</th>
              <td>
                  <div className="checks-report">
                    <Input type="checkbox" name="toggleReportVisibility" checked={this.state.isReportVisible || false} onChange={() => {
                    this.updateTokenHOC(this.toggleReportVisibility)
                    }}/>
                  </div>
              </td>
            </tr>) ||
            <tr>
              <th>{i18n.t('review.showReport')}</th>
              <td><p>{reportVisibility?i18n.t('report.visible'):i18n.t('report.hidden')}</p></td>
            </tr>
            }
            </tbody>
          </table>) ||
          <StepLoading/>
          }
        </CardBody>
      </Card>
    )
  }

}
export default ImeiClassification;
