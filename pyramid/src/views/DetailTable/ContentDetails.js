import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const ContentDetails = () => {
  //All const variables
  const [content, setContent] = useState();
  const navigate = useNavigate();
  const [contentDetails, setContentDetails] = useState({
    title: '',
    creation_date: moment(),
    content_date: moment(),
    content_type: '',
  });
  //setting data in contentDetails
  const handleInputs = (e) => {
    setContentDetails({ ...contentDetails, [e.target.name]: e.target.value });
  };
  const { loggedInuser } = useContext(AppContext);
  //getting data from content
  const getContent = () => {
    api.get('/content/getContent').then((res) => {
      setContent(res.data.data);
    });
  };
  //Insert Content Data
  const insertContentData = () => {
    if (contentDetails.title !== '') {
      contentDetails.creation_date = creationdatetime;
      contentDetails.created_by = loggedInuser.first_name;
      api
        .post('/content/insertContent', contentDetails)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Content inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/ContentEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'warning');
    }
  };
  useEffect(() => {
    getContent();
    console.log(content)
  }, []);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>Title<span className='required'>*</span></Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={contentDetails && contentDetails.title}
                      name="title"
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        insertContentData();
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(-1);
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
export default ContentDetails;
