import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import TenderCompanyDetails from '../../components/TenderTable/TenderCompanyDetails';
import AppContext from '../../context/AppContext';


const OpportunityDetails = () => {
  const [company, setCompany] = useState();
  const [allCountries, setallCountries] = useState();
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toggle = () => {
    setModal(!modal);
  };
  //get user details
  const { loggedInuser } = useContext(AppContext);
  //Api call for getting company dropdown
  const getCompany = () => {
    api.get('/company/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };

  //Logic for adding company in db
  const [companyInsertData, setCompanyInsertData] = useState({
    company_name: '',
    address_street: '',
    address_town: '',
    address_country: '',
    address_po_code: '',
    phone: '',
    fax: '',
    website: '',
    supplier_type: '',
    industry: '',
    company_size: '',
    source: '',
  });

  const handleInputs = (e) => {
    setCompanyInsertData({ ...companyInsertData, [e.target.name]: e.target.value });
  };

  const insertCompany = () => {
    if (
      companyInsertData.company_name !== '' &&
      companyInsertData.address_street !== '' &&
      companyInsertData.address_po_code !== '' &&
      companyInsertData.address_country !== ''
    ) {
      companyInsertData.creation_date = creationdatetime;
      companyInsertData.created_by= loggedInuser.first_name; 
      api
        .post('/company/insertCompany', companyInsertData)
        .then(() => {
          message('Company inserted successfully.', 'success');
          getCompany();
          window.location.reload();
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'warning');
    }
  };

  //Logic for adding tender in db
  const [tenderForms, setTenderForms] = useState({
    title: '',
    company_name: '',
    category: '',
  });

  const handleInputsTenderForms = (e) => {
    setTenderForms({ ...tenderForms, [e.target.name]: e.target.value });
  };

  //Api for getting all countries
  const getAllCountries = () => {
    api
      .get('/clients/getCountry')
      .then((res) => {
        setallCountries(res.data.data);
      })
      .catch(() => {
        message('Country Data Not Found', 'info');
      });
  };
  //const[tenderDetails,setTenderDetails]=useState();
  const getTendersById = () => {
    api
      .post('/tender/getTendersById', { opportunity_id: id })
      .then((res) => {
        setTenderForms(res.data.data);
        // getContact(res.data.data.company_id);
      })
      .catch(() => {});
  };
  //console.log(tenderDetails);
  const insertTender = (code) => {
    if (tenderForms.company_id !== '' && tenderForms.title !== '' && tenderForms.category !== '') {
      tenderForms.opportunity_code = code;
      tenderForms.creation_date = creationdatetime;
      tenderForms.created_by= loggedInuser.first_name; 
      api
        .post('/tender/insertTenders', tenderForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          getTendersById();
          message('Tender inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/OpportunityEdit/${insertedDataId}?tab=1`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  //QUTO GENERATED CODE
  const generateCode = () => {
    api
      .post('/tender/getCodeValue', { type: 'opportunity' })
      .then((res) => {
        insertTender(res.data.data);
      })
      .catch(() => {
        insertTender('');
      });
  };

  useEffect(() => {
    getCompany();
    getAllCountries();
  }, [id]);

  return (
    <div>
      <BreadCrumbs />
      <Row>
        <ToastContainer></ToastContainer>
        <Col md="6" xs="12">
          <ComponentCard title="New Opportunity">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Label>
                      {' '}
                      Title <span className="required"> *</span>{' '}
                    </Label>
                    <Input
                      type="text"
                      name="title"
                      value={tenderForms && tenderForms.title}
                      onChange={handleInputsTenderForms}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Label>
                      Company Name <span className="required"> *</span>{' '}
                    </Label>
                    <Input
                      type="select"
                      name="company_id"
                      //value={tenderForms && tenderForms.company_id}
                      onChange={handleInputsTenderForms}
                    >
                      <option>Please Select</option>
                      {company &&
                        company.map((ele) => {
                          return (
                            <option key={ele.company_id} value={ele.company_id}>
                              {ele.company_name}
                            </option>
                          );
                        })}
                    </Input>
                  </Col>
                  <Col md="3" className="addNew">
                    <Label>Add New Name</Label>
                    <Button color="primary" className="shadow-none" onClick={toggle.bind(null)}>
                      Add New
                    </Button>
                  </Col>
                </Row>
               
              </FormGroup>
              <TenderCompanyDetails
                allCountries={allCountries}
                insertCompany={insertCompany}
                handleInputs={handleInputs}
                toggle={toggle}
                modal={modal}
                setModal={setModal}
              ></TenderCompanyDetails>
              <FormGroup>
                <Col md="9">
                  <Label>
                    Category <span className="required"> *</span>
                  </Label>
                  <Input
                    type="select"
                    onChange={handleInputsTenderForms}
                    value={tenderForms && tenderForms.category}
                    name="category"
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="Project">Project</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Tenancy Project">Tenancy Project</option>
                    <option value="Tenancy Work">Tenancy Work</option>
                  </Input>
                </Col>
              </FormGroup>
              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="btn mr-2 shadow-none"
                    onClick={() => {
                      generateCode();
                    }}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    className="shadow-none"
                    color="dark"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to cancel  \n  \n You will lose any changes made',
                        )
                      ) {
                        navigate(-1);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Row>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default OpportunityDetails;
