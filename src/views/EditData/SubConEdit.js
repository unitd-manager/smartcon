import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate, useParams } from 'react-router-dom';
import '../form-editor/editor.scss';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import creationdatetime from '../../constants/creationdatetime';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import WorkOrderLinked from '../../components/SubConModal/WorkOrderlinked';
import SubConTable from '../../components/SubConModal/SubConTable';
import ApiButton from '../../components/ApiButton';

const SubConEdit = () => {
  //all state variables
  const [subCon, setSubCon] = useState();
  const [status, setStatus] = useState();
  const [subConWorkOrder, setSubConWorkOrder] = useState();
  const [allCountries, setAllCountries] = useState();
  const [editWorkOrderLinked, setEditWorkOrderLinked] = useState(false);
  const [subconStatus, setSubconStatus] = useState();
  //navigation and params
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  const backToList=() => {
    navigate('/Subcon');
  }
  // Get SubCon By Id
  const getsubCon = () => {
    api
      .post('/subcon/getSubconById', { sub_con_id: id })
      .then((res) => {
        setSubCon(res.data.data[0]);
      })
      .catch(() => {
        message('subcon not found', 'info');
      });
  };

  const handleInputs = (e) => {
    setSubCon({ ...subCon, [e.target.name]: e.target.value });
  };
  //Logic for edit data in db
  const editSubConData = () => {
    if (subCon.company_name !== ''&& subCon.address_flat){
      subCon.modification_date = creationdatetime;
      subCon.modified_by = loggedInuser.first_name;
      api
        .post('/subcon/edit-Subcon', subCon)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
      }else {
      message('Please fill all required fields.', 'error');
    }
  };
  //Logic for edit data in db
  const Status = () => {
    api
      .post('/subcon/getStatus', { sub_con_id: id })
      .then((res) => {
        setStatus(res.data.data[0]);
      })

      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    getsubCon();
    
  }, [id]);

  
  const subconeditdetails = () => {
    api
      .get('/supplier/getCountry')
      .then((res) => {
        setAllCountries(res.data.data);
      })
      .catch(() => {
        message('SubCon Data Not Found', 'info');
      });
  };
  //Api call for getting Staff Type From Valuelist
  const getSubconStatus = () => {
    api
      .get('/subcon/getValueList')
      .then((res) => {
        setSubconStatus(res.data.data);
      })
      .catch(() => {
        message('Status Data Not Found', 'info');
      });
  };
  useEffect(() => {
    // Get purchaseOrder By Id
  const getworkOrder = () => {
    api
      .post('/subcon/getWorkOrderLinkedss', { sub_con_id: id })
      .then((res) => {
        setSubConWorkOrder(res.data.data);
      })
      .catch(() => {
        message('SubCon not found', 'info');
      });
  };
    getworkOrder();
    subconeditdetails();
    getSubconStatus();
    Status();
  }, []);
  return (
    <>
      <BreadCrumbs heading={subCon && subCon.company_name} />

      <ApiButton
              editData={editSubConData}
              navigate={navigate}
              applyChanges={editSubConData}
              backToList={backToList}
              module="Sub Con"
            ></ApiButton>

         <Form>
        
          {/* <ComponentCardV2>
            <Row>
              <Col>
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    editSubConData();
                    navigate('/Subcon');
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    editSubConData();
                  }}
                >
                  Apply
                </Button>
              </Col>
              <Col>
                <Button
                  color="secondary"
                  className="shadow-none"
                  onClick={() => {
                    navigate('/Subcon');
                  }}
                >
                  Back to List
                </Button>
              </Col>
            </Row>
          </ComponentCardV2> */} 
          
          <ComponentCard title="SubCon Details" creationModificationDate={subCon}>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>
                    Name <span className="required"> *</span>
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.company_name}
                    name="company_name"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.email}
                    name="email"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Fax</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.fax}
                    name="fax"
                  />
                </FormGroup>
              </Col>
            
            
              <Col md="3">
                <FormGroup>
                  <Label>Mobile</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.mobile}
                    name="mobile"
                  />
                </FormGroup>
              </Col>
              </Row>
              <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    name="status"
                    onChange={handleInputs}
                    value={subCon && subCon.status}
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="current">Current</option>
                    <option value="old">Old</option>
                    {subconStatus &&
                      subconStatus.map((ele) => {
                        return (
                          <option key={ele.value} value={ele.value}>
                            {ele.value}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        <FormGroup>
          <ComponentCard title="Address">
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>
                    Address 1 <span className="required"> *</span>
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.address_flat}
                    name="address_flat"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Address 2</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.address_street}
                    name="address_street"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Country</Label>
                  <Input
                    type="select"
                    name="address_country"
                    onChange={handleInputs}
                    value={subCon && subCon.address_country}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {allCountries &&
                      allCountries.map((country) => (
                        <option key={country.country_code} value={country.country_code}>
                          {country.name}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Postal Code</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={subCon && subCon.address_state}
                    name="address_state"
                  />
                </FormGroup>
              </Col>
            </Row>
            {status &&
              (status.status === 'New' ||
                status.status === 'Confirmed' ||
                status.status === 'Hold' ||
                status.status === 'Paid' ||
                status.status === 'Due' ||
                status.status === 'Partially Paid' ||
                status.status === 'paid') && (
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      className="shadow-none"
                      onClick={() => {
                        setEditWorkOrderLinked(true);
                      }}
                      color="primary"
                    >
                      Make Sub Con Payment
                    </Button>
                  </div>
                </Row>
              )}
          </ComponentCard>
        </FormGroup>
      </Form>
      <WorkOrderLinked
        editWorkOrderLinked={editWorkOrderLinked}
        setEditWorkOrderLinked={setEditWorkOrderLinked}
      ></WorkOrderLinked>
        <ToastContainer></ToastContainer>
        <SubConTable subConWorkOrder={subConWorkOrder}></SubConTable>
    </>
  );
};

export default SubConEdit;
