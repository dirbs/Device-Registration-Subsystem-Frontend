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
import i18n from '../../i18n';
import { withFormik, Field } from 'formik';
import {
  Col,
  Button,
  Form,
  Card,
  CardBody,
  CardHeader,
  Row
} from 'reactstrap';
import renderInput from '../../components/Form/RenderInput';
import {
  instance,
  errors,
  getUserInfo,
  getAuthHeader,
  SweetAlert
} from "../../utilities/helpers";

class Association extends Component {

  render() {
    const {
      isSubmitting,
      handleSubmit
    } = this.props;
    return (
      <div className="mt-5">
        <Row>
        <Col sm={{ size: 12 }} md={{ size: 8, offset: 2 }} >
          <div style={{backgroundColor: '#F9F9F9', padding: '30px'}}>
        <Card className="mb-0">
        <CardHeader><b>{i18n.t('associate') + ' ' + i18n.t('IMEI')}</b></CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
                <Field name="device_imei" component={renderInput} label={i18n.t('IMEI')}
                  type="text" placeholder={i18n.t('typeImei')} requiredStar min={0} max={16} />
                <Button color="primary" type="submit" className="float-right mb-4" disabled={isSubmitting}>
                  {i18n.t('associate')}
                </Button>
            </Form>
          </CardBody>
        </Card>
        </div>
        </Col>
        </Row>
      </div>
    );
  }
}

//export default Association;

const EnhancedAssociation = withFormik({
  mapPropsToValues: () => ({ "device_imei": "" }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.device_imei) {
      errors.device_imei = i18n.t('fieldRequired')
    } else if (isNaN(Number(values.device_imei))) {
      errors.device_imei = i18n.t('validation.deviceImei')
    } else if (values.device_imei.length < 14 || values.device_imei.length > 16) {
      errors.device_imei = i18n.t('validation.imei')
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.updateTokenHOCProp(callServer, values, bag.props);
  },

  displayName: 'Association', // helps with React DevTools
})(Association);

function callServer(values, config) {
  const params = {};
  params.uid = getUserInfo().sub.substring(27);
  params.imei = values.device_imei;
  instance.post('/associate', params, config)
    .then(response => {
      if (response.data.message) {
        SweetAlert({
          title: 'Associated!',
          message: response.data.message,
          type: 'success'
        })
      }
    })
    .catch(error => {
      errors(this, error);
    })
}

EnhancedAssociation.defaultProps = {
  updateTokenHOCProp: (callingFunc, values = null, props) => {
    let config = null;
    if (props.kc.isTokenExpired(0)) {
      props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', props.kc.token)
          config = {
            headers: getAuthHeader(props.kc.token)
          }
          callingFunc(values, config);
        })
        .error(() => props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(values, config);
    }
  }
}

export default EnhancedAssociation;