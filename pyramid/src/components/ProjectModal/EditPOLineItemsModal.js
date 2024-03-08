import React, { useEffect, useState } from 'react';
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
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';

const EditPOLineItemsModal = ({ editPOLineItemsModal, setEditPOLineItemsModal, data }) => {
  EditPOLineItemsModal.propTypes = {
    editPOLineItemsModal: PropTypes.bool,
    setEditPOLineItemsModal: PropTypes.func,
    data: PropTypes.array,
  };

  const [getProductValue, setProductValue] = useState();
  const [newItems, setNewItems] = useState([]);
  const [purchase, setPurchase] = useState(data[0]);
  const [items, setItems] = useState(data);
  const [addNewProductModal, setAddNewProductModal] = useState(false);
  const AddMoreItem = () => {
    const item = newItems.slice();
    item.push(1);
    setNewItems(item)
  };
console.log('purchase',purchase);
console.log('purchase',data[0]);
  const handleInputs = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };
  const [productDetails, setProductDetails] = useState({
    title: '',
    product_code: '',
    site_id: 0,
    price:'',
    qty_in_stock:'',
    unit:'',
    product_type:'',


  });
//setting data in ProductDetails
const handleNewProductDetails = (e) => {
  setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
};
  function updateState(index, property, e, ProductName) {
    const copyDeliverOrderProducts = [...items];
    if (ProductName) {
      const updatedObject = { ...copyDeliverOrderProducts[index], 'product_id': e?.value, 'item_title': e?.label };
      copyDeliverOrderProducts[index] = updatedObject;
    }else {
      const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
      copyDeliverOrderProducts[index] = updatedObject;
    }
    setItems(copyDeliverOrderProducts);
  }
  const updateAmount = (index) => {
    const item = items[index];
    const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.cost_price) || 0);
    const updatedItems = [...items];
    updatedItems[index] = { ...item, amount: amount.toFixed(2) };
    setItems(updatedItems);
  };

  const updateAmount1 = (index) => {
    const item = newItems[index];
    const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.cost_price) || 0);
    const updatedItems = [...newItems];
    updatedItems[index] = { ...item, amount: amount.toFixed(2) };
    setNewItems(updatedItems);
  };

  function updateNewItemState(index, property, e, ProductName) {
    const copyDeliverOrderProducts = [...newItems];
    if (ProductName) {
      const updatedObject = { ...copyDeliverOrderProducts[index], 'product_id': e?.value, 'item_title': e?.label };
      copyDeliverOrderProducts[index] = updatedObject;
    }else {
      const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e?.target?.value || e };
      copyDeliverOrderProducts[index] = updatedObject;
    }
    setNewItems(copyDeliverOrderProducts);
  }

  //edit purchase
  const editPurchase = () => {
    
    api.post('/purchaseorder/editTabPurchaseOrder',purchase)
    .then((response) => {
      
      const insertedProductId = response.data.data.product_id;
      newItems.forEach((el) => {
        el.purchase_order_id = purchase.purchase_order_id; // Assuming you have the purchase_order_id in your purchase object
          el.product_id = insertedProductId;
        api
          .post('/purchaseorder/insertPoProduct', el)
          .then(() => {
            // message('Record editted successfully', 'success');
          })
          .catch(() => {
            message('Unable to edit record.', 'error');
          });
      });
      items.forEach((el) => {
        api
          .post('/purchaseorder/editTabPurchaseOrderLineItem', el)
          .then(() => {
            // message('Record editted successfully', 'success');
          })
          .catch(() => {
            message('Unable to edit record.', 'error');
          });
      });
      message('Record editted successfully', 'success');
      // setTimeout(() => {
      //   window.location.reload();
      // }, 300);
    })
    .catch(() => {
      message('Unable to edit record.', 'error');
    });
  };

  //edit delivery items
  // const editLineItems = () => {
  //   items.forEach((el) => {
  //     api
  //       .post('/purchaseorder/editTabPurchaseOrderLineItem', el)
  //       .then(() => {
  //         message('Record editted successfully', 'success');
  //       })
  //       .catch(() => {
  //         message('Unable to edit record.', 'error');
  //       });
  //   });
  // };

  const getTotalOfPurchase = () => {
    let total = 0;
    items.forEach((a) => {
      const amount = parseInt(a.qty, 10) * parseFloat(a.cost_price, 10);
       total += Number.isNaN(amount) ? 0 : amount;
    });
    return total;
  };

  //insert po items
  // const insertPoItems = () => {
  //   newItems.forEach((el) => {
  //     api
  //       .post('/purchaseorder/insertPoProduct', el)
  //       .then(() => {
  //         message('Record editted successfully', 'success');
  //       })
  //       .catch(() => {
  //         message('Unable to edit record.', 'error');
  //       });
  //   });
  // };

  //Clear row value
  const ClearValue = (index, newItem) => {
    let arr = [];
    let setArr;
    
    if (newItem) {
      arr = [...newItems];
      setArr = setNewItems;
    }else {
      arr = [...items];
      setArr = setItems;
    }

    const updatedObject = { ...arr[index], 
      product_id: "",
      item_title: "",
      unit: "",
      qty: "",
      cost_price: "0",
      description: "",
      amount:"0"
    };
    arr[index] = updatedObject;
    setArr(arr);
  };

  const getProduct = () => {
    api.get('/product/getProducts').then((res) => {
      const arr = res.data.data;
      const finaldat = [];
      arr.forEach((item) => {
        finaldat.push({ value: item.product_id, label: item.title });
      });
      setProductValue(finaldat);
    });
  };
