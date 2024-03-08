import React, {useContext, useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const ProductDetails = () => {
  //All const variables
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    title: '',
  });
  //setting data in ProductDetails
  const handleInputs = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };
  //get staff details
  const { loggedInuser } = useContext(AppContext);
  //Insert Product Data
  const insertProductData = (ProductCode, ItemCode) => {
    if (productDetails.title.trim() !== '') {
      productDetails.product_code = ProductCode;
      productDetails.item_code = ItemCode;
      productDetails.creation_date = creationdatetime;
      productDetails.created_by= loggedInuser.first_name;   
      api
        .post('/product/insertProduct', productDetails)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Product inserted successfully.', 'success');
          api
          .post('/product/getCodeValue', { type: 'InventoryCode' })
            .then((res1) => {
              const InventoryCode = res1.data.data;
              message('inventory created successfully.', 'success');
              api
              .post('/inventory/insertinventory', { product_id: insertedDataId, inventory_code:InventoryCode  })
            
            .then(() => {
              message('inventory created successfully.', 'success');
            })
            })
            .catch(() => {
              message('Unable to create inventory.', 'error');
            });
          setTimeout(() => {
            navigate(`/ProductEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'warning');
    }
  };


  //Auto generation code
  const generateCode = () => {
    api
      .post('/product/getCodeValue', { type: 'ProductCode' })
      .then((res) => {
        const ProductCode = res.data.data
      api
      .post('/product/getCodeValue', { type: 'ItemCode' })
      .then((response) => {
        const ItemCode = response.data.data
        insertProductData(ProductCode, ItemCode);
      })
      })
      .catch(() => {
        insertProductData('');
      });
  };

  //useeffect
  useEffect(() => {
    
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
                    <Label>Product Name <span className="required"> *</span> </Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={ProductDetails && ProductDetails.title}
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
                        generateCode();
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/Product');
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
export default ProductDetails;
