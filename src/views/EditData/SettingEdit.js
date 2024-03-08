import React, { useEffect, useState,useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
//import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';
//import DeleteButton from '../../components/DeleteButton';
import AppContext from '../../context/AppContext';


const SettingEdit = () => {
  //All state variable
  const [settingdetails, setSettingDetails] = useState();
  const [valueType, setValueType] = useState();
  const { loggedInuser } = useContext(AppContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  //navigation and parameters
  const { id } = useParams();
  const navigate = useNavigate();

  //const applyChanges = () => {};
  const backToList = () => {
    navigate('/Setting');
  };
  //setting data in settingDetails
  const handleInputs = (e) => {
    setSettingDetails({ ...settingdetails, [e.target.name]: e.target.value });
  };
  //getting data from setting by Id
  const getSettingById = () => {
    api
      .post('/setting/getSettings', { setting_id: id })
      .then((res) => {
        setSettingDetails(res.data.data[0]);
        setValueType(res.data.data[0].value_type);
      })
      .catch(() => {
        message('setting Data Not Found', 'info');
      });
  };
  //Update Setting
  const editSettingData = () => {
    setFormSubmitted(true);
    
    if (settingdetails.key_text !== '') {
      settingdetails.modification_date = creationdatetime;
    settingdetails.modified_by = loggedInuser.first_name;
      api
        .post('/setting/editSetting', settingdetails)
        .then(() => {
          message('Record editted successfully', 'success');
          getSettingById();
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'error');
    }
  };

  const DeleteSetting = () => {
    api
      .post('/setting/DeleteSetting', { setting_id: id })
      .then(() => {
        message('Record deleted successfully', 'success');
      })
      .catch(() => {
        message('Unable to delete record.', 'error');
      });
  };
  useEffect(() => {
    getSettingById();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <Form>
        <FormGroup>
          <ToastContainer></ToastContainer>
        
          <ApiButton
            editData={editSettingData}
            navigate={navigate}
            //applyChanges={updateData}
            backToList={backToList}
            deleteData={DeleteSetting}
            module="Setting"
          ></ApiButton>

        </FormGroup>
      </Form>
      {/* Setting Details */}
      <Form>
        <FormGroup>
          <ComponentCard title="Setting Details" creationModificationDate={settingdetails}>
            {' '}
            <ToastContainer></ToastContainer>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>Key Text <span className="required"> *</span>
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={settingdetails && settingdetails.key_text}
                    name="key_text"
                    className={`form-control ${
                      formSubmitted && settingdetails.key_text.trim() === '' ? 'highlight' : ''
                    }`}
                  ></Input>
                </FormGroup>
                {formSubmitted && settingdetails.key_text.trim() === '' && (
                  <div className="error-message">Please Enter</div>
                )}
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    type="textarea"
                    onChange={handleInputs}
                    value={settingdetails && settingdetails.description}
                    name="description"
                  />
                </FormGroup>
              </Col>
              {valueType && valueType === 'Text Area' && (
                <Col md="4">
                  <FormGroup>
                    <Label>Value</Label>
                    <Input
                      type="textarea"
                      onChange={handleInputs}
                      value={settingdetails && settingdetails.value}
                      name="value"
                    />
                  </FormGroup>
                </Col>
              )}
              {valueType && valueType === 'Yes No' && (
                <Col md="4">
                  <FormGroup>
                    <Label> Value</Label>
                    <br></br>
                    &nbsp;
                    &nbsp;
                    <Label> Yes </Label>
                    &nbsp;
                    <Input
                      name="value"
                      value="1"
                      type="radio"
                      defaultChecked={settingdetails && settingdetails.value === '1' && true}
                      onChange={handleInputs}
                    />
                    &nbsp;
                    &nbsp;
                    <Label> No </Label>
                    &nbsp;
                    <Input
                      name="value"
                      value="0"
                      type="radio"
                      defaultChecked={settingdetails && settingdetails.value === '0' && true}
                      onChange={handleInputs}
                    />
                  </FormGroup>
                </Col>
              )}
              {valueType && valueType === 'Text field' && (
                <Col md="4">
                  <FormGroup>
                    <Label>Value</Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={settingdetails && settingdetails.value}
                      name="value"
                    />
                  </FormGroup>
                </Col>
              )}
              {valueType && valueType === '' && (
                <Col md="4">
                  <FormGroup>
                    <Label>Value</Label>
                    <Input
                      type="textarea"
                      onChange={handleInputs}
                      value={settingdetails && settingdetails.value}
                      name="value"
                    />
                  </FormGroup>
                </Col>
              )}
              {valueType && valueType === 'Number Field' && (
                <Col md="4">
                  <FormGroup>
                    <Label>Value</Label>
                    <Input
                      type="numbers"
                      onChange={handleInputs}
                      value={settingdetails && settingdetails.value}
                      name="value"
                    />
                  </FormGroup>
                </Col>
              )}

              <Col md="4">
                <FormGroup>
                  <Label>Value Text</Label>
                  <Input
                    type="select"
                    value={settingdetails && settingdetails.value_type}
                    name="value_type"
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="Yes No">Yes No</option>
                    <option value="Text field">Text field</option>
                    <option value="Text Area">Text Area</option>
                    <option value="Number Field">Number Field</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
};

export default SettingEdit;
