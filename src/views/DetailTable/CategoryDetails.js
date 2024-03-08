import React, { useState, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const CategoryDetails = () => {
  //Navigation and Parameter Constants
  const navigate = useNavigate();

  //Logic for adding category in db
  const [categoryForms, setCategoryForms] = useState({
    category_title: '',
  });

  const { loggedInuser } = useContext(AppContext);

  //setting data in categoryForms
  const handleCategoryForms = (e) => {
    setCategoryForms({ ...categoryForms, [e.target.name]: e.target.value });
  };

  //Api for insertCategory
  const insertCategory = () => {
    if (categoryForms.category_title !== '') {
      categoryForms.creation_date = creationdatetime;
      categoryForms.created_by = loggedInuser.first_name;
      api
        .post('/category/insertCategory', categoryForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Category inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/CategoryEdit/${insertedDataId}`);
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
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>
                      Title<span className="required"> *</span>
                    </Label>
                    <Input
                      type="text"
                      name="category_title"
                      onChange={handleCategoryForms}
                      value={categoryForms && categoryForms.category_title}
                    ></Input>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertCategory();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
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
export default CategoryDetails;
