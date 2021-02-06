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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getAuthHeader } from "../../utilities/helpers";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import { ELASTIC_SEARCH_URL } from "./../../utilities/constants";

class searchLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      caseSubmitted: false,
      columns: [
        {
          label: [
            "Registration Id ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "reg_id",
          width: 50,
        },
        {
          label: [
            "User ID ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "user_id",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "ID",
          },
        },
        {
          label: [
            "Username ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "user_name",
          width: 270,
        },
        {
          label: [
            "Status ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "status",
          width: 200,
        },
        {
          label: [
            "Method ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "method",
          width: 100,
        },
        {
          label: [
            "Creation Date ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "created_at",
          width: 150,
        },
        {
          label: [
            "Tracking ID ",
            <i key="Lorem" className="fa fa-sort" aria-hidden="true"></i>,
          ],
          field: "tracking_id",
          width: 100,
        },
      ],
      dataTable: {},
      modalData: {},
      modalNodes: [],
      isShow: false,
    };
    this.saveCase = this.saveCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.jsonIterate = this.jsonIterate.bind(this);
  }

  componentDidMount() {
    this.updateTokenHOC(this.saveCase);
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

  handleRowClick = (data) => {
    this.setState({ modalData: data }, () => {
      this.setState({ modalNodes: this.jsonIterate() });

      this.toggleModal();
    });
  };

  saveCase(config, values) {
    axios
      .get(`${ELASTIC_SEARCH_URL}/_search?pretty=true&q=*:*&size=10000`, config)
      .then((res) => {
        let dataObject = {};
        let rowArray = res.data.hits.hits.map((elem) => {
          return {
            clickEvent: () => this.handleRowClick(elem._source),
            ...elem._source,
          };
        });
        dataObject.columns = this.state.columns;
        dataObject.rows = rowArray.reverse();
        this.setState({ dataTable: dataObject });
      })
      .catch((err) => console.log(err));
  }

  toggleModal = () => {
    this.setState({ isShow: !this.state.isShow });
  };

  generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  };

  jsonIterate() {
    const { modalData } = this.state;
    let mainArray = [];
    let isFirstIMEI = true;
    iter(modalData);
    function iter(o) {
      if (typeof o === "object") {
        Object.keys(o).forEach(function (k, i) {
          if (
            o[k] !== null &&
            (typeof o[k] === "object" || typeof o[k] === "array")
          ) {
            iter(o[k]);
            return;
          }
          if (
            o[k] !== undefined &&
            (typeof o[k] === "string" || typeof o[k] === "number")
          ) {
            if (isNaN(Number(k))) {
              mainArray.push({ name: k, value: o[k] });
            } else {
              if (k === "0" && isFirstIMEI) {
                isFirstIMEI = false;
                mainArray.push({ name: k, value: o[k] });
              } else {
                mainArray.push({ name: k + "1", value: o[k] });
              }
            }
          }
        });
      } else if (typeof o === "array") {
        o.forEach(function (elem, k) {
          if (elem[k] !== null && typeof elem[k] === "array") {
            iter(elem[k]);
            return;
          }
          if (
            elem[k] !== undefined &&
            (typeof elem[k] === "string" || typeof elem[k] === "number")
          ) {
            mainArray.push({ name: "arrayElem", value: elem[k] });
          }
        });
      }
    }
    return mainArray;
  }

  improveKeys = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");
  };

  render() {
    return (
      <>
        <MDBDataTable
          striped
          hover
          sortable
          entriesLabel="&nbsp;&nbsp;&nbsp;Show entries"
          data={this.state.dataTable}
        />
        <Modal size="lg" isOpen={this.state.isShow} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Log Details</ModalHeader>
          <ModalBody>
            {this.state.modalNodes.map((elem) =>
              isNaN(Number(elem.name)) ? (
                <>
                  <hr className="customHr" />
                  <article className="log-row">
                    <strong>{this.improveKeys(elem.name)}:</strong>
                    <p>{elem.value}</p>
                  </article>
                </>
              ) : (
                <>
                  {elem.name === "0" ? (
                    <span>
                      <hr className="customHr" />
                      <b>IMEIs: </b>&nbsp;&nbsp;{elem.value}
                    </span>
                  ) : (
                    <span>, {elem.value}</span>
                  )}
                </>
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default translate("translations")(searchLogging);
