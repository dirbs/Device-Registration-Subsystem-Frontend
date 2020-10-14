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
import i18n from './../../../../i18n'
import {withFormik, Field, FieldArray} from 'formik';
import {
  Row,
  Col,
  Button,
  Form,
  Label,
  Input,
  FormGroup,
  FormFeedback,
  Card,
  CardHeader,
  CardBody,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import renderInput from '../../../../components/Form/RenderInput'
import RenderModal from '../../../../components/Form/RenderModal'
import doubleEntryInput from '../../../../components/Form/DoubleEntryInput'
import renderError from '../../../../components/Form/RenderError'
import RenderArrayError from '../../../../components/Form/RenderArrayError'
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
  removeExtension,
  downloadSampleFile,
  languageCheck
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
import StepLoading from "../../../../components/Loaders/StepLoading";
import {isNil, isEmpty, mapObjIndexed,equals,all,keys} from 'ramda';
import ReactTootip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

class NewRegistrationStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imeiIndex: null,
      imeiModal: false,
      imeiModalTitle: null,
    }
    this.handleDeviceCountChange = this.handleDeviceCountChange.bind(this);
  }

  handleDeviceCountChange(event) {
    if (event.target.value > 10) {
      this.props.setFieldValue(event.target.name, event.target.value);
      this.props.setFieldValue('device_imei', 'tsv', false);
      this.props.setFieldValue('devices', [], false);
    } else {
      this.props.setFieldValue(event.target.name, event.target.value);
      this.props.setFieldValue('device_imei', 'webpage', false);
      this.props.setFieldValue('filename', '', false);
    }
  }

  render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      stepsInfo,
      step,
      stepReady,
      kcProps
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className='order-xl-12 mt-3' xs={12} xl={4}>
            <StepIndicator stepsInfo={stepsInfo} step={step}></StepIndicator>
            <div className="samplefile">
              <p><i className="fa fa-file-text-o fa-3x"></i>{i18n.t('simpleImeiFile')}</p>
              <p className="text-right">
                <button onClick={(e) => {
                  downloadSampleFile(kcProps,'registration', e)
                }} className="btn btn-outline-dark">{i18n.t('downloadFile')}</button>
              </p>
            </div>
            <div>
              <p className="alert alert-info mt-3 mb-1"><b>{i18n.t('webInput.label')}:</b>
                {i18n.t('webInput.text')}</p>
              <p className="alert alert-info"><b>{i18n.t('tabDelimitedFile.label')}:</b>
                {i18n.t('tabDelimitedFile.text')}
              </p>
            </div>
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
                      <FormGroup>
                        <Label>{i18n.t('deviceCount')} <i className="fa fa-question-circle text-secondary" data-tip
                                               data-for='dCount'></i> <span className="text-danger">*</span>
                          <ReactTootip id="dCount" effect="solid">
                            <p>{i18n.t('requestInstructions.1')}:</p>
                            <ol className="ol-list">
                              <li>{i18n.t('requestInstructions.2')}</li>
                              <li>{i18n.t('requestInstructions.3')}</li>
                            </ol>
                          </ReactTootip>
                        </Label>
                        <Input
                          name="device_count"
                          type="text"
                          onChange={this.handleDeviceCountChange}
                          onBlur={handleBlur}
                          placeholder={i18n.t('deviceCount')}
                          disabled={values.device_imei === 'webpage' && values.devices.length > 0}
                          valid={(touched.device_count && errors.device_count) ? false : null}
                        />
                        {errors.device_count && touched.device_count &&
                        <FormFeedback className="d-block">
                          {errors.device_count}
                        </FormFeedback>}
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Field name="imei_per_device" component={renderInput}
                             label={i18n.t('numberOfImeis')} type="text"
                             placeholder={i18n.t('numberOfImeis')} requiredStar
                             disable={values.device_imei === 'webpage' && values.devices.length > 0}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <FormGroup>
                        <Label>{i18n.t('deviceIMEIs')} <i className="fa fa-question-circle text-secondary" data-tip
                                                 data-for='dImeis'></i>
                          <ReactTootip id="dImeis" effect="solid">
                            <p>{i18n.t('requestInstructions.4')}.</p>
                            <ol className='ol-list'>
                              <li>{i18n.t('requestInstructions.5')}</li>
                              <li>{i18n.t('requestInstructions.6')}</li>
                            </ol>
                          </ReactTootip>
                        </Label>
                        {(values.device_imei === '' || values.device_count === '')
                          ? <div className="alert alert-warning p-2">{i18n.t('enterDeviceCount')}</div>
                          : <div className="asitfield checkfield">
                            <label>
                              <input
                                name="device_imei"
                                type="radio"
                                value="tsv"
                                checked={values.device_imei === 'tsv'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={(values.device_count && parseInt(values.device_count) <= 10)}
                                className="d-none"
                              />
                              {(values.device_imei === 'tsv') &&
                              <div>
                                <i className="fa fa-check"></i>
                                <span className="ml-2">{i18n.t('tabDelimitedFile.label')}</span>
                              </div>}
                            </label>
                            <label>
                              <input
                                name="device_imei"
                                type="radio"
                                value="webpage"
                                checked={values.device_imei === 'webpage'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={(values.device_count && parseInt(values.device_count) > 10)}
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
                        }
                      </FormGroup>
                    </Col>
                    <Col xs={12} md={6}>
                      <FormGroup>
                        <Label>{i18n.t('manufacturingLocation')}<span
                          className="text-danger">*</span></Label>
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
                                      <div key={index} className="device-box">
                                        <Button type="button" size="sm" color="danger" onClick={() => {
                                          MySwal.fire({
                                            title: i18n.t('alert.warning'),
                                            text: i18n.t('alert.text1'),
                                            type: 'question',
                                            showCancelButton: true,
                                            confirmButtonText: i18n.t('ok'),
                                            cancelButtonText: i18n.t('cancel')
                                          }).then((result)=>{
                                            if(result.value){
                                              remove(index)
                                            }
                                          })
                                        }} className="btn-del-device">{i18n.t('delete')}</Button>
                                        <FieldArray
                                          name="imeis"
                                          render={({insert, remove, push}) => (
                                            <Card>
                                              <CardHeader><b>{i18n.t('device')} # {index + 1}</b></CardHeader>
                                              {values.devices[index].imeis.length &&
                                              values.devices[index].imeis.map((imei, i) => (
                                                <CardBody key={i} className="pt-0 pb-0">
                                                  <div className="imei-row">
                                                    <div className="imei-col">
                                                      IMEI # {i + 1}
                                                    </div>
                                                    <div className="imei-col">
                                                      <Field name={`devices.${index}.imeis.${i}.imei`}
                                                             component={doubleEntryInput} type="text"
                                                             placeholder={`${i18n.t('typeImei')} ${i + 1}`}/>
                                                      {errors.devices && touched.devices &&
                                                      <RenderArrayError errors={errors.devices}
                                                                        touched={touched.devices} mainIndex={index}
                                                                        innerIndex={i} field="imei"/>}
                                                    </div>
                                                    <div className="imei-col">
                                                      <Field name={`devices.${index}.imeis.${i}.reImei`}
                                                             component={doubleEntryInput} type="text"
                                                             placeholder={`${i18n.t('reTypeImei')} ${i + 1}`}/>
                                                      {errors.devices && touched.devices &&
                                                      <RenderArrayError errors={errors.devices}
                                                                        touched={touched.devices} mainIndex={index}
                                                                        innerIndex={i} field="reImei"/>}
                                                    </div>
                                                  </div>
                                                </CardBody>
                                              ))}
                                            </Card>
                                          )}
                                        />
                                      </div>
                                    ))}
                                    <Button color="outline-primary" type="button" onClick={() => push({imeis})}
                                            size="sm"
                                            className={(
                                              (errors['device_count'] ||
                                                errors['imei_per_device'] ||
                                                values.devices.length === parseInt(values.device_count))) ?
                                              'd-none' : 'd-inline-block webpage-add-devices'}>
                                      {i18n.t('addDevice')}
                                    </Button>
                                  </div>
                                )
                              }}
                            />
                            {errors.imei_per_device === undefined &&
                              <Field name="imeis_count" component={renderError} class="alert alert-danger"/>
                            }
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  }
                  {values.device_imei === 'tsv' &&
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
              <Button color="primary" type="submit" className="btn-next-prev">{i18n.t('next')}</Button>{' '}
            </div>
          </Col>
        </Row>
      </Form>
    )

  }
}

