import React, { useState,useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
import api from '../../constants/api';
import message from '../Message';


const QuoteViewEditItem = ({ quoteData, setQuoteData, FetchLineItemData,quoteId,QuotationViewLine,getQuotations }) => {
  QuoteViewEditItem.propTypes = {
    quoteData: PropTypes.bool,
    getQuotations:PropTypes.func,
    QuotationViewLine:PropTypes.func,
    setQuoteData: PropTypes.func,
    FetchLineItemData: PropTypes.object,
    quoteId: PropTypes.any,
   
  };
const {id}=useParams();
  const [lineItemData, setLineItemData] = useState(null);
  const [lineItem, setLineItem] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [quotation, setQuotation] = useState();

  const getQuotation = () => {
    api
      .post('/projecttabquote/getTabQuote', { quote_id: quoteId })
      .then((res) => {
        setQuotation(res.data.data[0]);
      })
  };
  const getLineItem = () => {
    api.post('/project/getQuoteLineItemsById', { quote_id: quoteId }).then((res) => {
      setLineItem(res.data.data);
    });
  };
  useEffect(() => {
    getQuotation();
    getLineItem();
  }, [quoteId]);

  const handleData = (e) => {
    setLineItemData({ ...lineItemData, [e.target.name]: e.target.value });
  };
  const handleCalc = (Qty, UnitPrice, TotalPrice) => {
    if (!Qty) Qty = 0;
    if (!UnitPrice) UnitPrice = 0;
    if (!TotalPrice) TotalPrice = 0;

    setTotalAmount(parseFloat(Qty) * parseFloat(UnitPrice));
  };

  const insertquote = () => {
    api.post('/project/insertLog', quotation).then((res) => {
      message('quote inserted successfully.', 'success');

      lineItem.forEach((element) => {
        element.quote_log_id = res.data.data.insertId;

        api
          .post('/project/insertLogLine', element)
          .then(() => {
            getQuotations(); 
          })
          .catch((error) => {
            console.error('Error inserting log line:', error);
          });
      });
    });
  };

  const UpdateData = () => {
    lineItemData.quote_id=id;
    //lineItemData.amount=totalAmount;
    
    lineItemData.amount = parseFloat(lineItemData.quantity) * parseFloat(lineItemData.unit_price) 
    const hasChanges = JSON.stringify(lineItemData) !== JSON.stringify(FetchLineItemData);
    api
      .post('/tender/edit-TabQuoteLine', lineItemData)
      .then((res) => {
        console.log('edit Line Item', res.data.data);
        message('Edit Line Item Udated Successfully.', 'success');
        if (hasChanges) {
          insertquote();
        }
        QuotationViewLine();
      })
      .catch(() => {
        message('Unable to edit quote. please fill all fields', 'error');
      });
  };


 


  React.useEffect(() => {
    setLineItemData(FetchLineItemData);
  }, [FetchLineItemData]);

  return (
    <>
      <Modal isOpen={quoteData}>
        <ModalHeader>Line Items</ModalHeader>
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
              <Label sm="2">Qty</Label>
              <Col sm="10">
                <Input
                  type="text"
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
              <Label sm="2">UOM</Label>
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
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            type="button"
            onClick={() => {
              UpdateData();
              setQuoteData(false);
            }}
          >
            Save & Continue
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setQuoteData(false);
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

export default QuoteViewEditItem;
