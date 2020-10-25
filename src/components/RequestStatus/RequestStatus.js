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

import React, { Component } from 'react';
import i18n from './../../i18n'
import { Link } from "react-router-dom";

class RequestStatus extends Component {
  render() {
    console.log('test');
    const {details} = this.props.location.state;
    return (
      <div>
        {(details.userType === 'reviewer' &&
          <div className="submitted">
            <div className="icon-box">
              <i className={details.icon}></i>
            </div>
            <h4>{i18n.t('requestStatusPage.titleReviewer')}<span>{i18n.t(details.action)}</span></h4>
            <div className="msg">
              <p>
                  {i18n.t('requestStatusBodyText.type')}
                  <span>{details.typeLabel}</span>
                  {i18n.t('requestStatusBodyText.id')}
                  <span>{details.id}</span>
                  {(details.type === 'registration' || details.type === 'deregistration') && details.status === 'Pending Review' ? null :
                  <>
                  {i18n.t('requestStatusBodyText.status')}
                  <span>{i18n.t(details.status)}</span>
                  </>
                  }
              </p>
              <p>{i18n.t('requestStatusPage.infoText')}</p>
            </div>
            <div className="link-box">
              <Link to={`/view-review/${details.id}/${details.type}`} className="btn btn-primary">{i18n.t('viewReviewLink')}</Link>
            </div>
          </div>) ||
          <div className="submitted">
            <div className="icon-box">
              <i className={details.icon}></i>
            </div>
            <h4>{i18n.t('requestStatusPage.titleUser')}<span>{details.action}</span> {i18n.t('successfully')}</h4>
            <div className="msg">
              <p>
                <>
                  {i18n.t('requestStatusBodyText.type')}
                  <span>{i18n.t(details.typeLabel)}</span>
                  {i18n.t('requestStatusBodyText.id')}
                  <span>{details.id}</span>
                  {(details.type === 'registration' || details.type === 'deregistration') && details.status === 'Pending Review' ? null :
                  <>
                  {i18n.t('requestStatusBodyText.status')}
                  <span>{i18n.t(details.status)}</span>
                  </>
                  }
                </>
              </p>
              <p>{i18n.t('requestStatusPage.infoText')}</p>
            </div>
            <div className="link-box">
              <Link to={`/view-request/${details.id}/${details.type}`} className="btn btn-primary">{i18n.t('View your Request')}</Link>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default RequestStatus;
