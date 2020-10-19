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
import React from 'react'
import axios from 'axios';
import Base64 from 'base-64';
import {
  BASE_URL,
  APP_NAME,
  TECHNOLOGIES,
  STATUS_TYPES,
  DEVICE_TYPES,
  DOCUMENTS,
  DE_DOCUMENTS,
  ENGLISH_REGEX,
  SPANISH_REGEX,
  INDONESIAN_REGEX,
  REQUEST_STEPS,
  IS_AUTOMATE,
  VIEW_STEPS,
  REVIEW_STEPS
} from './constants';
import FileSaver from "file-saver";
import { lastIndexOf, take } from 'ramda'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import i18n from './../i18n'
import settings from '../settings';

const MySwal = withReactContent(Swal)
const { defaultLanguage } = settings.appDetails;

export const instance = axios.create({ // API Gateway
  baseURL: BASE_URL, // Dev API
});

export function fetchServerConfigData() {
  const config = {
    headers: getAuthHeader()
  }
  instance.get(`/config/server-config`, config)
    .then(response => {
      let data = response.data;
      if (data.technologies) {
        data.technologies.map((technology) => (
          TECHNOLOGIES.push(technology)
        ))
      }
      if (data.status_types) {
        data.status_types.map((status) => (
          STATUS_TYPES.push(status)
        ))
      }
      if (data.device_types) {
        data.device_types.map((type) => (
          DEVICE_TYPES.push(type)
        ))
      }
      if (data.documents.registration) {
        data.documents.registration.map((doc) => (
          DOCUMENTS.push(doc)
        ))
      }
      if (data.documents.de_registration) {
        data.documents.de_registration.map((doc) => (
          DE_DOCUMENTS.push(doc)
        ))
      }
      if (data.system_config) {
        data.system_config.map((entry) => {
          if (entry.label === "automate_imei_request") {
            IS_AUTOMATE[0] = entry.flag;
            if (entry.flag) {
              REQUEST_STEPS.registration.pop();
              REQUEST_STEPS.de_registration.pop();
              VIEW_STEPS.stepInfo.pop();
              VIEW_STEPS.deRegStepInfo.pop();
              REVIEW_STEPS.registration.pop();
              REVIEW_STEPS.de_registration.pop();
            }
          }
        })
      }
    })
    .catch(error => {
      errors(this, error);
    });
}

export function getExtension(param) {
  if (!param) {
    return null
  } else {
    return param.slice((Math.max(0, param.lastIndexOf(".")) || Infinity) + 1)
  }
}

export function removeExtension(name) {
  // let lastDotPosition = name.lastIndexOf(".");
  let lastDotPosition = lastIndexOf('.', name)
  if (lastDotPosition === -1) return name;
  else return take(lastDotPosition, name);
}

