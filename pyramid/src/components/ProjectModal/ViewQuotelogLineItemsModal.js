import React, { useState, useEffect } from 'react';
import {
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
//import moment from 'moment';
import api from '../../constants/api';
//import QuoteLogViewLineItem from './QuoteLogViewLineItem';
//import PdfProjectQuoteLog from '../PDF/PdfProjectQuoteLog';

const ViewQuotelogLineItemsModal = ({ quoteLogViewLineItem, setQuoteLogViewLineItem, logId}) => {
  ViewQuotelogLineItemsModal.propTypes = {
    quoteLogViewLineItem: PropTypes.bool,
    setQuoteLogViewLineItem: PropTypes.func,
    logId:PropTypes.any,
  };




  const [quotation, setQuotelogLineItems] = useState();
  const QuotationViewLineItem = () => {
    api
      .post('/project/getTabQuoteLineItems', { quote_log_id: logId })
      .then((res) => {
        setQuotelogLineItems(res.data.data);
        console.log('tender', res.data.data);
      })
      .catch(() => {});
  };
  useEffect(() => {
    //QuotationViewLineItem();
  }, []);

  useEffect(() => {
    
    QuotationViewLineItem();
  }, []);
  return (
    <>

                           <Modal size="xl" isOpen={quoteLogViewLineItem}>
                              <ModalHeader>View Quote Log Line Items</ModalHeader>
                              <ModalBody>
                                <FormGroup>
                                  <table className="lineitem">
                                    <thead>
                                      <tr>
                                        <th scope="col">Title </th>
                                        <th scope="col">Description </th>
                                        <th scope="col">Qty </th>
                                        <th scope="col">Unit Price </th>
                                        <th scope="col">Amount</th>
                                      
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {quotation &&
                                        quotation.map((e) => {
                                          return (
                                            <tr>
                                              <td>{e.title}</td>
                                              <td>{e.description}</td>
                                              <td>{e.quantity}</td>
                                              <td>{e.unit_price}</td>
                                              <td>{e.amount}</td>
                                              <td></td>
                                              <td></td>
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
                                    setQuoteLogViewLineItem(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </Modal>
                  
                            {/* <QuoteLogViewLineItem
                                  quoteLogViewLineItem={quoteLogViewLineItem}
                                  setQuoteLogViewLineItem={setQuoteLogViewLineItem}
                                  ids={element.quote_log_id}
                                /> */}
                          
                          {/* <FormGroup>
                            <Label>
                              <PdfProjectQuoteLog
                                logId={element.quote_log_id}
                                id={id}
                              ></PdfProjectQuoteLog>
                            </Label>
                          </FormGroup> */}
                       
    </>
  );
};

export default ViewQuotelogLineItemsModal;
