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
import {translate, I18n} from 'react-i18next';
import i18n from './../../../i18n'
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import StepIndicator from '../../../components/Sidebar/StepIndicator';
import CommentBox from '../../../components/CommentSection/CommentBox'
import {
  instance,
  errors,
  getStatusClass,
  capitalize,
  getAuthHeader,
  getExtension,
  downloadDocument,
  removeExtension,
  getUserInfo,
  getUserRole
} from "../../../utilities/helpers";
import StepLoading from "../../../components/Loaders/StepLoading";
import {isNil, isEmpty, map} from 'ramda'
import {BULK_IMPORTER, EXPORTER, VIEW_STEPS, IS_AUTOMATE} from "../../../utilities/constants";
import FileSaver from "file-saver";

const Steps = ({
                 stepsInfo,
                 stepsNames,
                 step,
                 callPrev,
                 id,
                 requestStatus,
                 step1Data,
                 step2Data,
                 step3Data,
                 viewType,
                 jumpToNext,
                 step1Comments,
                 step2Comments,
                 step3Comments,
                 stepReady,
                 kcProps,
                 hasReport,
                 downloadReport
               }) => {
  return (
    <I18n ns="translations">
      {
        (t) => (
          <div>
            <div id="stepHeader" className="steps-status space-between no-previous">
              <div>
                <h4>{t('requestId')}: <span className="text-primary">{id}</span> &nbsp;&nbsp;
                  <small>{viewType === 'registration' ?
                    <span>{t('requestType')}: <span className="text-primary">{t('registration')}</span></span> :
                    <span>{t('requestType')}: <span
                      className="text-primary"> {t('deregistration')}</span></span>}</small>
                </h4>
              </div>
              <div className='steps-status no-previous'>
                <p>{i18n.t('status')}: <span className={getStatusClass(requestStatus, 'text')}>{i18n.t(requestStatus)}</span></p>
              </div>
            </div>
            {step === 1 &&
            <Form>
              <Row>
                <Col className="col-12 col-xl-4 order-xl-12 mt-3">
                  <StepIndicator stepsInfo={stepsNames} step={step} mode="view"/>
                  {hasReport &&
                  <div className="samplefile">
                    <p><i className="fa fa-file-text-o fa-2x"></i> {i18n.t('report')}
                      <button onClick={downloadReport}
                              className="btn btn-outline-dark pull-right">
                        {i18n.t('downloadReport')}</button>
                    </p>
                  </div>
                  }
                  <CommentBox header={t('commentBox.header')} comments={step1Comments}/>
                </Col>
                <Col className="col-12 col-xl-8 order-xl-1 mt-3">
                  {viewType === 'registration' &&
                  <Card>
                    <CardHeader>
                      <h6>{t('basicDetails')}</h6>
                    </CardHeader>
                    <CardBody className='steps-loading'>
                      {!stepReady &&
                      <StepLoading></StepLoading>
                      }
                      {(!isNil(step1Data) &&
                      <table className="table table-bordered mb-0">
                        <tbody>
                        <tr>
                          <th>{t('deviceCount')}</th>
                          <td>{step1Data.device_count}</td>
                        </tr>
                        <tr>
                          <th>{t('IMEIsPerDevice')}</th>
                          <td>{step1Data.imei_per_device}</td>
                        </tr>
                        {(step1Data.file === null &&
                        <tr>
                          <th>IMEIs</th>
                          <td>
                            <table className="table table-mobile-primary table-webimeis table-striped table-sm mb-0">
                              <tbody>
                              {!isEmpty(step1Data.imeis) && step1Data.imeis.map((imeiList, index) => (
                                <tr key={index}>
                                  <th>{i18n.t('device')} # {index + 1}</th>
                                  <td>
                                    <table className="table table-sm mb-0">
                                      <tbody>
                                      <tr>
                                        {imeiList.map((imei, i) => (
                                          <td key={i}>{imei}</td>
                                        ))}
                                      </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>)
                        ||
                        <tr>
                          <th>{t('file')}</th>
                          <td>
                            <button onClick={(e) => {
                              downloadDocument(kcProps,step1Data.file_link, getExtension(step1Data.file_link), removeExtension(step1Data.file), e)
                            }} value={step1Data.file_link} className="btn-link">{t('download.file')}
                            </button>
                          </td>
                        </tr>}
                        <tr>
                          <th>{t('manufacturingLocation')}</th>
                          <td>{step1Data.m_location}</td>
                        </tr>
                        </tbody>
                      </table>)
                      ||
                      <span>{t('request.inprocess')}</span>
                      }
                    </CardBody>
                  </Card>
                  }
                  {viewType === 'deregistration' &&
                  <Card>
                    <CardHeader>
                      <h6>{t('BasicDetailsDeRegistration')}</h6>
                    </CardHeader>
                    <CardBody>
                      <table className="table table-bordered mb-0">
                        <tbody>
                        <tr>
                          <th>{t('deviceCount')}</th>
                          <td>{step1Data.device_count}</td>
                        </tr>
                        <tr>
                          <th>{t('file')}</th>
                          <td>
                            <button onClick={(e) => {
                              downloadDocument(kcProps,step1Data.file_link, getExtension(step1Data.file_link), removeExtension(step1Data.file), e)
                            }} value={step1Data.file_link} className="btn-link">{t('download.file')}
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <th>{t('reason')}</th>
                          <td>{step1Data.reason}</td>
                        </tr>
                        </tbody>
                      </table>
                    </CardBody>
                  </Card>
                  }
                  <div className="stepBtn_container">
                    <Button color="primary" onClick={jumpToNext} className='btn-next-prev'>{t('next')}</Button>{' '}
                  </div>
                </Col>
              </Row>
            </Form>
            }
            {step === 2 &&
            <Form>
              <Row>
                <Col className="col-12 col-xl-4 order-xl-12 mt-3">
                  <StepIndicator stepsInfo={stepsNames} step={step} mode="view"/>
                  <CommentBox header={t('commentBox.header')} comments={step2Comments}/>
                </Col>
                <Col className="col-12 col-xl-8 order-xl-1 mt-3">
                  {viewType === 'registration' &&
                  <Card>
                    <CardHeader>
                      <h6>{t('deviceModelDescription')}</h6>
                    </CardHeader>
                    <CardBody className='steps-loading'>
                      {!stepReady &&
                      <StepLoading></StepLoading>
                      }
                      {(!isEmpty(step2Data) &&
                      <table className="table table-bordered mb-0">
                        <tbody>
                        <tr>
                          <th>{t('brand')}</th>
                          <td>{step2Data.brand}</td>
                        </tr>
                        <tr>
                          <th>{t('model')}</th>
                          <td>{step2Data.model_name}</td>
                        </tr>
                        <tr>
                          <th>{t('modelnumber')}</th>
                          <td>{step2Data.model_num}</td>
                        </tr>
                        <tr>
                          <th>{t('deviceType')}</th>
                          <td>{step2Data.device_type}</td>
                        </tr>
                        <tr>
                          <th>{t('operatingSystem')}</th>
                          <td>{step2Data.operating_system}</td>
                        </tr>
                        <tr>
                          <th>{t('technologies')}</th>
                          <td>{step2Data.technologies && step2Data.technologies.join(', ')}</td>
                        </tr>
                        </tbody>
                      </table>) ||
                      <span>{t('request.inprocess')}</span>
                      }
                    </CardBody>
                  </Card>
                  }
                  {viewType === 'deregistration' &&
                  <Card>
                    <CardHeader>
                      <h6>{t('deviceModelDescription')}</h6>
                    </CardHeader>
                    <CardBody>
                      {(!isEmpty(step2Data) &&
                      <div className='table-responsive'>
                        <table className="table table-bordered table-mobile-primary table-mob-two-column mb-0">
                          <thead>
                          <tr>
                            <th>{t('brand')}</th>
                            <th>{t('model')}</th>
                            <th>{t('modelnumber')}</th>
                            <th>{t('deviceType')}</th>
                            <th>{t('operatingSystem')}</th>
                            <th>{t('technologies')}</th>
                            <th>{t('deviceCount')}</th>
                          </tr>
                          </thead>
                          <tbody>
                          {step2Data.map((device, i) => (
                            <tr key={i}>
                              <td data-label='Brand'>{device.brand_name}</td>
                              <td data-label='Model name'>{device.model_name}</td>
                              <td data-label='Model number'>{device.model_num}</td>
                              <td data-label='Device type'>{device.device_type}</td>
                              <td data-label='Operating system'>{device.operating_system}</td>
                              <td data-label='Technologies'>{device.technology}</td>
                              <td data-label='Device count'>{device.count}</td>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>) ||
                      <span>{t('request.inprocess')}</span>
                      }
                    </CardBody>
                  </Card>
                  }
                  <div className="stepBtn_container">
                    <button color="link" onClick={callPrev} className='btn btn-next-prev'>{t('previous')}</button>
                    <Button color="primary" onClick={jumpToNext} className='btn-next-prev'>{IS_AUTOMATE[0] ? t('finish') : t('next')}</Button>{' '}
                  </div>
                </Col>
              </Row>
            </Form>
            }
            {step === 3 &&
            <Form>
              <Row>
                <Col className="col-12 col-xl-4 order-xl-12 mt-3">
                  <StepIndicator mode="view" stepsInfo={stepsNames} step={step}/>
                  <CommentBox header={t('commentBox.header')} comments={step3Comments}/>
                </Col>
                <Col className="col-12 col-xl-8 order-xl-1 mt-3">
                  <Card>
                    <CardHeader>
                      <h6>{t('approvalDocuments')}</h6>
                    </CardHeader>
                    <CardBody className='steps-loading'>
                      {!stepReady &&
                      <StepLoading></StepLoading>
                      }
                      {(!isEmpty(step3Data) &&
                      <table className="table table-bordered mb-0">
                        <tbody>
                        {step3Data.map((value, i) => {
                          return <tr key={i}>
                            <th>{capitalize(i18n.t(value.label))}</th>
                            <td>
                              <button onClick={(e) => {
                                downloadDocument(kcProps,value.link, getExtension(value.link), removeExtension(value.filename), e)
                              }} value={value.link} className="btn-link">
                                {i18n.t('clickToDownload')}
                              </button>
                            </td>
                          </tr>
                        })}
                        </tbody>
                      </table>) ||
                      <span>{t('request.inprocess')}</span>
                      }
                    </CardBody>
                  </Card>
                  <div className="stepBtn_container">
                    <button color="link" onClick={callPrev} className='btn btn-next-prev'>{t('previous')}</button>
                    <Button color="primary" onClick={jumpToNext} className='btn-next-prev'>{t('finish')}</Button>{' '}
                  </div>
                </Col>
              </Row>
            </Form>
            }
          </div>
        )
      }
    </I18n>
  )
};

class ViewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: '',
      requestId: 0,
      requestStatus: '',
      stepReady: false,
      hasReport: false,
      stepsInfo: VIEW_STEPS.stepInfo,
      stepsInfo2: VIEW_STEPS.deRegStepInfo,
      currentStep: 1,
      step1Data: {},
      step1Comments: [],
      step2Data: {},
      step2Comments: [],
      step3Data: [],
      step3Comments: []
    }
    this.getCommentsData = this.getCommentsData.bind(this);
    this.callPrev = this.callPrev.bind(this);
    this.jumpToNext = this.jumpToNext.bind(this);
    this.loadAllRelatedData = this.loadAllRelatedData.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
  }

  componentDidMount() {
    this.updateTokenHOC(this.loadAllRelatedData);
  }

  updateTokenHOC(callingFunc, values = null) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config, values);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config, values);
      }
  }

  loadAllRelatedData(config) {
    const type = this.props.match.params.type === 'registration' ? 'registration' : 'deregistration'
    const id = parseInt(this.props.match.params.id);
    this.setState({
      viewType: type,
      requestId: id
    }, () => {
      this.updateTokenHOC(this.getCommentsData);
      instance.get(`/${type}/sections/${id}`, config)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.reg_details !== {}) {
              if (type === 'registration') {
                this.setState({
                  step1Data: response.data.reg_details,
                  currentStep: 1,
                  requestStatus: response.data.reg_details.status_label,
                  hasReport: response.data.reg_details.report_allowed
                })
              }
              else {
                this.setState({
                  step1Data: response.data.dereg_details,
                  currentStep: 1,
                  requestStatus: response.data.dereg_details.status_label,
                  hasReport: response.data.dereg_details.report_allowed
                })
              }
              this.setState({
                stepReady: true
              })
            }
            if (!isEmpty(response.data.reg_device)) {
              if (type === 'registration') {
                this.setState({
                  step2Data: response.data.reg_device,
                })
              }
              else {
                this.setState({
                  step2Data: response.data.dereg_device,
                })
              }
            }
            if (!isEmpty(response.data.reg_docs)) {
              if (type === 'registration') {
                this.setState({
                  step3Data: response.data.reg_docs,
                  currentStep: 1
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
              else {
                this.setState({
                  step3Data: response.data.dereg_docs,
                  currentStep: 1
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
            }
          }
        })
        .catch((error) => {
          errors(this, error);
        })
    })
  }

  getCommentsData(config) {
    const {
      step1Comments,
      step2Comments,
      step3Comments
    } = this.state
    let step1comments = step1Comments
    let step2comments = step2Comments
    let step3comments = step3Comments
    this.setState({
      stepReady: false
    })
    const type = this.props.match.params.type === 'registration' ? 'registration_request' : 'de_registration_request'
    const id = this.state.requestId
    instance.get(`/review/sections?request_id=${id}&request_type=${type}`, config)
      .then((response) => {
        if (response.status === 200) {
          map((section) => {
            if (section.section_type === 'device_quota') {
              if (!isNil(section.comments) && !isEmpty(section.comments)) {
                section.comments.map((value) => {
                  step1comments.push(value)
                  return this.setState({
                    step1Comments: step1comments
                  });
                })
              } else {
                this.setState({
                  stepReady: true
                })
              }
            }
            else if (section.section_type === 'device_description') {
              if (!isNil(section.comments) && !isEmpty(section.comments)) {
                section.comments.map((value) => {
                  step2comments.push(value)
                   return this.setState({
                    step2Comments: step2comments
                  });
                })
              }
            }
            else if (section.section_type === 'imei_classification') {
              if (!isNil(section.comments) && !isEmpty(section.comments)) {
                section.comments.map((value) => {
                  step1comments.push(value)
                  return this.setState({
                    step1Comments: step1comments
                  });
                })
              }
            }
            else if (section.section_type === 'imei_registration') {
              if (!isNil(section.comments) && !isEmpty(section.comments)) {
                section.comments.map((value) => {
                  step1comments.push(value)
                  return this.setState({
                    step1Comments: step1comments
                  });
                })
              }
            }
            else if (section.section_type === 'approval_documents') {
              if (!isNil(section.comments) && !isEmpty(section.comments)) {
                section.comments.map((value) => {
                  step3comments.push(value)
                  return this.setState({
                    step3Comments: step3comments,
                    stepReady: true
                  });
                })
              }
            }
          }, response.data.sections)
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  callPrev() {
    const {
      currentStep,
      step1Data,
      step2Data
    } = this.state
    if (currentStep === 2 && step1Data) {
      this.setState({
        currentStep: 1,
      }, () => {
        this.setState({
          stepReady: true
        })
      })
    }
    else if (currentStep === 3 && step2Data) {
      this.setState({
        currentStep: 2,
      }, () => {
        this.setState({
          stepReady: true
        })
      })
    }
  }

  jumpToNext() {
    const {
      currentStep,
      step2Data,
      step3Data
    } = this.state
    if (currentStep === 1 && step2Data) {
      this.setState({
        currentStep: 2,
      }, () => {
        this.setState({
          stepReady: true
        })
      })
    }
    else if (currentStep === 2 && step3Data) {
      if(IS_AUTOMATE[0]){
        this.props.history.push(`/search-requests`)
      }
      else { 
      this.setState({
        currentStep: 3,
      }, () => {
        this.setState({
          stepReady: true
        })
      })
    }
    }
    else if (currentStep === 3) {
      this.props.history.push(`/search-requests`)
    }
  }

  downloadReport = (config) => {
    let userId = getUserInfo().sub
    let userType = ''
    let userRole = getUserRole(this.props.resources)
    let requestType = this.state.viewType === 'registration'? 'registration_request' :'de_registration_request'
    if (userRole === BULK_IMPORTER) {
      userType = 'importer'
    } else if (userRole === EXPORTER) {
      userType = 'exporter'
    } else {
      userType = 'individual'
    }
    instance.get(`/report/download?request_type=${requestType}&request_id=${this.state.requestId}&user_type=${userType}&user_id=${userId}`, config)
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
  render() {
    const {
      stepReady,
      stepsInfo,
      stepsInfo2,
      viewType,
      step1Data,
      step1Comments,
      step2Data,
      step2Comments,
      step3Data,
      step3Comments,
      currentStep,
      requestId,
      requestStatus
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Steps
          step1Data={step1Data}
          step2Data={step2Data}
          step3Data={step3Data}
          step1Comments={step1Comments}
          step2Comments={step2Comments}
          step3Comments={step3Comments}
          step={currentStep}
          stepsNames={viewType === 'registration' ? stepsInfo : stepsInfo2}
          viewType={viewType}
          jumpToNext={() => this.updateTokenHOC(this.jumpToNext)}
          callPrev={() => this.updateTokenHOC(this.callPrev)}
          id={requestId}
          requestStatus={requestStatus}
          stepReady={stepReady}
          kcProps={this.props}
          hasReport={this.state.hasReport}
          downloadReport={(e)=>{
            e.preventDefault()
            this.updateTokenHOC(this.downloadReport)
          }}
        />
      </div>
    )
  }
}

export default translate('translations')(ViewRequest);
