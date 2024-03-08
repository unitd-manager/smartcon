import React, { useEffect, useState,useContext } from 'react';
import { TabContent, TabPane, Col, Label, FormGroup, Row, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AddCostingSummaryModal from '../../components/TenderTable/AddCostingSummaryModal';
import EditCostingSummaryModal from '../../components/TenderTable/EditCostingSummaryModal';
import TenderQuotation from '../../components/TenderTable/TenderQuotation';
import TenderMoreDetails from '../../components/TenderTable/TenderMoreDetails';
import TenderAttachment from '../../components/TenderTable/TenderAttachment';
import Tab from '../../components/project/Tab';
import ApiButton from '../../components/ApiButton';
import AppContext from '../../context/AppContext';

const OpportunityEdit = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [costingsummary, setCostingSummary] = useState([]);
  const [quote, setQuote] = useState({});
  const [lineItem, setLineItem] = useState([]);
  const [rateItem, setRateItem] = useState([]);
  const [tenderDetails, setTenderDetails] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { loggedInuser } = useContext(AppContext);

  // Start for tab refresh navigation #Renuka 1-06-23
  const tabs = [
    { id: '1', name: 'Quotations' },
    { id: '2', name: 'Costing Summary' },
    { id: '3', name: 'Attachment' },
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  };
  // End for tab refresh navigation #Renuka 1-06-23

  const [editCostingSummaryModel, setEditCostingSummaryModel] = useState(false);
  const [addCostingSummaryModel, setAddCostingSummaryModel] = useState(false);
  const [costingcostingDetails, setCostingChargesDetails] = useState();
  const [quotationsModal, setquotationsModal] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [viewLineModal, setViewLineModal] = useState(false);
  const [addContactModal, setAddContactModal] = useState(false);
  const [addCompanyModal, setAddCompanyModal] = useState(false);
  const [editQuoteModal, setEditQuoteModal] = useState(false);
  //const [editLineModal, setEditLineModal] = useState(false);
  const [contact, setContact] = useState();
  const [company, setCompany] = useState();
  const [incharge, setIncharge] = useState();
  const [quotes, setQuotes] = useState();
  const [selectedCompany, setSelectedCompany] = useState();
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [project, setProject] = useState([]);
  const [allCountries, setallCountries] = useState();
  //const [editLineModelItem, setEditLineModelItem] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    quote_date: '',
    quote_code: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  // const applyChanges = () => {};
  const backToList = () => {
    navigate('/Opportunity');
  };

  const viewLineToggle = () => {
    setViewLineModal(!viewLineModal);
  };
  const addContactToggle = () => {
    setAddContactModal(!addContactModal);
  };
  const addCompanyToggle = () => {
    setAddCompanyModal(!addCompanyModal);
  };

  // Get Costing Summary Data
  const getCostingbySummary = () => {
    api.post('/tender/getTabCostingSummaryById', { opportunity_id: id }).then((res) => {
      setCostingSummary(res.data.data);
      //seteditCostingSummaryData(res.data.data)
    });
  };
  const [costingsummaries, setCostingSummaries] = useState([]);

  const getCostingbySummaries = () => {
    api.post('/tender/getTabCostingSummaryById', { opportunity_id: id }).then((res) => {
      setCostingSummaries(res.data.data[0]);
      //seteditCostingSummaryData(res.data.data)
    });
  };

  // Get Company Data
  const getCompany = () => {
    api.get('/company/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuote(res.data.data[0]);
    });
  };

  //Logic for adding company in db

  const [companyInsertData, setCompanyInsertData] = useState({
    company_name: '',
    address_street: '',
    address_town: '',
    address_country: 'Singapore',
    address_po_code: '',
    phone: '',
    fax: '',
    website: '',
    supplier_type: '',
    industry: '',
    company_size: '',
    source: '',
  });

  const companyhandleInputs = (e) => {
    console.log("companyhandleInputs",{ ...companyInsertData, [e.target.name]: e.target.value })
    setCompanyInsertData({ ...companyInsertData, [e.target.name]: e.target.value });
  };

  // Insert Company
  const insertCompany = () => {
    if (
      companyInsertData.company_name !== '' &&
      companyInsertData.address_street !== '' &&
      companyInsertData.address_po_code !== '' &&
      companyInsertData.address_country !== ''
    ) {
      api
        .post('/company/insertCompany', companyInsertData)
        .then(() => {
          message('Company inserted successfully.', 'success');
          getCompany();
          addCompanyToggle(null)
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'warning');
      setFormSubmitted(true)
    }
  };

  const getContact = (companyId) => {
    setSelectedCompany(companyId);
    api.post('/company/getContactByCompanyId', { company_id: companyId }).then((res) => {
      setContact(res.data.data);
    });
  };

  // Get Incharge
  const getIncharge = () => {
    api.get('/tender/projectIncharge').then((res) => {
      setIncharge(res.data.data);
    });
  };

  // Get Tenders By Id

  const editTenderById = () => {
    api.post('/tender/getTendersById', { opportunity_id: id }).then((res) => {
      setTenderDetails(res.data.data);
      console.log("created_by",res.data.data)
      //getContact(res.data.data.company_id);
    });
  };

  const handleInputs = (e) => {
    setTenderDetails({ ...tenderDetails, [e.target.name]: e.target.value });
  };

  //Logic for edit data in db

  const editTenderData = () => {

    if (tenderDetails.title !== '') {
      tenderDetails.modification_date = creationdatetime;
      tenderDetails.modified_by = loggedInuser.first_name;

    api.post('/tender/edit-Tenders', tenderDetails)
      .then(() => {

        message('Record editted successfully', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
    }
    else{
      message('Please fill all required fields', 'warning');
    }
  };

  // Add new Contact

  const [newContactData, setNewContactData] = useState({
    salutation: '',
    first_name: '',
    email: '',
    position: '',
    department: '',
    phone_direct: '',
    fax: '',
    mobile: '',
  });

  const handleAddNewContact = (e) => {
    setNewContactData({ ...newContactData, [e.target.name]: e.target.value });
  };

  const AddNewContact = () => {
    const newDataWithCompanyId = newContactData;
    newDataWithCompanyId.company_id = selectedCompany;
    if (
      newDataWithCompanyId.salutation !== '' &&
      newDataWithCompanyId.first_name !== ''

    ) {
      api
        .post('/tender/insertContact', newDataWithCompanyId)
        .then(() => {
          getContact(newDataWithCompanyId.company_id);
          message('Contact Inserted Successfully', 'success');
          getCompany();
          addContactToggle(null)
        })
        .catch(() => {
          message('Unable to add Contact! try again later', 'error');
        });
    } else {
      setFormSubmitted(true)
      message('All fields are required.', 'warning');
    }
  };

  //Api for getting all countries
  const getAllCountries = () => {
    api.get('/clients/getCountry').then((res) => {
      setallCountries(res.data.data);
    });
  };

  // Get Line Item
  const getLineItem = (quotationId) => {
    api.post('/tender/getQuoteLineItemsById', { quote_id: quotationId }).then((res) => {
      setLineItem(res.data.data);
      console.log('Error fetching line items111111:', quotationId);

    })
    .catch((error) => {
      console.error('Error fetching line items:', error);
      message('LineItem Data not found', 'info');
    });
  };


  
  const getRateItem = (quotationId) => {
    api.post('/tender/getRateItemsById', { quote_id: quotationId }).then((res) => {
      setRateItem(res.data.data);
      console.log('rate', res.data.data)
      console.log('Error fetching line items111111:', quotationId);

    })
    .catch((error) => {
      console.error('Error fetching line items:', error);
      message('LineItem Data not found', 'info');
    });
  };

  // Get Line Item
  const getLine = (quoteId) => {
    api.post('/tender/getTabQuotelogsById', { quote_id: quoteId }).then((res) => {
      setQuotes(res.data.data);
    });
  };

  const handleQuoteForms = (ele) => {
    setQuoteForm({ ...quoteForm, [ele.target.name]: ele.target.value });
  };
  //Add Quote
  const insertQuote = (code) => {
    const newQuoteId = quoteForm;
    newQuoteId.opportunity_id = id;
    newQuoteId.quote_code = code;
    api.post('/tender/insertquote', newQuoteId).then(() => {
      message('Quote inserted successfully.', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  };
  //QUOTE GENERATED CODE
  const generateCode = () => {
    api
      .post('/tender/getCodeValue', { type: 'quote' })
      .then((res) => {
        insertQuote(res.data.data);
      })
      .catch(() => {
        insertQuote('');
      });
  };

  const getProject = () => {
    api.get('project/getOppProject').then((res) => {
      setProject(res.data.data);
    });
  };
  //Add new Project
  const insertProject = (code) => {
    const newDataWithCompanyId = tenderDetails;
    newDataWithCompanyId.quote_id = quote.quote_id;
    newDataWithCompanyId.project_code = code;
    api.post('/project/insertProject', newDataWithCompanyId).then((response) => {

      const projectId = response.data.data.insertId;

      const newDataWithId = costingsummaries;
      newDataWithId.project_id = projectId;
      api.post('/project/insertCostingSummary', newDataWithId).then(() => {
  
        // setTimeout(() => {
        //   window.location.reload();
        // }, 300);
      });

      const updateQuoteData = {
        project_id: projectId,
        quote_id: quote.quote_id,
        opportunity_id: newDataWithCompanyId.opportunity_id,
      };
  
      api.post('/project/updateQuote', updateQuoteData).then(() => {
        message('Project Converted Successfully', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      });
    });
  };

  const getCostingSummaryChargesById = () => {
    api
      .post('/tender/getTabOpportunityCostingSummary', {
        opportunity_id: id,
      })
      .then((res) => {
        setCostingChargesDetails(res.data.data);
      });
  };
  //Project GENERATED CODE
  const generateCodes = () => {
    api
      .post('/tender/getCodeValue', { type: 'opportunityproject' })
      .then((res) => {
        insertProject(res.data.data);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        insertProject('');
      });
  };

  //  deleteRecord
  const deleteOpportunity = () => {

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
        api
          .post('/tender/deleteTender', { opportunity_id: id })
          .then(() => {
            Swal.fire('Deleted!', 'Your opportunity has been deleted.', 'success');
            backToList();
          });
      }
    });
  };

  useEffect(() => {
    getCostingbySummary();
    editTenderById();
    getQuote();
    getIncharge();
    getCompany();
    getProject();
    getAllCountries();
    getCostingSummaryChargesById();
    getCostingbySummaries();
  }, [id]);

  return (
    <>
      <BreadCrumbs heading={tenderDetails && tenderDetails.title} />
      <ToastContainer></ToastContainer>
      <ApiButton
        editData={editTenderData}
        navigate={navigate}
        applyChanges={editTenderData}
        backToList={backToList}
        deleteData={deleteOpportunity}
        module="Tender"
        setFormSubmitted={setFormSubmitted}
        tenderDetails={tenderDetails}
      ></ApiButton>
      <TenderMoreDetails
        companyInsertData={companyInsertData}
        newContactData={newContactData}
        handleInputs={handleInputs}
        handleAddNewContact={handleAddNewContact}
        setAddContactModal={setAddContactModal}
        addContactModal={addContactModal}
        tenderDetails={tenderDetails}
        allCountries={allCountries}
        company={company}
        contact={contact}
        incharge={incharge}
        addCompanyModal={addCompanyModal}
        addCompanyToggle={addCompanyToggle}
        companyhandleInputs={companyhandleInputs}
        insertCompany={insertCompany}
        AddNewContact={AddNewContact}
        addContactToggle={addContactToggle}
        setAddCompanyModal={setAddCompanyModal}
        getContact={getContact}
        formSubmitted={formSubmitted}
      ></TenderMoreDetails>

      <ComponentCard>

        <EditCostingSummaryModal
          editCostingSummaryModel={editCostingSummaryModel}
          setEditCostingSummaryModel={setEditCostingSummaryModel}
          costingsummaries={costingsummaries}
          setCostingSummaries={setCostingSummaries}
        />
        {addCostingSummaryModel && (
          <AddCostingSummaryModal
            addCostingSummaryModel={addCostingSummaryModel}
            setAddCostingSummaryModel={setAddCostingSummaryModel}
            projectInfo={id}
          ></AddCostingSummaryModal>
        )}
        {/* End Call Edit Costing Summary Modal */}


        {/* End Call View Quote Log Modal */}

        <Tab toggle={toggle} tabs={tabs} />
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1">
            <TenderQuotation
              tenderId={id}
              quote={quote}
              project={project}
              quotationsModal={quotationsModal}
              setquotationsModal={setquotationsModal}
              rateModal={rateModal}
              setRateModal={setRateModal}
              viewLineToggle={viewLineToggle}
              getLineItem={getLineItem}
              getRateItem={getRateItem}
              getLine={getLine}
              quotes={quotes}
              editQuoteModal={editQuoteModal}
              setAddLineItemModal={setAddLineItemModal}
              setEditQuoteModal={setEditQuoteModal}
              addLineItemModal={addLineItemModal}
              lineItem={lineItem}
              setLineItem={setLineItem}
              rateItem={rateItem}
              setRateItem={setRateItem}
              viewLineModal={viewLineModal}
              setViewLineModal={setViewLineModal}
              id={id}
              insertProject={insertProject}
              generateCode={generateCode}
              generateCodes={generateCodes}
              handleQuoteForms={handleQuoteForms}
              getQuote={getQuote}
            ></TenderQuotation>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              {Object.keys(costingsummary).length !== 0 && (
                <Col md="3" className="mb-4 d-flex justify-content-between">
                  <Button
                    color="primary"
                    className="shadow-none"
                    onClick={() => {
                      setEditCostingSummaryModel(true);
                    }}
                  >
                    Edit Costing Summary
                  </Button>
                </Col>
              )}
              {Object.keys(costingsummary).length === 0 && (
                <Col md="3" className="mb-4 d-flex justify-content-between">
                  <Button
                    color="primary"
                    className="shadow-none"
                    onClick={() => {
                      setAddCostingSummaryModel(true);
                    }}
                  >
                    Add Costing Summary
                  </Button>
                </Col>
              )}
            </Row>
            {Object.keys(costingsummary).length !== 0 && (
              <Row>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <h3>Costing Summary</h3>{' '}
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Total Cost : {costingsummaries && costingsummaries.total_cost}</Label>{' '}
                    </FormGroup>
                  </Col>
                  {/* <Col md="3">
                    <FormGroup>
                      <Label>
                        PO Price (S$ W/o GST) : {costingsummary && costingsummary.po_price}
                      </Label>{' '}
                    </FormGroup>
                  </Col> */}
                  <Col md="3">
                    <FormGroup>
                      <Label>
                        Profit Margin : {costingsummaries && costingsummaries.profit_percentage} %
                      </Label>{' '}
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label>Total Material</Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.total_material_price}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Transport Charges</Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.transport_charges}</span>
                      <span>
                        {costingcostingDetails && costingcostingDetails.transport_charges}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Total  Charges</Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.total_labour_charges}</span>
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <Label>Salesman Commission</Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.salesman_commission}</span>
                      <span>
                        {costingcostingDetails && costingcostingDetails.salesman_commission}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label> Finance Charges </Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.finance_charges}</span>
                      <span>{costingcostingDetails && costingcostingDetails.finance_charges}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Office Overheads</Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.office_overheads}</span>
                      <span>{costingcostingDetails && costingcostingDetails.office_overheads}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Other Charges</Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.other_charges}</span>
                      <span>{costingcostingDetails && costingcostingDetails.other_charges}</span>
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <Label> TOTAL COST </Label>
                      <br />
                      <span>{costingsummaries && costingsummaries.total_cost}</span>

                      {/* <span>{costingcostingDetails && costingcostingDetails.total_cost}</span> */}
                      {/* <span>
                    {(costingcostingDetails && costingcostingDetails.transport_charges) +
                      (costingcostingDetails && costingcostingDetails.other_charges) +
                      (costingcostingDetails && costingcostingDetails.salesman_commission) +
                      (costingcostingDetails && costingcostingDetails.finance_charges) +
                      (costingcostingDetails && costingcostingDetails.office_overheads) +
                      (costingcostingDetails && costingcostingDetails.total_labour_charges)}
                  </span> */}
                    </FormGroup>
                  </Col>
                </Row>
              </Row>
            )}
          </TabPane>
          {/* Tender Quotation */}


          <TabPane tabId="3">
            <TenderAttachment></TenderAttachment>
          </TabPane>
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default OpportunityEdit;
