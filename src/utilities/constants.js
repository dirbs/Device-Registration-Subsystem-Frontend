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

// Settings for API and Keycloak
import settings from './../settings';
const {host: apiHost, port: apiPort, version: apiVersion, use: apiUse} = settings.api;
const {host: apimanHost, port: apimanPort, clientId: apimanClientId, use: apimanUse} = settings.apiman;
const {appName} = settings.appDetails;
const {host: kcHost, port:kcPort, version: kcVersion, use: kcUse} = settings.keycloak;
const {host: elHost, port:elPort, use: elUse} = settings.elasticSearch;



export let BASE_URL = '';
export let KC_URL = '';

if(kcUse){
  KC_URL = `${kcHost}${kcPort ? ':'+ kcPort: ''}${kcVersion}`;
}

if(apiUse) {
 BASE_URL = `${apiHost}${apiPort ? ':'+ apiPort: ''}${apiVersion}`;
} else if(apimanUse) {
 BASE_URL = `${apimanHost}${apimanPort ? ':'+ apimanPort: ''}${apimanClientId}`;
}

export let ELASTIC_SEARCH_URL = elHost + ':' + elPort;

export const APP_NAME = appName;

export const MANUFACTURE_LOCATIONS = [{'label': 'Local', 'value': 'local'}, {'label': 'Overseas', 'value': 'overseas'}];
export const DEVICE_TYPES = [];
export const TECHNOLOGIES = []
export const DOCUMENTS = []
export const DE_DOCUMENTS = []
export const EXTENSIONS = ['pdf', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'svg'];
export const STATUS_TYPES = [];
export const IS_AUTOMATE = [];

export const REVIEW_STEPS = {
 registration: [
  'reviewRegistration.step1',
  'reviewRegistration.step2',
  'reviewRegistration.step3',
  'reviewRegistration.step4',
  'reviewRegistration.step5'],
 de_registration: [
  'reviewRegistration.step2',
  'reviewRegistration.step3',
  'reviewRegistration.step4',
  'reviewRegistration.step5'
 ]
}
export const REQUEST_STEPS = {
 registration: [
  'requestSteps.registration.basic',
  'requestSteps.registration.deviceModel',
  'reviewRegistration.step5'
 ],
 de_registration: [
  'requestSteps.de-registration.basic',
  'reviewRegistration.step5'
 ]
}
export const VIEW_STEPS = {
  stepInfo: [
    'requestSteps.registration.basic',
    'requestSteps.registration.deviceModel',
    'requestSteps.registration.approvalDocuments'
  ],
  deRegStepInfo: [
    'requestSteps.de-registration.basic',
    'requestSteps.de-registration.deviceModel',
    'requestSteps.de-registration.approvalDocuments'
  ]
}

export const Date_Format = 'YYYY-MM-DD';
export const PAGE_LIMIT = 10;

export const AUTHORITY = 'authority';
export const BULK_IMPORTER = 'importer';
export const INDIVIDUAL_IMPORTER = 'individual';
export const EXPORTER = 'exporter';

export const ITEMS_PER_PAGE= [
 { value: 10, label: '10' },
 { value: 20, label: '20' },
 { value: 30, label: '30' },
 { value: 50, label: '50' },
 { value: 100, label: '100' }
];

export const ENGLISH_REGEX = /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/;
export const SPANISH_REGEX = /^[0-9A-Za-zñáéíóúü$@$!%*?&#^-_. +]+$/i;
export const INDONESIAN_REGEX = /^[0-9A-Za-zé$@$!%*?&#^-_. +]+$/i;
