import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Form,
} from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import moment from 'moment';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import api from '../../constants/api';
import message from '../Message';

const EditQuoteModal = ({
  editQuoteModal,
  setEditQuoteModal,
  quoteDatas,
  lineItem,
  getQuoteFun,
  //setSelectedQuoteFormat,
  //handlePDFFormatChange,
  //QuoteProject,
  selectedFormat,
  setSelectedFormat,
}) => {
  EditQuoteModal.propTypes = {
    editQuoteModal: PropTypes.bool,
    setEditQuoteModal: PropTypes.func,
    quoteDatas: PropTypes.object,
    lineItem: PropTypes.object,
    getQuoteFun: PropTypes.any,
    //setSelectedQuoteFormat: PropTypes.any,
    //handlePDFFormatChange:PropTypes.func,
    //QuoteProject:PropTypes.func,
    selectedFormat: PropTypes.any,
    setSelectedFormat: PropTypes.any,
  };

  const { id } = useParams();
  console.log('win', lineItem);
  //   Get Quote Edited Value

  const [quoteData, setQuoteData] = useState(quoteDatas);
  const [quoteDatas1, setQuoteDatas] = useState('');
  const [conditions, setConditions] = useState('');
  const [lineItems, setLineItem] = useState('');
  // const [selectedQuoteFormat, setSelectedQuoteFormat] = useState('')

  const handleFormatChange = (e) => {
    setQuoteData({ ...quoteData, [e.target.name]: e.target.value });
    const selectedValue = e.target.value;
    setSelectedFormat(selectedValue); // Always set selected format

    // // Check if the selected format requires PDF format change
    // // if (selectedValue === 'format2' || selectedValue === 'format3' || selectedValue === 'format4' || selectedValue === 'format5') {
    //   handlePDFFormatChange(e); // Call handlePDFFormatChange
    // // }
  };

  const handleData = (e) => {
    setQuoteData({ ...quoteData, [e.target.name]: e.target.value });
    //setSelectedFormat(e.target.value);
  };

  const getQuote = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuoteData(res.data.data[0]);
    });
  };

  console.log("quote",quoteDatas1);
  const handleData1 = (e) => {
    setQuoteData({ ...quoteData, [e.target.name]: e.target.value });
    
    
  };
  const getQuote1 = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuoteDatas(res.data.data[0]);
    });
  };
  const fetchTermsAndConditions = () => {
    api
      .get('/setting/getSettingsForTerms')
      .then((res) => {
        const settings = res.data.data;
        if (settings && settings.length > 0) {
          const fetchedTermsAndCondition = settings[0].value; // Assuming 'value' holds the terms and conditions
          console.log('1', res.data.data);
          // Update the quote condition in quoteData
          setQuoteData({ ...quoteData, quote_condition: fetchedTermsAndCondition });
          // Convert fetched terms and conditions to EditorState
          const contentBlock = htmlToDraft(fetchedTermsAndCondition);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setConditions(editorState);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching terms and conditions:', error);
      });
  };

  const fetchTermsAndConditions1 = () => {
    api
      .get('/setting/getSettingsForJobScope')
      .then((res) => {
        const settings = res.data.data;
        if (settings && settings.length > 0) {
          const fetchedTermsAndCondition = settings[0].value; // Assuming 'value' holds the terms and conditions
          console.log('1', res.data.data);
          // Update the quote condition in quoteData
          setQuoteData({ ...quoteData, job_scope: fetchedTermsAndCondition });
          // Convert fetched terms and conditions to EditorState
          const contentBlock = htmlToDraft(fetchedTermsAndCondition);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setConditions(editorState);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching terms and conditions:', error);
      });
  };
  // Call fetchTermsAndConditions within useEffect or when required
  useEffect(() => {
    fetchTermsAndConditions();
    fetchTermsAndConditions1();
    // Other useEffect logic
  }, []);

  const insertquote = () => {
    api.post('/tender/insertLog', quoteData).then((res) => {
      message('quote inserted successfully.', 'success');
      lineItem.forEach((element) => {
        element.quote_log_id = res.data.data.insertId;
        api.post('/tender/insertLogLine', element).then(() => {
          getQuoteFun();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      });
    });
  };
  const GetEditQuote = () => {
    api
      .post('/tender/edit-TabQuote', quoteData)
      .then(() => {
        message('Quote Edited Successfully.', 'success');
        getQuoteFun();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        message('Unable to edit quote. please fill all fields', 'error');
      });
  };

  const handleDataEditor = (e, type) => {
    setQuoteData({ ...quoteData, [type]: draftToHtml(convertToRaw(e.getCurrentContent())) });
  };

  const convertHtmlToDraftcondition = (existingQuoteformal) => {
    if (existingQuoteformal && existingQuoteformal.quote_condition) {
      const contentBlock = htmlToDraft(existingQuoteformal && existingQuoteformal.quote_condition);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setConditions(editorState);
      }
    }
  };

  const convertHtmlToDraft = (existingQuoteformal) => {
    if (existingQuoteformal && existingQuoteformal.job_scope) {
      const contentBlock = htmlToDraft(existingQuoteformal && existingQuoteformal.job_scope);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setLineItem(editorState);
      }
    }
  };
  useEffect(() => {
    setQuoteData(quoteDatas);
    getQuote();
    getQuote1();
    convertHtmlToDraftcondition(quoteDatas);
    convertHtmlToDraft(quoteDatas);
  }, [quoteDatas]);

  return (
    <>
      {/*  Edit Quote Modal */}
      <Modal size="lg" isOpen={editQuoteModal}>
        <ModalHeader>
          Edit Quote
          <Button
            color="secondary"
            onClick={() => {
              setEditQuoteModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {/* Add dropdown for selecting format */}
              <Label>Select Format:</Label>
              <Input
                type="select"
                onChange={handleFormatChange}
                value={quoteData && quoteData.quote_format}
                //value={selectedFormat}
                name="quote_format"
              >
                <option value="">Please Select</option>
                <option value="format1">Format 1</option> 
                <option value="format2">Format 2</option>
                <option value="format3">Format 3</option>
                <option value="format4">Format 4</option>
                <option value="format5">Format 5</option>
              </Input>
            </FormGroup>
            {/* Render basic fields */}
           
         
            <FormGroup>
            {/* {selectedFormat !== 'format2' && (
                   <> */}
              <Row>                
                <Col md="4">
                  <FormGroup>
                    <Label>Quote Date</Label>
                    <Input
                      type="date"
                      name="quote_date"
                      value={quoteData ? moment(quoteData.quote_date).format('YYYY-MM-DD') : ''}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label> Quote Status</Label>
                    <Input
                      value={quoteData && quoteData.quote_status}
                      type="select"
                      onChange={handleData}
                      name="quote_status"
                    >
                      <option selected="selected" value="New">
                        New
                      </option>
                      <option value="Quoted">Quoted</option>
                      <option value="Awarded">Awarded</option>
                      <option value="Not Awarded">Not Awarded</option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Discount</Label>
                    <Input
                      type="text"
                      name="discount"
                      defaultValue={(quoteData && quoteData.discount) || 0}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Validity</Label>
                    <Input
                      type="text"
                      name="validity"
                      defaultValue={quoteData && quoteData.validity}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Project Reference</Label>
                    <Input
                      type="text"
                      name="project_reference"
                      defaultValue={quoteData && quoteData.project_reference}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Terms of Payment</Label>
                    <Input
                      type="select"
                      name="payment_method"
                      defaultValue={quoteData && quoteData.payment_method}
                      onChange={handleData}
                    >
                      <option value="">Please Select</option>
                      <option value="15 days">15 days</option>
                      <option selected="selected" value="30 days">
                        30 days
                      </option>
                      <option value="60 days">60 days</option>
                      <option value="COD">COD</option>
                    </Input>
                  </FormGroup>
                  </Col>
                  </Row>
                  {/* </>
                  )} */}
            
            
           
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Our Reference</Label>
                    <Input
                      type="text"
                      name="our_reference"
                      defaultValue={quoteData && quoteData.our_reference}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Ref No</Label>
                    <Input
                      type="text"
                      name="ref_no_quote"
                      defaultValue={quoteData && quoteData.ref_no_quote}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Quote Revision</Label>
                    <Input
                      type="text"
                      name="revision"
                      defaultValue={quoteData && quoteData.revision}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>

                {/* Render additional fields based on selected format */}

                {(selectedFormat && quoteData.quote_format === 'format2' || selectedFormat && quoteData.quote_format === 'format5') && (
                
                  <>
                    <Col md="4">
                      <FormGroup>
                        <Label>Invoices & Payment</Label>
                        <Input
                          type="textarea"
                          name="invoices_payment_terms"
                          defaultValue={quoteData && quoteData.invoices_payment_terms}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Notice of Termination</Label>
                        <Input
                          type="text"
                          name="notice_of_termination"
                          defaultValue={quoteData && quoteData.notice_of_termination}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Taxes</Label>
                        <Input
                          type="textarea"
                          name="taxes"
                          defaultValue={quoteData && quoteData.taxes}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                  </>
                )}

                {selectedFormat && quoteData.quote_format === 'format4' && (
                  <>
                    <Col md="4">
                      <FormGroup>
                        <Label>External Notes</Label>
                        <Input
                          type="textarea"
                          name="external_notes"
                          defaultValue={quoteData && quoteData.external_notes}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                  </>
                )}

                {selectedFormat && quoteData.quote_format === 'format5' && (
                  <>
                    <Col md="4">
                      <FormGroup>
                        <Label>General</Label>
                        <Input
                          type="textarea"
                          name="general"
                          defaultValue={quoteData && quoteData.general}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Scope Of Works</Label>
                        <Input
                          type="text"
                          name="scope_of_works"
                          defaultValue={quoteData && quoteData.scope_of_works}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Commencement & Completion Date</Label>
                        <Input
                          type="text"
                          name="commencement_and_completion"
                          defaultValue={quoteData && quoteData.commencement_and_completion}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Safety</Label>
                        <Input
                          type="text"
                          name="safety"
                          defaultValue={quoteData && quoteData.safety}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Insurance</Label>
                        <Input
                          type="text"
                          name="insurance"
                          defaultValue={quoteData && quoteData.insurance}
                          onChange={handleData1}
                        />
                      </FormGroup>
                    </Col>
                  </>
                )}
              </Row>
              <Row>
                <Label>Terms & Condition</Label>
              </Row>
              <Editor
                editorState={conditions}
                wrapperClassName="demo-wrapper mb-0"
                editorClassName="demo-editor border mb-4 edi-height"
                onEditorStateChange={(e) => {
                  handleDataEditor(e, 'quote_condition');
                  setConditions(e);
                }}
              />
              {selectedFormat === 'format3' && (
                <>
                  <Row>
                    <Label>JOB SCOPE</Label>
                  </Row>
                  <Editor
                    editorState={lineItems}
                    wrapperClassName="demo-wrapper mb-0"
                    editorClassName="demo-editor border mb-4 edi-height"
                    onEditorStateChange={(e) => {
                      handleDataEditor(e, 'job_scope');
                      setLineItem(e);
                    }}
                  />
                </>
              )}
              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="btn shadow-none mr-2"
                    onClick={() => {
                      insertquote();
                      GetEditQuote();
                      // setQuoteData();
                      //setSelectedQuoteFormat(selectedFormat);
                      setEditQuoteModal(false);

                      //insertquoteLogLine();
                    }}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    color="secondary"
                    className="shadow-none"
                    onClick={() => {
                      setEditQuoteModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Row>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      {/* END Edit Quote Modal */}
    </>
  );
};

export default EditQuoteModal;
