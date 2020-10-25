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
import i18n from '../../../../i18n';
import {translate} from 'react-i18next';
import {withFormik, Field, FieldArray} from 'formik';
import {
  Row,
  Col,
  Button,
  Form,
  Label,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import renderInput from '../../../../components/Form/RenderInput'
import RenderModal from '../../../../components/Form/RenderModal'
import renderError from '../../../../components/Form/RenderError'
import RenderFileInput from '../../../../components/Form/RenderFileInput'
import StepIndicator from '../../../../components/Sidebar/StepIndicator';
import {
  getExtension,
  instance,
  errors,
  getUserInfo,
  capitalize,
  getAuthHeader,
  downloadDocument,
  removeExtension, languageCheck
} from "../../../../utilities/helpers";
import {
  DE_DOCUMENTS,
  EXTENSIONS, REQUEST_STEPS
} from "../../../../utilities/constants";
import CommentBox from "../../../../components/CommentSection/CommentBox";
import StepLoading from "../../../../components/Loaders/StepLoading";

class DeRegistrationStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step1FileUpload: false
    }

    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleFileUpload(e) {
    e.preventDefault();
    this.setState({step1FileUpload: true});
    this.props.setFieldValue('filename', '', false);
  }

  render() {
    const {
      values,
      errors,
      touched,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      setFieldTouched,
      stepsInfo,
      step,
      id,
      comments,
      statusLabel,
      stepReady,
      info,
      kcProps
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <div className="steps-status space-between">
          <div>
            <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
              <small> {i18n.t('requestType')}: <span className="text-primary">{i18n.t('deregistration')}</span></small>
            </h4>
          </div>
          <div className="steps-status no-previous">
            <p>{i18n.t('status')}: <span className='text-primary'>{i18n.t(statusLabel)}</span></p>
          </div>
        </div>
        <Row>
          <Col className='order-xl-12 mt-3' xs={12} xl={4}>
            <StepIndicator stepsInfo={stepsInfo} step={step}></StepIndicator>
            <CommentBox header={i18n.t('commentBox.header')} comments={comments}/>
          </Col>
          <Col className='order-xl-1 mt-3' xs={12} xl={8}>
            <Card>
              <CardHeader>
                <b>{i18n.t('requestSteps.de-registration.basic')}</b>
              </CardHeader>
              <CardBody className='steps-loading'>
                {!stepReady &&
                <StepLoading></StepLoading>
                }
                <div>
                  <Row>
                    <Col xs={12} sm={6}>
                      {values.filename && !this.state.step1FileUpload && <FormGroup>
                        <Label className="d-block">{i18n.t('selectedDevice')}<span className="text-danger">*</span></Label>
                        <div className="asitfield">
                          <div className='filespan'>
                            <input type="button" value={i18n.t('chooseFile')} disabled/>
                            <span className="selectedfile">{values.filename}</span>
                          </div>
                          <button className="btn btn-link btn-sm text-danger" onClick={(e) => this.handleFileUpload(e)}><i
                            className="fa fa-close"></i></button>
                        </div>
                        <button onClick={(e) => {
                          downloadDocument(kcProps,info.file_link, getExtension(info.file_link), removeExtension(values.filename), e)
                        }} value={info.file_link} className="btn-link">{i18n.t('download.file')}</button>
                      </FormGroup>}
                      {this.state.step1FileUpload &&
                      <RenderFileInput
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.filename}
                        touched={touched.filename}
                        values={values.filename}
                        fieldName="filename"
                        type="file"
                        inputClass="asitfield"
                        inputClassError="asitfield is-invalid"
                        label={i18n.t('deviceImeis')}
                        requiredStar
                      />}
                    </Col>
                    <Col xs={12} sm={6}>
                      <Field name="device_count" component={renderInput} label={i18n.t('deviceCount')} type="text"
                             placeholder={i18n.t('deviceCount')} requiredStar
                             disable={(values.filename && typeof values.filename === 'string')}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={12}>
                      <Field name="reason" component={renderInput} label={i18n.t('reasonDeregistration')} type="textarea"
                             placeholder={i18n.t('requestSteps.de-registration.reason')} requiredStar/>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" className="btn-next-prev" disabled={isSubmitting}>{i18n.t('next')}</Button>{' '}
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

class DeRegistrationStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyDevicesModal: false
    }
  }

  componentDidMount() {
    this.setState({verifyDevicesModal: true});
  }

  render() {
    const {
      values,
      handleSubmit,
      isValid,
      closeRequest,
      comments,
      stepReady,
      notRegisteredIMEIs
    } = this.props;

    return (
      <RenderModal show={this.state.verifyDevicesModal} className="modal-xl">
        <Form onSubmit={handleSubmit}>
          <ModalHeader>{i18n.t('deviceModelInformation')}</ModalHeader>
          <div className="steps-loading">
            {!stepReady &&
            <StepLoading></StepLoading>
            }
            <ModalBody>
              <Row>
                <Col xs={12} lg={4} className='order-lg-12'>
                  {notRegisteredIMEIs.length > 0 &&
                  <React.Fragment>
                    <p className="alert alert-danger"><b>Error:</b> Following IMEIs are not registered in DRS.</p>
                    <Card className="border-danger">
                      <CardHeader className="bg-danger"><b>Not Registered IMEIs</b></CardHeader>
                      <CardBody className='p0'>
                        <ul className='file-imeis'>
                          {notRegisteredIMEIs.length > 0 && notRegisteredIMEIs.map((imei, key) => (
                            <li key={key}>{imei}</li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </React.Fragment>
                  }
                  <CommentBox header={i18n.t('commentBox.header')} comments={comments}/>
                </Col>
                <Col className='order-md-1' xs={12} lg={8}>
                  <table
                    className="table table-striped table-bordered table-mobile-primary table-verify-model-info table-sm mb-0">
                    <thead>
                    <tr>
                      <th>{i18n.t('verify')}</th>
                      <th>{i18n.t('brand')}</th>
                      <th>{i18n.t('model')}</th>
                      <th>{i18n.t('modelnumber')}</th>
                      <th>{i18n.t('deviceType')}</th>
                      <th>{i18n.t('operatingSystem')}</th>
                      <th>{i18n.t('rat')}</th>
                      <th>{i18n.t('deviceCount')}</th>
                    </tr>
                    </thead>
                    <FieldArray
                      name="verified_devices"
                      render={arrayHelpers => (
                        <tbody>
                        {values.devices.length > 0 ?
                          values.devices.map((device, i) => (
                            <tr key={i}>
                              <td data-label='Verify'>
                                <label>
                                  <input
                                    name="verified_devices"
                                    type="checkbox"
                                    value={device}
                                    checked={values.verified_devices.includes(device)}
                                    onChange={e => {
                                      if (e.target.checked) arrayHelpers.push(device);
                                      else {
                                        const idx = values.verified_devices.indexOf(device);
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />{" "}
                                </label>
                              </td>
                              <td data-label='Brand'>{device.brand_name}</td>
                              <td data-label='Model name'>{device.model_name}</td>
                              <td data-label='Model Number'>{device.model_num}</td>
                              <td data-label='Device Type'>{device.device_type}</td>
                              <td data-label='Operating System'>{device.operating_system}</td>
                              <td data-label='Radio access technology'>{device.technology}</td>
                              <td data-label='Device Count'>{device.count}</td>
                            </tr>
                          ))
                          : <tr>
                            <td colSpan="8">
                              <span className="text-danger">{i18n.t('requestSteps.de-registration.noRecord')}</span>
                            </td>
                          </tr>
                        }
                        </tbody>
                      )}
                    />
                  </table>
                  <Field name="verified_devices" component={renderError}/>

                  {values.devices.length > 0 &&
                  <div className="text-info padd-info">* {i18n.t('requestInstructions.12')}</div>}
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button className='eq-width' color="secondary" type="button" onClick={closeRequest}>{i18n.t('closeRequest')}</Button>
              <Button className='eq-width' color="primary" type="submit" disabled={!isValid}>{i18n.t('reviewStatus.approve')}</Button>
            </ModalFooter>
          </div>
        </Form>
      </RenderModal>
    )
  }
}

class DeRegistrationStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    if (DE_DOCUMENTS.length > 0) {
      DE_DOCUMENTS.map((doc, i) => {
        if (this.props.info[i]) {
          this.setState({[i]: false});
          return null;
        } else {
          this.setState({[i]: true});
          return null;
        }
      })
    }
  }
  handleFileUpload(e, id, index) {
    e.preventDefault();
    //this.setState({ [id]: true}, () => {
    this.setState({[index]: true}, () => {
      this.props.setFieldValue(`documents[${index}]`, '', true);
    })
  }
  render() {
    const {
      values,
      errors,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      setFieldTouched,
      stepsInfo,
      step,
      id,
      comments,
      statusLabel,
      stepReady,
      kcProps
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <div className="steps-status space-between">
          <div>
            <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
              <small> {i18n.t('requestType')}: <span className="text-primary">{i18n.t('deregistration')}</span></small>
            </h4>
          </div>
          <div className="steps-status no-previous">
            <p>{i18n.t('status')}: <span className='text-primary'>{i18n.t(statusLabel)}</span></p>
          </div>
        </div>
        <Row>
          <Col className='order-xl-12 mt-3' xs={12} xl={4}>
            <StepIndicator stepsInfo={stepsInfo} step={step}></StepIndicator>
            <CommentBox header={i18n.t('commentBox.header')} comments={comments}/>
          </Col>
          <Col className='order-xl-1 mt-3' xs={12} xl={8}>
            <Card>
              <CardHeader>
                <b>{i18n.t('reviewRegistration.step5')}</b>
              </CardHeader>
              <CardBody className='steps-loading'>
                {!stepReady &&
                <StepLoading></StepLoading>
                }
                <div>
                  <FieldArray
                    name="documents"
                    render={arrayHelpers => (
                      <Row>
                        {DE_DOCUMENTS.map((document, index) => {
                          return (
                            <Col xs={12} sm={6} key={document.id}>
                              {(typeof values.documents[index] === 'undefined' || this.state[index])
                                ? <RenderFileInput
                                  onChange={setFieldValue}
                                  onBlur={setFieldTouched}
                                  error={((errors || {}).documents || []).length > 0 ? errors.documents[`${index}`] : null}
                                  //touched={touched.documents[`${index}`]}
                                  values={values.documents[`${index}`]}
                                  fieldName={`documents[${index}]`}
                                  type="file"
                                  label={capitalize(i18n.t(document.label))}
                                  inputClass="asitfield"
                                  inputClassError="asitfield is-invalid"
                                  requiredStar={document.required}
                                />
                                : document.id === values.documents[index].document_id &&
                                <FormGroup>
                                  <Label className="d-block">{capitalize(i18n.t(document.label))} <span
                                    className="text-danger">*</span></Label>
                                  <div className="asitfield">
                                    <div className='filespan'>
                                      <input type="button" value={i18n.t('chosenFile')} disabled/>
                                      <span
                                        className="selectedfile">{values.documents[index].filename.split(':')[0]}</span>
                                    </div>
                                    <button className="btn btn-link btn-sm text-danger" onClick={(e) => this.handleFileUpload(e, document.document_id, index)}><i className="fa fa-close"></i></button>
                                  </div>
                                  <button onClick={(e) => {
                                    downloadDocument(kcProps,values.documents[index].link, getExtension(values.documents[index].link), removeExtension(values.documents[index].filename), e)
                                  }} value={values.documents[index].link}
                                          className="btn-link">{i18n.t('download.document')}
                                  </button>
                                </FormGroup>
                              }

                            </Col>
                          )
                        })
                        }
                      </Row>
                    )}
                  />
                  <div className="text-danger">{errors.allDocs}</div>
                </div>
              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" disabled={isSubmitting}>{i18n.t('submit')}</Button>{' '}
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

const EnhancedDeRegistrationStep1 = withFormik({
  mapPropsToValues: (props) => {
    return ({
      "device_count": props.info.device_count || "",
      "reason": props.info.reason || "",
      "filename": props.info.file || ""
    })
  },
  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.device_count) {
      errors.device_count = i18n.t('fieldRequired')
    } else if (isNaN(Number(values.device_count))) {
      errors.device_count = i18n.t('validation.number')
    } else if (!/^([1-9][0-9]{0,6}|1000000)$/i.test(values.device_count)) {
      errors.device_count = i18n.t('validation.deviceCount');
    }

    if (!values.reason) {
      errors.reason = i18n.t('fieldRequired')
    } else if (values.reason.length >= 1000) {
      errors.reason = i18n.t('validation.maxCharacters')
    }else if (languageCheck(values.reason) === false){
      errors.reason = i18n.t('validation.langError')
    }

    if (!values.filename) {
      errors.filename = i18n.t('fieldRequired')
    } else if (typeof values.filename === 'string') {
      // No error if filename is string
    } else if (getExtension(values.filename.name) !== 'txt') {
      errors.filename = i18n.t('validation.fileExtension2')
    }

    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    //bag.props.callServer(values);
    bag.props.callServer(prepareAPIRequestStep1(values));
  },

  displayName: 'DeRegistrationStep1', // helps with React DevTools
})(DeRegistrationStep1);

function prepareAPIRequestStep1(values) {
  // Validate Values before sending
  const formData = new FormData();
  if (values.device_count) {
    formData.append('device_count', values.device_count);
  }
  if (values.filename) {
    formData.append('file', values.filename);
  }
  if (values.reason) {
    formData.append('reason', values.reason);
  }

  formData.append('user_id', getUserInfo().sub);

  return formData;
}

const EnhancedDeRegistrationStep2 = withFormik({
  mapPropsToValues: (props) => ({"devices": props.info || [], "verified_devices": []}),

  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.verified_devices || values.verified_devices.length === 0) {
      errors.verified_devices = i18n.t('validation.verifiedDevice')
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequestStep2(values));
  },

  displayName: 'DeRegistrationStep2', // helps with React DevTools
})(DeRegistrationStep2);

function prepareAPIRequestStep2(values) {
  // Validate Values before sending
  const formData = new FormData();
  if (values.verified_devices) {
    formData.append('devices', JSON.stringify(values.verified_devices));
  }

  formData.append('user_id', getUserInfo().sub);

  return formData;
}

const EnhancedDeRegistrationStep3 = withFormik({
  mapPropsToValues: (props) => {
    if (props.info.length > 0) {
      props.info.sort((a, b) => a.document_id - b.document_id)
    }
    return (
      {
        "documents": props.info || []
      }
    )
  },

  validate: values => {
    let errors = {};
    if (!values.documents.length) {
      errors.allDocs = 'Please report all required fields';
    } else {
      for (let i = 0; i < DE_DOCUMENTS.length; i++) {
        if (values.documents[i]) {
          if (typeof values.documents[i].filename === 'string') {
            // No error if filename is string
          } else if (!EXTENSIONS.includes(getExtension(values.documents[i].name).toLowerCase())) {
            if (typeof errors.documents === "undefined") {
              errors.documents = [];
            }
            errors.documents[i] = i18n.t('validation.file.invalid') + EXTENSIONS.join(', ')
          } else if ((values.documents[i].size / 1024 / 1024) > 26) {
            if (typeof errors.documents === "undefined") {
              errors.documents = [];
            }
            errors.documents[i] = i18n.t('validation.file.sizeExceed')
          }
        }
        if (!(typeof values.documents[i] === 'undefined') && typeof values.documents[i].filename === 'string') {
          // No error if filename is string
        } else if (!values.documents[i] && DE_DOCUMENTS[i].required) {
          if (typeof errors.documents === "undefined") {
            errors.documents = [];
          }
          errors.documents[i] = i18n.t('fieldRequired')
        }
      }
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequestStep3(values));
  },

  displayName: 'DeRegistrationStep3', // helps with React DevTools
})(DeRegistrationStep3);

function prepareAPIRequestStep3(values) {
  // Validate Values before sending
  const formData = new FormData();
  for (let i = 0; i < DE_DOCUMENTS.length; i++) {
    formData.append(DE_DOCUMENTS[i].label, values.documents[i])
  }
  formData.append('user_id', getUserInfo().sub);
  return formData;
}

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      step1Comments: [],
      step2Comments: [],
      step3Comments: [],
      id: null,
      stepsInfo: REQUEST_STEPS.de_registration,
      devices: null,
      data: null,
      stepReady: false,
      statusLabel: '',
      notRegIMEIs: []
    }
    this.saveStep1 = this.saveStep1.bind(this);
    this.saveStep2 = this.saveStep2.bind(this);
    this.saveStep3 = this.saveStep3.bind(this);
    this.getStep1DataFromServer = this.getStep1DataFromServer.bind(this);
    this.getStep3DataFromServer = this.getStep3DataFromServer.bind(this);
    this.closeDeRequest = this.closeDeRequest.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.getCommentsData = this.getCommentsData.bind(this);
  }

  componentDidMount() {
    const {step} = this.state;
    if (step === 1) {
      this.updateTokenHOC(this.getStep1DataFromServer);
    }
    this.updateTokenHOC(this.getCommentsData);
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

  getCommentsData(config) {
    const id = parseInt(this.props.match.params.id)
    const {
      step1Comments,
      step2Comments,
      step3Comments
    } = this.state
    this.setState({
      stepReady: false
    })
    let step1comments = step1Comments
    let step2comments = step2Comments
    let step3comments = step3Comments
    const type = 'de_registration_request'
    instance.get(`/review/sections?request_id=${id}&request_type=${type}`, config)
      .then((response) => {
        if (response.status === 200) {
          for (let step in response.data.sections) {
            if (response.data.sections[step].section_type === 'device_description') {
              if (response.data.sections[step].comments !== null && response.data.sections[step].comments.length > 0) {
                response.data.sections[step].comments.map((value) => {
                  let obj = value;
                  obj.sectionType = response.data.sections[step].section_type;
                  step2comments.push(obj)
                  return this.setState({
                    step2Comments: step2comments
                  });
                })
              } else {
                this.setState({
                  stepReady: true
                });
              }
            }
            else if (response.data.sections[step].section_type === 'imei_classification') {
              if (response.data.sections[step].comments !== null && response.data.sections[step].comments.length > 0) {
                response.data.sections[step].comments.map((value) => {
                  let obj = value;
                  obj.sectionType = response.data.sections[step].section_type;
                  step1comments.push(obj)
                  return this.setState({
                    step1Comments: step1comments
                  });
                })
              }
            }
            else if (response.data.sections[step].section_type === 'imei_registration') {
              if (response.data.sections[step].comments !== null && response.data.sections[step].comments.length > 0) {
                response.data.sections[step].comments.map((value) => {
                  let obj = value;
                  obj.sectionType = response.data.sections[step].section_type;
                  step1comments.push(obj)
                  return this.setState({
                    step1Comments: step1comments
                  });
                })
              }
            }
            else if (response.data.sections[step].section_type === 'approval_documents') {
              if (response.data.sections[step].comments !== null && response.data.sections[step].comments.length > 0) {
                response.data.sections[step].comments.map((value) => {
                  let obj = value;
                  obj.sectionType = response.data.sections[step].section_type;
                  step3comments.push(obj)
                  return this.setState({
                    step3Comments: step3comments,
                    stepReady: true
                  });
                })
              } else {
                this.setState({
                  stepReady: true
                })
              }
            }
          }
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  closeDeRequest(config) {
    this.setState({stepReady: false});
    const id = this.state.id;
    const formData = new FormData();
    formData.append('user_id', getUserInfo().sub);
    formData.append('close_request', 'True');
    formData.append('dereg_id', id);

    instance.put(`/deregistration`, formData, config)
      .then(response => {
        if (response.data) {
          this.setState({stepReady: true});
          const statusDetails = {
            id: id,
            type: 'deregistration',
            typeLabel: 'De-registration',
            icon: 'fa fa-check',
            status: 'Closed',
            action: 'Closed'
          }
          this.props.history.push({
            pathname: '/request-status',
            state: {details: statusDetails}
          });
        }
      })
      .catch(error => {
        this.setState({stepReady: true});
        errors(this, error);
      })
  }

  getStep1DataFromServer(config) {
    const {id} = this.props.match.params;
    this.setState({
      stepReady: false
    })
    instance.get(`/deregistration/${id}`, config)
      .then(response => {
        this.setState({
          data: response.data,
          loading: false,
          id: response.data.id,
          stepReady: true,
          statusLabel: response.data.status_label
        })
      })
      .catch(error => {
        errors(this, error);
      })
  }

  getStep3DataFromServer(config) {
    const {id} = this.state;
    this.setState({
      stepReady: false
    })
    instance.get(`/deregistration/documents/${id}`, config)
      .then(response => {
        this.setState({
          data: response.data,
          loading: false,
          step: 3
        },()=>{
          this.setState({
            stepReady: true
          })
        });
      })
      .catch(error => {
        errors(this, error);
      })
  }

  saveStep1(config, formdata) {
    // Call API and save information
    const {id} = this.state;
    formdata.append('dereg_id', id);
    instance.put(`/deregistration`, formdata, config)
      .then((response) => {
        if (typeof response.data.devices !== 'undefined') {
          this.setState({devices: response.data.devices, step: 2});
        } else {
          this.updateTokenHOC(this.getStep3DataFromServer);
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  saveStep2(config, formdata) {
    // Call API and save information
    this.setState({stepReady: false});
    const {id} = this.state;
    formdata.append('dereg_id', id);
    instance.put(`/deregistration/devices`, formdata, config)
      .then((response) => {
        if (response.data.dreg_id) {
          this.setState({stepReady: true});
          this.updateTokenHOC(this.getStep3DataFromServer);
        }
      })
      .catch((error) => {
        this.setState({stepReady: true});
        errors(this, error, true);
        if (error.response.status === 422) {
          let errors = error.response.data.not_registered_imeis;
          this.setState({notRegIMEIs: errors});
        }
      })
  }

  saveStep3(config, formdata) {
    // Call API and save information
    const {id} = this.state;
    formdata.append('dereg_id', id);
    instance.put(`/deregistration/documents`, formdata, config)
      .then((response) => {
        if (response.data) {
          // Finish the Registration
          const statusDetails = {
            id: id,
            type: 'deregistration',
            typeLabel: 'De-registration',
            icon: 'fa fa-check',
            status: 'Pending Review',
            action: 'Updated'
          }
          this.props.history.push({
            pathname: '/request-status',
            state: {details: statusDetails}
          });
        }
      })
      .catch((error) => {
        this.setState({stepReady: true});
        errors(this, error);
      })
  }

  render() {
    const {step, stepsInfo, id, stepReady, notRegIMEIs} = this.state;
    return (
      <div className="animated fadeIn">
        {(step === 1) && this.state.data &&
        <EnhancedDeRegistrationStep1 callServer={(values) => this.updateTokenHOC(this.saveStep1, values)} stepsInfo={stepsInfo} step={step} id={id}
                                     info={this.state.data} comments={this.state.step1Comments}
                                     statusLabel={this.state.statusLabel} stepReady={stepReady}
                                     kcProps={this.props}
        />
        }
        {(step === 2) && this.state.devices &&
        <EnhancedDeRegistrationStep2 callServer={(values) => this.updateTokenHOC(this.saveStep2, values)} stepsInfo={stepsInfo} step={step}
                                     info={this.state.devices} closeRequest={()=>{this.updateTokenHOC(this.closeDeRequest)}}
                                     comments={this.state.step2Comments} stepReady={stepReady}
                                     notRegisteredIMEIs={notRegIMEIs}/>}
        {(step === 3) && this.state.data &&
        <EnhancedDeRegistrationStep3 callServer={(values) => this.updateTokenHOC(this.saveStep3, values)} stepsInfo={stepsInfo} step={step - 1} id={id}
                                     info={this.state.data} reportReady={this.state.reportReady}
                                     comments={this.state.step3Comments} statusLabel={this.state.statusLabel}
                                     stepReady={stepReady}
                                     kcProps={this.props}
        />
        }
      </div>
    )
  }
}

export default translate('translations')(Update);
