import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function AccountsMainDetails({ handleInputs, AccountsDetail }) {
  AccountsMainDetails.propTypes = {
    handleInputs: PropTypes.object,
    AccountsDetail: PropTypes.object,
  };
  return (
    <Form>
      <FormGroup>
        <Row>
          
          <Col md="3">
            <FormGroup>
              <Label>
                Description <span className="required"> *</span>
              </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={AccountsDetail && AccountsDetail.description}
                name="description"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Invoice No <span className="required"> *</span></Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={AccountsDetail && AccountsDetail.invoice_code}
                name="invoice_code"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>invoice Date </Label>
              <Input
                type="date"
                onChange={handleInputs}
                value={AccountsDetail && moment(AccountsDetail.invoice_date).format('YYYY-MM-DD')}
                name="invoice_date"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Payment Ref No </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={AccountsDetail && AccountsDetail.payment_ref_no}
                name="payment_ref_no"
              />
            </FormGroup>
          </Col>
         
        </Row>
      </FormGroup>
    </Form>
  );
}
