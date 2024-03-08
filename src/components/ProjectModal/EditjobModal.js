import React from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Form,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

const EditQuoteModal = ({
  editjob,
  setEditJob,
  job,
  EditJobDetails,
  handleInputs,
}) => {
  EditQuoteModal.propTypes = {
    editjob: PropTypes.bool,
    setEditJob: PropTypes.func,
    job: PropTypes.any,
    EditJobDetails: PropTypes.func,
    handleInputs: PropTypes.func,
  };

  

  

 
  return (
    <>
      {/*  Edit Quote Modal */}
      <Modal size="lg" isOpen={editjob}>
        <ModalHeader>
          Edit Job
          <Button
            color="secondary"
            onClick={() => {
              setEditJob(false);
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
                    defaultValue={job && job.project_location}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Scope of Work</Label>
                  <Input
                    type="text"
                    name="scope_of_work"
                    defaultValue={job && job.scope_of_work}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Po Number</Label>
                  <Input
                    type="text"
                    name="po_number"
                    defaultValue={job && job.po_number}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Quote Number</Label>
                  <Input
                    type="text"
                    name="quote_no"
                    defaultValue={job && job.quote_no}
                    onChange={handleInputs}
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
                    defaultValue={moment(job && job.job_completion_date).format('YYYY-MM-DD')}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={job && job.name}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Designation</Label>
                  <Input
                    type="text"
                    name="designation"
                    defaultValue={job && job.designation}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="date"
                    defaultValue={moment(job && job.date).format('YYYY-MM-DD')}
                    onChange={handleInputs}
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
                    defaultValue={job && job.witness_by_name}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Designation</Label>
                  <Input
                    type="text"
                    name="witness_by_designation"
                    defaultValue={job && job.witness_by_designation}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Date</Label>
                  <Input
                    type="date"
                    name="witness_by_date"
                    defaultValue={moment(job && job.witness_by_date).format('YYYY-MM-DD')}
                    onChange={handleInputs}
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
                        EditJobDetails();
                        setEditJob(false);
                      }}
                    >
                      {' '}
                      Save & Continue{' '}
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setEditJob(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
        </ModalBody>
      </Modal>
      {/* END Edit Quote Modal */}
    </>
  );
};

export default EditQuoteModal;
