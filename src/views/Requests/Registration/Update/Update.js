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
  CardBody
} from 'reactstrap';
import renderInput from '../../../../components/Form/RenderInput'
import doubleEntryInput from '../../../../components/Form/DoubleEntryInput'
import renderError from '../../../../components/Form/RenderError'
import RenderArrayError from '../../../../components/Form/RenderArrayError'
import RenderFileInput from '../../../../components/Form/RenderFileInput'
import StepIndicator from '../../../../components/Sidebar/StepIndicator';
import {
  getExtension,
  removeExtension,
  instance,
  errors,
  getUserInfo,
  capitalize,
  getAuthHeader,
  downloadDocument, languageCheck
} from "../../../../utilities/helpers";
import {
  MANUFACTURE_LOCATIONS,
  DEVICE_TYPES,
  TECHNOLOGIES,
  DOCUMENTS,
  EXTENSIONS,
  REQUEST_STEPS,
  IS_AUTOMATE
} from "../../../../utilities/constants";
import CommentBox from "../../../../components/CommentSection/CommentBox";
import StepLoading from "../../../../components/Loaders/StepLoading";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {all, equals, keys} from "ramda";
const MySwal = withReactContent(Swal)

class UpdateRegistrationStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imeiIndex: null,
      imeiModal: false,
      imeiModalTitle: null,
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
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      setFieldTouched,
      dirty,
      stepsInfo,
      step,
      comments,
      id,
      statusLabel,
      stepReady,
      anySectionChange,
      info,
      kcProps
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <div className="steps-status space-between">
          <div>
            <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
              <small>{i18n.t('requestType')}: <span className="text-primary">{i18n.t('registration')}</span></small>
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
                <b>{i18n.t('requestSteps.registration.basic')}</b>
              </CardHeader>
              <CardBody className='steps-loading'>
                {!stepReady &&
                <StepLoading></StepLoading>
                }
                <div>
                  <Row>
                    <Col xs={12} sm={6}>
                      <Field name="device_count" component={renderInput} label={i18n.t('deviceCount')} type="text"
                             placeholder={i18n.t('deviceCount')} requiredStar
                             disable={(values.device_imei === 'webpage' && values.devices.length > 0) ||
                             (values.device_imei === 'tsv' && values.filename && !this.state.step1FileUpload)}/>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Field name="imei_per_device" component={renderInput} label={i18n.t('numberOfImeis')}
                             type="text" placeholder={i18n.t('numberOfImeis')} requiredStar
                             disable={(values.device_imei === 'webpage' && values.devices.length > 0) ||
                             (values.device_imei === 'tsv' && values.filename && !this.state.step1FileUpload)}/>
                    </Col>
                    {(values.device_imei === 'tsv' && values.filename && !this.state.step1FileUpload) &&
                    <p className="alert alert-warning ml-3 mr-3">{i18n.t('cantModify')}
                      <b>{i18n.t('deviceCount')}</b> & <b>{i18n.t('numberOfImeis')}</b>
                      {i18n.t('requestInstructions.7')}
                    </p>
                    }
                    {(values.device_imei === 'webpage' && values.devices.length > 0) &&
                    <p className="alert alert-warning ml-3 mr-3">
                      {i18n.t('cantModify')} <b>{i18n.t('deviceCount')}</b> & <b>{i18n.t('numberOfImeis')}</b>
                      {i18n.t('requestInstructions.8')}
                    </p>
                    }
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <FormGroup>
                        <Label>{i18n.t('deviceIMEIs')}</Label>
                        <div className="asitfield checkfield">
                          <label>
                            <input
                              name="device_imei"
                              type="radio"
                              value="tsv"
                              checked={values.device_imei === 'tsv'}
                              readOnly
                              onBlur={handleBlur}
                              onChange={handleChange}
                              disabled={values.device_imei === 'webpage'}
                              className="d-none"
                            />
                            {(values.device_imei === 'tsv') &&
                            <div>
                              <i className="fa fa-check"></i>
                              <span className="ml-2">{i18n.t('tabDelimitedFile.label')}</span>
                            </div>
                            }
                          </label>
                          <label>
                            <input
                              name="device_imei"
                              type="radio"
                              value="webpage"
                              checked={values.device_imei === 'webpage'}
                              readOnly
                              onBlur={handleBlur}
                              onChange={handleChange}
                              disabled={values.device_imei === 'tsv'}
                              className="d-none"
                            />
                            {(values.device_imei === 'webpage') &&
                            <div>
                              <i className="fa fa-check"></i>
                              <span className="ml-2">{i18n.t('webInput.label')}</span>
                            </div>
                            }
                          </label>
                        </div>
                        <Field name="device_imei" component={renderError}/>
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                      <FormGroup>
                        <Label>{i18n.t('manufacturingLocation')}<span className="text-danger">*</span></Label>
                        <div className='selectbox'>
                          <Field component="select" name="m_location" className="form-control">
                            <option value="">{i18n.t('selectManufacturingLocation')}</option>
                            {MANUFACTURE_LOCATIONS.map((location, i) => (
                              <option value={location.value} key={i}>{i18n.t(location.label)}</option>
                            ))}
                          </Field>
                        </div>
                        <Field name="m_location" component={renderError}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <p className="alert alert-warning">{i18n.t('cantModify')} <b>{i18n.t('requestInstructions.4')}</b>.
                    {i18n.t('requestInstructions.9')}</p>
                  {values.device_imei === 'webpage' &&
                  <Row>
                    <Col xs={12}>
                      <div className="devices-imeis">
                        <div className="devices-heading">
                          <b>{i18n.t('devicesList')}</b>
                        </div>
                        <div>
                          <div className="read-box position-relative">
                            <FieldArray
                              name="devices"
                              render={({insert, remove, push}) => {
                                let imeis = [];
                                if (values.imei_per_device > 0) {
                                  for (let i = 0; i < values.imei_per_device; i++) {
                                    imeis[i] = {};
                                    imeis[i].imei = '';
                                    imeis[i].reImei = '';
                                  }
                                }
                                return (
                                  <div>
                                    {values.devices.length > 0 &&
                                    values.devices.map((device, index) => (
                                      <div key={index} className="position-relative">
                                        <Button type="button" size="sm" color="danger"
                                                onClick={() => {
                                                  MySwal.fire({
                                                    title: i18n.t('alert.warning'),
                                                    text: i18n.t('alert.text1'),
                                                    type: 'question',
                                                    showCancelButton: true,
                                                    confirmButtonText: i18n.t('ok'),
                                                    cancelButtonText: i18n.t('cancel')
                                                  }).then((result) => {
                                                    if (result.value) {
                                                      remove(index)
                                                    }
                                                  })
                                                }} className="btn-del-device">{i18n.t('delete')}</Button>
                                        <FieldArray
                                          name="imeis"
                                          render={({insert, remove, push}) => (
                                            <Card>
                                              <CardHeader><b>{i18n.t('device')}
                                                # {index + 1}</b></CardHeader>
                                              {values.devices[index].imeis.length &&
                                              values.devices[index].imeis.map((imei, i) => (
                                                <CardBody key={i}
                                                          className="pt-0 pb-0">
                                                  <div className="imei-row">
                                                    <div className="imei-col">
                                                      IMEI # {i + 1}
                                                    </div>
                                                    <div className="imei-col">
                                                      <Field
                                                        name={`devices.${index}.imeis.${i}.imei`}
                                                        component={doubleEntryInput}
                                                        type="text"
                                                        placeholder={`${i18n.t('typeImei')} ${i + 1}`}/>
                                                      {errors.devices && touched.devices &&
                                                      <RenderArrayError
                                                        errors={errors.devices}
                                                        touched={touched.devices}
                                                        mainIndex={index}
                                                        innerIndex={i}
                                                        field="imei"/>}
                                                    </div>
                                                    <div className="imei-col">
                                                      <Field
                                                        name={`devices.${index}.imeis.${i}.reImei`}
                                                        component={doubleEntryInput}
                                                        type="text"
                                                        placeholder={`${i18n.t('reTypeImei')} ${i + 1}`}/>
                                                      {errors.devices && touched.devices &&
                                                      <RenderArrayError
                                                        errors={errors.devices}
                                                        touched={touched.devices}
                                                        mainIndex={index}
                                                        innerIndex={i}
                                                        field="reImei"/>}
                                                    </div>
                                                  </div>
                                                </CardBody>
                                              ))}
                                            </Card>
                                          )}
                                        />
                                      </div>
                                    ))}
                                    <Button type="button"
                                            onClick={() => push({imeis})}
                                            size="sm"
                                            className={((errors['device_count'] ||
                                              errors['imei_per_device'] ||
                                              values.devices.length === parseInt(values.device_count))) ? 'd-none' :
                                              'btn-outline-primary d-inline-block'}>
                                      {i18n.t('addDevice')}
                                    </Button>
                                  </div>
                                )
                              }}
                            />
                            <Field name="imeis_count" component={renderError} class="alert alert-danger dis-absolute"/>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  }
                  {values.filename && !this.state.step1FileUpload &&
                  <Row>
                    <Col xs={12} sm={12}>
                      <FormGroup>
                        <Label className="d-block">{i18n.t('selectedTabdelimitedFile')}<span
                          className="text-danger">*</span></Label>
                        <div className="asitfield">
                          <div className='filespan'>
                            <input type="button" value={i18n.t('chooseFile')} disabled/>
                            <span className="selectedfile">{values.filename}</span>
                          </div>
                          <button className="btn btn-link btn-sm text-danger" onClick={(e) => this.handleFileUpload(e)}>
                            <i className="fa fa-close"></i>
                          </button>
                        </div>
                        <button onClick={(e) => {
                          downloadDocument(
                            kcProps,info.file_link,
                            getExtension(info.file_link),
                            removeExtension(values.filename), e)
                        }} value={info.file_link} className="btn-link">
                          {i18n.t('download.file')}
                        </button>
                      </FormGroup>
                    </Col>
                  </Row>
                  }
                  {values.device_imei === 'tsv' && this.state.step1FileUpload &&
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
                    label={i18n.t('tabDelimitedFile.select')}
                    requiredStar
                  />
                  }
                </div>
              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" disabled={isSubmitting}
                      className={(!dirty && !anySectionChange) ? 'btn-next-prev d-none' : 'btn-next-prev d-inline-block'}>
                {i18n.t('next')}</Button>{' '}
              <Button color="primary" onClick={this.props.jumpToNextStep}
                      className={(dirty || anySectionChange) ? 'btn-next-prev d-none' : 'btn-next-prev d-inline-block'}>
                {i18n.t('next')}</Button>{' '}
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

