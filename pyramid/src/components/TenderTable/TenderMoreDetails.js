import React, {useEffect} from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';
import TenderCompanyEditDetails from './TenderCompanyEditDetails';
import TenderContactDetails from './TenderContactDetails';
// import styled from 'styled-components';

// const redText = styled.label`
//   color: #2962ff;
// `;

export default function TenderMoreDetails({
  tenderDetails,
  handleInputs,
  handleAddNewContact,
  company,
  contact,
  addCompanyModal,
  getContact,
  incharge,
  addCompanyToggle,
  addContactModal,
  addContactToggle,
  AddNewContact,
  insertCompany,
  companyhandleInputs,
  setAddCompanyModal,
  //setAddContactModal,
  allCountries,
  formSubmitted,
  companyInsertData,
  newContactData
}) {
  TenderMoreDetails.propTypes = {
    tenderDetails: PropTypes.object,
    handleInputs: PropTypes.object,
    handleAddNewContact: PropTypes.object,
    contact: PropTypes.object,
    company: PropTypes.object,
    addCompanyModal: PropTypes.object,
    addCompanyToggle: PropTypes.object,
    addContactModal: PropTypes.object,
    addContactToggle: PropTypes.object,
    AddNewContact: PropTypes.object,
    insertCompany: PropTypes.object,
    companyhandleInputs: PropTypes.object,
    setAddCompanyModal: PropTypes.func,
    incharge: PropTypes.object,
    getContact: PropTypes.object,
    allCountries: PropTypes.object,
    formSubmitted: PropTypes.any,
    companyInsertData: PropTypes.object,
    newContactData: PropTypes.object,
  };

    useEffect(() => {
    getContact(tenderDetails?.company_id);
  }, [tenderDetails?.company_id]);
  

  console.log("tenderDetails",tenderDetails)

  return (
    <div>
      {' '}
      <Form>
        <FormGroup>
          <ComponentCard title="Opportunity Details"  creationModificationDate={tenderDetails}
          >
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>
                    Project <span className="required"> *</span>
                  </Label>
                  <Input
                    type="text"
                    style={{ borderColor: 'red', color: 'green', /* other styles */ }}
                    onChange={handleInputs}
                    value={tenderDetails && tenderDetails.title}
                    name="title"
                    className={`form-control ${
                      formSubmitted && tenderDetails && tenderDetails.title.trim() === '' ? 'highlight' : ''
                    }`}
                    />
                {formSubmitted && tenderDetails && tenderDetails.title.trim() === '' && (
                <div className="error-message">Please enter the title</div>
              )}


                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Ref No</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={tenderDetails && tenderDetails.office_ref_no}
                    name="office_ref_no"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                    Company (OR){' '}
                    <span
                      className="anchor"
                      onClick={() => {
                        setAddCompanyModal(true);
                      }}
                    >
                      <b>
                        <u>Add New</u>
                      </b>
                    </span>
                  </Label>
                  <Input
                    type="select"
                    onChange={(e) => {
                      handleInputs(e);
                      getContact(e.target.value);
                    }}
                    value={tenderDetails && tenderDetails.company_id}
                    name="company_id"
                  >
                    <option value="selected">Please Select</option>
                    {company &&
                      company.map((e) => {
                        return (
                          <option key={e.company_id} value={e.company_id}>
                            {' '}
                            {e.company_name}{' '}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>

                <TenderCompanyEditDetails
                  addCompanyModal={addCompanyModal}
                  addCompanyToggle={addCompanyToggle}
                  insertCompany={insertCompany}
                  allCountries={allCountries}
                  companyhandleInputs={companyhandleInputs}
                  formSubmitted={formSubmitted}
                  companyInsertData={companyInsertData}
                ></TenderCompanyEditDetails>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>
                    Contact (OR){' '}
                    <span className="anchor" onClick={addContactToggle.bind(null)}>
                      <b>
                        <u>Add New</u>
                      </b>
                    </span>
                  </Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={tenderDetails?.contact_id}
                    name="contact_id"
                  >
                    <option value="selected">Please Select</option>
                    {contact &&
                      contact.map((e) => {
                        return (
                          <option key={e.contact_id} value={e.contact_id}>
                            {e.first_name}
                          </option>
                        );
                      })}
                    <TenderContactDetails
                      addContactModal={addContactModal}
                      addContactToggle={addContactToggle}
                      AddNewContact={AddNewContact}
                      handleAddNewContact={handleAddNewContact}
                      formSubmitted={formSubmitted}
                      newContactData={newContactData}
                    ></TenderContactDetails>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Mode of submission</Label>
                  <Input
                    type="text"
                    value={tenderDetails && tenderDetails.mode_of_submission}
                    onChange={handleInputs}
                    name="mode_of_submission"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Services</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={tenderDetails && tenderDetails.services}
                    name="services"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Project Start Date</Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={tenderDetails && tenderDetails.site_show_date}
                    name="site_show_date"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Project End Date</Label>
                  <Input
                    value={tenderDetails && tenderDetails.project_end_date}
                    type="date"
                    onChange={handleInputs}
                    name="project_end_date"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Project Incharge</Label>
                  <Input
                    type="select"
                    value={tenderDetails && tenderDetails.site_show_attendee}
                    onChange={handleInputs}
                    name="site_show_attendee"
                  >
                    <option value="" selected="selected">
                      Please Select
                    </option>
                    {incharge &&
                      incharge.map((e) => {
                        return (
                          <option value={e.employee_id} key={e.employee_name}>
                            {e.employee_name}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Actual Submission Date</Label>
                  <Input
                    type="date"
                    value={tenderDetails && tenderDetails.actual_submission_date}
                    onChange={handleInputs}
                    name="actual_submission_date"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                    {' '}
                    Status <span className="required"> *</span>
                  </Label>
                  <Input
                    value={tenderDetails && tenderDetails.status}
                    type="select"
                    onChange={handleInputs}
                    name="status"
                  >
                    <option value="">Please Select</option>
                    <option selected="selected" value="In Progress">In Progress</option>
                    <option value="Waiting for Approval">Waiting for Approval</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Awarded">Awarded</option>
                    <option value="Not Awarded">Not Awarded</option>
                    <option value="Cancelled">Cancelled</option>
                    <option  value="Converted to Project">
                      Converted to Project
                    </option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Actual Closing Date</Label>
                  <Input
                    type="date"
                    value={tenderDetails && tenderDetails.actual_closing}
                    onChange={handleInputs}
                    name="actual_closing"
                  />
                </FormGroup>
              </Col>
              </Row>
              <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={tenderDetails && tenderDetails.opp_email}
                    onChange={handleInputs}
                    name="opp_email"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Price</Label>
                  <Input
                    onChange={handleInputs}
                    type="text"
                    value={tenderDetails && tenderDetails.price}
                    name="price"
                  ></Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </div>
  );
}