// Clear new product form
const clearNewProductForm = () => {
  setProductDetails({
    title: '',
    product_type: '',
  });
};
    //Insert Product Data
    const insertProductData = (ProductCode,ItemCode) => {
      productDetails.product_code = ProductCode;
      productDetails.item_code = ItemCode;
      if (productDetails.title !== '' && productDetails.item_code !== ''  && productDetails.product_type !== '' ) {
        api
          .post('/product/insertProductss', productDetails)
          .then(() => {
            message('Product inserted successfully.', 'success');
            getProduct();
            clearNewProductForm('');
            setAddNewProductModal(false);
         
          })
          .catch(() => {
            message('Unable to edit record.', 'error');
          });
      } else {
        message('Please fill all required fields.', 'warning');
      }
    };
    const generateCode = () => {
      api
        .post('/product/getCodeValue', { type: 'ProductCode' })
        .then((res) => {
          const ProductCode = res.data.data
        api
        .post('/product/getCodeValue', { type: 'ItemCode' })
        .then((response) => {
          const ItemCode = response.data.data
          insertProductData(ProductCode, ItemCode);
         
        })
        })
        .catch(() => {
          insertProductData('');
        });
    };
  useEffect(
    () => {
      getProduct();
      return () => {
        setItems(data);
      }
    }, []
  )

  return (
    <>
      <Modal size="xl" isOpen={editPOLineItemsModal}>
        <ModalHeader>Edit PO Line Items</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <Col md="3">
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        setAddNewProductModal(true);
                      }}
                    >
                      Add New Product
                    </Button>
                  </Col>
                  <Col md="3">
                    <Button color="primary" className="shadow-none" onClick={AddMoreItem}>
                      Add More Items
                    </Button>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md="3">
                    <Label>Supplier</Label>
                    <Input
                      disabled
                      type="text"
                      name="supplier"
                      value={purchase && purchase.company_name}
                    />
                  </Col>
                  <Col md="3">
                    <Label>PO Date</Label>
                    <Input
                      type="date"
                      name="po_date"
                      value={moment(purchase && purchase.po_date).format('YYYY-MM-DD')}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Col md="3">
                    <Label>PO No.</Label>
                    <Input
                      type="text"
                      name="po_code"
                      value={purchase && purchase.po_code}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Gst</Label>
                      <br></br>
                      <Label>Yes</Label>
                      &nbsp;
                      <Input
                        name="gst"
                        value="1"
                        type="radio"
                        defaultChecked={purchase && purchase.gst === "1" && true}
                        onChange={handleInputs}
                      />
                      &nbsp; &nbsp;
                      <Label>No</Label>
                      &nbsp;
                      <Input
                        name="gst"
                        value="0"
                        type="radio"
                        defaultChecked={purchase && purchase.gst === "0" && true}
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <FormGroup className="mt-3"> Total Amount :{getTotalOfPurchase()}</FormGroup>
                </Row>
              </Col>
            </Row>

            <table className="lineitem">
              <thead>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">UoM</th>
                  <th scope="col">qty</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Remarks</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((el, index) => {
                  //const amount = el.cost_price * el.qty;
                  return (
                    <tr key={el.po_product_id}>
                      <td data-label="ProductName">
                      <Select
                          key={el.id}
                          value={{ value: el.product_id, label: el.item_title }}
                          onChange={(e) => {
                            updateState(index, null, e, true);
                          }}
                          options={getProductValue}
                        />
                        <Input
                          value={el.product_id}
                          type="hidden"
                          name="product_id"
                          onChange={(e) => updateState(index, 'product_id', e)}
                        ></Input>
                        <Input
                          value={el.title}
                          type="hidden"
                          name="title"
                          onChange={(e) => updateState(index, 'title', e)}
                        ></Input>
                        {/* <Input
                          type="text"
                          name="item_title"
                          value={el.item_title}
                          onChange={(e) => updateState(index, 'item_title', e)}
                        /> */}
                      </td>
                      <td data-label="unit">
                        <Input
                          type="text"
                          name="unit"
                          value={el.unit}
                          onChange={(e) => updateState(index, 'unit', e)}
                        />
                      </td>
                      <td data-label="qty">
                        <Input
                          type="text"
                          name="qty"
                          value={el.qty}
                          onChange={(e) => updateState(index, 'qty', e)}
                          onBlur={(e) => updateAmount(index,e)}
                        />
                      </td>
                      <td data-label="Unit Price">
                        <Input
                          type="text"
                          name="cost_price"
                          value={el.cost_price}
                          onChange={(e) => updateState(index, 'cost_price', e)}
                          onBlur={(e) => updateAmount(index,e)}
                        />
                      </td>
                      <td data-label="Total Price">
                      <Input
                          type="text"
                          name="amount"
                          value={el.amount}
                          // onChange={(e) => updateAmount(index, 'amount', e)}
                        />
                        </td>
                      {/* <td data-label="Total Price">{Number.isNaN(amount) ? 0 : amount}</td> */}
                      <td data-label="Remarks">
                        <Input
                          type="textarea"
                          name="description"
                          value={el.description}
                          onChange={(e) => updateState(index, 'description', e)}
                        />
                      </td>
                      <td data-label="Action">
                        <div className='anchor'>
                          <span onClick={()=>ClearValue(index)}>Clear</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {newItems?.map((elem, index) => {
                  //const amount = elem.cost_price * elem.qty;
                  return (
                    <tr key={elem}>
                      <td data-label="ProductName">
                        <Select
                          key={elem.id}
                          value={{ value: elem.product_id, label: elem.item_title }}
                          onChange={(e) => {
                            updateNewItemState(index, null, e, true);
                          }}
                          options={getProductValue}
                        />
                        <Input
                          value={elem.product_id}
                          type="hidden"
                          name="product_id"
                          onChange={(e) => updateNewItemState(index, 'product_id', e)}
                        ></Input>
                        <Input
                          value={elem.title}
                          type="hidden"
                          name="title"
                          onChange={(e) => updateNewItemState(index, 'title', e)}
                        ></Input>
                        {/* <Input
                          type="text"
                          name="item_title"
                          value={elem.item_title}
                          onChange={(e) => updateNewItemState(index, 'item_title', e)}
                        /> */}
                      </td>
                      <td data-label="UoM">
                        <Input
                          type="text"
                          name="unit"
                          value={elem.unit}
                          onChange={(e) => updateNewItemState(index, 'unit', e)}
                        />
                      </td>
                      <td data-label="qty">
                        <Input
                          type="text"
                          name="qty"
                          value={elem.qty}
                          onChange={(e) => updateNewItemState(index, 'qty', e)}
                          onBlur={(e) => updateAmount1(index,e)}
                        />
                      </td>
                      <td data-label="Unit Price">
                        <Input
                          type="text"
                          name="cost_price"
                          value={elem.cost_price}
                          onChange={(e) => updateNewItemState(index, 'cost_price', e)}
                          onBlur={(e) => updateAmount1(index,e)}
                        />
                      </td>
                      <td data-label="Total Price">
                      <Input
                          type="text"
                          name="amount"
                          value={elem.amount}
                          // onChange={(e) => updateAmount(index, 'amount', e)}
                        />
                        </td>
                      {/* <td data-label="Total Price">{Number.isNaN(amount) ? 0 : amount}</td> */}
                      <td data-label="Remarks">
                        <Input
                          type="textarea"
                          name="description"
                          value={elem.description}
                          onChange={(e) => updateNewItemState(index, 'description', e)}
                        />
                      </td>
                      <td data-label="Action">
                        <div className='anchor'>
                          <span onClick={()=>ClearValue(index, true)}>Clear</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              editPurchase();
              // editLineItems();
              // insertPoItems();
              setEditPOLineItemsModal(false);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondar"
            className="shadow-none"
            onClick={() => {
              setEditPOLineItemsModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add New Product Modal */}
      {/* <Modal size="lg" isOpen={addNewProductModal}>
        <ModalHeader>Add New Materials / Tools</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <FormGroup>
                    <Row>
                      <Label sm="3">
                        Product Name <span className="required"> *</span>
                      </Label>
                      <Col sm="9">
                        <Input type="text" name="product_name" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3">
                        Product Type <span className="required"> *</span>
                      </Label>
                      <Col sm="9">
                        <Input type="select" name="product_type">
                          <option value="">Please Select</option>
                          <option defaultValue="selected" value="Materials">
                            Materials
                          </option>
                          <option value="Tools">Tools</option>
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal> */}
       <Modal isOpen={addNewProductModal}>
        <ModalHeader>Add New Materials / Tools</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <FormGroup>
                    <Row>
                      <Label sm="3">
                        Product Name <span className="required"> *</span>
                      </Label>
                      <Col sm="8">
                        <Input
                          type="text"
                          name="title"
                          onChange={handleNewProductDetails}
                          value={productDetails.title}
                        />
                      </Col>
                      <Label sm="3">
                        Product Type <span className="required"> *</span>
                      </Label>
                      <Col sm="8">
                        <Input
                          type="select"
                          name="product_type"
                          onChange={handleNewProductDetails}
                          value={productDetails.product_type}
                        >
                          <option value="">Please Select</option>
                          <option value="Material">Materials</option>
                          <option value="Tools">Tools</option>
                            
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              //insertProductData();
              generateCode();
              
              //getProduct();
              //setAddNewProductModal(false);
              
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditPOLineItemsModal;
