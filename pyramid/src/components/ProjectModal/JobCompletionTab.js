import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';




const JobCompletionTab = ({ joborder, addnewjob, setAddNewJob , generateJobCode, handleJobInputs, handleInsertData}) => {
  JobCompletionTab.propTypes = {
    joborder: PropTypes.any,
    addnewjob:PropTypes.any,
    setAddNewJob:PropTypes.any,
    generateJobCode: PropTypes.any,
    handleInsertData: PropTypes.func,
    handleJobInputs: PropTypes.any,
  };

  // Edit Project
  
  


 


  return (
    <>
    <Modal size="xl" isOpen={addnewjob}>
        <ModalHeader>
          Add New Job
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddNewJob(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
      <Form>
        <FormGroup>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    name="project_location"
                    defaultValue={joborder && joborder.project_location}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Scope of Work</Label>
                  <Input
                    type="text"
                    name="scope_of_work"
                    defaultValue={joborder && joborder.scope_of_work}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Po Number</Label>
                  <Input
                    type="text"
                    name="po_number"
                    defaultValue={joborder && joborder.po_number}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Quote Number</Label>
                  <Input
                    type="text"
                    name="quote_no"
                    defaultValue={joborder && joborder.quote_no}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Job Completion Date</Label>
                  <Input
                    type="date"
                    name="job_completion_date"
                    defaultValue={joborder && joborder.job_completion_date}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={joborder && joborder.name}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Designation</Label>
                  <Input
                    type="text"
                    name="designation"
                    defaultValue={joborder && joborder.designation}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="date"
                    defaultValue={joborder && joborder.date}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              </Row>
              <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Name</Label>
                  <Input
                    type="text"
                    name="witness_by_name"
                    defaultValue={joborder && joborder.witness_by_name}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Designation</Label>
                  <Input
                    type="text"
                    name="witness_by_designation"
                    defaultValue={joborder && joborder.witness_by_designation}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Date</Label>
                  <Input
                    type="date"
                    name="witness_by_date"
                    defaultValue={joborder && joborder.witness_by_date}
                    onChange={handleJobInputs}
                  />
                </FormGroup>
              </Col>
              </Row>
        </FormGroup>
      </Form>
      <Row>
      </Row>
        <ModalFooter>
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        generateJobCode();
                        handleInsertData();
                      }}
                    >
                      {' '}
                      Save & Continue{' '}
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setAddNewJob(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
        </ModalBody>
      </Modal>
        
    </>
  );
};

export default JobCompletionTab;
