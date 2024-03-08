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
} from 'reactstrap';
import random from 'random';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import message from '../Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';

function TransferModal({ transferModal, setTransferModal, transferItem }) {
  TransferModal.propTypes = {
    transferModal: PropTypes.bool,
    setTransferModal: PropTypes.func,
    transferItem: PropTypes.object,
  };
  const { loggedInuser } = React.useContext(AppContext);
  const [project, setProject] = useState([]);
  const [stock, setStock] = useState();
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
  const getProjects = (clientId) => {
    api
      .post('/project/getprojectcompanyById', { company_id: clientId })
      .then((res) => {
        setProject(res.data.data);
      })
      .catch(() => {
        message('unable to get products', 'error');
      });
  };
  const getStock = () => {
    api
      .post('/inventory/getstockById', { product_id: transferItem && transferItem.product_id })
      .then((res) => {
        setStock(res.data.data[0]);
      })
      .catch(() => {
        message('unable to get products', 'error');
      });
  };
  console.log('loggedinuser', project);
  //Insert claim line items
  //Insert claim line items
  const insertTransferItems = (elem) => {
    elem.product_id = transferItem.product_id;
    elem.from_project_id = id;
    elem.created_by = loggedInuser.name;
    api
      .post('/projecttabmaterialstransferredportal/insertstock_transfer', elem)
      .then(() => {
        transferItem.qty -= elem.quantity;
        api
          .post('/purchaseorder/editTabPurchaseOrderLineItem', transferItem)
          .then(() => {
            message('Record created successfully', 'success');
          })
          .catch(() => {
            message('Unable to edit record.', 'error');
          });
        message('Record created successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  // const insertOrEditClaimItems = () => {
  //   const totalQuantity = addLineItem.reduce((total, item) => total + parseFloat(item.quantity), 0);

  //   if (totalQuantity <= transferItem.qty) {
  //     addLineItem.forEach((el) => {
  //       const clientQuantity = parseFloat(el.quantity);

  //        const proportion = clientQuantity / totalQuantity;
  //        const transferredQuantity = proportion * transferItem.qty;

  //       const clientElement = {
  //         ...el,
  //         quantity: transferredQuantity,
  //       };

  //       insertTransferItems(clientElement);
  //     });
  //   } else {
  //     alert(`Please Enter the Quantity less than or equal to ${transferItem.qty}`);
  //   }
  // };

  const insertOrEditClaimItems = () => {
    // Calculate the total quantity of all line items
    // const totalQuantity = addLineItem.reduce((total, item) => total + parseFloat(item.quantity), 0);
    //   // Iterate over each line item and insert the quantity
    //    // Check if the total quantity exceeds the available quantity
    // if (totalQuantity <= transferItem.qty) {
    // Iterate over each line item and insert/transf
    addLineItem.forEach((el) => {
      const clientQuantity = parseFloat(el.quantity);

      const clientElement = {
        ...el,
        quantity: clientQuantity,
      };

      // Call the function to insert the item
      insertTransferItems(clientElement);
    });
    // Move the 'else' block here
    // }else {
    //   alert(`Please Enter the Quantity less than or equal to ${transferItem.qty}`);
    // }
  };

  function updateState(index, property, e) {
    const updatedLineItems = [...addLineItem];
    const updatedObject = { ...updatedLineItems[index], [property]: e.target.value };
    updatedLineItems[index] = updatedObject;
    setAddLineItem(updatedLineItems);
  }

  // const insertOrEditClaimItems = () => {
  //   let transQuantity = 0;
  //   addLineItem.forEach((elem) => {
  //     transQuantity += elem.quantity;
  //   });
  //   if (transQuantity <= transferItem.qty) {
  //     addLineItem.forEach((el) => {
  //       insertTransferItems(el);
  //     });
  //   } else {
  //     alert(`Please Enter the Quantity less than ${transferItem.qty}`);
  //   }
  // };
  // const onchangeItems = (selectedProduct, itemId) => {
  //   const elementIndex = addLineItem.findIndex((el) => el.id === itemId);
  //   const updatedItems = [...addLineItem];
    
  //   if (elementIndex !== -1) {
  //     updatedItems[elementIndex] = {
  //       ...updatedItems[elementIndex],
  //       company_id: selectedProduct.value.toString(),
  //       company_name: selectedProduct.label,
  //       selectedClientId: selectedProduct.value.toString(),
  //     };
      
  //     // Update the projects only for the selected client
  //     getProjects(selectedProduct.value);
  //   }
  
  //   setAddLineItem(updatedItems);
  // };

  const [selectedClients, setSelectedClients] = useState({});
  const onchangeItems = (selectedProduct, itemId) => {
    const updatedSelectedClients = { ...selectedClients };
    updatedSelectedClients[itemId] = selectedProduct.value;

    setAddLineItem((prevLineItems) =>
      prevLineItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            company_id: selectedProduct.value.toString(),
            company_name: selectedProduct.label,
            selectedClientId: selectedProduct.value.toString(),
          };
        }
        return item;
      })
    );

    setSelectedClients(updatedSelectedClients);
  };
  // ... (previous code)
  const loadOptions = (inputValue, callback) => {
    api.get(`/client/getClientsbyfilter`, { params: { keyword: inputValue } }).then((res) => {
      const items = res.data.data;
      const options = items.map((item) => ({
        value: item.company_id,
        label: item.company_name,
      }));
      callback(options);
    });
  };

  useEffect((selectedOption) => {
    getProjects(selectedOption);
    getStock();
  }, []);

  // Clear row value
  const ClearValue = (ind) => {
    setAddLineItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
  };

  return (
    <>
      <Modal size="lg" isOpen={transferModal}>
        <ModalHeader> Transfer to Other Projects</ModalHeader>
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
                      Add More Item
                    </Button>
                    {/* <Button onClick={() => AddNewLineItem}>Add More Items</Button> */}
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <span>Total Quantity:{transferItem && transferItem.qty}</span>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <table className="lineitem">
                  <thead>
                    <tr>
                      <th scope="col">Client</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addLineItem &&
                      addLineItem.map((item, index) => {
                        return (
                          <tr key={item.id}>
                            <td data-label="title">
                            <AsyncSelect
                            onChange={(selectedOption) => {
                              onchangeItems(selectedOption, item.id); // Pass item.id as the itemId
                              getProjects(selectedOption.value); // Fetch projects based on selected client's ID
                            }}
                            loadOptions={loadOptions}
                          />
                            </td>

                            <td data-label="Project Name">
                              <Input
                                defaultValue={item.project_id}
                                type="select"
                                name="to_project_id"
                                onChange={(e) => updateState(index, 'to_project_id', e)}
                              >
                                <option value="">Please Select</option>
                                {project &&
                                  project.map((e) => {
                                    return <option value={e.project_id}>{e.title}</option>;
                                  })}
                              </Input>
                            </td>
                            <td data-label="Stock">{stock && stock.actual_stock}</td>
                            <td data-label="Quantity">
                              <Input
                                defaultValue={item.quantity}
                                type="text"
                                name="quantity"
                                onChange={(e) => updateState(index, 'quantity', e)}
                              />
                            </td>
                            <td data-label="Action">
                              <Input type="hidden" name="id" Value={item.id}></Input>
                              <span
                                className="addline"
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

                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      type="button"
                      className="btn mr-2 shadow-none"
                      color="primary"
                      onClick={() => {
                        insertOrEditClaimItems();
                        setTransferModal(false);
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      color="secondary"
                      className="shadow-none"
                      onClick={() => {
                        setTransferModal(false);
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

export default TransferModal;