export function capitalize(text) {
  if (!text)
    return null;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getReviewStatus(status) {
  switch (status) {
    case 5:
      return i18n.t('reviewStatus.requested');

    case 6:
      return i18n.t('Approved');

    case 7:
      return i18n.t('Rejected');

    default:
      return '';
  }
}

export function downloadSampleFile(kcProps, type, e) {
  e.preventDefault()
  let config = null;
  if (kcProps.kc.isTokenExpired(0)) {
    kcProps.kc.updateToken(0)
      .success(() => {
        localStorage.setItem('token', kcProps.kc.token)
        config = {
          headers: getAuthHeader(kcProps.kc.token)
        }
        instance.get(`/sample/${type}`, config)
          .then(response => {
            if (response.status === 200) {
              try {
                let file = new File([response.data], `sample.${type === 'deregistration' ? 'txt' : 'tsv'}`);
                FileSaver.saveAs(file);
              } catch (err) {
                let file = new Blob([response.data]);
                window.navigator.msSaveBlob(file, `sample.${type === 'deregistration' ? 'txt' : 'tsv'}`);
              }
            }
          })
          .catch(error => {
            errors(this, error);
          })
      })
      .error(() => kcProps.kc.logout());
  } else {
    config = {
      headers: getAuthHeader()
    }
    instance.get(`/sample/${type}`, config)
      .then(response => {
        if (response.status === 200) {
          try {
            let file = new File([response.data], `sample.${type === 'deregistration' ? 'txt' : 'tsv'}`);
            FileSaver.saveAs(file);
          } catch (err) {
            let file = new Blob([response.data]);
            window.navigator.msSaveBlob(file, `sample.${type === 'deregistration' ? 'txt' : 'tsv'}`);
          }
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }
}

export function downloadDocument(kcProps, link, fileType, fileName, event) {
  event.preventDefault()
  let accessToken = '';
  if (kcProps.kc.isTokenExpired(0)) {
    kcProps.kc.updateToken(0)
      .success(() => {
        localStorage.setItem('token', kcProps.kc.token)
        accessToken = kcProps.kc.token
        axios({
          url: `${BASE_URL}files/download?path=${link}`,
          method: 'GET',
          responseType: 'blob', // important
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        }).then((response) => {
          if (response.status === 200) {
            try {
              let file = new Blob([response.data]);
              FileSaver.saveAs(file, `${fileName === '' ? 'download' : fileName}.${fileType}`);
            } catch (err) {
              let textFileAsBlob = new Blob([response.data]);
              window.navigator.msSaveBlob(textFileAsBlob, `${fileName === '' ? 'download' : fileName}.${fileType}`);
            }
          }
        })
          .catch((error) => {
            errors(this, error);
          })
      })
      .error(() => kcProps.kc.logout());
  } else {
    accessToken = localStorage.getItem('token')
    axios({
      url: `${BASE_URL}files/download?path=${link}`,
      method: 'GET',
      responseType: 'blob', // important
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {
      if (response.status === 200) {
        try {
          let file = new Blob([response.data]);
          FileSaver.saveAs(file, `${fileName === '' ? 'download' : fileName}.${fileType}`);
        } catch (err) {
          let textFileAsBlob = new Blob([response.data]);
          window.navigator.msSaveBlob(textFileAsBlob, `${fileName === '' ? 'download' : fileName}.${fileType}`);
        }
      }
    })
      .catch((error) => {
        errors(this, error);
      })
  }
}

export function getStatusClass(status, sType = 'badge') {
  let statusClass = '';
  let styleType = sType
  switch (status) {
    case 'In Review':
      statusClass = `${styleType} ${styleType}-secondary`
      break;

    case 'Pending Review':
      statusClass = `${styleType} ${styleType}-primary`
      break;

    case 'New Request':
    case 'Awaiting Documents':
    case 'In Complete':
      statusClass = `${styleType} ${styleType}-info`
      break;

    case 'Information Requested':
    case 'In Process':
      statusClass = `${styleType} ${styleType}-warning`
      break;

    case 'Approved':
      statusClass = `${styleType} ${styleType}-success`
      break;

    case 'Closed':
    case 'Rejected':
    case 'Failed':
      statusClass = `${styleType} ${styleType}-danger`
      break;

    default:
      statusClass = ''
  }
  return statusClass;
}

export function getAuthHeader(token) {
  let accessToken = localStorage.getItem('token');
  if (token) {
    accessToken = token;
  }
  return {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language
  }
}

export function range(start, limit, step) {

  if (arguments.length === 1) {
    limit = start;
    start = 0;
  }

  limit = limit || 0;
  step = step || 1;

  for (var result = []; (limit - start) * step > 0; start += step) {
    result.push(start);
  }
  return result;
}

export function getLangTag(lng) {
  return lng.split('-')[0]
}

export function getUserInfo() {
  if (!localStorage.getItem('userInfo')) {
    return {};
  }
  return JSON.parse(Base64.decode(localStorage.getItem('userInfo')))
}

/**
 * this function get currently loggedIn user Role
 *
 * @param resources
 * @returns {string}
 */
export function getUserRole(resources) {
  let role = '';
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  if (groupDetails.length > 0) {
    role = groupDetails.find(app => app.split('_')[0] === APP_NAME);
  }
  if (role) {
    role = role.split('_')[1];
  }
  return role;
}

/**
 * this function get all groups of currently loggedIn user
 *
 * @param resources
 * @returns {string}
 */
export function getUserGroups(resources) {
  let groups = '';
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  // Remove default group first
  let index = groupDetails.indexOf('uma_authorization');
  if (index !== -1)
    groupDetails.splice(index, 1);
  if (groupDetails.length > 0) {
    groups = groupDetails;
  }
  return groups;
}

/**
 * This functions get users' groups assigned by Keycloak and see if user has access to this application
 *
 * @param groups
 * @returns {boolean}
 */
export function isPage401(groups) {
  let pageStatus = false; // assume it's not page401
  pageStatus = (groups.length > 0) ? false : true; // if groups exist then that's not page401
  if (!pageStatus) { // if groups exist then we apply another check
    pageStatus = groups.find(app => app.split('_')[0] === APP_NAME) ? false : true; // app name is same as role assigned
  }
  return pageStatus;
}

export function SweetAlert(params) {
  let title = params.title
  let message = params.message
  let type = params.type

  MySwal.fire({
    title: <p>{title}</p>,
    text: message,
    type: type,
    confirmButtonText: i18n.t('ok')
  })
}
// Generic Errors handling for Axios
export function errors(context, error, noToastr = false) {
  if (typeof error !== 'undefined') {
    if (typeof error.response !== 'undefined') {
      if (error.response.status === 400) {
        let errors = error.response.data;
        for (let key in errors) {
          if (typeof errors[key][0] === 'object') {
            for (let k in errors[key][0]) {
              SweetAlert({
                title: i18n.t('error'),
                message: k + ' ' + errors[key][0][k],
                type: 'error'
              })
            }
          } else {
            SweetAlert({
              title: i18n.t('error'),
              message: errors[key][0],
              type: 'error'
            })
          }
        }
      } else if (error.response.status === 401) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('sessionExpired'),
          type: 'error'
        })
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (error.response.status === 403) {
        SweetAlert({
          title: i18n.t('error'),
          message: 'credentialMatch',
          type: 'error'
        })
      } else if (error.response.status === 404) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
      } else if (error.response.status === 405) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('wrongHttp'),
          type: 'error'
        })
      } else if (error.response.status === 406) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
      } else if (error.response.status === 409) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
      } else if (error.response.status === 422 && !noToastr) {
        let errorMessages = '';
        let errorResponse = error.response.data.message
        if (errorResponse) {
          Object.keys(errorResponse).map((key, i) => {
            Object.keys(errorResponse[key]).map((innerKey, j) => {
              errorMessages += errorResponse[key][innerKey] + '<br/>'
            })
          })
          MySwal.fire({
            title: i18n.t('errorLog'),
            html: `<div>${errorMessages}</div>`,
            type: 'error',
            customClass: 'swal-wide'
          })
        }

        let errors = error.response.data;
        for (let key in errors) {
          if (typeof errors[key][0] === 'object') {
            for (let k in errors[key][0]) {

            }
          } else {
            SweetAlert({
              title: i18n.t('error'),
              message: errors[key][0],
              type: 'error'
            })
          }
        }
      } else if (error.response.status >= 500) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('serverNotResponding'),
          type: 'error'
        })
      }
    } else {
      SweetAlert({
        title: i18n.t('error'),
        message: i18n.t('serverNotResponding'),
        type: 'error'
      })
    }
  }
}

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function languageCheck(text) {
  if (ENGLISH_REGEX.test(text) && defaultLanguage === "en") {
    return true;
  } else if (SPANISH_REGEX.test(text) && defaultLanguage === "es") {
    return true;
  } else return INDONESIAN_REGEX.test(text) && defaultLanguage === "id";
}