class UpdateRegistrationStep2 extends Component {
  render() {
    const {
      values,
      handleSubmit,
      isSubmitting,
      dirty,
      stepsInfo,
      step,
      id,
      comments,
      statusLabel,
      stepReady,
      anySectionChange
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <div className="steps-status space-between">
          <div>
            <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
              <small> {i18n.t('requestType')}: <span className="text-primary">{i18n.t('registration')}</span></small>
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
                <b>{i18n.t('requestSteps.registration.deviceModel')}</b>
              </CardHeader>
              <CardBody className='steps-loading'>
                {!stepReady &&
                <StepLoading></StepLoading>
                }
                <div>
                  <Row>
                    <Col xs={12} sm={6}>
                      <Field name="brand" component={renderInput}
                             label={i18n.t('brand')} placeholder={i18n.t('brand')} type="text" requiredStar/>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Field name="model_name" component={renderInput}
                             label={i18n.t('model')} placeholder={i18n.t('model')} type="text" requiredStar/>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <Field name="model_num" component={renderInput} label={i18n.t('modelnumber')}
                             placeholder={i18n.t('modelnumber')} type="text" requiredStar/>
                    </Col>
                    <Col xs={12} sm={6}>
                      <FormGroup>
                        <Label>{i18n.t('deviceType')}<span className="text-danger">*</span></Label>
                        <div className='selectbox'>
                          <Field component="select" name="device_type" className="form-control">
                            <option value="">{i18n.t('selectDeviceType')}</option>
                            {DEVICE_TYPES.map((deviceType, i) => (
                              <option value={deviceType.description}
                                      key={i}>{i18n.t(deviceType.description)}</option>
                            ))}
                          </Field>
                        </div>
                        <Field name="device_type" component={renderError}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <Field name="operating_system" component={renderInput}
                             label={i18n.t('operatingSystem')} placeholder={i18n.t('operatingSystem')}
                             type="text" requiredStar/>
                    </Col>
                    <Col xs={12} sm={6}>
                      <FieldArray
                        name="technologies"
                        render={arrayHelpers => (
                          <FormGroup>
                            <Label>{i18n.t('rat')}<span
                              className="text-danger">*</span> </Label>
                            <div className="asitfield checkfield">
                              {TECHNOLOGIES.map((technology, i) => (
                                <div key={technology.id} className="mr-3 d-inline-block">
                                  <label>
                                    <input
                                      name="technologies"
                                      type="checkbox"
                                      value={technology.description}
                                      checked={values.technologies.includes(technology.description)}
                                      onChange={e => {
                                        if (e.target.checked) arrayHelpers.push(technology.description);
                                        else {
                                          const idx = values.technologies.indexOf(technology.description);
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />{" "}
                                    {technology.description}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <Field name="technologies" component={renderError}/>
                          </FormGroup>
                        )}
                      />
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" disabled={isSubmitting}
                      className={(!dirty && !anySectionChange) ? 'btn-next-prev d-none' : 'btn-next-prev d-inline-block'}>
                {IS_AUTOMATE[0] ? i18n.t('finish') : i18n.t('next')}</Button>{' '}
              <Button color="primary" onClick={this.props.jumpToNextStep}
                      className={(dirty || anySectionChange) ? 'btn-next-prev d-none' : 'btn-next-prev d-inline-block'}>
                {IS_AUTOMATE[0] ? i18n.t('finish') : i18n.t('next')}</Button>{' '}
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

class UpdateRegistrationStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  componentDidMount() {
    if (DOCUMENTS.length > 0) {
      DOCUMENTS.map((doc, i) => {
        if (this.props.info[i]) {
          this.setState({[i]: false})
          return null;
        } else {
          this.setState({[i]: true})
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
  /**
   * HOC function to update token
   * @param callingFunc
   * @param e
   * @param param1
   * @param param2
   */
  updateTokenHOC(callingFunc, e, param1=null,param2=null) {
    e.preventDefault()
    let config = null;
    if (this.props.kcProps.kc.isTokenExpired(0)) {
      this.props.kcProps.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kcProps.kc.token)
          config = {
            headers: getAuthHeader(this.props.kcProps.kc.token)
          }
          callingFunc(config,param1,param2);
        })
        .error(() => this.props.kcProps.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config,param1,param2);
    }
  }
  render() {
    const {
      values,
      errors,
      handleSubmit,
      isSubmitting,
      dirty,
      setFieldValue,
      setFieldTouched,
      stepsInfo,
      step,
      id,
      comments,
      statusLabel,
      stepReady,
      anySectionChange,
      kcProps
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <div className="steps-status space-between">
          <div>
            <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
              <small> {i18n.t('requestType')}: <span className="text-primary">{i18n.t('registration')}</span></small>
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
                        {DOCUMENTS.map((document, index) => {
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
                                : (document.id === values.documents[index].document_id) &&
                                <FormGroup>
                                  <Label className="d-block">{capitalize(i18n.t(document.label))} <span
                                    className="text-danger">*</span></Label>
                                  <div className="asitfield">
                                    <div className='filespan'>
                                      <input type="button" value={i18n.t('chosenFile')} disabled/>
                                      <span
                                        className="selectedfile">{values.documents[index].filename.split(':')[0]}</span>
                                    </div>
                                    <button className="btn btn-link btn-sm text-danger"
                                            onClick={(e) => this.handleFileUpload(e, document.document_id, index)}
                                      >
                                      <i className="fa fa-close"></i>
                                    </button>
                                  </div>
                                  <button onClick={(e) => {
                                    downloadDocument(kcProps,values.documents[index].link,
                                      getExtension(values.documents[index].link),
                                      removeExtension(values.documents[index].filename), e)
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
              <Button color="primary" type="submit" disabled={isSubmitting}
                      className={(!dirty && !anySectionChange) ? 'd-none' : 'btn-next-prev d-inline-block'}>
                {i18n.t('submit')}</Button>
              {' '}
              <Button color="primary" onClick={this.props.jumpToNextStep}
                      className={(dirty || anySectionChange) ? 'd-none' : 'btn-next-prev d-inline-block'}>
                {i18n.t('submit')}</Button>{' '}
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

const EnhancedUpdateRegistrationStep1 = withFormik({
  mapPropsToValues: (props) => {
    let device_imei = null
    let filename = null
    let devices = []
    if (props.info.file === null) {
      if ((props.info.imeis || []).length > 0) {
        for (var d = 0; d < props.info.imeis.length; d++) {
          devices[d] = {};
          for (var im = 0; im < props.info.imeis[d].length; im++) {
            if (typeof devices[d].imeis === "undefined") {
              devices[d].imeis = [];
            }
            if (typeof devices[d].imeis[im] === "undefined") {
              devices[d].imeis[im] = {};
            }
            devices[d].imeis[im].imei = props.info.imeis[d][im]
            devices[d].imeis[im].reImei = props.info.imeis[d][im]
          }
        }
      }
      device_imei = 'webpage'
    } else {
      filename = props.info.file
      device_imei = 'tsv'
    }
    return ({
      "device_count": props.info.device_count || "",
      "imei_per_device": props.info.imei_per_device || "",
      "device_imei": device_imei || "",
      "filename": filename || "",
      "imeis_count": "",
      "m_location": props.info.m_location || "",
      "devices": devices
    })
  },

  // Custom sync validation
  validate: values => {
    let errors = {};

    if (values.device_imei === 'webpage') {
      if (!values.device_count) {
        errors.device_count = i18n.t('fieldRequired')
      } else if (isNaN(Number(values.device_count))) {
        errors.device_count = i18n.t('validation.number')
      } else if (!/^([1-9]|10)$/i.test(values.device_count)) {
        errors.device_count = i18n.t('validation.deviceCount2');
      }
    } else if (values.device_imei === 'tsv') {
      if (!values.device_count) {
        errors.device_count = i18n.t('fieldRequired')
      } else if (isNaN(Number(values.device_count))) {
        errors.device_count = i18n.t('validation.number')
      } else if (!/^([1-9][0-9]{0,6}|1000000)$/i.test(values.device_count)) {
        errors.device_count = i18n.t('validation.deviceCount');
      }
    }

    if (!values.imei_per_device) {
      errors.imei_per_device = i18n.t('fieldRequired')
    } else if (isNaN(Number(values.imei_per_device))) {
      errors.imei_per_device = i18n.t('validation.number')
    } else if (!/^[1-5]$/i.test(values.imei_per_device)) {
      errors.imei_per_device = i18n.t('validation.imeiPerDevice');
    }

    if (values.device_imei === 'webpage') {

      if (!values.devices || !values.devices.length) {
        errors.imeis_count = i18n.t('validation.imeiCount')
      } else if (!((values.devices.length) === parseInt(values.device_count))) {
        errors.imeis_count = i18n.t('validation.imeiCount2')
      }
      let validatedImeiSet = []
      if (values.devices.length > 0) {
        for (let i = 0; i < parseInt(values.device_count); i++) {
          if (typeof values.devices[i] !== 'undefined') {
            for (let j = 0; j < parseInt(values.imei_per_device); j++) {
              if (typeof errors.devices === "undefined") {
                errors.devices = [];
              }
              if (typeof errors.devices[i] === "undefined") {
                errors.devices[i] = {};
              }
              if (typeof errors.devices[i].imeis === "undefined") {
                errors.devices[i].imeis = [];
              }
              if (typeof errors.devices[i].imeis[j] === "undefined") {
                errors.devices[i].imeis[j] = {};
              }
              // IMEIs Validation
              if (!values.devices[i].imeis[j].imei) {
                errors.devices[i].imeis[j].imei = i18n.t('fieldRequired')
                validatedImeiSet.push(false)
              } else if (isNaN(Number(values.devices[i].imeis[j].imei))) {
                errors.devices[i].imeis[j].imei = i18n.t('validation.deviceImei')
                validatedImeiSet.push(false)
              } else if (values.devices[i].imeis[j].imei.length < 14 || values.devices[i].imeis[j].imei.length > 16) {
                errors.devices[i].imeis[j].imei = i18n.t('validation.imei')
                validatedImeiSet.push(false)
              } else {
                validatedImeiSet.push(true)
              }
              // Retype IMEIs Validation
              if (!values.devices[i].imeis[j].reImei) {
                errors.devices[i].imeis[j].reImei = i18n.t('fieldRequired')
                validatedImeiSet.push(false)
              } else if (isNaN(Number(values.devices[i].imeis[j].reImei))) {
                errors.devices[i].imeis[j].reImei = i18n.t('validation.reTypeimei')
                validatedImeiSet.push(false)
              } else if (values.devices[i].imeis[j].reImei.length < 14 || values.devices[i].imeis[j].reImei.length > 16) {
                errors.devices[i].imeis[j].reImei = i18n.t('validation.reTypeimei2')
                validatedImeiSet.push(false)
              } else if (values.devices[i].imeis[j].imei !== values.devices[i].imeis[j].reImei) {
                errors.devices[i].imeis[j].reImei = i18n.t('validation.imeiMatch')
                validatedImeiSet.push(false)
              } else {
                validatedImeiSet.push(true)
              }
              let hasDeviceImeis = keys(errors.devices[i].imeis[j]).length === 0
              let deviceImeisValidated = all(equals(true))(validatedImeiSet) &&
                validatedImeiSet.length === parseInt((values.imei_per_device) * 2) * parseInt(values.device_count)
              if (hasDeviceImeis && deviceImeisValidated) {
                delete errors['devices']
              }
            }
          }
        }
      }

    } else if (values.device_imei === 'tsv') {

      if (!values.filename) {
        errors.filename = i18n.t('fieldRequired')
      } else if (typeof values.filename === 'string') {
        // No error if filename is string
      } else if (getExtension(values.filename.name) !== 'tsv') {
        errors.filename = i18n.t('validation.fileExtension')
      }
    }

    if (!values.m_location) {
      errors.m_location = i18n.t('fieldRequired')
    }

    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    //bag.props.callServer(values);
    bag.props.callServer(prepareAPIRequestStep1(values));
  },

  displayName: 'UpdateRegistrationStep1', // helps with React DevTools
})(UpdateRegistrationStep1);

function prepareAPIRequestStep1(values) {
  // Validate Values before sending
  const formData = new FormData();
  if (values.device_count) {
    formData.append('device_count', values.device_count);
  }
  if (values.imei_per_device) {
    formData.append('imei_per_device', values.imei_per_device);
  }
  if (values.devices.length > 0) {
    let devices = [];
    for (let d = 0; d < values.devices.length; d++) {
      if (values.devices[d].imeis.length > 0) {
        devices[d] = [];
        for (let im = 0; im < values.devices[d].imeis.length; im++) {
          devices[d][im] = values.devices[d].imeis[im].imei;
        }
      }
    }
    formData.append('imeis', JSON.stringify(devices));
  }
  if (values.filename) {
    formData.append('file', values.filename);
  }
  if (values.m_location) {
    formData.append('m_location', values.m_location);
  }

  formData.append('user_id', getUserInfo().sub);

  return formData;
}

const EnhancedUpdateRegistrationStep2 = withFormik({
  mapPropsToValues: (props) => {
    return ({
      "brand": props.info.brand || "",
      "model_name": props.info.model_name || "",
      "model_num": props.info.model_num || "",
      "device_type": props.info.device_type || "",
      "operating_system": props.info.operating_system || "",
      "technologies": props.info.technologies || []
    })
  },

  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.brand) {
      errors.brand = i18n.t('fieldRequired')
    } else if (values.brand.length >= 1000) {
      errors.brand = i18n.t('validation.maxCharacters')
    }else if (languageCheck(values.brand) === false){
      errors.brand = i18n.t('validation.langError')
    }
    if (!values.model_name) {
      errors.model_name = i18n.t('fieldRequired')
    } else if (values.model_name.length >= 1000) {
      errors.model_name = i18n.t('validation.maxCharacters')
    }else if (languageCheck(values.model_name) === false) {
      errors.model_name = i18n.t('validation.langError')
    }
    if (!values.model_num) {
      errors.model_num = i18n.t('fieldRequired')
    } else if (values.model_num.length >= 1000) {
      errors.model_num = i18n.t('validation.maxCharacters')
    }
    if (!values.device_type) {
      errors.device_type = i18n.t('fieldRequired')
    }
    if (!values.operating_system) {
      errors.operating_system = i18n.t('fieldRequired')
    } else if (values.operating_system.length >= 1000) {
      errors.operating_system = i18n.t('validation.maxCharacters')
    }else if (languageCheck(values.operating_system) === false){
      errors.operating_system = i18n.t('validation.langError')
    }
    if (!values.technologies || !values.technologies.length) {
      errors.technologies = i18n.t('validation.technology')
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequestStep2(values));
  },

  displayName: 'UpdateRegistrationStep2', // helps with React DevTools
})(UpdateRegistrationStep2);

function prepareAPIRequestStep2(values) {
  // Validate Values before sending
  const formData = new FormData();
  if (values.brand) {
    formData.append('brand', values.brand);
  }
  if (values.operating_system) {
    formData.append('operating_system', values.operating_system);
  }
  if (values.model_name) {
    formData.append('model_name', values.model_name);
  }
  if (values.model_num) {
    formData.append('model_num', values.model_num);
  }
  if (values.device_type) {
    formData.append('device_type', values.device_type);
  }
  if (values.technologies) {
    formData.append('technologies', values.technologies);
  }

  formData.append('user_id', getUserInfo().sub);
  return formData;
}

const EnhancedUpdateRegistrationStep3 = withFormik({
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
      errors.allDocs = i18n.t('requestInstructions.10');
    } else {
      for (let i = 0; i < DOCUMENTS.length; i++) {
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
        } else if (!values.documents[i] && DOCUMENTS[i].required) {

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

  displayName: 'UpdateRegistrationStep3', // helps with React DevTools
})(UpdateRegistrationStep3);

function prepareAPIRequestStep3(values) {
  // Validate Values before sending
  const formData = new FormData();
  for (let i = 0; i < DOCUMENTS.length; i++) {
    formData.append(DOCUMENTS[i].label, values.documents[i])
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
      stepsInfo: REQUEST_STEPS.registration,
      requestId: null,
      data: null,
      loading: true,
      stepReady: false,
      statusLabel: '',
      anySectionChange: false
    }
    this.getCommentsData = this.getCommentsData.bind(this);
    this.saveStep1 = this.saveStep1.bind(this);
    this.saveStep2 = this.saveStep2.bind(this);
    this.saveStep3 = this.saveStep3.bind(this);
    this.getStep1DataFromServer = this.getStep1DataFromServer.bind(this);
    this.getStep2DataFromServer = this.getStep2DataFromServer.bind(this);
    this.getStep3DataFromServer = this.getStep3DataFromServer.bind(this);
    this.jumpToNextStep = this.jumpToNextStep.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  componentDidMount() {
    const {step} = this.state;
    const id = parseInt(this.props.match.params.id)
    if (step === 1) {
      this.updateTokenHOC(this.getStep1DataFromServer);
    }
    this.setState({
      id: id
    }, () => {
      this.updateTokenHOC(this.getCommentsData);
    })
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

  jumpToNextStep() {
    const {step} = this.state;
    if ((step + 1) === 2) {
      this.updateTokenHOC(this.getStep2DataFromServer);
    } else if ((step + 1) === 3) {
      this.updateTokenHOC(this.getStep3DataFromServer);
    } else if (step === 3) { // step is now 3, meaning finish this
      this.props.history.push('/search-requests');
    }
  }

  getCommentsData(config) {
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
    const type = 'registration_request'
    const id = this.state.id
    instance.get(`/review/sections?request_id=${id}&request_type=${type}`, config)
      .then((response) => {
        if (response.status === 200) {
          for (let step in response.data.sections) {
            if (response.data.sections[step].section_type === 'device_quota') {
              if (response.data.sections[step].comments !== null && response.data.sections[step].comments.length > 0) {
                response.data.sections[step].comments.map((value) => {
                  let obj = value;
                  obj.sectionType = response.data.sections[step].section_type;
                  step1comments.push(obj)
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
            else if (response.data.sections[step].section_type === 'device_description') {
              if (response.data.sections[step].comments !== null && response.data.sections[step].comments.length > 0) {
                response.data.sections[step].comments.map((value) => {
                  let obj = value;
                  obj.sectionType = response.data.sections[step].section_type;
                  step2comments.push(obj)
                  return this.setState({
                    step2Comments: step2comments
                  });
                })
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

  getStep1DataFromServer(config) {
    const {id} = this.props.match.params;
    this.setState({
      stepReady: false
    })
    instance.get(`/registration/${id}`, config)
      .then(response => {
        this.setState({
          data: response.data,
          loading: false,
          requestId: response.data.id,
          stepReady: true,
          statusLabel: response.data.status_label,
          hasReport: response.data.report_allowed
        });
      })
      .catch(error => {
        errors(this, error);
        this.setState({stepReady: true});
      })
  }

  getStep2DataFromServer(config) {
    const {requestId} = this.state;
    this.setState({
      stepReady: false
    })
    instance.get(`/registration/device/${requestId}`, config)
      .then(response => {
        this.setState({data: response.data, loading: false});
        this.setState({step: 2}, () => {
          this.setState({
            stepReady: true
          })
        });
      })
      .catch(error => {
        errors(this, error);
        this.setState({stepReady: true});
      })
  }

  getStep3DataFromServer(config) {
    // const {id} = this.state;
    const {requestId} = this.state;
    this.setState({
      stepReady: false
    })
    instance.get(`/registration/documents/${requestId}`, config)
      .then(response => {
        this.setState({
          data: response.data,
          loading: false,
          step: 3
        },()=>{
          this.setState({
            stepReady: true
          })
        })
      })
      .catch(error => {
        errors(this, error);
      })
  }

  saveStep1(config, formdata) {
    // Call API and save information
    const {requestId} = this.state;
    formdata.append('reg_id', requestId);
    instance.put(`/registration`, formdata, config)
      .then((response) => {
        if (response.data.id) {
          this.setState({anySectionChange: true});
          this.updateTokenHOC(this.getStep2DataFromServer);
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  saveStep2(config, formdata) {
    // Call API and save information
    const {requestId} = this.state;
    formdata.append('reg_id', requestId);
    instance.put(`/registration/device`, formdata, config)
      .then((response) => {
        if (response.data) {
          this.setState({stepReady: true, anySectionChange: true});
          if(IS_AUTOMATE[0])
          {
            // Finish the Registration if Automatic registration is enabled
            const statusDetails = {
              id: requestId,
              type: 'registration',
              typeLabel: 'Registration',
              icon: 'fa fa-check',
              status: 'Pending Review',
              action: 'Updated'
            }
            this.props.history.push({
              pathname: '/request-status',
              state: {details: statusDetails}
            });
          }
          else{
            this.updateTokenHOC(this.getStep3DataFromServer);
          }
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  saveStep3(config, formdata) {
    // Call API and save information
    this.setState({stepReady: false});
    const {requestId} = this.state;
    formdata.append('reg_id', requestId);
    instance.put(`/registration/documents`, formdata, config)
      .then((response) => {
        if (response.data) {
          this.setState({stepReady: true, anySectionChange: true});
          // Finish the Registration
          const statusDetails = {
            id: requestId,
            type: 'registration',
            typeLabel: 'Registration',
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
    const {step, stepsInfo, requestId, stepReady, anySectionChange} = this.state;
    return (
      <div className="animated fadeIn">
        {(step === 1) && this.state.data &&
        <EnhancedUpdateRegistrationStep1 callServer={(values) => this.updateTokenHOC(this.saveStep1, values)}
                                         stepsInfo={stepsInfo} step={step} id={requestId}
                                         info={this.state.data} comments={this.state.step1Comments}
                                         statusLabel={this.state.statusLabel} stepReady={stepReady}
                                         jumpToNextStep={() => this.updateTokenHOC(this.jumpToNextStep)}
                                         anySectionChange={anySectionChange}
                                         kcProps={this.props}
        />
        }
        {(step === 2) && this.state.data &&
        <EnhancedUpdateRegistrationStep2 callServer={(values) => this.updateTokenHOC(this.saveStep2, values)}
                                         stepsInfo={stepsInfo} step={step} id={requestId}
                                         info={this.state.data} comments={this.state.step2Comments}
                                         statusLabel={this.state.statusLabel} stepReady={stepReady}
                                         jumpToNextStep={() => this.updateTokenHOC(this.jumpToNextStep)}
                                         anySectionChange={anySectionChange}/>}
        {(step === 3) && this.state.data &&
        <EnhancedUpdateRegistrationStep3 callServer={(values) => this.updateTokenHOC(this.saveStep3, values)}
                                         stepsInfo={stepsInfo} step={step} id={requestId}
                                         info={this.state.data} comments={this.state.step3Comments}
                                         statusLabel={this.state.statusLabel} stepReady={stepReady}
                                         jumpToNextStep={() => this.updateTokenHOC(this.jumpToNextStep)}
                                         anySectionChange={anySectionChange}
                                         kcProps={this.props}/>
        }
      </div>
    )
  }
}

export default translate('translations')(Update);
