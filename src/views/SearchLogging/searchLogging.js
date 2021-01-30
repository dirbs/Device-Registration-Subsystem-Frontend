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
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { withFormik, Field, FieldArray } from "formik";
import { getAuthHeader } from "../../utilities/helpers";
import doubleEntryInput from "../../components/Form/DoubleEntryInput";
import renderInput from "../../components/Form/RenderInput";
import axios from "axios";
import { MDBDataTable } from "mdbreact";

import i18n from "i18next";

class searchLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      caseSubmitted: false,
      columns: [
        {
          label: "User ID",
          field: "user_id",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "ID",
          },
        },
        {
          label: "Username",
          field: "user_name",
          width: 270,
        },
        {
          label: "Status",
          field: "status",
          width: 200,
        },
        {
          label: "Method",
          field: "method",
          width: 100,
        },
        {
          label: "Creation Date",
          field: "created_at",
          width: 150,
        },
        {
          label: "Tracking ID",
          field: "tracking_id",
          width: 100,
        },
      ],
      dataTable: {},
      modalData: {
        description: '',
        reg_id: 0,
        reviewer_info: {
          comment: '',
          reviewer_id: '',
          reviewer_name: '',
          section: '',
          section_status: ''
        }
      },
      isShow: false,
    };
    this.saveCase = this.saveCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
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
    console.log(data)
    const { modalData } = this.state;
    modalData.description = data.description;
    modalData.reg_id = data.reg_id;
    if(data.reviewer_info)
    {
      modalData.reviewer_info.comment = data.reviewer_info.comment;
      modalData.reviewer_info.reviewer_id = data.reviewer_info.reviewer_id;
      modalData.reviewer_info.reviewer_name = data.reviewer_info.reviewer_name;
      modalData.reviewer_info.section = data.reviewer_info.comment;
      modalData.reviewer_info.section_status = data.reviewer_info.section_status;
    }
    else {
      modalData.reviewer_info.comment = '';
      modalData.reviewer_info.reviewer_id = '';
      modalData.reviewer_info.reviewer_name = '';
      modalData.reviewer_info.section = '';
      modalData.reviewer_info.section_status = '';
    }
    this.setState({modalData}, () => {
      this.toggleModal();
    })
  };

  saveCase(config, values) {
    axios
      .get(
        `http://192.168.100.82:9200/_search?pretty=true&q=*:*&size=10000`,
        config
      )
      .then((res) => {
        let dataObject = {};
        let rowArray = res.data.hits.hits.map((elem) => {
          return {
            clickEvent: () => this.handleRowClick(elem._source),
            ...elem._source,
          };
        });
        dataObject.columns = this.state.columns;
        dataObject.rows = rowArray;
        this.setState({ dataTable: dataObject });
      })
      .catch((err) => console.log(err));
  }

  toggleModal = () => {
    this.setState({isShow: !this.state.isShow})
  }

  render() {
    const { description, regId, isShow, dataTable,
      reviewer_info = { comment: '', reviewer_id: '', reviewer_name: '', section: '', section_status: '' }} = this.state;
    return (
      <>
        <MDBDataTable striped hover data={dataTable} />
        <Modal isOpen={isShow} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Log Details</ModalHeader>
          <ModalBody>
          <b>Description:</b> &nbsp;&nbsp;{this.state.modalData.description}
          <br/>
          <b>Registration ID:</b> &nbsp;&nbsp;{this.state.modalData.reg_id}
          <br/>
          <hr/>
          <b>Reviewer Comment:</b> &nbsp;&nbsp;{this.state.modalData.reviewer_info.comment}
          <br/>
          <b>Reviewer ID:</b> &nbsp;&nbsp;{this.state.modalData.reviewer_info.reviewer_id}
          <br/>
          <b>Reviewer Name:</b> &nbsp;&nbsp;{this.state.modalData.reviewer_info.reviewer_name}
          <br/>
          <b>Section:</b> &nbsp;&nbsp;{this.state.modalData.reviewer_info.section}
          <br/>
          <b>Section Status:</b> &nbsp;&nbsp;{this.state.modalData.reviewer_info.section_status}
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
