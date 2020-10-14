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
import {translate} from 'react-i18next';
import i18n from '../../../i18n';
import {withFormik} from 'formik';
import {
  Button,
} from 'reactstrap';
import {
  getAuthHeader,
  instance,
  errors,
  getUserInfo,
  getReviewStatus, getUserRole,
  languageCheck
} from "../../../utilities/helpers";
import {
  REVIEW_STEPS, IS_AUTOMATE
} from "../../../utilities/constants";
import {isNil, lensPath, view, set} from 'ramda'
//Steps forms
import Step1Form from './Forms/Step1Form'
import Step2Form from './Forms/Step2Form'
import Step3Form from './Forms/Step3Form'
import Step4Form from './Forms/Step4Form'
import Step5Form from './Forms/Step5Form'
//Creating Lenses In Ramda for immutibility
const currentStepLens = lensPath(['steps', 'currentStep'])

const step1ApiDataLens = lensPath(['steps', 'step1', 'apiData'])
const step1DataLens = lensPath(['steps', 'step1', 'data'])
const step1Status = lensPath(['steps', 'step1', 'reviewStatus'])
const step1PrevStatus = lensPath(['steps', 'step1', 'prevReviewStatus'])
const step1Feedback = lensPath(['steps', 'step1', 'reviewFeedback'])
const step1Comments = lensPath(['steps', 'step1', 'comments'])
//Step2
const step2ApiDataLens = lensPath(['steps', 'step2', 'apiData'])
const step2DataLens = lensPath(['steps', 'step2', 'data'])
const step2Status = lensPath(['steps', 'step2', 'reviewStatus'])
const step2PrevStatus = lensPath(['steps', 'step2', 'prevReviewStatus'])
const step2Feedback = lensPath(['steps', 'step2', 'reviewFeedback'])
const step2Comments = lensPath(['steps', 'step2', 'comments'])
//Step3
const step3ApiDataLens = lensPath(['steps', 'step3', 'apiData'])
const step3DataLens = lensPath(['steps', 'step3', 'data'])
const step3Status = lensPath(['steps', 'step3', 'reviewStatus'])
const step3PrevStatus = lensPath(['steps', 'step3', 'prevReviewStatus'])
const step3Feedback = lensPath(['steps', 'step3', 'reviewFeedback'])
const step3Comments = lensPath(['steps', 'step3', 'comments'])
//Step4
const step4ApiDataLens = lensPath(['steps', 'step4', 'apiData'])
const step4DataLens = lensPath(['steps', 'step4', 'data'])
const step4Status = lensPath(['steps', 'step4', 'reviewStatus'])
const step4PrevStatus = lensPath(['steps', 'step4', 'prevReviewStatus'])
const step4Feedback = lensPath(['steps', 'step4', 'reviewFeedback'])
const step4Comments = lensPath(['steps', 'step4', 'comments'])
//Step5
const step5ApiDataLens = lensPath(['steps', 'step5', 'apiData'])
const step5DataLens = lensPath(['steps', 'step5', 'data'])
const step5Status = lensPath(['steps', 'step5', 'reviewStatus'])
const step5PrevStatus = lensPath(['steps', 'step5', 'prevReviewStatus'])
const step5Feedback = lensPath(['steps', 'step5', 'reviewFeedback'])
const step5Comments = lensPath(['steps', 'step5', 'comments'])