class NewRegistrationStep2 extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.showPrevStepsData();
  }

  render() {
    const {
      values,
      handleSubmit,
      isSubmitting,
      stepsInfo,
      step,
      id,
      stepReady
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <div>
          <div className="steps-status space-between">
            <div>
              <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
                <small>{i18n.t('requestType')}: <span className="text-primary">{i18n.t('registration')}</span></small>
              </h4>
            </div>
            <div className="steps-status">
              <p>{i18n.t('status')}: <span className='text-primary'>{i18n.t('NewRequest')}</span></p>
              <button onClick={this.handleClick} className="btn-link">{i18n.t('PreviousDetails')}</button>
            </div>
          </div>
          <Row>
            <Col className='order-xl-12 mt-3' xs={12} xl={4}>
              <StepIndicator stepsInfo={stepsInfo} step={step}></StepIndicator>
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
                               label={i18n.t('brand')} placeholder={i18n.t('brand')} type="text" requiredStar  text={values.brand}/>
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
                <Button color="primary" type="submit" disabled={isSubmitting}>{IS_AUTOMATE[0] ? i18n.t('finish') : i18n.t('next')}</Button>{' '}
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    )
  }
}

class NewRegistrationStep3 extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.showPrevStepsData();
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
      stepReady
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <div>
          <div className="steps-status space-between">
            <div>
              <h4>{i18n.t('requestId')}: <span className='text-primary mr-1'>{id}</span>
                <small>{i18n.t('requestType')}: <span className="text-primary">{i18n.t('registration')}</span></small>
              </h4>
            </div>
            <div className="steps-status">
              <p>{i18n.t('status')}: <span className='text-primary'>{i18n.t('awaitingDocuments')}</span></p>
              <button onClick={this.handleClick} className="btn-link">{i18n.t('PreviousDetails')}</button>
            </div>
          </div>
          <Row>
            <Col className='order-xl-12 mt-3' xs={12} xl={4}>
              <StepIndicator stepsInfo={stepsInfo} step={step}></StepIndicator>
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
                          {DOCUMENTS.map((document, index) => (
                            <Col xs={12} sm={6} key={document.id}>
                              <RenderFileInput
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
                            </Col>
                          ))}
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
        </div>
      </Form>
    )
  }
}

