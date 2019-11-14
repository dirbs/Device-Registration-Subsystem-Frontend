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

import React, {Component} from 'react';
import i18n from '../../i18n';
import {
  Button,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import {
  instance,
  errors,
  getUserInfo,
  getAuthHeader,
  SweetAlert
} from "../../utilities/helpers";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

class Deassociation extends Component {

  constructor(props){
    super(props);
    this.state = {
      associateList: []
    }
  }
  componentDidMount()
  {
  this.updateTokenHOC(this.callServerAssociationList)
  }

  updateTokenHOC = (callingFunc, values = null) => {
    let config = null;
    if(this.props.kc.isTokenExpired(0)) {
        this.props.kc.updateToken(0)
            .success(() => {
                localStorage.setItem('token', this.props.kc.token)
                config = {
                  headers: getAuthHeader(this.props.kc.token)
                }
                callingFunc(values, config);
            })
            .error(() => this.props.kc.logout());
    } else {
        config = {
          headers: getAuthHeader()
        }
        callingFunc(values, config);
    }
}

  callServerAssociationList = (values, config) => {
    instance.get(`/associate/${getUserInfo().sub.substring(27)}` , config)
    .then(response => {
      if(response.data.message)
      {
        SweetAlert(response.data.message);
      }
      else{
        this.setState({associateList: response.data});
      }
    })
    .catch(error => {
      errors(this, error);
    })
  }

  deAssociateIMEI = (imei) => {
    const params = {
      imei: imei,
      uid: getUserInfo().sub.substring(27)
    }
    this.updateTokenHOC(this.confirmMessage, params)
  }

  confirmMessage = (values, config) => {
    MySwal.fire({
      title: i18n.t('areYouSure'),
      text: i18n.t('thisIMEIwillbeDeAssociate!'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.callServerDeAssociation(values, config);
      }
    })
  }

  callServerDeAssociation = (values, config) => {
    instance.post(`/deassociate`, values , config)
    .then(response => {
      SweetAlert({
        title: i18n.t('deAssociate') + '!',
        message: response.data.message,
        type:'info'
      });
        let updatedList = this.state.associateList.filter((elem, i ) => elem.imei === values.imei ? false : true)
        this.setState({associateList: updatedList});
    })
    .catch(error => {
      errors(this, error);
    })
  }

  callServerDeass

    render(){
      const { associateList } = this.state;
        return(
          <div className="animated fadeIn position-relative">
          <Card>
          <CardHeader>
            <b>{i18n.t('associatedIMEIsList')}</b>
          </CardHeader>
          <CardBody>
            <table className="table table-bordered table-hover table-mobile-primary table-dashboard">
              <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>{i18n.t('IMEI')}</th>
                <th>{i18n.t('startDate')}</th>
                <th>{i18n.t('endDate')}</th>
                <th>{i18n.t('actions')}</th>
              </tr>
              </thead>
              <tbody>
              {associateList.length > 0 ?
               associateList.map((elem, i) => {
                return <tr key={i}>
                   <td data-label="#"><b>{i + 1}</b></td>
                   <td data-label="IMEI">{elem.imei}</td>
                   <td data-label="Start Date">{elem.start_date}</td>
                   <td data-label="End Date">{elem.end_date ? elem.end_date : '-'}</td>
                   <td data-label="Actions"><Button size="sm" outline color="warning" onClick={() => this.deAssociateIMEI(elem.imei)}>{i18n.t('deAssociate') + ' ' + i18n.t('IMEI')}</Button></td>
                 </tr>
               })
               :
              <tr>
                <td colSpan={6}>{i18n.t('noRequestFound')}</td>
              </tr>
              }
              </tbody>
            </table>
          </CardBody>
        </Card>
        </div>
        );
    }
}

export default Deassociation;