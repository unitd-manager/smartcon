import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import PropTypes from 'prop-types';
import moment from 'moment';
import Swal from 'sweetalert2';
// import styled from 'styled-components';
import api from '../../constants/api';
import AddLineItemModal from './AddLineItemModal';
import EditQuoteModal from './EditQuoteModal';
import ViewQuoteLogModal from './ViewQuoteLogModal';
import EditLineItemModal from './EditLineItemModal';
import PdfQuote from '../PDF/PdfQuote';
import PdfQuoteFormat2 from '../PDF/PdfQuoteFormat2';
import PdfQuoteFormat3 from '../PDF/PdfQuoteFormat3';
import PdfQuoteFormat4 from '../PDF/PdfQuoteFormat4';
import PdfQuoteFormat5 from '../PDF/PdfQuoteFormat5';
import AddRateItemModal from './AddRateItemModal';
import EditRateItemModal from './EditRateItemModal';

export default function TenderQuotation({
  tenderId,
  quote,
  lineItem,
  quotationsModal,
  setquotationsModal,
  rateModal,
  setRateModal,
  rateItem,
  getLineItem,
  getRateItem,
  setAddLineItemModal,
  setEditQuoteModal,
  viewLineModal,
  // viewLineToggle,
  editQuoteModal,
  addLineItemModal,
  project,
  id,
  setViewLineModal,
  generateCodes,
  handleQuoteForms,
  generateCode,
  getLine,
  getQuote,
}) {
  TenderQuotation.propTypes = {
    tenderId: PropTypes.object,
    lineItem: PropTypes.object,
    viewLineModal: PropTypes.object,
    getLineItem: PropTypes.object,
    getLine: PropTypes.object,
    // viewLineToggle: PropTypes.object,
    setEditQuoteModal: PropTypes.object,
    setAddLineItemModal: PropTypes.object,
    editQuoteModal: PropTypes.object,
    addLineItemModal: PropTypes.object,
    quotationsModal: PropTypes.object,
    setquotationsModal: PropTypes.object,
    rateModal: PropTypes.object,
    setRateModal: PropTypes.object,
    quote: PropTypes.object,
    project: PropTypes.array,
    id: PropTypes.any,
    setViewLineModal: PropTypes.any,
    handleQuoteForms: PropTypes.object,
    generateCode: PropTypes.object,
    generateCodes: PropTypes.object,
    getQuote: PropTypes.any,
    rateItem: PropTypes.object,
    getRateItem: PropTypes.any,
  };

  const [quoteDatas, setQuoteData] = useState([]);
  const [quoteLine, setQuoteLine] = useState();
  const [editLineModelItem, setEditLineModelItem] = useState(null);
  const [editLineModal, setEditLineModal] = useState(false);
  const [editRateModelItem, setEditRateModelItem] = useState(null);
  const [editRateModal, setEditRateModal] = useState(false);
  //const [selectedQuoteFormat, setSelectedQuoteFormat] = useState('format1')
  const [selectedFormat, setSelectedFormat] = useState('format1');

  console.log('quoteDatas', quoteDatas);
  console.log('quote', quote);

  const QuoteProject = project.find((element) => {
    return element.quote_id === quote.quote_id;
  });

  const deleteRecord = (deleteID) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/tender/deleteEditItem', { quote_items_id: deleteID }).then(() => {
          Swal.fire('Deleted!', 'Your Line Items has been deleted.', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        });
      }
    });
  };

  const deleteRateRecord = (deleteRateID) => {
    console.log('Delete Rate:', deleteRateID);
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/tender/deleteRateItem', { sub_con_rate_id: deleteRateID }).then(() => {
          Swal.fire('Deleted!', 'Your Rate Items has been deleted.', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        });
      }
    });
  };

  useEffect(() => {}, [tenderId]);

  const handleEditSuccess = () => {
    // Handle the refresh of the View Line Item Modal
    getLineItem(quote.quote_id);
    setViewLineModal(true);
  };

  // const handleEditRate = () => {
  //   // Handle the refresh of the View Line Item Modal
  //   getRateItem(quote.quote_id);

  // };

  // const handlePDFFormatChange = (event) => {
  //   setSelectedQuoteFormat(event.target.value); // Update the selected format
  // };

  //const [selectedFormat, setSelectedFormat] = useState('format1');

  useEffect(() => {
    getRateItem(quote.quote_id);
  }, [quote.quote_id]);

  console.log('rateItem:', rateItem);

  return (
    <div>
      <Row>
        {Object.keys(quote).length === 0 && (
          <Col md="2" className="mb-4 d-flex justify-content-between">
            <Button
              color="primary"
              className="shadow-none"
              onClick={(ele) => {
                if (window.confirm('Do you Like to Add Quote ?')) {
                  handleQuoteForms(ele);
                  generateCode(ele);
                                  // Set the default format to 'format1' when the button is clicked
                setSelectedFormat('format1');
                }
              }}
            >
              Add Quote
            </Button>
          </Col>
        )}
        {Object.keys(quote).length !== 0 && (
          <>
            <Col md="2" className="mb-4 d-flex justify-content-between">
              <Button
                color="primary"
                className="shadow-none"
                onClick={() => {
                  setquotationsModal(true);
                }}
              >
                View Quote Log
              </Button>
            </Col>

            <Col md="2" className="mb-4 d-flex justify-content-between">
              <Button
                color="primary"
                className="shadow-none"
                onClick={() => {
                  setQuoteLine(quote.quote_id);
                  setRateModal(true);
                }}
              >
                Add Subcon Rate
              </Button>
            </Col>
          </>
        )}
        {QuoteProject === undefined && quote.quote_status === 'Awarded' && (
          <Col md="2" className="mb-4 d-flex justify-content-between">
            <Button
              color="primary"
              className="shadow-none"
              style={{ width: '100%' }}
              onClick={() => {
                if (window.confirm('Do you like to Convert to Project?')) {
                  //insertProject();
                  generateCodes();
                }
              }}
            >
              Convert Opp To Project
            </Button>
          </Col>
        )}

        {quote && QuoteProject !== undefined && (
          <Col md="2" className="mb-4 d-flex justify-content-between">
            <Link to={`/ProjectEdit/${QuoteProject && QuoteProject.project_id}?tab=1`}>
              {' '}
              <Button color="primary" className="shadow-none">
                Go to Project
              </Button>
            </Link>
          </Col>
        )}
      </Row>

      {/* End View Line Item Modal */}
      <EditLineItemModal
        editLineModal={editLineModal}
        setEditLineModal={setEditLineModal}
        FetchLineItemData={editLineModelItem}
        getLineItem={getLineItem}
        setViewLineModal={setViewLineModal}
        onEditSuccess={handleEditSuccess}
      >
        {' '}
      </EditLineItemModal>

      {rateModal && (
        <AddRateItemModal
          projectInfo={tenderId}
          rateModal={rateModal}
          setRateModal={setRateModal}
          quoteLine={quoteLine}
        ></AddRateItemModal>
      )}
      {/* Call View Quote Log Modal */}
      {quotationsModal && (
        <ViewQuoteLogModal
          quotationsModal={quotationsModal}
          setquotationsModal={setquotationsModal}
          quoteId={quote.quote_id}
          id={tenderId}
        />
      )}

      {Object.keys(quote).length !== 0 && (
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
                <Label>Discount</Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Amount</Label>{' '}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup></FormGroup>
            </Col>
            <Col>
              <FormGroup></FormGroup>
            </Col>
            <Col md="1">
              <FormGroup>
                <Label>Action</Label>{' '}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label>{quote && quote.revision}</Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>
                  <u>{quote && quote.quote_code}</u>
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>
                  {quote.quote_date ? moment(quote.quote_date).format('DD MMM YY') : ''}
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>{quote && quote.quote_status}</Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>{quote && quote.discount}</Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>{quote && quote.totalamount - quote.discount}</Label>
              </FormGroup>
            </Col>

            <Col md="2">
              <Label className="anchor">
                <u
                  onClick={() => {
                    getLineItem(quote.quote_id);
                    setViewLineModal(true);
                  }}
                >
                  View Line Items
                </u>
              </Label>

              <Modal size="xl" isOpen={viewLineModal} toggle={() => setViewLineModal(false)}>
                <ModalHeader toggle={() => setViewLineModal(false)}>Line Items</ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <table className="lineitem border border-secondary rounded">
                      <thead>
                        <tr>
                          <th scope="col">Title </th>
                          <th scope="col">Description </th>
                          <th scope="col">Qty </th>
                          <th scope="col">Unit Price </th>
                          <th scope="col">Amount</th>
                          <th scope="col">Updated By </th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItem &&
                          lineItem.map((e) => {
                            return (
                              <tr>
                                <td data-label="Title">{e.title}</td>
                                <td data-label="Description">{e.description}</td>
                                <td data-label="Quantity">{e.quantity}</td>
                                <td data-label="Unit Price">{e.unit_price}</td>
                                <td data-label="Amount">{e.amount}</td>
                                <td data-label="Updated By">
                                  {e.created_by} {e.creation_date}
                                </td>
                                {quote && QuoteProject === undefined && (
                                  <td data-label="Actions">
                                    <span
                                      className="addline pointer"
                                      onClick={() => {
                                        setEditLineModelItem(e);
                                        setEditLineModal(true);
                                      }}
                                    >
                                      <Icon.Edit2 />
                                    </span>
                                    <span
                                      className="addline pointer"
                                      onClick={() => {
                                        deleteRecord(e.quote_items_id);
                                      }}
                                    >
                                      <Icon.Trash2 />
                                    </span>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </FormGroup>
                </ModalBody>
              </Modal>
            </Col>

            <Col>
              <FormGroup>
                <Row>
                  {QuoteProject === undefined && (
                    <Col md="4">
                      <Label>
                        <span
                          className="addline pointer"
                          onClick={() => {
                            setEditQuoteModal(true);
                            // setQuoteData(quote);
                            setQuoteData(lineItem.quote_id);
                            getLineItem(quote.quote_id);
                          }}
                        >
                          <Icon.Edit />
                        </span>
                      </Label>
                    </Col>
                  )}
                  {/* {Object.keys(quote.quote_format === 'format1').length === 0 && ( */}
               
                <>
                  {QuoteProject === undefined && quote.quote_format === 'format1' && (
                    <Col md="4">
                      <Label className="pointer">
                      {/* {selectedFormat === 'format1' && <PdfQuote quoteId={quote.quote_id} id={id}></PdfQuote>} */}
                         <PdfQuote quoteId={quote.quote_id} id={id} ></PdfQuote> 
                        {/* <PdfQuoteFormat2 quoteId={quote.quote_id} id={id}></PdfQuoteFormat2> */}
                        {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                      </Label>
                    </Col>
                  )}
                  </>
               
                  {/* {Object.keys(quote.quote_format === 'format2').length !== 0 && ( */}
                  {/* //{QuoteProject === undefined && quote.quote_format === 'format2' && ( */}
                  {QuoteProject === undefined && quote.quote_format === 'format2' && (
                    <Col md="4">
                      <Label className="pointer">
                        <PdfQuoteFormat2 quoteId={quote.quote_id} id={id}></PdfQuoteFormat2>
                        {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                      </Label>
                    </Col>
                  )}
                  {/* {Object.keys(quote.quote_format === 'format3').length !== 0 && ( */}
                  {QuoteProject === undefined && quote.quote_format === 'format3' && (
                    <Col md="4">
                      <Label className="pointer">
                        <PdfQuoteFormat3 quoteId={quote.quote_id} id={id}></PdfQuoteFormat3>
                        {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                      </Label>
                    </Col>
                  )}
                  {/* {Object.keys(quote.quote_format === 'format4').length !== 0 && ( */}
                  {QuoteProject === undefined && quote.quote_format === 'format4' && (
                    <Col md="4">
                      <Label className="pointer">
                        <PdfQuoteFormat4 quoteId={quote.quote_id} id={id}></PdfQuoteFormat4>
                        {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                      </Label>
                    </Col>
                  )}

                  {/* <Col md="4">
                    <Label className='pointer'>
                      <PdfQuoteFormat3 quoteId={quote.quote_id} id={id} ></PdfQuoteFormat3> */}
                  {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                  {/* </Label>
                  </Col> */}
                  {/* <Col md="4">
                    <Label className='pointer'>
                      <PdfQuoteFormat4 quoteId={quote.quote_id} id={id} ></PdfQuoteFormat4> */}
                  {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                  {/* </Label>
                  </Col> */}
                  {/* {Object.keys(quote.quote_format === 'format5').length !== 0 && ( */}
                  {QuoteProject === undefined && quote.quote_format === 'format5' && (
                    <Col md="4">
                      <Label className="pointer">
                        <PdfQuoteFormat5 quoteId={quote.quote_id} id={id}></PdfQuoteFormat5>
                        {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                      </Label>
                    </Col>
                  )}



{/* {Object.keys(quote.quote_format === 'format5').length !== 0 && (
  <Col md="4">
    <Label className="pointer">
      {selectedFormat === 'format1' && <PdfQuote quoteId={quote.quote_id} id={id}></PdfQuote>}
      {selectedFormat === 'format2' && <PdfQuoteFormat2 quoteId={quote.quote_id} id={id}></PdfQuoteFormat2>}
      {selectedFormat === 'format3' && <PdfQuoteFormat3 quoteId={quote.quote_id} id={id}></PdfQuoteFormat3>}
      {selectedFormat === 'format4' && <PdfQuoteFormat4 quoteId={quote.quote_id} id={id}></PdfQuoteFormat4>}
      {selectedFormat === 'format5' && <PdfQuoteFormat5 quoteId={quote.quote_id} id={id}></PdfQuoteFormat5>}
    </Label>
  </Col>
)} */}
                  {/* {Object.keys(quote).length !== 0 && (
<Col md="4">
  <Label className='pointer'>
    {selectedFormat === 'format1' && <PdfQuote quoteId={quote.quote_id} id={id} />}
    {selectedFormat === 'format2' && <PdfQuoteFormat2 quoteId={quote.quote_id} id={id} />}
    {selectedFormat === 'format3' && <PdfQuoteFormat3 quoteId={quote.quote_id} id={id} />}
    {selectedFormat === 'format4' && <PdfQuoteFormat4 quoteId={quote.quote_id} id={id} />}
    {selectedFormat === 'format5' && <PdfQuoteFormat5 quoteId={quote.quote_id} id={id} />}
  </Label>
</Col>
)} */}
                  {project && QuoteProject === undefined && (
                    <Col md="4">
                      <Label>
                        <span
                          className="addline pointer"
                          onClick={() => {
                            setQuoteLine(quote.quote_id);
                            setAddLineItemModal(true);
                          }}
                        >
                          <Icon.PlusCircle />
                        </span>
                      </Label>
                    </Col>
                  )}
                </Row>
              </FormGroup>
            </Col>

            <CardTitle tag="h4" className="border-bottom bg-secondary p-2 mb-0 text-white">
              {' '}
              Subcontract Rate{' '}
            </CardTitle>
            <FormGroup>
              {console.log('rateItem:', rateItem)}

              <table className="lineitem border border-secondary rounded">
                <thead>
                  <tr>
                    <th scope="col">Designation</th>
                    <th scope="col">Mon-Fri Normal</th>
                    <th scope="col">Mon-Fri OT</th>
                    <th scope="col">Mon-Sat Normal</th>
                    <th scope="col">Public Holiday</th>
                    <th scope="col">Meal Chargeable</th>
                    <th scope="col">Shift Allowance</th>
                    <th scope="col">Updated By</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rateItem &&
                    rateItem.map((e) => {
                      return (
                        <tr>
                          <td data-label="Designation">{e.designation}</td>
                          <td data-label="Mon-Fri Normal">{e.mon_to_fri_normal_hr}</td>
                          <td data-label="Mon-Fri OT">{e.mon_to_fri_ot_hr}</td>
                          <td data-label="Mon-Sat Normal">{e.mon_to_sat_normal_hr}</td>
                          <td data-label="Public Holiday">{e.sunday_public_holiday}</td>
                          <td data-label="Meal Chargeable">{e.meal_chargeable}</td>
                          <td data-label="Shift Allowance">{e.night_shift_allowance}</td>
                          <td data-label="Updated By">
                            {e.created_by} {e.creation_date}
                          </td>
                          {quote && QuoteProject === undefined && (
                            <td data-label="Actions">
                              <span
                                className="addline pointer"
                                onClick={() => {
                                  setEditRateModelItem(e);
                                  setEditRateModal(true);
                                }}
                              >
                                <Icon.Edit2 />
                              </span>
                              <span
                                className="addline pointer"
                                onClick={() => {
                                  console.log('Clicked Element ID:', e.sub_con_rate_id);
                                  deleteRateRecord(e.sub_con_rate_id);
                                }}
                              >
                                <Icon.Trash2 />
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </FormGroup>
          </Row>
        </Form>
      )}
      {editQuoteModal && (
        <EditQuoteModal
          lineItem={lineItem}
          getLine={getLine}
          editQuoteModal={editQuoteModal}
          setEditQuoteModal={setEditQuoteModal}
          quoteDatas={quote}
          getQuoteFun={getQuote}
          //setSelectedQuoteFormat={setSelectedQuoteFormat}
          //handlePDFFormatChange={handlePDFFormatChange}
          QuoteProject={QuoteProject}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          quote={quote}
        ></EditQuoteModal>
      )}
      {addLineItemModal && (
        <AddLineItemModal
          projectInfo={tenderId}
          addLineItemModal={addLineItemModal}
          setAddLineItemModal={setAddLineItemModal}
          quoteLine={quoteLine}
          selectedFormat={selectedFormat}
          quote={quote}
        ></AddLineItemModal>
      )}
      <EditRateItemModal
        editRateModal={editRateModal}
        setEditRateModal={setEditRateModal}
        FetchRateItemData={editRateModelItem}
        rateItem={rateItem}
      >
        {' '}
      </EditRateItemModal>
    </div>
  );
}