export class ReviewRegistrationForm extends Component {
  render() {
    const {
      dirty,
      handleSubmit,
      isValid,
      stepsInfo,
      stepsNames,
      unAssignReview,
      assigned,
      assignedTo,
      step,
      callPrev,
      reviewStatus,
      id,
      viewType,
      stepIndicator,
      totalImeis,
      requestStatus,
      stepReady,
      jumpToNext,
      kcProps,
      showReport,
      userRole,
      toggleReportStatus
    } = this.props
    const step1Data = stepsInfo.step1.apiData
    const step2Data = stepsInfo.step2.apiData
    const step3Data = stepsInfo.step3.apiData
    const step4Data = stepsInfo.step4.apiData
    const step5Data = stepsInfo.step5.apiData
    return (
      <div>
        <div id="stepHeader" className="steps-status space-between">
          <div>
            <h4>{i18n.t('requestId')}: <span className="text-primary">{id}</span> &nbsp;&nbsp;
              <small>{viewType === 'registration' ?
                <span>{i18n.t('requestType')}: <span className="text-primary">{i18n.t('registration')}</span></span> :
                <span>{i18n.t('requestType')}: <span
                  className="text-primary"> {i18n.t('deregistration')}</span></span>}</small>
            </h4>
          </div>
          <div className='steps-status'>
            {assigned &&
            <p>{i18n.t('assignee')}: <span className='text-primary'>{assignedTo}</span> - {i18n.t('status')}: <span
              className='text-secondary'>{i18n.t(requestStatus)}</span></p>
            }
            {assigned &&
            <Button onClick={unAssignReview} color="danger"
                    size="sm">{i18n.t('unAssignRequest')}</Button>
            }
          </div>
        </div>
        {step === 1 && viewType === 'registration' &&
        <Step1Form
          handleSubmit={handleSubmit}
          stepsNames={stepsNames}
          stepIndicator={stepIndicator}
          step1Data={step1Data}
          stepsInfo={stepsInfo}
          stepReady={stepReady}
          callPrev={callPrev}
          jumpToNext={jumpToNext}
          viewType={viewType}
          reviewStatus={reviewStatus}
          dirty={dirty}
          isValid={isValid}
          type='review'
        />
        }
        {step === 2 &&
        <Step2Form
          handleSubmit={handleSubmit}
          stepsNames={stepsNames}
          stepIndicator={stepIndicator}
          step2Data={step2Data}
          stepsInfo={stepsInfo}
          stepReady={stepReady}
          callPrev={callPrev}
          jumpToNext={jumpToNext}
          viewType={viewType}
          reviewStatus={reviewStatus}
          dirty={dirty}
          isValid={isValid}
          type='review'
        />
        }
        {step === 3 &&
        <Step3Form
          handleSubmit={handleSubmit}
          stepsNames={stepsNames}
          stepIndicator={stepIndicator}
          step3Data={step3Data}
          stepsInfo={stepsInfo}
          stepReady={stepReady}
          callPrev={callPrev}
          jumpToNext={jumpToNext}
          viewType={viewType === 'registration' ? 'registration_request' : 'de_registration_request'}
          reviewStatus={reviewStatus}
          dirty={dirty}
          isValid={isValid}
          id={id}
          totalImeis={totalImeis}
          kcProps={kcProps}
          showReport={showReport}
          userRole={userRole}
          toggleReportStatus={toggleReportStatus}
          type='review'
        />
        }
        {step === 4 &&
        <Step4Form
          handleSubmit={handleSubmit}
          stepsNames={stepsNames}
          stepIndicator={stepIndicator}
          step4Data={step4Data}
          stepsInfo={stepsInfo}
          stepReady={stepReady}
          callPrev={callPrev}
          jumpToNext={jumpToNext}
          viewType={viewType}
          reviewStatus={reviewStatus}
          dirty={dirty}
          isValid={isValid}
          type='review'
        />
        }
        {step === 5 &&
        <Step5Form
          handleSubmit={handleSubmit}
          stepsNames={stepsNames}
          stepIndicator={stepIndicator}
          step5Data={step5Data}
          stepsInfo={stepsInfo}
          stepReady={stepReady}
          callPrev={callPrev}
          reviewStatus={reviewStatus}
          dirty={dirty}
          isValid={isValid}
          kcProps={kcProps}
          type='review'
        />
        }
      </div>
    )
  }
}

function prepareAPIRequest(values, step, id, requestType) {
  // Validate Values before sending
  const type = requestType === 'registration' ? 'registration_request' : 'de_registration_request'
  const reviewer_name = getUserInfo().preferred_username
  let data = {}
  if (step === 1) {
    data = {
      "comment": values.reviewFeedback,
      "request_id": id,
      "request_type": type,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": reviewer_name,
      "status": parseInt(values.reviewStatus),
      "section": "device_quota",
    }
    return data;
  }
  else if (step === 2) {
    data = {
      "comment": values.reviewFeedback,
      "request_id": id,
      "request_type": type,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": reviewer_name,
      "status": parseInt(values.reviewStatus),
      "section": "device_description",
    }
    return data;
  }
  else if (step === 3) {
    data = {
      "comment": values.reviewFeedback,
      "request_id": id,
      "request_type": type,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": reviewer_name,
      "status": parseInt(values.reviewStatus),
      "section": "imei_classification",
    }
    return data;
  }
  else if (step === 4) {
    data = {
      "comment": values.reviewFeedback,
      "request_id": id,
      "request_type": type,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": reviewer_name,
      "status": parseInt(values.reviewStatus),
      "section": "imei_registration",
    }
    return data;
  }
  else if (step === 5) {
    data = {
      "comment": values.reviewFeedback,
      "request_id": id,
      "request_type": type,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": reviewer_name,
      "status": parseInt(values.reviewStatus),
      "section": "approval_documents",
    }
    return data;
  }
}

