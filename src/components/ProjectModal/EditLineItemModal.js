import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Button,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { useParams } from 'react-router-dom';
import api from '../../constants/api';
import message from '../Message';


const EditLineItemModal = ({ editLineModal, setEditLineModal, FetchLineItemData, onEditSuccess }) => {
  EditLineItemModal.propTypes = {
    editLineModal: PropTypes.bool,
    setEditLineModal: PropTypes.func,
    FetchLineItemData: PropTypes.object,
    onEditSuccess: PropTypes.func,
   
  };
const {id}=useParams();
  const [lineItemData, setLineItemData] = useState(null);
  const [totalAmount, setTotalAmount] = useState();
  const [quoteData, setQuoteData] = useState();

  const handleData = (e) => {
    setLineItemData({ ...lineItemData, [e.target.name]: e.target.value });
  };
  const getQuote = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuoteData(res.data.data[0]);
    });
  };
  const handleCalc = (Qty, UnitPrice, TotalPrice) => {
    if (!Qty) Qty = 0;
    if (!UnitPrice) UnitPrice = 0;
    if (!TotalPrice) TotalPrice = 0;

    setTotalAmount(parseFloat(Qty) * parseFloat(UnitPrice));
  };
  const getLineItem = () => {
    api.post('/tender/getQuoteLineItemsById', { quote_id: quoteData.quote_id }).then(() => {
      console.log('222222222:', quoteData.quote_id);

    })
    .catch((error) => {
      console.error('Error fetching line items:', error);
      message('LineItem Data not found', 'info');
    });
  };
  const UpdateData = () => {
    lineItemData.quote_id=id;
    //lineItemData.amount=totalAmount;
    lineItemData.amount = parseFloat(lineItemData.quantity) * parseFloat(lineItemData.unit_price) 
    api
      .post('/tender/edit-TabQuoteLine', lineItemData)
      .then(() => {
        api.post('/tender/insertLog', quoteData)
        .then(() => {
          message('insert log Udated Successfully.', 'success');
         
        })
        api
        .post('/tender/insertLogLine', lineItemData)
        .then((result) => {
          console.log('edit Line Item', result.data.data);
          message('Edit Line Item Udated Successfully.', 'success');
         
        })
        .catch(() => {
          message('Unable to edit quote. please fill all fields', 'error');
        });
        getLineItem();
        onEditSuccess(); // Call the callback function
      
      })
      .catch(() => {
        message('Unable to edit quote. please fill all fields', 'error');
      });
  };

  React.useEffect(() => {
    getQuote();
    setLineItemData(FetchLineItemData);
  }, [FetchLineItemData]);

  return (
    <>
      <Modal isOpen={editLineModal}>
        <ModalHeader>Edit Line Item</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Label sm="2">Title</Label>
              <Col sm="10">
                <Input
                  type="text"
                  name="title"
                  defaultValue={lineItemData && lineItemData.title}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Description</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="description"
                  defaultValue={lineItemData && lineItemData.description}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Unit</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="unit"
                  defaultValue={lineItemData && lineItemData.unit}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Label sm="2">Qty</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="quantity"
                  defaultValue={lineItemData && lineItemData.quantity}
                  onChange={(e)=>{handleData(e);
                    handleCalc(e.target.value, lineItemData.unit_price,lineItemData.amount
                      )}}
                 
                />
              </Col>
            </Row>
          </FormGroup>
          
          <FormGroup>
            <Row>
              <Label sm="2">Unit Price</Label>
              <Col sm="10">
                <Input
                  type="text"
                  name="unit_price"
                  defaultValue={lineItemData && lineItemData.unit_price}
                  onChange={(e)=>{handleData(e);
                    handleCalc(lineItemData.quantity,e.target.value,lineItemData.amount)
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Total Price</Label>
              <Col sm="10">
                <Input
                  type="text"
                  name="amount"
                  value={totalAmount || lineItemData && lineItemData.amount}
                  onChange={(e)=>{handleData(e);
                    handleCalc(lineItemData.quantity,lineItemData.unit_price,e.target.value)
                  }}
                  disabled
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Remarks</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="remarks"
                  defaultValue={lineItemData && lineItemData.remarks}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            type="button"
            onClick={() => {
              UpdateData();
              setEditLineModal(false);
            }}
          >
            Save & Continue
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditLineModal(false);
            }}
          >
            {' '}
            Cancel{' '}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditLineItemModal;
