import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  Row
} from 'reactstrap';

export default function TenderContactDetails({
  handleAddNewContact,
  addContactModal,
  addContactToggle,
  AddNewContact,
  formSubmitted,
  newContactData
}) {
  TenderContactDetails.propTypes = {
    handleAddNewContact: PropTypes.any,
    addContactModal: PropTypes.object,
    addContactToggle: PropTypes.any,
    AddNewContact: PropTypes.any,
    formSubmitted: PropTypes.any,
    newContactData: PropTypes.object,
  };

  return (
    <div>
      <Modal size="lg" isOpen={addContactModal} toggle={addContactToggle.bind(null)}>
        <ModalHeader toggle={addContactToggle.bind(null)}>New Contact</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Title<span className="required"> *</span>
                          </Label>
                          <Input type="select" name="salutation" onChange={handleAddNewContact}
                            className={`form-control ${formSubmitted && newContactData && (newContactData.salutation === undefined || newContactData.salutation.trim() === '')
                            ? 'highlight'
                            : ''
                          }`}
                          >
                            <option value="" selected="selected">
                              Please Select
                            </option>
                            <option value="Ms">Ms</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                          </Input>
                          {formSubmitted && newContactData && (newContactData.salutation === undefined || newContactData.salutation.trim() === '') && (
                      <div className="error-message">Please select the Title</div>
                    )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>
                            Name<span className="required"> *</span>
                          </Label>
                          <Input type="text" name="first_name" onChange={handleAddNewContact} 
                           className={`form-control ${formSubmitted && newContactData && newContactData.first_name.trim() === '' ? 'highlight' : ''
                          }`}
                          />
                            {formSubmitted && newContactData && newContactData.first_name.trim() === '' && (
                      <div className="error-message">Please enter the Name</div>
                    )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Email</Label>
                          <Input type="text" name="email" onChange={handleAddNewContact} />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Position</Label>
                          <Input type="text" name="position" onChange={handleAddNewContact} />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Department</Label>
                          <Input type="text" name="department" onChange={handleAddNewContact} />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Phone (Direct)</Label>
                          <Input type="number" name="phone_direct" onChange={handleAddNewContact} />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Fax (Direct)</Label>
                          <Input type="number" name="fax" onChange={handleAddNewContact} />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Mobile</Label>
                          <Input type="number" name="mobile" onChange={handleAddNewContact} />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              AddNewContact();
              // addContactToggle(null)
            }}
          >
            Save & Continue
          </Button>
          <Button color="secondary" className="shadow-none" onClick={addContactToggle.bind(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
