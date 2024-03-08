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
  Label,
  Form,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import { id } from 'date-fns/locale';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
//import creationdatetime from '../../constants/creationdatetime';
import api from '../../constants/api';
import message from '../Message';
//import AppContext from '../../context/AppContext';

const EditQuotation = ({ editQuoteModal, setEditQuoteModal, quoteId, quoteData, projectInfo }) => {
  EditQuotation.propTypes = {
    editQuoteModal: PropTypes.bool,
    setEditQuoteModal: PropTypes.func,
    quoteData: PropTypes.object,
    //setQuoteData:PropTypes.object,
    quoteId: PropTypes.any,
    projectInfo: PropTypes.object,
  };
  const [previousquotationeditDetails, setPreviousQuotationeditDetails] = useState(null);
  const [lineItem, setLineItem] = useState([]);

  //const { loggedInuser } = useContext(AppContext);
  const [quotationeditDetails, setQuotationeditDetails] = useState({
    project_id: id,
    quote_id: id,
  });

  const handleQuoteInputs = (e) => {
    setQuotationeditDetails({ ...quotationeditDetails, [e.target.name]: e.target.value });
  };

  const getLineItem = () => {
    api.post('/project/getQuoteLineItemsById', { quote_id: quoteId }).then((res) => {
      setLineItem(res.data.data);
      console.log('lineItem', res.data.data);
    });
  };
  console.log('lineItem', quoteId);

  const saveCurrentDetails = () => {
    setPreviousQuotationeditDetails({ ...quotationeditDetails });
  };

  const handleDataEditor = (e, type) => {
    setQuotationeditDetails({
      ...quotationeditDetails,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    });
  };
  const [conditions, setConditions] = useState(EditorState.createEmpty()); // Initialize EditorState
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
  const fetchTermsAndConditions = () => {
    api
      .get('/setting/getSettingsForTerms')
      .then((res) => {
        const settings = res.data.data;
        if (settings && settings.length > 0) {
          const fetchedTermsAndCondition = settings[0].value; // Assuming 'value' holds the terms and conditions
          console.log('2', res.data.data);
          // Update the quote condition in quoteData
          setQuotationeditDetails({ ...quoteData, quote_condition: fetchedTermsAndCondition });
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
    // Other useEffect logic
  }, []);
  //Logic for edit data in db
  const insertquote = () => {
    //   const quoteDatas = {
    //   quote_date: previousquotationeditDetails.quote_date,
    //   quote_status: previousquotationeditDetails.quote_status,
    //   quote_code: previousquotationeditDetails.quote_code,
    //   quote_id: id,
    //   created_by: loggedInuser.first_name,
    //   creation_date: creationdatetime,
    // };

    quoteData.project_id = projectInfo;
    api.post('/project/insertLog', quoteData).then((res) => {
      message('quote inserted successfully.', 'success');
      lineItem.forEach((element) => {
        element.quote_log_id = res.data.data.insertId;

        api
          .post('/project/insertLogLine', element)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.error('Error inserting log line:', error);
          });
      });
    });
  };

  //Insert order for finance module
  const editQuotations = () => {
    const hasChanges =
      JSON.stringify(quotationeditDetails) !== JSON.stringify(previousquotationeditDetails);

    api
      .post('/projecttabquote/editTabQuote', quotationeditDetails)
      .then(() => {
        if (hasChanges) {
          insertquote();
        }

        // Save the current details as previousquotationeditDetails
        saveCurrentDetails();
        message('quote editted successfully.', 'success');
      })
      .catch(() => {
        message('Network connection error.');
      });
  };

  // const insertquote = () => {
  //   api
  //     .post('/projecttabquote/insertQuote', quotationeditDetails)
  //     .then(() => {
  //       message('quote inserted successfully.', 'success');
  //     })
  //     .catch(() => {
  //       message('Network connection error.', 'error');
  //     });
  // };

  useEffect(() => {
    setQuotationeditDetails(quoteData);
    convertHtmlToDraftcondition(quoteData);
    getLineItem();
  }, [quoteData]);
  return (
    <>
      <Modal size="lg" isOpen={editQuoteModal}>
        <ModalHeader>Edit Quote Display </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Form inline>
              <FormGroup>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Quote Date</Label>
                      <Input
                        type="date"
                        onChange={handleQuoteInputs}
                        value={
                          quotationeditDetails &&
                          moment(quotationeditDetails.quote_date).format('YYYY-MM-DD')
                        }
                        name="quote_date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Quote Status</Label>
                      <Input
                        type="text"
                        name="quote_status"
                        onChange={handleQuoteInputs}
                        value={quotationeditDetails && quotationeditDetails.quote_status}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Discount</Label>
                      <Input
                        type="text"
                        name="discount"
                        onChange={handleQuoteInputs}
                        value={quotationeditDetails && quotationeditDetails.discount}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  {/* <Col md="4">
                    <FormGroup>
                      <Label>Drawing Nos</Label>
                    </FormGroup>
                    <Input
                      className="form-check-input form-check-inline"
                      type="radio"
                      name="drawing_nos"
                      value="1"
                    />
                    <Label for="inlineradio1">yes</Label>{' '}
                    <Input
                      className="form-check-input form-check-inline"
                      type="radio"
                      name="drawing_nos"
                      value="0"
                    />
                    <Label for="inlineradio2">No</Label>{' '}
                  </Col> */}
                  <Col md="4">
                    <FormGroup>
                      <Label>Validity</Label>
                      <Input
                        type="text"
                        name="validity"
                        onChange={handleQuoteInputs}
                        value={quotationeditDetails && quotationeditDetails.validity}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Project Reference</Label>
                      <Input
                        type="text"
                        name="project_reference"
                        onChange={handleQuoteInputs}
                        value={quotationeditDetails && quotationeditDetails.project_reference}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Mode of Payment</Label>
                      <Input
                        type="select"
                        name="payment_method"
                        value={quotationeditDetails && quotationeditDetails.payment_method}
                        onChange={handleQuoteInputs}
                      >
                        <option value="">Please Select</option>
                        <option value="15 days">15 days</option>
                        <option defaultValue="selected" value="40 days">
                          40 days
                        </option>
                        <option value="60 days">60 days</option>
                        <option value="COD">COD</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Ref No</Label>
                      <Input
                        type="text"
                        name="ref_no_quote"
                        onChange={handleQuoteInputs}
                        value={quotationeditDetails && quotationeditDetails.ref_no_quote}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Quote Revision</Label>
                      <Input
                        type="text"
                        name="revision"
                        onChange={handleQuoteInputs}
                        value={quotationeditDetails && quotationeditDetails.revision}
                      />
                    </FormGroup>
                  </Col>
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
                  // Set initial content of the Editor to fetched terms and conditions
                  // initialContentState={quoteTermsAndCondition}
                />

                {/*                
                <Row>
                  <FormGroup>
                    <Label>Terms & Condition</Label>
                    <Input
                      type="textarea"
                      name="invoices_payment_terms"
                      onChange={handleQuoteInputs}
                      value={quotationeditDetails && quotationeditDetails.invoices_payment_terms}
                    />
                  </FormGroup>
                </Row> */}

                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      type="button"
                      color="primary"
                      className="btn shadow-none mr-2"
                      onClick={() => {
                        editQuotations();
                        setTimeout(() => {
                          setEditQuoteModal(false);
                        }, 500);
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
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
          </FormGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditQuotation;
