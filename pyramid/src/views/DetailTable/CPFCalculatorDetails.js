import React, { useState, useContext } from 'react';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const CpfCalculatorDetails = () => {
  const navigate = useNavigate();

  //  insertClient
  const [cpfRecord, setCpfRecord] = useState({
    from_age: '',
    to_age: '',
    year: null,
  });

  const currentDate = new Date();

  // Get the current year
  const currentYear = currentDate.getFullYear();

  //Client Functions/Methods
  const handleCpfForms = (e) => {
    setCpfRecord({ ...cpfRecord, [e.target.name]: e.target.value });
  };

  const { loggedInuser } = useContext(AppContext);

  // Client Insert
  const insertCpfCalculator = () => {
    if(cpfRecord.to_age!=='' && cpfRecord.from_age!==''){
    cpfRecord.year = currentYear;
    cpfRecord.created_by = loggedInuser.first_name;;
    cpfRecord.creation_date = creationdatetime;
    api
      .post('/cpfCalculator/insertCpfCalculator', cpfRecord)
      .then((res) => {
        const insertedDataId = res.data.data.insertId;
        message('CpfCalculator Record inserted successfully.', 'success');
        setTimeout(() => {
          navigate(`/cpfCalculatorEdit/${insertedDataId}`);
        }, 300);
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <BreadCrumbs />
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <FormGroup>
              <Row>
                <Col md="12">
                  <Label>
                    From age<span className="required"> *</span>
                  </Label>
                  <Input
                    name="from_age"
                    value={cpfRecord && cpfRecord.from_age}
                    onChange={handleCpfForms}
                    type="text"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md="12">
                  <Label>
                    To age <span className="required"> *</span>
                  </Label>
                  <Input
                    name="to_age"
                    value={cpfRecord && cpfRecord.to_age}
                    onChange={handleCpfForms}
                    type="text"
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    color="primary"
                    onClick={() => {
                      insertCpfCalculator();
                    }}
                    type="button"
                    className="btn mr-2 shadow-none"
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
            </FormGroup>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default CpfCalculatorDetails;
