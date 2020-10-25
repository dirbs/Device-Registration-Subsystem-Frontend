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
import {REVIEW_STEPS, IS_AUTOMATE} from "../../../../utilities/constants";
import {
  Button
} from 'reactstrap';
import {
  instance,
  errors,
  getAuthHeader,
  getUserInfo,
  getStatusClass, getUserRole
} from "../../../../utilities/helpers";
//Steps form
import Step1Form from '../Forms/Step1Form'
import Step2Form from '../Forms/Step2Form'
import Step3Form from '../Forms/Step3Form'
import Step4Form from '../Forms/Step4Form'
import Step5Form from '../Forms/Step5Form'
import i18n from "../../../../i18n";

export const Steps = ({
                 stepsInfo,
                 stepsNames,
                 assigned,
                 assignedTo,
                 step,
                 callPrev,
                 id,
                 requestStatus,
                 viewType,
                 stepIndicator,
                 gotoReview,
                 jumpToNext,
                 totalImeis,
                 stepReady,
                 kcProps,
                 userRole,
                 reportVisibility
               }) => {
  const step1Data = stepsInfo.step1.apiData
  const step2Data = stepsInfo.step2.apiData
  const step3Data = stepsInfo.step3.apiData
  const step4Data = stepsInfo.step4.apiData
  const step5Data = stepsInfo.step5.apiData
  return (
    <I18n ns="translations">
      {
        (t) => (
          <div>
            <div id="stepHeader" className="steps-status space-between">
              <div>
                <h4>{t('requestId')}: <span className="text-primary">{id}</span> &nbsp;&nbsp;
                  <small>{viewType === 'registration_request' ?
                    <span>{t('requestType')}: <span className="text-primary">{t('registration')}</span></span> :
                    <span>{t('requestType')}: <span
                      className="text-primary"> {t('deregistration')}</span></span>}</small>
                </h4>
              </div>
              <div className='steps-status no-previous'>
                {assignedTo !== 'N/A' &&
                <p>{t('assignee')}: <span className='text-primary'>{assignedTo}</span> - {t('status')}: <span
                  className={getStatusClass(requestStatus, 'text')}>{i18n.t(requestStatus)}</span></p>
                }
                {(!assigned && !IS_AUTOMATE[0]) &&
                <div className='steps-status'>
                  <p>{t('status')}: <span className={getStatusClass(requestStatus, 'text')}>{i18n.t(requestStatus)}</span></p>
                  <Button onClick={gotoReview} color="primary" size="sm">{t('assignRequest')}</Button>
                </div>
                }
              </div>
            </div>
            {step === 1 &&
            <Step1Form
              stepsNames={stepsNames}
              stepIndicator={stepIndicator}
              comments={stepsInfo.step1.comments}
              step1Data={step1Data}
              stepReady={stepReady}
              jumpToNext={jumpToNext}
              viewType={viewType === 'registration_request' ? 'registration' : 'deregistration'}
              type='view'
            />
            }
            {step === 2 &&
            <Step2Form
              stepsNames={stepsNames}
              stepIndicator={stepIndicator}
              comments={stepsInfo.step2.comments}
              step2Data={step2Data}
              stepReady={stepReady}
              callPrev={callPrev}
              jumpToNext={jumpToNext}
              viewType={viewType === 'registration_request' ? 'registration' : 'deregistration'}
              type='view'
            />
            }
            {step === 3 &&
            <Step3Form
              stepsNames={stepsNames}
              stepIndicator={stepIndicator}
              comments={stepsInfo.step3.comments}
              step3Data={step3Data}
              stepReady={stepReady}
              callPrev={callPrev}
              jumpToNext={jumpToNext}
              totalImeis={totalImeis}
              kcProps={kcProps}
              id={id}
              userRole={userRole}
              reportVisibility={reportVisibility}
              viewType={viewType === 'registration_request' ? 'registration' : 'deregistration'}
              type='view'
            />
            }
            {step === 4 &&
            <Step4Form
              stepsNames={stepsNames}
              stepIndicator={stepIndicator}
              comments={stepsInfo.step4.comments}
              step4Data={step4Data}
              stepReady={stepReady}
              callPrev={callPrev}
              jumpToNext={jumpToNext}
              viewType={viewType === 'registration_request' ? 'registration' : 'deregistration'}
              type='view'
            />
            }
            {step === 5 &&
            <Step5Form
              stepsNames={stepsNames}
              stepIndicator={stepIndicator}
              comments={stepsInfo.step5.comments}
              step5Data={step5Data}
              stepReady={stepReady}
              callPrev={callPrev}
              jumpToNext={jumpToNext}
              kcProps={kcProps}
              viewType={viewType === 'registration_request' ? 'registration' : 'deregistration'}
              type='view'
            />
            }
          </div>
        )
      }
    </I18n>
  )
};

class ViewReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: '',
      assigned: false,
      assignedTo: 'N/A',
      requestId: 0,
      requestStatus: '',
      stepReady: false,
      stepsInfo: REVIEW_STEPS.registration,
      stepsInfo2: REVIEW_STEPS.de_registration,
      totalImeis: null,
      reportVisibility: false,
      steps: {
        currentStep: 1,
        step1: {
          apiData: null,
          comments: [],
        },
        step2: {
          apiData: null,
          comments: [],
        },
        step3: {
          apiData: null,
          comments: [],
        },
        step4: {
          apiData: null,
          comments: [],
        },
        step5: {
          apiData: null,
          comments: [],
        }
      },
    }
    this.gotoReview = this.gotoReview.bind(this);
    this.checkReviewer = this.checkReviewer.bind(this);
    this.getCommentsData = this.getCommentsData.bind(this);
    this.getStepDataFromServer = this.getStepDataFromServer.bind(this);
    this.callPrev = this.callPrev.bind(this);
    this.jumpToNext = this.jumpToNext.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }
  /**
   * HOC function to update token
   * @param callingFunc
   */
  updateTokenHOC(callingFunc, param=null) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kc.token)
          config = {
            headers: getAuthHeader(this.props.kc.token)
          }
          callingFunc(config, param);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config, param);
    }
  }

  gotoReview(config) {
    const id = this.state.requestId
    let data = {
      "request_id": parseInt(id),
      "request_type": this.state.viewType,
      "reviewer_id": getUserInfo().sub,
      "reviewer_name": getUserInfo().preferred_username
    }
    instance.put(`/review/assign-reviewer`, data, config)
      .then((response) => {
        if (response.status === 201) {
          if (this.state.viewType === 'registration_request') {
            this.props.history.push(`/review-registration/${id}/registration`)
          } else {
            this.props.history.push(`/review-registration/${id}/deregistration`)
          }
        }
      })
      .catch((error) => {
        errors(this, error);
      })
  }

  checkReviewer(config) {
    const id = this.state.requestId;
    const type = this.state.viewType === 'registration_request' ? 'registration' : 'deregistration'
    instance.get(`/${type}/${id}`, config)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.reviewer_id && response.data.reviewer_name) {
            this.setState({
              assigned: true,
              assignedTo: response.data.reviewer_name,
              requestStatus: response.data.status_label,
              reportVisibility: response.data.report_allowed
            })
          } else {
            this.setState({
              assigned: false,
              assignedTo: 'N/A',
              requestStatus: response.data.status_label
            })
          }
          if (type === 'registration_request') {
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
    const type = this.props.match.params.type === 'registration' ? 'registration_request' : 'de_registration_request'
    const id = parseInt(this.props.match.params.id);
    this.setState({
      viewType: type,
      requestId: id
    }, () => {
      this.updateTokenHOC(this.getCommentsData)
      this.updateTokenHOC(this.checkReviewer)
      this.updateTokenHOC(this.getStepDataFromServer,1)
      this.updateTokenHOC(this.getStepDataFromServer,2)
      this.updateTokenHOC(this.getStepDataFromServer,3)
      this.updateTokenHOC(this.getStepDataFromServer,4)
      this.updateTokenHOC(this.getStepDataFromServer,5)
    })
  }

  getCommentsData(config) {
    const type = this.state.viewType
    const id = this.state.requestId
    instance.get(`/review/sections?request_id=${id}&request_type=${type}`, config)
      .then((response) => {
        if (response.status === 200) {
          for (let step in response.data.sections) {
            if (response.data.sections[step].section_type === 'device_quota') {
              let modifiedComments = response.data.sections[step].comments.map(value => {
                let obj = value;
                obj.sectionType = response.data.sections[step].section_type;
                return obj;
              })
              this.setState({
                ...this.state,
                steps: {
                  ...this.state.steps,
                  step1: {
                    ...this.state.steps.step1,
                    comments: modifiedComments,
                  },
                }
              })
            }
            else if (response.data.sections[step].section_type === 'device_description') {
              let modifiedComments = response.data.sections[step].comments.map(value => {
                let obj = value;
                obj.sectionType = response.data.sections[step].section_type;
                return obj;
              })
              this.setState({
                ...this.state,
                steps: {
                  ...this.state.steps,
                  step2: {
                    ...this.state.steps.step2,
                    comments: modifiedComments,
                  },
                }
              })
            }
            else if (response.data.sections[step].section_type === 'imei_classification') {
              let modifiedComments = response.data.sections[step].comments.map(value => {
                let obj = value;
                obj.sectionType = response.data.sections[step].section_type;
                return obj;
              })
              this.setState({
                ...this.state,
                steps: {
                  ...this.state.steps,
                  step3: {
                    ...this.state.steps.step3,
                    comments: modifiedComments,
                  },
                }
              })
            }
            else if (response.data.sections[step].section_type === 'imei_registration') {
              let modifiedComments = response.data.sections[step].comments.map(value => {
                let obj = value;
                obj.sectionType = response.data.sections[step].section_type;
                return obj;
              })
              this.setState({
                ...this.state,
                steps: {
                  ...this.state.steps,
                  step4: {
                    ...this.state.steps.step4,
                    comments: modifiedComments,
                  },
                }
              })
            }
            else if (response.data.sections[step].section_type === 'approval_documents') {
              let modifiedComments = response.data.sections[step].comments.map(value => {
                let obj = value;
                obj.sectionType = response.data.sections[step].section_type;
                return obj;
              })
              this.setState({
                ...this.state,
                steps: {
                  ...this.state.steps,
                  step5: {
                    ...this.state.steps.step5,
                    comments: modifiedComments,
                  },
                }
              })
            }
          }
        }
      })
      .catch((error) => {
        //errors(this, error);
      })
  }

  getStepDataFromServer(config,step) {
    const {id} = this.props.match.params;
    const type = this.state.viewType
    this.setState({
      stepReady: false
    })
    let stepNumber = step
    if (stepNumber === 1 && type === 'registration_request') {
      instance.get(`/review/device-quota?request_id=${id}`, config)
        .then(response => {
          this.setState({
            steps: {
              ...this.state.steps,
              step1: {
                ...this.state.steps.step1,
                apiData: response.data
              },
            }
          });
        })
        .catch(error => {
          errors(this, error);
        })
    }
    else if (stepNumber === 2) {
      instance.get(`/review/device-description?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          this.setState({
            steps: {
              ...this.state.steps,
              step2: {
                ...this.state.steps.step2,
                apiData: response.data
              },
            }
          });
        })
        .catch(error => {
          errors(this, error);
        })
    }
    else if (stepNumber === 3) {
      instance.get(`/review/imei-classification?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          this.setState({
            steps: {
              ...this.state.steps,
              step3: {
                ...this.state.steps.step3,
                apiData: response.data
              }
            }
          });
        })
        .catch(error => {
          errors(this, error);
        })
    }
    else if (stepNumber === 4) {
      instance.get(`/review/imeis-status?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          this.setState({
            steps: {
              ...this.state.steps,
              step4: {
                ...this.state.steps.step4,
                apiData: response.data
              }
            }
          });
        })
        .catch(error => {
          errors(this, error);
        })
    }
    else if (stepNumber === 5) {
      instance.get(`/review/documents?request_id=${id}&request_type=${type}`, config)
        .then(response => {
          this.setState({
            steps: {
              ...this.state.steps,
              currentStep: 1,
              step5: {
                ...this.state.steps.step5,
                apiData: response.data
              }
            }
          }, () => {
            this.setState({
              stepReady: true
            })
          });
        })
        .catch(error => {
          errors(this, error);
        })
    }
  }

  callPrev() {
    const {steps} = this.state
    if (this.state.viewType === 'registration_request') {
      if (steps.currentStep === 2) {
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
      }
      else if (steps.currentStep === 3) {
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
      }
      else if (steps.currentStep === 4) {
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
      }
      else if (steps.currentStep === 5) {
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
      }
    }
    else {
      if (steps.currentStep === 2) {
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
      }
      else if (steps.currentStep === 3) {
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
      }
      else if (steps.currentStep === 4) {
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
      }
    }
  }

  jumpToNext() {
    const {steps} = this.state
    if (this.state.viewType === 'registration_request') {
      if (steps.currentStep === 1) {
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
      }
      else if (steps.currentStep === 2) {
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
      }
      else if (steps.currentStep === 3) {
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
      }
      else if (steps.currentStep === 4) {
        if(IS_AUTOMATE[0])
        {
          this.props.history.push(`/dashboard`)
        }
        else {
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
      }
      }
      else if (steps.currentStep === 5) {
        this.props.history.push(`/dashboard`)
      }
    }
    else {
      if (steps.currentStep === 1) {
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
      }
      else if (steps.currentStep === 2) {
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
      }
      else if (steps.currentStep === 3) {
        if(IS_AUTOMATE[0])
        {
          this.props.history.push(`/dashboard`)
        }
        else {
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
      }
      }
      else if (steps.currentStep === 4) {
        this.props.history.push(`/dashboard`)
      }
    }
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
      requestStatus,
      totalImeis,
      reportVisibility
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Steps
          stepsInfo={steps}
          step={viewType === 'registration_request' ? steps.currentStep : steps.currentStep + 1}
          stepsNames={viewType === 'registration_request' ? stepsInfo : stepsInfo2}
          stepReady={stepReady}
          id={parseInt(this.props.match.params.id)}
          assigned={assigned}
          assignedTo={assignedTo}
          viewType={viewType}
          stepIndicator={steps.currentStep}
          gotoReview={()=>this.updateTokenHOC(this.gotoReview)}
          callPrev={this.callPrev}
          jumpToNext={this.jumpToNext}
          requestStatus={requestStatus}
          totalImeis={totalImeis}
          kcProps={this.props}
          reportVisibility={reportVisibility}
          userRole = {getUserRole(this.props.resources)}
        />
      </div>
    )
  }
}

export default translate('translations')(ViewReview);
