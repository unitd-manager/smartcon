import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import PdfProjectQuoteLog from '../PDF/PdfProjectQuoteLog';
// import TenderPdfQuoteLog from '../PDF/TenderPdfQuoteLog';

const ViewQuoteLogModal = ({ quotationsModal, setquotationsModal ,id}) => {
  ViewQuoteLogModal.propTypes = {
    quotationsModal: PropTypes.bool,
    setquotationsModal: PropTypes.func,
    id: PropTypes.any,
  };

  const [quoteLogViewLineItem, setQuoteLogViewLineItem] = useState(false);
  const [quote, setQuote] = useState([]);

  const getquotations = () => {
    api
      .post('/tender/getTabQuotelogById', { opportunity_id: id })
      .then(({ data: { data } }) => {
        const modifiedData = data.length > 1 ? data.slice(0, -1) : data;
        setQuote(modifiedData);
      })
      .catch(() => {});
  };
  
  const [quotation, setQuotelogLineItems] = useState([]);
  const QuotationViewLineItem = () => {
    api
      .post('/tender/getTabQuoteLineItems', { opportunity_id: id })
      .then((res) => {
        setQuotelogLineItems(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    QuotationViewLineItem();
  }, []);

  useEffect(() => {
    getquotations();
  }, [id]);
  return (
    <>
      <Modal size="xl" isOpen={quotationsModal}>
        <ModalHeader>
          <div>Quote History</div>
          <Button
            color="secondary"
            onClick={() => {
              setquotationsModal();
            }}
          >
            {' '}
            X{' '}
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Revision</Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Quote Code</Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Quote Date</Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Quote Status</Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Amount</Label>
                    </FormGroup>
                  </Col>
                  <Col></Col>
                  <Col>
                    <FormGroup>
                      <Label>Action</Label>{' '}
                    </FormGroup>
                  </Col>
                </Row>

                {quote &&
                  quote.map((element) => {
                    return (
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label>{element.revision}</Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label>{element.quote_code}</Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label>
                              {element.quote_date
                                ? moment(element.quote_date).format('DD-MM-YYYY')
                                : ''}
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label>{element.quote_status}</Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label>{element.amount}</Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label>
                              <span
                                className="addline"
                                onClick={() => {
                                  setQuoteLogViewLineItem(true);
                                  QuotationViewLineItem(element.quote_log_id);
                                }}
                              >
                                <u>View Line Items</u>
                              </span>
                            </Label>

                            <Modal size="xl" isOpen={quoteLogViewLineItem}>
                              <ModalHeader>View Quote Log Line Items</ModalHeader>
                              <ModalBody>
                                <FormGroup>
                                  <table className="lineitem">
                                    <thead>
                                      <tr>
                                        <th scope="col">Title </th>
                                        <th scope="col">Description </th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Updated By</th>
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

                          </FormGroup>
                        </Col>
                        <Col>
                           <FormGroup>
                            <Label>
                              <PdfProjectQuoteLog
                                logId={element.quote_log_id}
                                id={id}
                              ></PdfProjectQuoteLog>
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                    );
                  })}
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ViewQuoteLogModal;
