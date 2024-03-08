import React, { useState, useEffect, useContext } from 'react';
import { CardTitle, Row, Col, TabContent, TabPane, Button, Label } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import DuctingCostModal from '../../components/ProjectModal/DuctingCostModal';
//import ViewQuoteLogModal from '../../components/ProjectModal/ViewQuoteLogModal';
import ViewLineItemModal from '../../components/ProjectModal/ViewLineItemModal';
import EditQuotation from '../../components/ProjectModal/EditQuotation';
import QuotationMoreDetails from '../../components/ProjectModal/QuotationMoreDetails';
import CreateFinance from '../../components/ProjectModal/CreateFinance';
import AddPurchaseOrderModal from '../../components/ProjectModal/AddPurchaseOrderModal';
import MaterialsusedTab from '../../components/ProjectModal/MaterialsusedTab';
import EditDeliveryOrder from '../../components/ProjectModal/EditDeliveryOrder';
import EditPoModal from '../../components/ProjectModal/EditPoModal';
import EditPOLineItemsModal from '../../components/ProjectModal/EditPOLineItemsModal';
import SubConWorkOrderPortal from '../../components/ProjectModal/SubConWorkOrderPortal';
import MaterialsTransferred from '../../components/ProjectModal/MaterialsTransferred';
import JobCompletionTab from '../../components/ProjectModal/JobCompletionTab';
import FinanceTab from '../../components/ProjectModal/FinanceTab';
import message from '../../components/Message';
import api from '../../constants/api';
import ProjectButton from '../../components/ProjectTable/ProjectButton';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import CostingSummary from '../../components/ProjectTabContent/CostingSummary';
import TransferModal from '../../components/ProjectModal/TransferModal';
import AddEmployee from '../../components/ProjectTabContent/AddEmployee';
import Tab from '../../components/project/Tab';
import MaterialPurchased from '../../components/project/TabContent/MaterialPurchased';
import DeliveryOrder from '../../components/project/TabContent/DeliveryOrder';
import Claim from '../../components/project/TabContent/Claim';
import ProjectEditForm from '../../components/project/ProjectEditForm';
import AddLineItemModal from '../../components/ProjectModal/AddLineItemModal';
import PdfJobCompletionCertificate from '../../components/PDF/PdfJobCompletionCertificate';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';
import EditLineItemModal from '../../components/ProjectModal/EditLineItemModal';
import ViewLineJobItemmodal from '../../components/ProjectModal/ViewLineJobItemModal'
import EditJobModal from '../../components/ProjectModal/EditjobModal'

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const applyChanges = () => {};
  const backToList = () => {
    navigate('/Project');
  }; 
 
  const [joborder, setJobOrder] = useState({});
  const [projectDetail, setProjectDetail] = useState();
  const [activeTab, setActiveTab] = useState('1');
  const [addDuctingCostModal, setAddDuctingCostModal] = useState(false);
  //const [viewQuotationsModal, setViewQuotationsModal] = useState(false);
  const [viewLineModal, setViewLineModal] = useState(false);
  const [editQuoteModal, setEditQuoteModal] = useState(false);
  const [addPurchaseOrderModal, setAddPurchaseOrderModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [tabdeliveryorder, setTabdeliveryorder] = useState([]);
  //const [tabPurchaseOrderLineItemTable, setTabPurchaseOrderLineItemTable] = useState();
  const [checkId, setCheckId] = useState([]);
  const [editDeliveryOrder, setEditDeliveryOrder] = useState(false);
  const [editPo, setEditPo] = useState(false);
  const [editPOLineItemsModal, setEditPOLineItemsModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState('');
  const [POId, setPOId] = useState('');
  const [testJsonData, setTestJsonData] = useState(null);
  const [quotationsModal, setquotationsModal] = useState(false);
  const [lineItem, setLineItem] = useState([]);
  const [addnewjob, setAddNewJob] = useState(false);
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [editLineModal, setEditLineModal] = useState(false);
  const { loggedInuser } = useContext(AppContext);
  const [viewjobLineModal, setViewJobLineModal] = useState(false);
  const [jobLineItem, setJobLineItem] = useState([]);
  const [editJobLineModal, setEditJobLineModal] = useState(false);
  const [editLineModelItem, setEditLineModelItem] = useState(null);
  const [editjob, setEditJob] = useState(false);
  const [job, setJob] = useState({});
  const [JobOrderId, setJobOrderId] = useState(null);
  const handleInputs = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const [addNewJobVisible, setAddNewJobVisible] = useState(true);

  const handleAddNewJob = () => {
    setAddNewJob(true);
  };
  const handleInsertData = () => {
    // Logic to insert data
    // Once the data is inserted successfully, close the modal and hide the button
    setAddNewJob(false);
    setAddNewJobVisible(false);
  };
  const viewJobLineToggle = () => {
    setViewJobLineModal(!viewjobLineModal);
  };
  const [workOrderForm, setWorkOrderForm] = useState({
    work_order_date: '',
    status: '',
  });

  const [quoteForm, setQuoteForm] = useState({
    quote_date: '',
    quote_code: '',
  });
  useEffect(() => {
    api
      .post('/purchaseorder/testAPIendpoint', { project_id: id })
      .then((res) => {
        setTestJsonData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  const handleJobInputs = (e) => {
    setJobOrder({ ...joborder, [e.target.name]: e.target.value });
  };

  const handleClientForms = (e) => {
    setWorkOrderForm({ ...workOrderForm, [e.target.name]: e.target.value });
  };
  const handleQuoteForms = (e) => {
    setQuoteForm({ ...quoteForm, [e.target.name]: e.target.value });
  };
  const [selectedPoProducts, setSelectedPoProducts] = useState([]);
  const [transferModal, setTransferModal] = useState(false);
  const [transferItem, setTransferItem] = useState({});
  const [financeModal, setFinanceModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [contactLinked, setContactLinked] = useState('');
  const [subConWorkOrdeData, setSubConWorkOrdeData] = useState([]);
  const [update, setUpdate] = useState(false);

  // Start for tab refresh navigation #Renuka 31-05-23
  const tabs =  [
    {id:'1',name:'Costing Summary'},
    {id:'2',name:'Quotations'},
    {id:'3',name:'Materials Purchased'},
    {id:'4',name:'Materials used'},
    {id:'5',name:'Materials Transferred'},
    {id:'6',name:'Delivery Order'},
    {id:'7',name:'Subcon Work Order'},
    {id:'8',name:'Claim'},
    {id:'9',name:'Finance'},
    {id:'10',name:'Job Completion'},
    {id:'11',name:'Attachment'}
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  }; 
  // End for tab refresh navigation #Renuka 31-05-23

  // Get Project By Id
  const getProjectById = () => {
    api
      .post('/project/getProjectById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data[0]);
      })
      .catch(() => {
        message(' project not found', 'info');
      });
  };

  const getContactById = () => {
    api
      .get('/project/getcontactById', contactLinked)
      .then((res) => {
        setContactLinked(res.data.data);
      })
      .catch(() => {
        message('Project contact not found', 'info');
      });
  };

  const UpdateData = () => {
    if(projectDetail.category){
    api.post('/project/edit-Project', projectDetail).then(() => {
      message('Record editted successfully', 'success');
      // setTimeout(() => {
      //   window.location.reload();
      // }, 300);
    });
  }else{
    message('Please Enter Category', 'warning');
  }
  };

  // // Tab PurchaseOrder LineItem Table
  // const TabPurchaseOrderLineItemTable = () => {
  //   api.post('/purchaseorder/TabPurchaseOrderLineItemTable', { project_id: id }).then((res) => {
  //     let arrayOfObj = Object.entries(res.data.data).map((e) => ({ id: e[0], data: e[1] }));
  //     arrayOfObj = arrayOfObj.reverse();
  //     setTabPurchaseOrderLineItemTable(arrayOfObj);
  //   }).catch(()=>{});
  // };

  // Tab Delivery Order
  const TabDeliveryOrder = () => {
    api
      .post('/projecttabdeliveryorder/TabDeliveryOrder', { project_id: id })
      .then((res) => {
        setTabdeliveryorder(res.data.data);
      })
      .catch(() => {
        message('Tab Delivery Order not found', 'info');
      });
  };

  // handleCheck
  const handleCheck = (e, item) => {
    let updatedList = [...checkId];
    if (e.target.checked) {
      updatedList = [...checkId, { item }];
    } else {
      const indexOfObject = updatedList.findIndex((object) => {
        return object.id === item.po_product_id;
      });

      updatedList.splice(indexOfObject, 1);
    }
    setCheckId(updatedList);
    setSelectedPoProducts(selectedPoProducts);
  };

  //Add to stocks
  const addQtytoStocks = () => {
    const isEmpty = Object.keys(checkId).length === 0;

    if (isEmpty) {
      Swal.fire('Please select atleast one product!');
    } else {
      const selectedProducts = checkId;
      setCheckId([]);
      console.log('selectedproducts',selectedProducts)
      selectedProducts.forEach((elem) => {
     
        if (elem.item.status !== 'Closed') {
          elem.item.status = 'Closed';
          elem.item.qty_updated = elem.item.qty_delivered;
          elem.item.qty_in_stock += parseFloat(elem.item.qty_delivered);
console.log('elem',elem)
          api
            .post('/inventory/editInventoryStock', elem.item)
            .then(() => {
              message('Quantity added successfully.', 'success');
              setTimeout(() => {
                window.location.reload();
              }, 300);
            })
            .catch((err) => {
              console.log('err',err)
              message(err.message, 'danger');
            });
        } else {
          message('This product is already added', 'danger');
        }
      });
    }
  };
  
  // const InsertJobOrder = () => {
    
  //     joborder.creation_date = creationdatetime
  //     joborder.created_by = loggedInuser.first_name;
  //     api
  //       .post('/project/insertJobOrder', joborder)
  //       .then(() => {
  //         message('Opportunity inserted successfully.', 'success');
  //         // setTimeout(() => {
  //         // }, 300);
  //       })
  //       .catch(() => {
  //         message('Network connection error.', 'error');
  //       });
  // };

 

  const insertDeliveryHistoryOrder = (proId, deliveryOrderId) => {
    api
      .post('/projecttabdeliveryorder/insertDeliveryHistoryOrder', {
        product_id: proId.product_id,
        purchase_order_id: proId.purchase_order_id,
        delivery_order_id: deliveryOrderId,
        status: '1',
        quantity: proId.qty,
        item_title: proId.item_title,
        creation_date: moment(),
        modification_date: moment(),
        remarks: proId.description,
      })
      .then(() => {
        message('Delivery Order Item Inserted', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Unable to add Delivery Order Item', 'error');
      });
  };

  const insertDelivery = () => {
    const isEmpty = Object.keys(checkId).length === 0;

    if (isEmpty) {
      Swal.fire('Please select atleast one product!');
    } else {
      // Assuming you want to associate the delivery order with the first selected purchase order
      const firstSelectedProduct = checkId[0].item;
      api
        .post('/projecttabdeliveryorder/insertdelivery_order', {
          project_id: id,
          company_id: projectDetail.company_id,
          purchase_order_id: firstSelectedProduct.purchase_order_id,
          date: new Date(),
          created_by: '1',
          creation_date: new Date(),
          modified_by: '1',
          modification_date: new Date(),
        })
        .then((res) => {
          const selectedProducts = checkId;
          setCheckId([]);
          selectedProducts.forEach((element) => {
            insertDeliveryHistoryOrder(element.item, res.data.data.insertId);
          });
        })
        .catch(() => {
          message('Unable to add delivery order.', 'error');
        });
    }
  };

  // deleteDeliveryOrder
  const deleteDeliveryOrder = (deliveryOrderId) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/projecttabdeliveryorder/deletedelivery_order', {
            delivery_order_id: deliveryOrderId,
          })
          .then(() => {
            Swal.fire('Deleted!', 'Delivery Order has been deleted.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 300);
          })
          .catch(() => {
            message('Unable to Delete Delivery Order', 'info');
          });
      }
    });
  };

  


  const InsertJobOrder = (code) => {
    joborder.creation_date = creationdatetime;
    joborder.created_by = loggedInuser.first_name;
    joborder.project_id = id;
    joborder.job_order_code = code;
    if (joborder.location !== '') {
      api
        .post('/project/insertJobOrder', joborder)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          console.log('JobOrderId',insertedDataId );
          message('Job order inserted successfully.', 'success');
          // setTimeout(() => {
            
          // }, 300);
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const generateJobCode = () => {
    api
      .post('/commonApi/getCodeValue', { type: 'jobordercode' })
      .then((res) => {
        InsertJobOrder(res.data.data);
      })
      .catch(() => {
        InsertJobOrder('');
      });
  };
  const getJobLineItem = (JobId) => {
    api
      .post('/project/getJobLineItemsById', { job_order_id: JobId })
      .then((res) => {
        setJobLineItem(res.data.data);
        console.log('joblineitems', res.data.data);
        setViewJobLineModal(true);
      })
  };
  const getJob = () => {
    api.post('/project/getJobByProjectId', { project_id: id }).then((res) => {
      setJob(res.data.data[0]);
      setJobOrder(res.data.data[0]);
    });
  };

  useEffect(() => {
    getJob();
  }, []);
  const EditJobDetails = () => {
    api
      .post('/project/editJoborder', job)
      .then(() => {
        message('Job order Edited Successfully.', 'success');
        getJob();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        message('Unable to edit job. please fill all fields', 'error');
      });
  };
  const deleteJobItemRecord = (quoteItemsId) => {
    Swal.fire({
      title: `Are you sure? `,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('tender/deleteQuoteItems', { quote_items_id: quoteItemsId })
          .then(() => {
            Swal.fire('Deleted!', 'Quote has been deleted.', 'success');
            setViewJobLineModal(false);
          })
          .catch(() => {
            message('Unable to Delete line Item', 'info');
          });
      }
    });
  };

  const deleteData = () => {
    Swal.fire({
      title: `Are you sure? $`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/project/deleteProject', { project_id: id }).then(() => {
          Swal.fire('Deleted!', 'Project has been deleted.', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        });
      }
    });
  };

  const getLineItem = (quotationId) => {
    api.post('/project/getQuoteLineItemsById', { quote_id: quotationId }).then((res) => {
      setLineItem(res.data.data);
      console.log("1111",quotationId)
      //setViewLineModal(true);
    });
  };



  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  //Add Quote
  const insertQuote = async (code) => {
    const newQuoteId = quoteForm;
    newQuoteId.project_id = id;
    newQuoteId.quote_code = code;
    api
      .post('/projecttabquote/insertquote', newQuoteId)
      .then(() => {
        message('Quote inserted successfully.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  };

  // Work Insert
  const insertWorkOrder = async (code) => {
    const newWorkOrderId = workOrderForm;
    newWorkOrderId.project_id = id;
    newWorkOrderId.sub_con_worker_code = code;
    api
      .post('/projecttabsubconworkorder/insertsub_con_work_order', newWorkOrderId)
      .then(() => {
        message('WorkOrder inserted successfully.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  };
  const SubConWorkOrder = () => {
    api.post('/projecttabsubconworkorder/SubConWorkOrderPortal', { project_id: id }).then((res) => {
      setSubConWorkOrdeData(res.data.data);
    });
  };
  useEffect(() => {
    SubConWorkOrder();
  }, [id]);
  //generateCode
  const generateCodeQuote = (type) => {
    api
      .post('/commonApi/getCodeValue', { type })
      .then((res) => {
        insertQuote(res.data.data);
      })
      .catch(() => {
        insertQuote('');
      });
  };
  //generateCode
  const generateCode = () => {
    api
      .post('/tender/getCodeValue', { type: 'subConworkOrder' })
      .then((res) => {
        insertWorkOrder(res.data.data);
      })
      .catch(() => {
        insertWorkOrder('');
      });
  };
  useEffect(() => {
    getProjectById();
    TabDeliveryOrder();
   // getLineItem();
    //TabPurchaseOrderLineItemTable();
    getContactById();
    getJob();
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
     // TabPurchaseOrderLineItemTable();
    }, 2000);
  }, [addPurchaseOrderModal]);

  const getTotalOfPurchase = (pItems) => {
    let total = 0;
    pItems.forEach((a) => {
      const amount = parseFloat(parseFloat(a.qty) * parseFloat(a.cost_price));
      total += Number.isNaN(amount) ? 0 : amount;
    });  
    return total;
  };

  return (
    <>
      <BreadCrumbs />
      <ProjectButton
        UpdateData={UpdateData}
        navigate={navigate}
        applyChanges={applyChanges}
        deleteData={deleteData}
        backToList={backToList}
      ></ProjectButton>

      <ProjectEditForm projectDetail={projectDetail} setProjectDetail={setProjectDetail} />

      <ComponentCard title="More Details">
        <ToastContainer></ToastContainer>

        {/* Call Modal's */}

        <DuctingCostModal
          addDuctingCostModal={addDuctingCostModal}
          setAddDuctingCostModal={setAddDuctingCostModal}
        />
        <AddPurchaseOrderModal
          projectId={id}
          addPurchaseOrderModal={addPurchaseOrderModal}
          setAddPurchaseOrderModal={setAddPurchaseOrderModal}
        />
{/* 
        {viewQuotationsModal && (
          <ViewQuoteLogModal
            viewQuotationsModal={viewQuotationsModal}
            setViewQuotationsModal={setViewQuotationsModal}
            id={id}
          />
        )} */}
        <ViewLineItemModal viewLineModal={viewLineModal} setViewLineModal={setViewLineModal} />
        <EditQuotation editQuoteModal={editQuoteModal} setEditQuoteModal={setEditQuoteModal} />
        <EditDeliveryOrder
          editDeliveryOrder={editDeliveryOrder}
          setEditDeliveryOrder={setEditDeliveryOrder}
          data={deliveryData}
          tabdeliveryorder={tabdeliveryorder}
        />
        {editPo && <EditPoModal editPo={editPo} setEditPo={setEditPo} data={POId} />}
        {editPOLineItemsModal && (
          <EditPOLineItemsModal
            editPOLineItemsModal={editPOLineItemsModal}
            setEditPOLineItemsModal={setEditPOLineItemsModal}
            data={POId}
          />
        )} 
        <CreateFinance financeModal={financeModal} setFinanceModal={setFinanceModal} />
        <Tab toggle={toggle} tabs={tabs} />
        {/* Tab 1 */}
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1" eventkey="costingSummary">
            <CostingSummary></CostingSummary>
          </TabPane>
          {/* Tab 2 */}
          <TabPane tabId="2" eventkey="quotationMoreDetails">
            <QuotationMoreDetails
              // setViewQuotationsModal={setViewQuotationsModal}
              insertQuote={insertQuote}
              handleQuoteForms={handleQuoteForms}
              generateCodeQuote={generateCodeQuote}
              quotationsModal={quotationsModal}
              lineItem={lineItem}
              getLineItem={getLineItem}
              setquotationsModal={setquotationsModal}
              id={id}
            ></QuotationMoreDetails>
          </TabPane>
          {/* Tab 3 Materials Purchased */}
          <TabPane tabId="3" eventkey="materialPurchased">
            <MaterialPurchased
              addPurchaseOrderModal={addPurchaseOrderModal}
              setAddPurchaseOrderModal={setAddPurchaseOrderModal}
              insertDelivery={insertDelivery}
              addQtytoStocks={addQtytoStocks}
             // tabPurchaseOrderLineItemTable={tabPurchaseOrderLineItemTable}
             // setTabPurchaseOrderLineItemTable={setTabPurchaseOrderLineItemTable}
              testJsonData={testJsonData}
              setEditPo={setEditPo}
              setPOId={setPOId}
              setEditPOLineItemsModal={setEditPOLineItemsModal}
              getTotalOfPurchase={getTotalOfPurchase}
              handleCheck={handleCheck}
              setTransferModal={setTransferModal}
              setTransferItem={setTransferItem}
              // getCheckedPoProducts={getCheckedPoProducts}
              setViewLineModal={setViewLineModal}
            />
            {transferModal && (
              <TransferModal
                transferModal={transferModal}
                setTransferModal={setTransferModal}
                transferItem={transferItem}
              />
            )}
          </TabPane>

          {/* Tab 4 */}
          <TabPane tabId="4" eventkey="materialsusedTab">
            <MaterialsusedTab projectId={id} />
          </TabPane>

          {/* Tab 5 */}
          <TabPane tabId="5" eventkey="materialsTransferred">
            <MaterialsTransferred projectId={id} />
          </TabPane>

          {/* Start Tab Content 6  Delivery Order */}
          <TabPane tabId="6">
            <DeliveryOrder
              deleteDeliveryOrder={deleteDeliveryOrder}
              tabdeliveryorder={tabdeliveryorder}
              setTabdeliveryorder={setTabdeliveryorder}
              setDeliveryData={setDeliveryData}
              setEditDeliveryOrder={setEditDeliveryOrder}
              deliveryData={deliveryData}
              editDeliveryOrder={editDeliveryOrder}
            />
          </TabPane>

          {/* Start Tab Content 7  Subcon Work Order */}
          <TabPane tabId="7" eventkey="subConWorkOrderPortal">
            <Row className="mb-4">
              <Col md="2">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={(e) => {
                    
                    handleClientForms(e);
                    generateCode(e);
                  }}
                >
                  Add Work Order
                </Button>
              </Col>
            </Row>

            <Row>
              <CardTitle tag="h4" className="border-bottom bg-dark p-2 mb-0 text-white">
                {' '}
                Work Orders{' '}
              </CardTitle>
            </Row>

            <SubConWorkOrderPortal projectId={id} SubConWorkOrder={SubConWorkOrder}
            subConWorkOrdeData={subConWorkOrdeData} />
            {/* <SubconWorkPaymentHistory projectId={id} /> */}
          </TabPane>

          {/* Start Tab Content 8 */}
          <TabPane tabId="8" eventkey="claim">
            <Claim
              projectDetail={projectDetail}
              projectId={id}
              checkId={checkId}
              deliveryData={deliveryData}
              editPo={editPo}
              POId={POId}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              RoomName={RoomName}
              setRoomName={setRoomName}
              fileTypes={fileTypes}
              setFileTypes={setFileTypes}
              attachmentData={attachmentData}
              dataForAttachment={dataForAttachment}
            />
          </TabPane>

          {/* Start Tab Content 9 */}
          <TabPane tabId="9" eventkey="financeTab">
            <FinanceTab projectId={id} projectDetail={projectDetail}></FinanceTab>
          </TabPane>

         {/* Start Tab Content 10*/} 
          <TabPane tabId="10" eventkey="JobCompletion">
            <Row>
            {(addNewJobVisible && (Object.keys(joborder).length === 0) )&& (  
          <Col md="3">
        <Button color="primary"
         onClick={(e) => {       
          handleJobInputs(e);
          handleAddNewJob(e);
        }} >
            Add New Job</Button>
      </Col>
           )}
   
      <Col md="3">
        <Button color="primary" 
         onClick={() => {
          getJob();
          setEditJob(true)
        }}>
             Edit Job</Button>
      </Col> 
      <Col md="3">
        <Button color="primary" 
        onClick={() => {
          setJobOrderId(job.job_order_id);
          setAddLineItemModal(true);
        }}>
            Add Line Item</Button>
      </Col>
      <Col md="3">
        <Button color="primary" 
         onClick={() => {
          getJobLineItem(job.job_order_id);
        }}>
            View Line Item</Button>
      </Col>
      <Col md="3">
                    <Label className='pointer'>
                      <PdfJobCompletionCertificate  id={id} 
                      quoteId={id} ></PdfJobCompletionCertificate>
                      {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                    </Label>
                  </Col>
                  </Row>
            <JobCompletionTab handleJobInputs={handleJobInputs} handleInsertData={handleInsertData} addnewjob={addnewjob} setAddNewJob={setAddNewJob}  joborder={joborder} setJobOrder={setJobOrder} generateJobCode={generateJobCode}></JobCompletionTab>
            <EditJobModal
          editjob={editjob}
          handleInputs={handleInputs}
          EditJobDetails={EditJobDetails}
          setEditJob={setEditJob}
          getJob={getJob}
          job={job}
        ></EditJobModal>
            <AddLineItemModal
          addLineItemModal={addLineItemModal}
          setAddLineItemModal={setAddLineItemModal}       
          editLineModal={editLineModal}
          setEditLineModal={setEditLineModal}
          JobOrderId={JobOrderId}
          setEditLineModelItem={setEditLineModelItem}
        ></AddLineItemModal>
        <ViewLineJobItemmodal
        viewjobLineModal={viewjobLineModal}
        setViewJobLineModal={setViewJobLineModal}
        viewJobLineToggle={viewJobLineToggle}
        deleteJobItemRecord={deleteJobItemRecord}
        getJobLineItem={getJobLineItem}
        jobLineItem={jobLineItem}
        setEditJobLineModal={setEditJobLineModal}
        JobOrderId={JobOrderId}
        ></ViewLineJobItemmodal>
         <EditLineItemModal
        editJobLineModal={editJobLineModal}
        setEditJobLineModal={setEditJobLineModal}
        FetchLineItemData={editLineModelItem}
      >
        {' '}
      </EditLineItemModal>
          </TabPane>

          {/* Start Tab Content 10 */}
          <TabPane tabId="11" eventkey="addEmployee">
            <Row>
              <AddEmployee />
              <Col xs="12" md="3" className="mb-3">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    setRoomName('ProjectAttach');
                    setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                    dataForAttachment();
                    setAttachmentModal(true);
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>

            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="ProjectAttach Data"
              desc="ProjectAttach Data"
              recordType="Picture"
              mediaType={attachmentData.modelType}
              update={update}
              setUpdate={setUpdate}
            />
            <ViewFileComponentV2 moduleId={id} roomName="ProjectAttach" recordType="Picture"   update={update}
              setUpdate={setUpdate}/>
          </TabPane>

          {/* End Tab Content 10 */}
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default ProjectEdit;
