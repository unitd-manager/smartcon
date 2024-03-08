import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Label,
} from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';

function EditPcItems({
  projectClaimId,
  getClaimPaymentById,
  projectId,
  editPcItems,
  setEditPcItems,
  pc,
  editClaim,
  editClaim1,
}) {
  EditPcItems.propTypes = {
    editPcItems: PropTypes.bool,
    getClaimPaymentById:PropTypes.bool,
    setEditPcItems: PropTypes.func,
    pc: PropTypes.object,
    projectClaimId: PropTypes.any,
    projectId: PropTypes.any,
    editClaim: PropTypes.any,
    editClaim1: PropTypes.any,
  };
  const [lineItems, setLineItems] = useState([]);
  const [mainDetails, setMainDetails] = useState({});

  const handleChange = (e) => {
    setMainDetails({ ...mainDetails, [e.target.name]: e.target.value });
  };

  console.log('ordr11111', editClaim);
  //get lineitems
  const getLineItems = () => {
    api
      .post('/claim/getTabClaimPaymentPortalById11', {
        project_id: projectId,
        project_claim_id: projectClaimId,
        claim_seq: editClaim1,
      })
      .then((res) => {
        setLineItems(res.data.data);
      })
      .catch(() => {
        message('line items not found', 'error');
      });
  };

  //edit lineitems
  const editLineItems = () => {
    let canInsert = true;

    lineItems.forEach((el) => {
      if (el.currentAmt) {
        const remainingAmount = el.claimAmount - el.prev_amount;

        if (el.currentAmt > remainingAmount) {
          alert('This Month Amount  exceeds the remaining contract amount.');
          canInsert = false;
        }
      }
    });
    if (canInsert) {
      lineItems.forEach((obj) => {
        api
          .post('/claim/editTabClaimPortalPayment', obj)
          .then(() => {
            setEditPcItems(false);
            getClaimPaymentById();
            message('Edited successfully', 'success');
          })
          .catch(() => {
            message('Failed to edit line items', 'error');
          });
      });
    }
  };

  function updateState(index, property, e) {
    const updatedLineItems = [...lineItems];
    const updatedObject = { ...updatedLineItems[index], [property]: e.target.value };
    updatedLineItems[index] = updatedObject;
    setLineItems(updatedLineItems);
  }

  useEffect(() => {
    getLineItems();
  }, []);

  return (
    <>
      <Modal size="lg" isOpen={editPcItems}>
        <ModalHeader> Edit Claim Items </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Form>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={moment(new Date()).format('YYYY-MM-DD')}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Project</Label>
                    <Input name="project" type="text" value={pc && pc.title} disabled />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Claim Sequence</Label>
                    <Input
                      name="claim_seq"
                      type="text"
                      value={editClaim1}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <table className="lineitem">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Contract Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">PrevAmount</th>
                      <th scope="col">This Month Amount</th>
                      <th scope="col">Cum Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems &&
                      lineItems.map((res, index) => {
                        return (
                          <>
                            <tr>
                              <td>{res.title}</td>
                              <td>{res.description}</td>
                              <td>{res.claimAmount}</td>
                              <td data-label="Status">
                                <Input
                                  type="select"
                                  name="status"
                                  value={res.status}
                                  onChange={(e) => {
                                    updateState(index, 'status', e);
                                  }}
                                >
                                  {' '}
                                  <option value="In Progress">In Progress</option>
                                  <option value="New">New</option>
                                </Input>
                              </td>

                              <td>{res.prev_amount}</td>
                              <td>
                                <Input
                                  name="currentAmt"
                                  defaultValue={res.currentAmt}
                                  onChange={(e) => {
                                    updateState(index, 'currentAmt', e);
                                  }}
                                />
                              </td>
                              <td>{res.cumAmount}</td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>

                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      type="button"
                      className="btn mr-2 shadow-none"
                      color="primary"
                      onClick={() => {
                        editLineItems();
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      color="secondary"
                      className="shadow-none"
                      onClick={() => {
                        setEditPcItems(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </FormGroup>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditPcItems;
