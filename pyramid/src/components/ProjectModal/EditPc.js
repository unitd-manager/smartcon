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
import random from 'random';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as $ from 'jquery';
import message from '../Message';
import api from '../../constants/api';

function EditPc({ editPcModal, setEditPcModal, pc, projectClaimId }) {
  EditPc.propTypes = {
    editPcModal: PropTypes.bool,
    setEditPcModal: PropTypes.func,
    pc: PropTypes.object,
    projectClaimId: PropTypes.any,
  };

  const [claimItems, setClaimItems] = useState([]);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      title: '',
      description: '',
      amount: '',
      status: '',
    },
  ]);
  const AddNewLineItem = () => {
    console.log('Add Line Item button clicked');

    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        title: '',
        description: '',
        amount: '',
        status: '',
      },
    ]);
  };

  const { id } = useParams();

  //get line items
  const getClaimLineItems = () => {
    api
      .post('/claim/TabClaimPortalLineItem', { project_id: id, project_claim_id: projectClaimId })
      .then((res) => {
        setClaimItems(res.data.data);
      })
      .catch(() => {
        message('unable to get products', 'error');
      });
  };

  function updateState(index, property, e, isAddLineItem) {
    const updatedItems = isAddLineItem ? [...addLineItem] : [...claimItems];
    const updatedObject = { ...updatedItems[index], [property]: e.target.value };

    if (!isAddLineItem) {
      // Include claim_line_items_id when updating existing items
      updatedObject.claim_line_items_id = updatedItems[index].claim_line_items_id;
    }

    updatedItems[index] = updatedObject;

    if (isAddLineItem) {
      setAddLineItem(updatedItems);
    } else {
      setClaimItems(updatedItems);
    }
  }
  //edit claim items
  const editClaimLineItems = (elem) => {
    elem.project_claim_id = projectClaimId;
    elem.project_id = id;
    api
      .post('/claim/editTabClaimPortalLineItem', elem)
      .then(() => {
        window.location.reload();
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  //Insert claim line items
  const insertClaimLineItems = (elem) => {
    // Modify the API call to handle an array of line items
    elem.project_claim_id = projectClaimId;
    elem.project_id = id;
    api
      .post('/claim/insertClaimLineItems11', elem) // Wrap elem in an array
      .then(() => {
        window.location.reload();
        message('Record created successfully', 'success');
      })
      .catch(() => {
        message('Unable to create record.', 'error');
      });
  };

  const insertOrEditClaimItems = async () => {
    try {
      // Update existing claim items
      const editPromises = claimItems.map(async (el) => {
        if (el.claim_line_items_id) {
          await editClaimLineItems(el);
        }
      });

      const getAllValues = () => {
        return new Promise((resolve) => {
          const result = [];
          $('tr.lineitem1').each(function input() {
            const allValues = {};
            $(this)
              .find('input')
              .each(function output() {
                const fieldName = $(this).attr('name');
                const value = $(this).val().trim(); // Trim to remove leading/trailing whitespaces
                allValues[fieldName] = value;
              });

            // Check if all values are non-empty before pushing into the result array
            const isEmpty = Object.values(allValues).some((value) => value === '');
            if (!isEmpty) {
              result.push(allValues);
            }
          });

          // Insert claim line items only if there are non-empty values
          if (result.length > 0) {
            result.forEach((element) => {
              insertClaimLineItems(element);
            });
          } else {
            message('Please fill all fields', 'danger');
          }

          resolve(); // Resolve the promise when everything is done
        });
      };

      // Wait for all promises to complete
      await Promise.all([...editPromises, getAllValues()]);

      // After all promises are completed, close the modal
      setEditPcModal(false);
      // Optionally, you may want to update the state or perform any other actions after the API calls are completed.
    } catch (error) {
      // Handle errors here
      console.error('Error:', error);
      message('Error occurred while saving data.', 'error');
    }
  };

  useEffect(() => {
    getClaimLineItems();
  }, []);

  return (
    <>
      <Modal size="lg" isOpen={editPcModal}>
        <ModalHeader> Edit Pc Item </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Form>
              <Row>
                <Col md="3">
                  <FormGroup>
                    <Button
                      className="shadow-none"
                      color="primary"
                      type="button"
                      onClick={() => {
                        AddNewLineItem();
                      }}
                    >
                      Add Line Item
                    </Button>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="claim_date"
                      value={moment(new Date()).format('YYYY-MM-DD')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Project</Label>
                    <Input name="project" type="text" value={pc && pc.title} disabled />
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
                    </tr>
                  </thead>
                  <tbody>
                    {claimItems &&
                      claimItems.map((item, index) => {
                        return (
                          <tr key={item.id}>
                            <td data-label="Title">
                              <Input
                                defaultValue={item.title}
                                type="text"
                                name="title"
                                onChange={(e) => updateState(index, 'title', e)}
                              />
                            </td>

                            <td data-label="Description">
                              <Input
                                defaultValue={item.description}
                                type="text"
                                name="description"
                                onChange={(e) => updateState(index, 'description', e)}
                              />
                            </td>
                            <td data-label="amount">
                              <Input
                                defaultValue={item.amount}
                                type="text"
                                name="amount"
                                onChange={(e) => updateState(index, 'amount', e)}
                              />
                            </td>
                            <td data-label="Status">
                              <Input
                                defaultValue={item.status}
                                type="text"
                                name="status"
                                onChange={(e) => updateState(index, 'status', e)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    {addLineItem &&
                      addLineItem.map((itemqwe) => {
                        return (
                          <tr className="lineitem1" key={itemqwe.id}>
                            <td data-label="Title">
                              <Input Value={itemqwe.title} type="text" name="title" />
                            </td>

                            <td data-label="Description">
                              <Input Value={itemqwe.description} type="text" name="description" />
                            </td>
                            <td data-label="amount">
                              <Input Value={itemqwe.amount} type="number" name="amount" />
                            </td>
                            <td data-label="Status">
                              <Input Value={itemqwe.status} type="text" name="status" />
                            </td>
                          </tr>
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
                        insertOrEditClaimItems();
                        setEditPcModal(false);
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      color="secondary"
                      className="shadow-none"
                      onClick={() => {
                        setEditPcModal(false);
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

export default EditPc;
