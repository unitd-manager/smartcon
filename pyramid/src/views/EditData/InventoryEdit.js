import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Form } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { useParams } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import message from '../../components/Message';
import ComponentCard from '../../components/ComponentCard';
import InventoryEditPart from '../../components/Inventory/InventoryEditPart';
import InventoryEditTables from '../../components/Inventory/InventoryEditTables';
import creationdatetime from '../../constants/creationdatetime';

const Test = () => {
  //state variables
  const [tabPurchaseOrdersLinked, setTabPurchaseOrdersLinked] = useState();
  const [projectsLinked, setProjectsLinked] = useState([]);
  const [productQty, setProductQty] = useState({});
  const [inventoryDetails, setInventoryDetails] = useState({
    inventory_code: '',
    inventory_id: '',
    minimum_order_level: '',
    productId: '',
    product_type: '',
    company_name: '',
    product_name: '',
    item_code: '',
    unit: '',
    notes: '',
    product_code: '',
  });

  //params and routing
  const { id } = useParams();
  const { loggedInuser } = useContext(AppContext);

  const [adjustStocks, setAdjustStocks] = useState([]);
  const [changedStock, setChangedStock] = useState();
  
  const getAdjustStocklogsById = () => {
    api
      .post('/inventory/getAdjustStock', { inventory_id: id })
      .then((res) => {
        setAdjustStocks(res.data.data);
      })
      .catch(() => {
        message('adjuststock logs Data Not Found', 'info');
      });
  };

  //handle input change
  const handleInputs = (e) => {
    setInventoryDetails({ ...inventoryDetails, [e.target.name]: e.target.value, inventory_id: id });
  };
   //get inventoryby product id
   const getInventoryData = () => {
    api
      .post('/inventory/getinventoryById', { inventory_id: id })
      .then((res) => {
        setInventoryDetails(res.data.data[0]);
      })
      .catch(() => {
        message('Unable to get inventory data.', 'error');
      });
  };
  //get data for purchaseorder table
  const getAllpurchaseOrdersLinked = () => {
    api
      .post('/inventory/gettabPurchaseOrderLinkedById', { product_id: inventoryDetails && inventoryDetails.productId })
      .then((res) => {
        setTabPurchaseOrdersLinked(res.data.data);
      })
      .catch(() => {
        message('Unable to get purchase order data.', 'error');
      });
  };
  console.log("productId", tabPurchaseOrdersLinked)

  //get data for projects table
  const getAllProjectsLinked = () => {
    api
      .post('/inventory/getTabProjectLinkedById', {product_id: inventoryDetails && inventoryDetails.productId })
      .then((res) => {
        setProjectsLinked(res.data.data);
      })
      .catch(() => {
        message('Unable to get projects data.', 'error');
      });
  };

  //get product purchasedquantity and sold qty
  const getproductquantity = () => {
    api
      .post('/inventory/getProductQuantity', {product_id: inventoryDetails && inventoryDetails.productId })
      .then((res) => {
        setProductQty(res.data.data[0]);
      })
      .catch(() => {
        message('Unable to get productqty data.', 'error');
      });
  };
 
  //update Inventory
  const editinventoryData = () => {
    inventoryDetails.modification_date = creationdatetime;
    inventoryDetails.modified_by = loggedInuser.first_name;
    api
      .post('/inventory/editinventoryMain', inventoryDetails)
      .then(() => {
        message('Record editted successfully', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    getInventoryData();
    getAllpurchaseOrdersLinked();
    getAllProjectsLinked();
  getAdjustStocklogsById();
    getproductquantity( inventoryDetails && inventoryDetails.productId);
  }, [ inventoryDetails && inventoryDetails.productId]);

  useEffect(() => {
    let changes=0;
    adjustStocks.forEach((el)=>{
changes +=parseFloat(el.adjust_stock);
    })
    setChangedStock(changes)
  }, [ adjustStocks]);
  return (
      <>
        <ToastContainer></ToastContainer>
        <InventoryEditPart
          inventoryDetails={inventoryDetails}
          handleInputs={handleInputs}
          editinventoryData={editinventoryData}
        />
        <Row>
          <Form>
            <ComponentCard title="Stock Details">
              <Row>
                <Col xs="12" md="3">
                  <Row>
                    <h5>Total Purchased quantity</h5>
                  </Row>
                  <span>{productQty && productQty.materials_purchased}</span>
                  <Row></Row>
                </Col>
                <Col xs="12" md="3">
                  <Row>
                    <h5>Sold quantity</h5>
                  </Row>
                  <span>{productQty && productQty.materials_used}</span>
                  <Row></Row>
                </Col>
                <Col xs="12" md="3">
                  <Row>
                    <h5>Adjusted quantity</h5>
                  </Row>
                  <span>{changedStock&&changedStock}</span>
                  <Row></Row>
                </Col>
                
                <Col xs="12" md="3">
                  <Row>
                    <h5>Remaining quantity</h5>
                  </Row>
                  <span>{productQty && productQty.actual_stock}</span>

                  <Row></Row>
                </Col>
              </Row>
            </ComponentCard>
          </Form>
        </Row>
        <InventoryEditTables
          tabPurchaseOrdersLinked={tabPurchaseOrdersLinked}
          projectsLinked={projectsLinked}
        />
      </>
  );
};

export default Test;
