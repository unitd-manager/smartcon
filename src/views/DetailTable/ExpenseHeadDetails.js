import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';

const LoanDetails = () => {
  //state variable
  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  // Get Employee By Id

  const [expenseForms, setExpenseForms] = useState({
    title: '',
  });

  //setting data in expenseForms
  const handleExpenseForms = (e) => {
    setExpenseForms({ ...expenseForms, [e.target.name]: e.target.value });
  };

  //Logic for adding Loan in db
  const insertExpense = () => {
    if (expenseForms.title !== '') {
      expenseForms.creation_date = creationdatetime;
      expenseForms.created_by = loggedInuser.first_name;
      api
        .post('/expensehead/insertExpGroup', expenseForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Expense head inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/ExpenseHeadEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  useEffect(() => {
    
  }, [id]);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6">
          <ComponentCard title="Expense Head Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                         Title <span className="required"> *</span>
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        onChange={handleExpenseForms}
                        value={expenseForms && expenseForms.title}
                      >
                      </Input>
                    </FormGroup>
                  </Col>
                  
                </Row>
              </FormGroup>
              <FormGroup>
              <Row>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertExpense();
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
               
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};
export default LoanDetails;
