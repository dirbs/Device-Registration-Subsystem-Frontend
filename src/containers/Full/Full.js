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
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import RequestStatus from '../../components/RequestStatus/RequestStatus';

import Dashboard from '../../views/Dashboard/';
import NewRegistrationRequest from '../../views/Requests/Registration/NewRequest/NewRegistationRequest';
import SearchRequests from '../../views/SearchRequests/';
import UpdateRegistration from '../../views/Requests/Registration/Update';
import ReviewRegistration from '../../views/Requests/Review/Review';
import NewDeregistrationRequest from '../../views/Requests/DeRegistration/NewRequest/NewDeregistrationRequest'
import UpdateDeRegistration from '../../views/Requests/DeRegistration/Update/Update';
import ViewReview from "../../views/Requests/Review/View/ViewReview";
import ViewRequest from "../../views/Requests/View/ViewRequest";

import Page401 from '../../views/Errors/Page401';
import { I18n, translate } from 'react-i18next';
import {getUserRole} from "../../utilities/helpers";
import {AUTHORITY, EXPORTER, BULK_IMPORTER, INDIVIDUAL_IMPORTER} from "../../utilities/constants";

class Full extends Component {
  constructor(props) {
    super(props);
    this.state={
      lang: 'en'
    }
    this.changeLanguage = this.changeLanguage.bind(this);
  }
  componentDidMount() {
    this.setState({
      lang: localStorage.getItem('i18nextLng')
    })
  }

  changeLanguage(lng) {
    this.setState({
      lang: lng
    },()=>{
      setTimeout(() => {
        const { i18n } = this.props;
        i18n.changeLanguage(lng);
        window.location.reload();
      }, 1000);
    })
  }

  rtlLanguageHandler = (langTag) => {
    if(langTag==='ur'){
      return true
    }
    return false
  }
  render() {
    return (
      <I18n ns="translations">
        {
          (t, {i18n}) => (
            <div className="app">
              <Helmet>
                <html lang={this.state.lang} />
                <title>{i18n.t('title')}</title>
                <body dir={this.rtlLanguageHandler(this.state.lang)?'rtl':'ltr'} />
              </Helmet>
                <Header {...this.props} switchLanguage={this.changeLanguage}/>
                <div className="app-body">
                  <Sidebar {...this.props}/>
                  <main className="main">
                    <Breadcrumb {...this.props} />
                    <Container fluid>
                      <Switch>
                        <Route path="/dashboard" name="Dashboard" render={(props) => <Dashboard {...this.props} />}/>
                        <Route path="/search-requests" name="SearchRequests"
                               render={(props) => <SearchRequests {...this.props} />}/>
                        {(getUserRole(this.props.resources) === INDIVIDUAL_IMPORTER ||
                          getUserRole(this.props.resources) === BULK_IMPORTER ||
                          getUserRole(this.props.resources) === EXPORTER ||
                          getUserRole(this.props.resources) === AUTHORITY) &&
                        <Route path="/request-status" name="RequestStatus" component={RequestStatus}/>
                        }
                        {(getUserRole(this.props.resources) === INDIVIDUAL_IMPORTER ||
                          getUserRole(this.props.resources) === BULK_IMPORTER) &&
                        <Route path="/new-request/:id" name="NewRequest" key="new-request"
                               render={(props) => <NewRegistrationRequest {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === INDIVIDUAL_IMPORTER ||
                          getUserRole(this.props.resources) === BULK_IMPORTER) &&
                        <Route path="/new-request-finish/:id" key="finish-new-request" name="NewRequest"
                               render={(props) => <NewRegistrationRequest {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === INDIVIDUAL_IMPORTER ||
                          getUserRole(this.props.resources) === BULK_IMPORTER) &&
                        <Route path="/update-registration/:id" name="UpdateRegistration" key={Date.now()}
                               render={(props) => <UpdateRegistration {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === AUTHORITY) &&
                        <Route path="/review-registration/:id/:type" name="ReviewRegistration"
                               render={(props) => <ReviewRegistration {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === AUTHORITY) &&
                        <Route path="/view-review/:id/:type" name="ViewReview"
                               render={(props) => <ViewReview {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === INDIVIDUAL_IMPORTER ||
                          getUserRole(this.props.resources) === BULK_IMPORTER ||
                          getUserRole(this.props.resources) === EXPORTER) &&
                        <Route path="/view-request/:id/:type" name="ViewRequest" key={Date.now()}
                               render={(props) => <ViewRequest {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === EXPORTER) &&
                        <Route path="/de-registration/:id" key="new-de-request" name="DeRegistration"
                               render={(props) => <NewDeregistrationRequest {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === EXPORTER) &&
                        <Route path="/de-registration-finish/:id" key="finish-de-request" name="DeRegistration"
                               render={(props) => <NewDeregistrationRequest {...this.props} {...props}/>}/>
                        }
                        {(getUserRole(this.props.resources) === EXPORTER) &&
                        <Route path="/update-deregistration/:id" name="UpdateDeRegistration" key={Date.now()}
                               render={(props) => <UpdateDeRegistration {...this.props} {...props}/>}/>
                        }
                        <Route path="/unauthorized-access" name="Page401" component={Page401}/>
                        <Redirect from="/" to="/dashboard"/>
                      </Switch>
                    </Container>
                  </main>
                  <Aside/>
                </div>
                <Footer/>
            </div>
          )
        }
      </I18n>
    );
  }
}

export default translate('translations')(Full);