export const EnhancedForm = withFormik({
  mapPropsToValues: (props) => ({
    reviewStatus: props.reviewStatus,
    reviewFeedback: props.reviewFeedback
  }),
  // Custom sync validation
  validate: values => {
    let errors = {}
    if (values.reviewStatus === '' || values.reviewStatus === 'select') {
      errors.reviewStatus = i18n.t('fieldRequired')
    }
    if (values.reviewFeedback === '') {
      errors.reviewFeedback = i18n.t('fieldRequired')
    }else if (languageCheck(values.reviewFeedback) === false){
      errors.reviewFeedback = i18n.t('validation.langError')
      // errors.brand = 'Not supported Lang'
    }
    return errors;
  },
  handleSubmit: (values, bag) => {
    if (bag.props.step === 1) {
      bag.props.callServer(prepareAPIRequest(values, 1, bag.props.id, bag.props.viewType))
    } else if (bag.props.step === 2) {
      bag.props.callServer(prepareAPIRequest(values, 2, bag.props.id, bag.props.viewType))
    } else if (bag.props.step === 3) {
      bag.props.callServer(prepareAPIRequest(values, 3, bag.props.id, bag.props.viewType))
    } else if (bag.props.step === 4) {
      bag.props.callServer(prepareAPIRequest(values, 4, bag.props.id, bag.props.viewType))
    } else if (bag.props.step === 5) {
      bag.props.callServer(prepareAPIRequest(values, 5, bag.props.id, bag.props.viewType))
    }
    bag.setSubmitting(false);
    bag.setFieldValue('reviewStatus', bag.props.reviewStatus)
    bag.setFieldValue('reviewFeedback', bag.props.reviewFeedback)
    bag.setFieldTouched('reviewStatus', false, false)
    bag.setFieldTouched('reviewFeedback', false, false)
  },
  displayName: 'ReviewRegistrationForm', // helps with React DevTools
})(ReviewRegistrationForm);

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: '',
      viewType: '',
      assigned: false,
      assignedTo: 'N/A',
      requestId: 0,
      currentReviewStatus: '',
      currentReviewFeedback: '',
      stepReady: false,
      stepUpdated: false,
      isRejected: false,
      stepsInfo: REVIEW_STEPS.registration,
      stepsInfo2: REVIEW_STEPS.de_registration,
      totalImeis: null,
      requestStatus: '',
      completedRequest: false,
      showReport: false,
      steps: {
        currentStep: null,
        step1: {
          data: {},
          apiData: null,
          comments: [],
          reviewStatus: '',
          prevReviewStatus: '',
          reviewFeedback: ''
        },
        step2: {
          data: {},
          apiData: null,
          comments: [],
          reviewStatus: '',
          prevReviewStatus: '',
          reviewFeedback: ''
        },
        step3: {
          data: {},
          apiData: null,
          comments: [],
          reviewStatus: '',
          prevReviewStatus: '',
          reviewFeedback: ''
        },
        step4: {
          data: {},
          apiData: null,
          comments: [],
          reviewStatus: '',
          prevReviewStatus: '',
          reviewFeedback: ''
        },
        step5: {
          data: {},
          apiData: null,
          comments: [],
          reviewStatus: '',
          prevReviewStatus: '',
          reviewFeedback: ''
        }
      }
    }
    this.unAssignReview = this.unAssignReview.bind(this);
    this.checkReviewer = this.checkReviewer.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.getStepDataFromServer = this.getStepDataFromServer.bind(this);
    this.callPrev = this.callPrev.bind(this);
    this.jumpToNext = this.jumpToNext.bind(this);
    this.getSectionsData = this.getSectionsData.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }
  /**
   * HOC function to update token
   * @param callingFunc
   */
  updateTokenHOC(callingFunc, param1=null,param2=null,param3=null) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kc.token)
          config = {
            headers: getAuthHeader(this.props.kc.token)
          }
          callingFunc(config,param1,param2,param3);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config,param1,param2,param3);
    }
  }

  unAssignReview(config) {
    const id = this.state.requestId;
    const type = this.state.viewType === 'registration' ? 'registration_request' : 'de_registration_request'
    let data = {
      "request_id": parseInt(id),
      "request_type": type,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": getUserInfo().preferred_username
    }
    instance.put(`/review/unassign-reviewer`, data, config)
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            assigned: false,
          })
          this.props.history.push('/search-requests')
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  checkReviewer(config) {
    const id = this.state.requestId;
    const type = this.state.viewType
    instance.get(`/${type}/${id}`, config)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.reviewer_id && response.data.reviewer_name) {
            this.setState({
              assigned: true,
              assignedTo: response.data.reviewer_name,
              requestStatus: response.data.status_label,
              showReport: response.data.report_allowed
            })
          } else {
            this.setState({
              assigned: false
            })
          }
          if (type === 'registration') {
            this.setState({
              totalImeis: response.data.device_count * response.data.imei_per_device
            })
          } else {
            this.setState({
              totalImeis: response.data.device_count
            })
          }
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  componentDidMount() {
    const type = this.props.match.params.type
    const id = parseInt(this.props.match.params.id);
    let currStep = null
    if(type === 'registration'){
      currStep = 1
    } else{
      currStep = 2
    }
    this.setState(state => {
      const updateCurrentStep = set(currentStepLens, currStep, state);
      const updateState = {
        ...updateCurrentStep,
        viewType: type,
        requestId: id
      }
      return updateState
    }, () => {
      this.updateTokenHOC(this.getSectionsData)
      this.updateTokenHOC(this.checkReviewer)
    })
  }

  getSectionsData(config) {
    const type = this.state.viewType === 'registration' ? 'registration_request' : 'de_registration_request'
    const id = this.state.requestId;
    instance.get(`/review/sections?request_id=${id}&request_type=${type}`, config)
      .then((response) => {
        if (response.status === 200) {
          for (let step in response.data.sections) {
            if (response.data.sections[step].section_type === 'device_quota') {
              if (!isNil(response.data.sections[step].section_status)) {
                this.setState(state => {
                  const updateComments = set(step1Comments, response.data.sections[step].comments, state)
                  const updateStatus = set(step1Status, response.data.sections[step].section_status, updateComments)
                  const updatePrevStatus = set(step1PrevStatus, response.data.sections[step].section_status, updateStatus)
                  const updateFeedback = set(step1Feedback, response.data.sections[step].comments[0].comment, updatePrevStatus)
                  return updateFeedback
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,1, false);
                })
              } else {
                this.setState({
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,1, true);
                })
                break
              }
            }
            else if (response.data.sections[step].section_type === 'device_description') {
              if (!isNil(response.data.sections[step].section_status)) {
                this.setState(state => {
                  const updateComments = set(step2Comments, response.data.sections[step].comments, state)
                  const updateStatus = set(step2Status, response.data.sections[step].section_status, updateComments)
                  const updatePrevStatus = set(step2PrevStatus, response.data.sections[step].section_status, updateStatus)
                  const updateFeedback = set(step2Feedback, response.data.sections[step].comments[0].comment, updatePrevStatus)
                  return updateFeedback
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,2, false);
                })
              } else {
                this.setState({
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,2, true);
                })
                break
              }
            }
            else if (response.data.sections[step].section_type === 'imei_classification') {
              if (!isNil(response.data.sections[step].section_status)) {
                this.setState(state => {
                  const updateComments = set(step3Comments, response.data.sections[step].comments, state)
                  const updateStatus = set(step3Status, response.data.sections[step].section_status, updateComments)
                  const updatePrevStatus = set(step3PrevStatus, response.data.sections[step].section_status, updateStatus)
                  const updateFeedback = set(step3Feedback, response.data.sections[step].comments[0].comment, updatePrevStatus)
                  return updateFeedback
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,3, false);
                })
              } else {
                this.setState({
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,3, true);
                })
                break;
              }
            }
            else if (response.data.sections[step].section_type === 'imei_registration') {
              if (!isNil(response.data.sections[step].section_status)) {
                this.setState(state => {
                  const updateComments = set(step4Comments, response.data.sections[step].comments, state)
                  const updateStatus = set(step4Status, response.data.sections[step].section_status, updateComments)
                  const updatePrevStatus = set(step4PrevStatus, response.data.sections[step].section_status, updateStatus)
                  const updateFeedback = set(step4Feedback, response.data.sections[step].comments[0].comment, updatePrevStatus)
                  return updateFeedback
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,4, false);
                })
              } else {
                this.setState({
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,4, true);
                })
                break
              }
            }
            else if (response.data.sections[step].section_type === 'approval_documents') {
              if (!isNil(response.data.sections[step].section_status)) {
                this.setState(state => {
                  const updateComments = set(step5Comments, response.data.sections[step].comments, state)
                  const updateStatus = set(step5Status, response.data.sections[step].section_status, updateComments)
                  const updatePrevStatus = set(step5PrevStatus, response.data.sections[step].section_status, updateStatus)
                  const updateFeedback = set(step5Feedback, response.data.sections[step].comments[0].comment, updatePrevStatus)
                  return updateFeedback
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,6, true);
                })
              } else {
                this.setState({
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                }, () => {
                  this.updateTokenHOC(this.getStepDataFromServer,5, true);
                })
                break
              }
            }
          }
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  getStepDataFromServer(config,step, push) {
    const {id} = this.props.match.params;
    const type = this.state.viewType === 'registration' ? 'registration_request' : 'de_registration_request'

    let stepNumber = step
    if (stepNumber === 1) {
      instance.get(`/review/device-quota?request_id=${id}`, config)
        .then(response => {
          if(response.status===200){
            this.setState(state => {
              return set(step1ApiDataLens, response.data, state);
            }, () => {
              if (push) {
                this.setState(state => {
                  return set(currentStepLens, 1, state);
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
            });
          }
        })
        .catch(error => {
          this.setState({
            currentReviewStatus: view(step1Status, this.state),
            currentReviewFeedback: view(step1Feedback, this.state),
          }, () => {
            this.setState(state => {
              return set(currentStepLens, 1, state);
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          });
          errors(this, error);
        })
    }
    else if (stepNumber === 2) {
      instance.get(`/review/device-description?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          if(response.status===200){
            this.setState((state) => {
              return set(step2ApiDataLens, response.data, state)
            }, () => {
              if (push) {
                this.setState(state => {
                  return set(currentStepLens, 2, state);
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
            });
          }
        })
        .catch(error => {
          if(type==='registration'){
            this.setState({
              currentReviewStatus: view(step1Status, this.state),
              currentReviewFeedback: view(step1Feedback, this.state),
            }, () => {
              this.setState(state => {
                return set(currentStepLens, 1, state);
              }, () => {
                this.setState({
                  stepReady: true
                })
              })
            });
          } else{
            this.setState({
              currentReviewStatus: view(step2Status, this.state),
              currentReviewFeedback: view(step2Feedback, this.state),
            }, () => {
              this.setState(state => {
                return set(currentStepLens, 2, state);
              }, () => {
                this.setState({
                  stepReady: true
                })
              })
            });
          }
          errors(this, error);
        })
    }
    else if (stepNumber === 3) {
      instance.get(`/review/imei-classification?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          if(response.status===200){
            this.setState(state => {
              return set(step3ApiDataLens, response.data, state);
            }, () => {
              if (push) {
                this.setState(state => {
                  return set(currentStepLens, 3, state);
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
            });
          }
        })
        .catch(error => {
          this.setState({
            currentReviewStatus: view(step2Status, this.state),
            currentReviewFeedback: view(step2Feedback, this.state),
          }, () => {
            this.setState(state => {
              return set(currentStepLens, 2, state);
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          });
          errors(this, error);
        })
    }
    else if (stepNumber === 4) {
      instance.get(`/review/imeis-status?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          if (response.status === 200) {
            this.setState(state => {
              return set(step4ApiDataLens, response.data, state);
            }, () => {
              if (push) {
                this.setState(state => {
                  return set(currentStepLens, 4, state);
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
            });
          }
        })
        .catch(error => {
          this.setState({
            currentReviewStatus: view(step3Status, this.state),
            currentReviewFeedback: view(step3Feedback, this.state),
          }, () => {
            this.setState(state => {
              return set(currentStepLens, 3, state);
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          });
          errors(this, error);
        })
    }
    else if (stepNumber === 5) {
      instance.get(`/review/documents?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          if(response.status===200){
            this.setState(state => {
              return set(step5ApiDataLens, response.data, state);
            }, () => {
              if (push) {
                this.setState(state => {
                  return set(currentStepLens, 5, state);
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
            });
          }
        })
        .catch(error => {
          this.setState({
            currentReviewStatus: view(step4Status, this.state),
            currentReviewFeedback: view(step4Feedback, this.state),
          }, () => {
            this.setState(state => {
              return set(currentStepLens, 4, state);
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          });
          errors(this, error);
        })
    }
    else if (stepNumber === 6) {
      if (this.state.viewType === 'registration') {
        instance.get(`/review/device-quota?request_id=${id}`, config)
          .then(response => {
            //Reset Data if all the steps are completed
            if(response.status===200){
              this.setState(state => {
                const updateApiData = set(step1ApiDataLens, response.data, state);
                const updateStatus = {
                  ...updateApiData,
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                  steps: {
                    ...this.state.steps,
                    step2: {
                      data: {},
                      ...this.state.steps.step2,
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    },
                    step3: {
                      ...this.state.steps.step3,
                      data: {},
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    },
                    step4: {
                      ...this.state.steps.step4,
                      data: {},
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    },
                    step5: {
                      ...this.state.steps.step5,
                      data: {},
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    }
                  }
                }
                return updateStatus;
              }, () => {
                if (push) {
                  this.setState(state => {
                    return set(currentStepLens, 1, state);
                  }, () => {
                    this.setState({
                      stepReady: true
                    })
                  })
                }
              });
            }
          })
          .catch(error => {
            this.setState({
              currentReviewStatus: view(step5Status, this.state),
              currentReviewFeedback: view(step5Feedback, this.state)
            }, () => {
              this.setState(state => {
                return set(currentStepLens, 5, state);
              }, () => {
                this.setState({
                  stepReady: true
                })
              })
            });
            errors(this, error);
          })
      } else {
        instance.get(`/review/device-description?request_id=${id}&request_type=${type}`, config)
          .then(response => {
            //Reset Data if all the steps are completed
            if(response.status===200){
              this.setState(state => {
                const updateApiData = set(step2ApiDataLens, response.data, state);
                const updateStatus = {
                  ...updateApiData,
                  currentReviewStatus: '',
                  currentReviewFeedback: '',
                  steps: {
                    ...this.state.steps,
                    step3: {
                      ...this.state.steps.step3,
                      data: {},
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    },
                    step4: {
                      ...this.state.steps.step4,
                      data: {},
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    },
                    step5: {
                      ...this.state.steps.step5,
                      data: {},
                      apiData: null,
                      reviewStatus: '',
                      reviewFeedback: ''
                    }
                  }
                };
                return updateStatus;
              }, () => {
                if (push) {
                  this.setState(state => {
                    return set(currentStepLens, 2, state);
                  }, () => {
                    this.setState({
                      stepReady: true
                    })
                  })
                }
              });
            }
          })
          .catch(error => {
            this.setState({
              currentReviewStatus: view(step5Status, this.state),
              currentReviewFeedback: view(step5Feedback, this.state)
            }, () => {
              this.setState(state => {
                return set(currentStepLens, 5, state);
              }, () => {
                this.setState({
                  stepReady: true
                })
              })
            });
            errors(this, error);
          })
      }
    }
  }

  saveStep(config,data) {
    // Call API and save information
    this.setState({
      stepReady: false
    })
    const {steps} = this.state
    if (data.section === 'device_quota') {
      instance.put(`/review/review-section`, data, config)
        .then((response) => {
          if (response.status === 201) {
            if (data.status === 7) {
              this.updateTokenHOC(this.submitReview,1, data.status)
            } else {
              if (steps.step2.apiData) {
                this.setState(state => {
                  const updateData = set(step1DataLens, data, state);
                  const updateCurrentStep = set(currentStepLens, 2, updateData);
                  const updateStatus = set(step1Status, data.status, updateCurrentStep);
                  const updateReview = set(step1Feedback, data.comment, updateStatus);
                  const updateState = {
                    ...updateReview,
                    currentReviewStatus: view(step2Status, updateReview),
                    currentReviewFeedback: view(step2Feedback, updateReview),
                  }
                  return updateState
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
              else {
                this.updateTokenHOC(this.getStepDataFromServer,2, true)
                this.setState(state => {
                  const updateData = set(step1DataLens, data, state);
                  const updateStatus = set(step1Status, data.status, updateData);
                  const updateReview = set(step1Feedback, data.comment, updateStatus);
                  const updateCurrentFields = {
                    ...updateReview,
                    currentReviewStatus: '',
                    currentReviewFeedback: '',
                  }
                  return updateCurrentFields
                })
              }
              this.setState({
                stepUpdated: true
              })
            }
          }
        })
        .catch((error) => {
          this.setState({stepReady: true})
          errors(this, error);
        })
    }
    else if (data.section === 'device_description') {
      instance.put(`/review/review-section`, data, config)
        .then((response) => {
          if (response.status === 201) {
            if (data.status === 7) {
              this.updateTokenHOC(this.submitReview,2, data.status)
            } else {
              if (steps.step3.apiData) {
                this.setState(state => {
                  const updateData = set(step2DataLens, data, state);
                  const updateCurrentStep = set(currentStepLens, 3, updateData);
                  const updateStatus = set(step2Status, data.status, updateCurrentStep);
                  const updateReview = set(step2Feedback, data.comment, updateStatus);
                  const updateState = {
                    ...updateReview,
                    currentReviewStatus: view(step3Status, updateReview),
                    currentReviewFeedback: view(step3Feedback, updateReview),
                  }
                  return updateState
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
              else {
                this.updateTokenHOC(this.getStepDataFromServer,3, true)
                this.setState(state => {
                  const updateData = set(step2DataLens, data, state);
                  const updateStatus = set(step2Status, data.status, updateData);
                  const updateReview = set(step2Feedback, data.comment, updateStatus);
                  const updateCurrentFields = {
                    ...updateReview,
                    currentReviewStatus: '',
                    currentReviewFeedback: '',
                  }
                  return updateCurrentFields
                })
                this.setState({
                  stepUpdated: true
                })
              }
            }
          }
        })
        .catch((error) => {
          this.setState({stepReady: true})
          errors(this, error);
        })
    }
    else if (data.section === 'imei_classification') {
      instance.put(`/review/review-section`, data, config)
        .then((response) => {
          if (response.status === 201) {
            if (data.status === 7) {
              this.updateTokenHOC(this.submitReview,3, data.status)
            } else {
              if (steps.step4.apiData) {
                this.setState(state => {
                  const updateData = set(step3DataLens, data, state);
                  const updateCurrentStep = set(currentStepLens, 4, updateData);
                  const updateStatus = set(step3Status, data.status, updateCurrentStep);
                  const updateReview = set(step3Feedback, data.comment, updateStatus);
                  const updateState = {
                    ...updateReview,
                    currentReviewStatus: view(step4Status, updateReview),
                    currentReviewFeedback: view(step4Feedback, updateReview),
                  }
                  return updateState
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
              else {
                this.updateTokenHOC(this.getStepDataFromServer,4, true)
                this.setState(state => {
                  const updateData = set(step3DataLens, data, state);
                  const updateStatus = set(step3Status, data.status, updateData);
                  const updateReview = set(step3Feedback, data.comment, updateStatus);
                  const updateCurrentFields = {
                    ...updateReview,
                    currentReviewStatus: '',
                    currentReviewFeedback: '',
                  }
                  return updateCurrentFields
                })
              }
              this.setState({
                stepUpdated: true
              })
            }
          }
        })
        .catch((error) => {
          this.setState({stepReady: true})
          errors(this, error);
        })
    }
    else if (data.section === 'imei_registration') {
      instance.put(`/review/review-section`, data, config)
        .then((response) => {
          if (response.status === 201) {
            if (data.status === 7) {
              this.updateTokenHOC(this.submitReview,4, data.status)
            } else {
              if (steps.step5.apiData) {
                this.setState(state => {
                  const updateData = set(step4DataLens, data, state);
                  const updateCurrentStep = set(currentStepLens, 5, updateData);
                  const updateStatus = set(step4Status, data.status, updateCurrentStep);
                  const updateReview = set(step4Feedback, data.comment, updateStatus);
                  const updateState = {
                    ...updateReview,
                    currentReviewStatus: view(step5Status, updateReview),
                    currentReviewFeedback: view(step5Feedback, updateReview),
                  }
                  return updateState
                }, () => {
                  this.setState({
                    stepReady: true
                  })
                })
              }
              else {
                this.updateTokenHOC(this.getStepDataFromServer,5, true)
                this.setState(state => {
                  const updateData = set(step4DataLens, data, state);
                  const updateStatus = set(step4Status, data.status, updateData);
                  const updateReview = set(step4Feedback, data.comment, updateStatus);
                  const updateCurrentFields = {
                    ...updateReview,
                    currentReviewStatus: '',
                    currentReviewFeedback: '',
                  }
                  return updateCurrentFields
                })
                this.setState({
                  stepUpdated: true
                })
              }
            }
          }
        })
        .catch((error) => {
          this.setState({stepReady: true})
          errors(this, error);
        })
    }
    else if (data.section === 'approval_documents') {
      instance.put(`/review/review-section`, data, config)
        .then((response) => {
          if (response.status === 201) {
            this.setState(state => {
              const updateData = set(step5DataLens, data, state);
              const updateStatus = set(step5Status, data.status, updateData);
              const updateReview = set(step5Feedback, data.comment, updateStatus);
              return updateReview
            })
            this.updateTokenHOC(this.submitReview,5)
          }
        })
        .catch((error) => {
          this.setState({stepReady: true})
          errors(this, error);
        })
    }
  }

  callPrev() {
    const {steps} = this.state
    if (this.state.viewType === 'registration') {
      if (steps.currentStep === 2) {
        this.setState({
          currentReviewStatus: view(step1Status, this.state),
          currentReviewFeedback: view(step1Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 1, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 3) {
        this.setState({
          currentReviewStatus: view(step2Status, this.state),
          currentReviewFeedback: view(step2Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 2, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 4) {
        this.setState({
          currentReviewStatus: view(step3Status, this.state),
          currentReviewFeedback: view(step3Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 3, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 5) {
        this.setState({
          currentReviewStatus: view(step4Status, this.state),
          currentReviewFeedback: view(step4Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 4, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
    }
    else {
      if (steps.currentStep === 3) {
        this.setState({
          currentReviewStatus: view(step2Status, this.state),
          currentReviewFeedback: view(step2Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 2, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 4) {
        this.setState({
          currentReviewStatus: view(step3Status, this.state),
          currentReviewFeedback: view(step3Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 3, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 5) {
        this.setState({
          currentReviewStatus: view(step4Status, this.state),
          currentReviewFeedback: view(step4Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 4, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
    }
  }

  jumpToNext() {
    const {steps} = this.state
    if (this.state.viewType === 'registration') {
      if (steps.currentStep === 1) {
        this.setState({
          currentReviewStatus: view(step2Status, this.state),
          currentReviewFeedback: view(step2Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 2, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 2) {
        this.setState({
          currentReviewStatus: view(step3Status, this.state),
          currentReviewFeedback: view(step3Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 3, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 3) {
        this.setState({
          currentReviewStatus: view(step4Status, this.state),
          currentReviewFeedback: view(step4Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 4, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
      else if (steps.currentStep === 4 && !IS_AUTOMATE[0]) {
        this.setState({
          currentReviewStatus: view(step5Status, this.state),
          currentReviewFeedback: view(step5Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 5, state)
          },()=>{
            this.setState({
              stepReady: true
            })
          })
        })
      }
    }
    else {
      if (steps.currentStep === 2) {
        this.setState({
          currentReviewStatus: view(step3Status, this.state),
          currentReviewFeedback: view(step3Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 3, state)
          })
        })
      }
      else if (steps.currentStep === 3) {
        this.setState({
          currentReviewStatus: view(step4Status, this.state),
          currentReviewFeedback: view(step4Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 4, state)
          })
        })
      }
      else if (steps.currentStep === 4 && !IS_AUTOMATE[0]) {
        this.setState({
          currentReviewStatus: view(step5Status, this.state),
          currentReviewFeedback: view(step5Feedback, this.state)
        }, () => {
          this.setState(state => {
            return set(currentStepLens, 5, state)
          })
        })
      }
    }
  }

  submitReview(config, step, status=null) {
    const {id} = this.props.match.params;
    const type = this.state.viewType === 'registration' ? 'registration_request' : 'de_registration_request'
    let data = {
      "request_id": id,
      "request_type": type,
      "reviewer_id": getUserInfo().sub
    }
    instance.put(`/review/submit-review`, data, config)
      .then((response) => {
        if (response.status === 201) {
          if (step === 5 || status === 7) {
            const statusDetails = {
              id: response.data.request_id,
              userType: 'reviewer',
              type: response.data.request_type === 'registration_request' ? 'registration' : 'deregistration',
              typeLabel: this.state.viewType === 'registration' ? 'Registration' : 'De-Registration',
              icon: 'fa fa-check',
              status: getReviewStatus(response.data.status),
              action: 'Submitted'
            }
            this.props.history.push({
              pathname: '/request-status',
              state: {details: statusDetails}
            });
          }
        }
      })
      .catch((error) => {
        if (step === 1) {
          this.setState({
            currentReviewStatus: this.state.steps.step1.reviewStatus,
            currentReviewFeedback: this.state.steps.step1.reviewFeedback,
          }, () => {
            this.setState({
              steps: {
                ...this.state.steps,
                currentStep: 1
              }
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          })
        } else if (step === 2) {
          this.setState({
            currentReviewStatus: this.state.steps.step2.reviewStatus,
            currentReviewFeedback: this.state.steps.step2.reviewFeedback,
          }, () => {
            this.setState({
              steps: {
                ...this.state.steps,
                currentStep: 2
              }
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          })
        } else if (step === 3) {
          this.setState({
            currentReviewStatus: this.state.steps.step3.reviewStatus,
            currentReviewFeedback: this.state.steps.step3.reviewFeedback,
          }, () => {
            this.setState({
              steps: {
                ...this.state.steps,
                currentStep: 3
              }
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          })
        } else if (step === 4) {
          this.setState({
            currentReviewStatus: this.state.steps.step4.reviewStatus,
            currentReviewFeedback: this.state.steps.step4.reviewFeedback,
          }, () => {
            this.setState({
              steps: {
                ...this.state.steps,
                currentStep: 4
              }
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          })
        } else if (step === 5) {
          this.setState({
            currentReviewStatus: this.state.steps.step5.reviewStatus,
            currentReviewFeedback: this.state.steps.step5.reviewFeedback,
          }, () => {
            this.setState({
              steps: {
                ...this.state.steps,
                currentStep: 5
              }
            }, () => {
              this.setState({
                stepReady: true
              })
            })
          })
        }
        errors(this, error);
      })
  }

  render() {
    const {
      steps,
      stepReady,
      stepsInfo,
      stepsInfo2,
      viewType,
      assigned,
      assignedTo,
      currentReviewStatus,
      currentReviewFeedback,
      totalImeis,
      requestStatus,
      requestId,
      showReport
    } = this.state;
    return (
      <div className="animated fadeIn">
        <EnhancedForm
          enableReinitialize={true}
          reviewStatus={currentReviewStatus}
          reviewFeedback={currentReviewFeedback}
          stepsInfo={steps}
          step={steps.currentStep}
          stepsNames={viewType === 'registration' ? stepsInfo : stepsInfo2}
          id={requestId}
          viewType={viewType}
          stepIndicator={viewType === 'registration' ? steps.currentStep : steps.currentStep - 1}
          assigned={assigned}
          assignedTo={assignedTo}
          unAssignReview={()=>this.updateTokenHOC(this.unAssignReview)}
          callPrev={this.callPrev}
          jumpToNext={this.jumpToNext}
          callServer={(data)=>this.updateTokenHOC(this.saveStep,data)}
          stepReady={stepReady}
          totalImeis={totalImeis}
          requestStatus={requestStatus}
          showReport={showReport}
          kcProps = {this.props}
          userRole = {getUserRole(this.props.resources)}
          toggleReportStatus={(val)=>this.setState({showReport : val})}
        />
      </div>
    )
  }
}

export default translate('translations')(Review);
