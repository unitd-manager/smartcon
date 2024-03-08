import React, { useState, useEffect,useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';


const SettingDetails = () => {
  //All state variables
  const [settingforms, setSettingForms] = useState({
    key_text: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { loggedInuser } = useContext(AppContext);
  //Navigation and Parameters
  const navigate = useNavigate();
  //Setting data in settingForms
  const handleInputsSettingForms = (e) => {
    setSettingForms({ ...settingforms, [e.target.name]: e.target.value });
  };
  //Insert Setting
  const insertSetting = () => {
         
    if (settingforms.key_text !== ''){
      settingforms.creation_date = creationdatetime;
      settingforms.created_by = loggedInuser.first_name;
      
      api
        .post('/setting/insertSetting', settingforms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Setting inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/SettingEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
      }
    else {
      setFormSubmitted(true)
      message('Please fill all required fields.', 'error');
    }
  };
  useEffect(() => {}, []);
  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6" xs="12">
          {/* Key Details */}
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>
                      {' '}
                      Key Text <span className="required"> *</span>{' '}
                    </Label>
                    <Input type="text" name="key_text" onChange={handleInputsSettingForms} 
                    className={`form-control ${formSubmitted && settingforms && settingforms.key_text.trim() === '' ? 'highlight' : ''
                  }`}
              />
              {formSubmitted && settingforms && settingforms.key_text.trim() === '' && (
                <div className="error-message">Please Enter</div>
              )}
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertSetting();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/Setting');
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
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

export default SettingDetails;
