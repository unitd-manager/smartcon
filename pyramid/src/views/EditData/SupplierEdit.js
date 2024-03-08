import React, { useState, useEffect, useContext } from 'react';
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
import Swal from 'sweetalert2';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
//import ComponentCard from '../../components/ComponentCard';
import creationdatetime from '../../constants/creationdatetime';
import message from '../../components/Message';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import PurchaseOrderLinked from '../../components/SupplierModal/Purchaseorderlinked';
import SupplierTable from '../../components/SupplierModal/SupplierTable';
import SupplierDetails from '../../components/SupplierModal/SupplierDetails';
import ApiButton from '../../components/ApiButton';

const SupplierEdit = () => {
  //all state variables
  const [supplier, setSupplier] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [allCountries, setAllCountries] = useState();
  const [editPurchaseOrderLinked, setEditPurchaseOrderLinked] = useState(false);
  const [supplierStatus, setSupplierStatus] = useState();
  const [status, setStatus] = useState();

  //navigation and params
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  //const applyChanges = () => {};
const backToList=() => {
  navigate('/Supplier');
}
  const handleInputs = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };
  // Get Supplier By Id
  const editSupplierById = () => {
    api
      .post('/supplier/get-SupplierById', { supplier_id: id })
      .then((res) => {
        setSupplier(res.data.data[0]);
      })
      .catch(() => {
        message('Supplier Data Not Found', 'info');
      });
  };

 
  //Logic for edit data in db
  const editSupplierData = () => {
    if (supplier.company_name !== '') {
      supplier.modification_date = creationdatetime;
      supplier.modified_by = loggedInuser.first_name;
      api
        .post('/supplier/edit-Supplier', supplier)
        .then(() => {
          message('Record editted successfully', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 400);
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
        }  else {
      message('Please fill all required fields.', 'error');
    }
  };
  //Logic for edit data in db
  const Status = () => {
    api
      .post('/supplier/getStatus', { supplier_id: id })
      .then((res) => {
        setStatus(res.data.data[0]);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    editSupplierById();
  }, [id]);
  // Get purchaseOrder By Id

  const suppliereditdetails = () => {
    api
      .get('/supplier/getCountry')
      .then((res) => {
        setAllCountries(res.data.data);
      })
      .catch(() => {
        message('Supplier Data Not Found', 'info');
      });
  };
  //Api call for getting Staff Type From Valuelist
  const getSupplierStatus = () => {
    api
      .get('/supplier/getValueList')
      .then((res) => {
        setSupplierStatus(res.data.data);
      })
      .catch(() => {
        message('Status Data Not Found', 'info');
      });
  };
  useEffect(() => {
    const getpurchaseOrder = () => {
      api
        .post('/supplier/getPurchaseOrderLinkedss', { supplier_id: id })
        .then((res) => {
          setPurchaseOrder(res.data.data);
        })
        .catch(() => {
          message('Supplier not found', 'info');
        });
    };
    getpurchaseOrder();
    suppliereditdetails();
    getSupplierStatus();
    Status();
  }, []);
  const deleteSupplierData = () => {
    Swal.fire({
      title: `Are you sure? ${id}`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/supplier/deleteSupplier', { supplier_id: id })
          .then(() => {
            Swal.fire('Deleted!', 'Your Leave has been deleted.', 'success');
            window.location.reload();
          });
      }
    });
  };

  return (
    <>
      <BreadCrumbs heading={supplier && supplier.company_name} />
     
          <ApiButton
              editData={editSupplierData}
              navigate={navigate}
              applyChanges={editSupplierData}
              backToList={backToList}
              deleteData={deleteSupplierData}
              module="Supplier"
            ></ApiButton>
            {/* <Row>
              <Col>
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    editSupplierData();
                    navigate('/Supplier');
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
                    editSupplierData();
                    setTimeout(() => {
                      applyChanges();
                    }, 800);
                  }}
                >
                  Apply
                </Button>
              </Col>
              <Col>
                <Button
                  color="dark"
                  className="shadow-none"
                  onClick={() => {
                    applyChanges();
                    navigate('/Supplier');

                  }}
                >
                  Back to List
                </Button>
              </Col>
            </Row> */}
          
     

      <SupplierDetails
        handleInputs={handleInputs}
        supplier={supplier}
        allCountries={allCountries}
        supplierStatus={supplierStatus}
        status={status}
        setEditPurchaseOrderLinked={setEditPurchaseOrderLinked}
      ></SupplierDetails>
 
      <PurchaseOrderLinked
        editPurchaseOrderLinked={editPurchaseOrderLinked}
        setEditPurchaseOrderLinked={setEditPurchaseOrderLinked}
      ></PurchaseOrderLinked>
      <ToastContainer></ToastContainer>
      <SupplierTable purchaseOrder={purchaseOrder}></SupplierTable>
    </>
  );
};

export default SupplierEdit;
