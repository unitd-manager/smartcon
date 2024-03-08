import React, { useState, useContext } from 'react';
import {
  // Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
// import moment from 'moment';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';


const AddLineItemModal = ({ addLineItemModal, setAddLineItemModal, JobOrderId}) => {
  AddLineItemModal.propTypes = {
    addLineItemModal: PropTypes.bool,
    setAddLineItemModal: PropTypes.func,
    JobOrderId: PropTypes.any,
  };
  console.log('JobOrderId:', JobOrderId);
  //All state Varible
  const { loggedInuser } = useContext(AppContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      unit: '',
      quantity: '',
      unit_price: '',
      amount: '',
      remarks: '',
      title: '',
      description: '',
    },
  ]);
  //Insert Invoice Item
  const addLineItemApi = (obj) => {
    if (obj.title !== '' && obj.unit_price !== '' && obj.quantity !== '') {
      obj.creation_date = creationdatetime;
      obj.created_by = loggedInuser.first_name;
      obj.job_order_id=JobOrderId
      api
      .post('/joborder/insertJobOrderItems', obj)
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
       //window.location.reload();
        setAddLineItemModal(false);
         setTimeout(() => {
            window.location.reload();
          }, 1000);
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
    }
    else {
      message('Please fill all required fields', 'warning');
    }
  
  };
  //Add new line item
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        unit: '',
        quantity: '',
        unit_price: '',
        remarks: '',
        amount: '',
        title: '',
        description: '',
      },
    ]);
  };
  //Invoice item values
  const getAllValues = () => {
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
      result.push(allValues);
    });
    setTotalAmount(0);
    console.log(result);
    result.forEach((element) => {
      addLineItemApi(element);
    });
    console.log(result);
  };
  
  //Invoice Items Calculation
  const calculateTotal = () => {
    let totalValue = 0;
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
          allValues.amount = allValues.quantity * allValues.unit_price;
        });
      result.push(allValues);
    });
    result.forEach((e) => {
      if (e.amount) {
        totalValue += parseFloat(e.amount);
      }
    });
    console.log(result);
    setAddLineItem(result);
    setTotalAmount(totalValue);
  };
  // Clear row value
  const ClearValue = (ind) => {
    setAddLineItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
    if (ind.amount) {
      const finalTotal = totalAmount - parseFloat(ind.amount);
      setTotalAmount(finalTotal);
    }
  };
  // const deleteRecord = (deleteID) => {
  //   Swal.fire({
  //     title: `Are you sure?`,
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       api.post('/project/deleteJobOrderItems', { job_order_item_id: deleteID }).then(() => {
  //         Swal.fire('Deleted!', 'Your Line Items has been deleted.', 'success');
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 300);
  //       });
  //     }
  //   });
  // };
  return (
    <>
      <Modal size="xl" isOpen={addLineItemModal}>
        <ModalHeader>
          Add Quote Items
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddLineItemModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Form>
                <Row>
                  <Row>
                    <Col md="3" className="mb-4">
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
                    </Col>
                    <br/>
                  </Row>
              
                  {/* Invoice Item */}
                  {/* <Card> */}
                    <table className="lineitem">
                      <thead>
                        <tr>
                          <th scope="col">Title <span className="required"> *</span>{' '}</th>
                          <th scope="col">Description </th>
                          <th scope="col">Unit</th>
                          <th scope="col">Qty <span className="required"> *</span>{' '}</th>
                          <th scope="col">Unit Price <span className="required"> *</span>{' '}</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Remarks</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addLineItem &&
                          addLineItem.map((item) => {
                            return (
                              <tr key={item.id}>
                                <td data-label="Title">
                                  <Input Value={item.title} type="text" name="title" style={{ width: '90%' }} />
                                </td>
                                
                                <td data-label="Description">
                                  <Input Value={item.description} type="text" name="description" style={{ width: '90%' }} />
                                </td>
                                <td data-label="Unit">
                                  <Input Value={item.unit} type="text" name="unit" style={{ width: '90%' }}/>
                                </td>
                                <td data-label="Qty">
                                  <Input Value={item.quantity} type="number" name="quantity" style={{ width: '70%' }}/>
                                </td>
                                <td data-label="Unit Price">
                                  <Input
                                    Value={item.unit_price}
                                    onBlur={() => {
                                      calculateTotal();
                                    }}
                                    type="number"
                                    name="unit_price"
                                    style={{ width: '90%' }}
                                  />
                                </td>
                                <td data-label="Amount">
                                  <Input Value={item.amount} type="text" name="amount" disabled style={{ width: '90%' }}/>
                                </td>
                                <td data-label="Remarks">
                                  <Input Value={item.remarks} type="text" name="remarks" style={{ width: '90%' }}/>
                                </td>
                                <td data-label="Action">
                                  
                                    <Input type="hidden" name="id" Value={item.id}></Input>
                                    <span className='addline'
                                      onClick={() => {
                                        ClearValue(item);
                                      }}
                                    >
                                      Clear
                                    </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  {/* </Card> */}
                 
                  <ModalFooter>
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        getAllValues();
                      }}
                    >
                      {' '}
                      Save & Continue{' '}
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setAddLineItemModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Row>
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};
export default AddLineItemModal;