const EnhancedNewRegistrationStep1 = withFormik({
  mapPropsToValues: () => {
    return ({
      "device_count": "",
      "imei_per_device": "",
      "device_imei": "",
      "filename": "",
      "imeis_count": "",
      "m_location": "",
      "devices": []
    })
  },

  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.device_count) {
      errors.device_count = i18n.t('fieldRequired')
    } else if (isNaN(Number(values.device_count))) {
      errors.device_count = i18n.t('validation.number')
    } else if (!/^([1-9][0-9]{0,5}|1000000)$/i.test(values.device_count)) {
      errors.device_count = i18n.t('validation.deviceCount');
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

  displayName: 'NewRegistrationStep1', // helps with React DevTools
})(NewRegistrationStep1);

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
  formData.append('user_name', getUserInfo().preferred_username);

  return formData;
}

const EnhancedNewRegistrationStep2 = withFormik({
  mapPropsToValues: () => ({
    "brand": "",
    "model_name": "",
    "model_num": "",
    "device_type": "",
    "operating_system": "",
    "technologies": []
  }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.brand) {
      errors.brand = i18n.t('fieldRequired')
    } else if (values.brand.length >= 1000) {
      errors.brand = i18n.t('validation.maxCharacters')
    }else if (languageCheck(values.brand) === false){
      errors.brand = i18n.t('validation.langError')
      // errors.brand = 'Not supported Lang'
    }

    if (!values.model_name) {
      errors.model_name = i18n.t('fieldRequired')
    } else if (values.model_name.length >= 1000) {
      errors.model_name = i18n.t('validation.maxCharacters')
    }else if (languageCheck(values.model_name) === false){
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

  displayName: 'NewRegistrationStep2', // helps with React DevTools
})(NewRegistrationStep2);

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

const EnhancedNewRegistrationStep3 = withFormik({
  mapPropsToValues: () => ({"step3": "", "documents": []}),

  validate: values => {
    let errors = {};
    if (!values.documents.length || DOCUMENTS.length !== values.documents.length) {
      errors.allDocs = i18n.t('validation.document');
    } else {
      for (let i = 0; i < values.documents.length; i++) {
        if (values.documents[i]) {
          if (!EXTENSIONS.includes(getExtension(values.documents[i].name).toLowerCase())) {
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
        if (!values.documents[i] && DOCUMENTS[i].required) {
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

  displayName: 'NewRegistrationStep3', // helps with React DevTools
})(NewRegistrationStep3);

function prepareAPIRequestStep3(values) {
  // Validate Values before sending
  const formData = new FormData();
  mapObjIndexed((document, key) => {
    formData.append(document.label, values.documents[key])
  }, DOCUMENTS)
  formData.append('user_id', getUserInfo().sub);
  return formData;
}

class NewRegistationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      id: null,
      stepsInfo: REQUEST_STEPS.registration,
      prevStepsData: null,
      prevStepsModal: false,
      stepReady: false
    }
    this.saveStep1 = this.saveStep1.bind(this);
    this.saveStep2 = this.saveStep2.bind(this);
    this.saveStep3 = this.saveStep3.bind(this);
    this.togglePrevStepsModal = this.togglePrevStepsModal.bind(this);
    this.getPrevStepsDataFromServer = this.getPrevStepsDataFromServer.bind(this);
    this.redirectToNextStep = this.redirectToNextStep.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  componentDidMount() {
    this.updateTokenHOC(this.redirectToNextStep);
  }

  redirectToNextStep(config) {
    const {id} = this.props.match.params;
    if (id !== 'id') {
      this.setState({stepReady: false});
      instance.get(`/registration/${id}`, config)
        .then(response => {
          if (response.data.status_label === 'New Request') {
            this.setState({id: response.data.id, step: 2}, () => {
              this.setState({stepReady: true});
            });
          } else if (response.data.status_label === 'Awaiting Documents') {
            this.setState({id: response.data.id, step: 3}, () => {
              this.setState({stepReady: true});
            });
          }
        })

      // Get Previous Steps Data
      this.updateTokenHOC(this.getPrevStepsDataFromServer, id);
    } else {
      this.setState({stepReady: true});
    }
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


  togglePrevStepsModal() {
    this.setState({prevStepsModal: !this.state.prevStepsModal});
  }

  getPrevStepsDataFromServer(config, id) {
    instance.get(`/registration/sections/${id}`, config)
      .then(response => {
        if(response.status===200){
          this.setState({prevStepsData: response.data});
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  saveStep1(config, formdata) {
    // Call API and save information
    this.setState({stepReady: false});
    instance.post(`/registration`, formdata, config)
      .then((response) => {
        if (response.data.id) {
        }
        this.setState({id: response.data.id, step: 2}, () => {
          this.updateTokenHOC(this.getPrevStepsDataFromServer, this.state.id);
          this.setState({stepReady: true});
        });
      })
      .catch((error) => {
        errors(this, error);
        this.setState({
          stepReady: true
        });
      })
  }

  saveStep2(config, formdata) {
    // Call API and save information
    this.setState({stepReady: false});
    const {id} = this.state;
    // Add Request ID to formData
    formdata.append('reg_id', id);
    instance.post(`/registration/device`, formdata, config)
      .then((response) => {
        if (response.data.id) {
          this.updateTokenHOC(this.getPrevStepsDataFromServer, id);
          this.setState({stepReady: true});
          if (IS_AUTOMATE[0])
          {
            // Finish the Registration WITHOUT 3RD STEP IF AUTOMATIC REGISTRATION IS TRUE
            const statusDetails = {
              id: id,
              type: 'registration',
              typeLabel: 'Registration',
              icon: 'fa fa-check',
              status: 'Pending Review',
              action: 'Submitted'
            }
            this.props.history.push({
              pathname: '/request-status',
              state: {details: statusDetails}
            });
          }
          else {
          this.setState({step: 3});
          }
        }
        this.setState({stepReady: true});
      })
      .catch((error) => {
        this.setState({stepReady: true});
        errors(this, error);
      })
  }

  saveStep3(config, formdata) {
    // Call API and save information
    this.setState({stepReady: false});
    const {id} = this.state;
    formdata.append('reg_id', id);
    instance.post(`/registration/documents`, formdata, config)
      .then((response) => {
        if (response.data.length) {
          // Finish the Registration
          this.setState({stepReady: true});
          const statusDetails = {
            id: id,
            type: 'registration',
            typeLabel: 'Registration',
            icon: 'fa fa-check',
            status: 'Pending Review',
            action: 'Submitted'
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
    const {step, stepsInfo, id, prevStepsData, stepReady} = this.state;
    return (
      <I18n ns="translations">
        {
          (t, {i18n}) => (
            <div className="animated fadeIn">
              {(step === 1) &&
              <EnhancedNewRegistrationStep1 callServer={(values) => this.updateTokenHOC(this.saveStep1, values)}
                                            stepsInfo={stepsInfo}
                                            stepReady={stepReady}
                                            step={step}
                                            kcProps={this.props}
              />
              }
              {(step === 2) &&
              <EnhancedNewRegistrationStep2 callServer={(values) => this.updateTokenHOC(this.saveStep2, values)}
                                            stepsInfo={stepsInfo} step={step}
                                            stepReady={stepReady}
                                            id={id} showPrevStepsData={this.togglePrevStepsModal}/>}
              {(step === 3) &&
              <EnhancedNewRegistrationStep3 callServer={(values) => this.updateTokenHOC(this.saveStep3, values)}
                                            stepsInfo={stepsInfo} step={step}
                                            stepReady={stepReady}
                                            id={id} showPrevStepsData={this.togglePrevStepsModal}/>}
              <RenderModal show={this.state.prevStepsModal} className="modal-lg">
                <ModalHeader><b>{i18n.t('previousStep')}</b></ModalHeader>
                <ModalBody>
                  {!isNil(prevStepsData) && !isEmpty(prevStepsData.reg_details) &&
                  <div id="someId">
                    <h6>{i18n.t('requestSteps.registration.basic')}</h6>
                    <table className="table table-bordered">
                      <tbody>
                      <tr>
                        <th>{i18n.t('deviceCount')}</th>
                        <td>{prevStepsData.reg_details.device_count}</td>
                      </tr>
                      <tr>
                        <th>{i18n.t('IMEIsPerDevice')}</th>
                        <td>{prevStepsData.reg_details.imei_per_device}</td>
                      </tr>
                      {(prevStepsData.reg_details.file === null &&
                      <tr>
                        <th>IMEIs</th>
                        <td>
                          <table className="table table-mobile-primary table-webimeis table-striped table-sm mb-0">
                            <tbody>
                            {prevStepsData.reg_details.imeis.map((imeiList, index) => (
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
                        <th>{i18n.t('file')}</th>
                        <td>
                          <button onClick={(e) => {
                            downloadDocument(this.props,prevStepsData.reg_details.file_link, getExtension(prevStepsData.reg_details.file_link), removeExtension(prevStepsData.reg_details.file), e)
                          }} value={prevStepsData.reg_details.file_link} className="btn-link">
                           {i18n.t('download.document')}
                          </button>
                        </td>
                      </tr>}
                      <tr>
                        <th>{i18n.t('manufacturingLocation')}</th>
                        <td>{prevStepsData.reg_details.m_location}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  }

                  {!isNil(prevStepsData) && !isEmpty(prevStepsData.reg_device) &&
                  <div className="mt-4">
                    <h6>{i18n.t('requestSteps.registration.deviceModel')}</h6>
                    <table className="table table-bordered">
                      <tbody>
                      <tr>
                        <th>{i18n.t('brand')}</th>
                        <td>{prevStepsData.reg_device.brand}</td>
                      </tr>
                      <tr>
                        <th>{i18n.t('model')}</th>
                        <td>{prevStepsData.reg_device.model_name}</td>
                      </tr>
                      <tr>
                        <th>{i18n.t('modelnumber')}</th>
                        <td>{prevStepsData.reg_device.model_num}</td>
                      </tr>
                      <tr>
                        <th>{i18n.t('deviceType')}</th>
                        <td>{prevStepsData.reg_device.device_type}</td>
                      </tr>
                      <tr>
                        <th>{i18n.t('operatingSystem')}</th>
                        <td>{prevStepsData.reg_device.operating_system}</td>
                      </tr>
                      <tr>
                        <th>{i18n.t('technologies')}</th>
                        <td>{prevStepsData.reg_device.technologies.join(', ')}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.togglePrevStepsModal}>{i18n.t('close')}</Button>
                </ModalFooter>
              </RenderModal>
            </div>
          )
        }
      </I18n>
    )
  }
}

export default translate('translations')(NewRegistationRequest);
