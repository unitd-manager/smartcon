import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, FormGroup, Label, Button, CardTitle } from 'reactstrap';
import moment from 'moment';
import * as Icon from 'react-feather';
import api from '../../constants/api';
//import ViewLineItemModal from './ViewLineItemModal';
import ViewQuoteLogModal from './ViewQuoteLogModal';
import EditQuotation from './EditQuotation';
import AddLineItemModal from './AddLineItemModal';
import PdfProjectQuote from '../PDF/PdfProjectQuote';
import QuotationViewLineItem from './QuotationViewLineItems';

export default function QuotationMoreDetails({
  id,
  //setViewQuotationsModal,
  // insertQuote,
  // handleQuoteForms,
  lineItem,
  // generateCodeQuote,
  getLineItem,
  quotationsModal,
  setquotationsModal,
}) {
  QuotationMoreDetails.propTypes = {
    id: PropTypes.string,
    getLineItem: PropTypes.array,
   // setViewQuotationsModal: PropTypes.any,
    quotationsModal: PropTypes.object,
    setquotationsModal: PropTypes.object,
    lineItem: PropTypes.object,
   
    // insertQuote: PropTypes.any,
    // handleQuoteForms: PropTypes.any,
    // generateCodeQuote: PropTypes.any,
  };


  console.log("id",id)

  const [quotation, setQuotation] = useState();
  const [quoteData, setQuoteData] = useState();
 // const [quotelineItem, setQuoteLineItem] = useState();
  const [editQuoteModal, setEditQuoteModal] = useState();
  const [quotationViewLineItem, setQuotationViewLineItem] = useState();
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [quote, setQuote] = useState();

  const getQuotations = () => {
    api
      .post('/projecttabquote/getTabQuoteById', { project_id: id })
      .then((res) => {
        console.log("getTabQuoteById",res.data.data)
        setQuotation(res.data.data);
      })
  };
  useEffect(() => {
    getQuotations();
  }, [id]);
  
  console.log("quotation",quotation)

  return (
    <>
      <Row>
        <Col md="2">
          <Button
            color="primary"
            className="shadow-none mb-2"
            onClick={() => {
              setquotationsModal(true);
            }}
          >
            View Quote Log
          </Button>
        </Col>
        
        {/* <Col md="2">
          <Button
            color="primary"
            className="shadow-none mb-2"
            onClick={() => {
              insertQuote();
              handleQuoteForms();
              generateCodeQuote('quote');
            }}
          >
            Add Quote
          </Button>
        </Col> */}
      </Row>
      <CardTitle tag="h4" className="border-bottom bg-secondary p-2 mb-0 text-white">
        {' '}
        Quotations{' '}
      </CardTitle>

      <Form className="mt-4">
        <Row className="border-bottom mb-3">
          <Col>
            <FormGroup>
              <Label>Revision</Label>{' '}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Quote Date</Label>{' '}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Quote Code</Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Quote Status</Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Discount </Label>
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label>Amount </Label>
            </FormGroup>
          </Col>
          <Col></Col>

          <Col>
            <FormGroup>
              <Label>Action</Label>
            </FormGroup>
          </Col>
        </Row>

        {quotation &&
          quotation.map((element) => {
            return (
              <Row>
                <Col>
                  <FormGroup>
                    <Label>{element.revision}</Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>
                      {element.quote_date ? moment(element.quote_date).format('DD-MM-YYYY') : ''}
                    </Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <span>{element.quote_code}</span>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>{element.quote_status}</Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>{element.discount}</Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>{element.totalamount - element.discount}</Label>
                  </FormGroup>
                </Col>

                <Col md="2">
                  <FormGroup>
                    <Label>
                      <div className='anchor'>
                        <span
                          onClick={() => {
                            setQuote(element.quote_id);
                            getLineItem(element.quote_id);
                            setQuotationViewLineItem(true);
                          }}
                        >
                          <u> View Line Items</u>
                        </span>
                      </div>
                    </Label>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Row>
                      <Col md="3">
                        <Label>
                          <div color="primary" className='anchor'>
                          {' '}
                            <span
                              onClick={() => {
                                setQuoteData(element);
                                setEditQuoteModal(true);
                              }}
                            >
                              <Icon.Edit />
                            </span>{' '}
                          </div>
                        </Label>
                      </Col>
                      <Col md="3">
                        <Label>
                        <PdfProjectQuote id={id} quoteId={element.quote_id}></PdfProjectQuote>
                        </Label>
                      </Col>
                      <Col md="2">
                        <Label>
                          <div color="primary" className='anchor'>
                            {' '}
                            <span
                              onClick={() => {
                                setQuote(element.quote_id);
                               
                                setAddLineItemModal(true);
                              }}
                            >
                              <Icon.PlusCircle />
                            </span>{' '}
                          </div>
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  {quotationsModal && (
                      <ViewQuoteLogModal
                        quotationsModal={quotationsModal}
                        setquotationsModal={setquotationsModal}
                        quoteId={element.quote_id}
                        id={id}
                      />
                    )}
                  <EditQuotation
                    editQuoteModal={editQuoteModal}
                    setEditQuoteModal={setEditQuoteModal}
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    lineItem={lineItem}
                    quoteId={element.quote_id}
                    projectInfo={id}
                  />
                   <AddLineItemModal
                  projectInfo={quote}
                  addLineItemModal={addLineItemModal}
                  setAddLineItemModal={setAddLineItemModal}
                ></AddLineItemModal>
                  {quotationViewLineItem && (
                    <QuotationViewLineItem
                    getQuotations={getQuotations}
                      quotationViewLineItem={quotationViewLineItem}
                      setQuotationViewLineItem={setQuotationViewLineItem}
                      quoteId={element.quote_id}
                      quoteData={quoteData}
                      id={id}
                      quote={quote}
                    />
                  )}
                </Col>
              </Row>
            );
          })}
      </Form>
     </>
  );
}