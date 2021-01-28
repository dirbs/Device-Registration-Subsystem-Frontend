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
import React, { Component } from "react";
import { translate } from "react-i18next";
import { Row, Col, Button, Form, Card, CardBody } from "reactstrap";
import { withFormik, Field, FieldArray } from "formik";
import {
  getAuthHeader,
} from "../../utilities/helpers";
import doubleEntryInput from "../../components/Form/DoubleEntryInput";
import renderInput from "../../components/Form/RenderInput";
import axios from "axios";

import i18n from "i18next";

class SearchRequest extends Component {
  render() {
    const {
      isSubmitting,
      handleSubmit,
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} xl={8} className="order-xl-1 mt-3">
            <Card>
              <CardBody>
                <Row>
                  <Col xs={12} sm={6}>
                    <Field
                      name="brand"
                      component={renderInput}
                      label="Brand"
                      type="text"
                      placeholder="Brand"
                      requiredStar
                    />
                  </Col>
                  </Row>
                  <Col xs={12} sm={6}>
                  <Button
                color="primary"
                type="submit"
                className="btn-next-prev"
                disabled={isSubmitting}
                role="button"
              >
                {i18n.t("submit")}
              </Button>
                  </Col>
                
              </CardBody>
            </Card>
            <div className="text-right">
              
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({
    brand: "",
  }),


  validate: (values) => {
    let errors = {};
    if (!values.brand) {
      errors.brand = i18n.t("validation.thisFieldIsRequired");
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
  },

  displayName: "SearchRequest", // helps with React DevTools
})(SearchRequest);

function prepareAPIRequest(values) {
  // Validate Values before sending
  const searchParams = {};

  if (values.brand) {
    searchParams.brand = values.brand;
  }
  return searchParams;
}

class searchLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      caseSubmitted: false,
    };
    this.saveCase = this.saveCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  updateTokenHOC(callingFunc, values = null) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc
        .updateToken(0)
        .success(() => {
          localStorage.setItem("token", this.props.kc.token);
          config = {
            headers: getAuthHeader(this.props.kc.token),
          };
          callingFunc(config, values);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader(),
      };
      callingFunc(config, values);
    }
  }

  saveCase(config, values) {
    axios
      .get(`http://192.168.100.82:9200/_search?q=${values.brand}`, config)
      .then((res) => {
        this.setState({ data: res.data.hits });
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div>
        <MyEnhancedForm
          callServer={(values) => this.updateTokenHOC(this.saveCase, values)}
          caseSubmitted={this.state.caseSubmitted}
        />
        <Row>
        {this.state.data !== null && 
          <table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search">
            <thead className="thead-light">
              <tr>
                <th>Register ID</th>
                <th>Reguest Type</th>
                <th>Username</th>
                <th>Status</th>
                <th>Method</th>
                <th>Create Date</th>
                <th>ID</th>
                <th>User ID</th>
                <th>Tracking ID</th>
              </tr>
            </thead>
            <tbody>
             {
                  this.state.data.hits.map((item) => (
                    <tr key={item._id}>
                      <td>{item._source["reg_id"]}</td>
                      <td>{item._source["user_name"]}</td>
                      <td>{item._source["status"]}</td>
                      <td>{item._source["request_type"]}</td>
                      <td>{item._source["method"]}</td>
                      <td>{item._source["created_at"]}</td>
                      <td>{item._id}</td>
                      <td>{item._source["user_id"]}</td>
                      <td>{item._source["tracking_id"]}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
              }
        </Row>
      </div>
    );
  }
}

export default translate("translations")(searchLogging);
