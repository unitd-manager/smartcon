import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import ComponentCard from '../../components/ComponentCard';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import CpfCalculatorMainDetails from '../../components/CpfCalculatorTable/CpfCalculatorMainDetails';
import ApiButton from '../../components/ApiButton';
import creationdatetime from '../../constants/creationdatetime';
//import ComponentCardV2 from '../../components/ComponentCardV2';

const CpfCalculatorEdit = () => {
  //Const Variables

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [cpfRecordDetails, setCpfRecordDetails] = useState({});
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });

  const [update, setUpdate] = useState(false);

  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  // Button Save Apply Back List
  const applyChanges = () => {};
  const backToList = () => {
    navigate('/CPFCalculator');
  };
  const [total, setTotal] = useState(0);
  const { loggedInuser } = useContext(AppContext);

  // Calculate and update the total whenever by_employee or by_employer changes
  useEffect(() => {
    const byEmployee = parseFloat(cpfRecordDetails && cpfRecordDetails.by_employee) || 0;
    const byEmployer = parseFloat(cpfRecordDetails && cpfRecordDetails.by_employer) || 0;
    
    // Calculate the total and set it in the state
    const newTotal = byEmployee + byEmployer;
    setTotal(newTotal);
  }, [cpfRecordDetails.by_employee, cpfRecordDetails.by_employer]);


  const [totalCapamount, setTotalCapAmount] = useState(0);

  // Calculate and update the total whenever by_employee or by_employer changes
  useEffect(() => {
    const byCapEmployee = parseFloat(cpfRecordDetails && cpfRecordDetails.cap_amount_employer) || 0;
    const byCapEmployer = parseFloat(cpfRecordDetails && cpfRecordDetails.cap_amount_employee) || 0;
    
    // Calculate the total and set it in the state
    const newTotalCapAmount = byCapEmployee + byCapEmployer;
    setTotalCapAmount(newTotalCapAmount);
  }, [cpfRecordDetails.cap_amount_employer, cpfRecordDetails.cap_amount_employee]);

  // Get Leaves By Id
  const editCpfRecordById = () => {
    api
      .post('/cpfCalculator/getCpfCalculatorRecordById', { cpf_calculator_id: id })
      .then((res) => {
        setCpfRecordDetails(res.data.data[0]);
      })
      .catch(() => {
        //message('leaves Data Not Found', 'info');
      });
  };
  //Leave Functions/Methods
  const handleInputs = (e) => {
    setCpfRecordDetails({ ...cpfRecordDetails, [e.target.name]: e.target.value });
  };
  // Attachment
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  //Logic for edit data in db
  const editCpfCalculator = () => {
    if (
      cpfRecordDetails.from_age !== '' &&
      cpfRecordDetails.to_age !== ''
    )
    {
    cpfRecordDetails.modification_date = creationdatetime;
    cpfRecordDetails.modified_by = loggedInuser.first_name;
    api
      .post('/cpfCalculator/editCpfCalculator', cpfRecordDetails)
      .then(() => {
        message('Record editted successfully', 'success');
        console.log('cpfRecordDetails',cpfRecordDetails)
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const deleteData = () => {
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
        api.post('/cpfCalculator/deleteCpfCalculator', { cpf_calculator_id: id }).then(() => {
          Swal.fire('Deleted!', 'Your employee has been deleted.', 'success');
          window.location.reload();
        });
      }
    });
  };

 
  useEffect(() => {
    editCpfRecordById();
  }, [id]);

  return (
    <>
      {/* BreadCrumbs */}
      <BreadCrumbs heading={cpfRecordDetails && cpfRecordDetails.employee_name} />
      {/* Button */}
      <Form>
        <FormGroup>
          
            <ApiButton
              editData={editCpfCalculator}
              navigate={navigate}
              applyChanges={applyChanges}
              backToList={backToList}
              deleteData={deleteData}
              module="CPF Calculater"
            ></ApiButton>
      
        </FormGroup>
      </Form>
      <ToastContainer></ToastContainer>
      {/* Main Details */}
      <CpfCalculatorMainDetails
        handleInputs={handleInputs}
        cpfRecordDetails={cpfRecordDetails}
        total={total}
        totalCapamount={totalCapamount}
      ></CpfCalculatorMainDetails>

      {/* Nav tab */}
      <ComponentCard title="Attachment">
        <Form>
          <FormGroup>
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    setRoomName('CpfCalculator');
                    setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                    dataForAttachment();
                    setAttachmentModal(true);
                  }}
                >
                  <Icon.File className="rounded-circle" width="20" />
                </Button>
              </Col>
            </Row>
            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="CpfCalculator Data"
              desc="CpfCalculator Data"
              recordType="CpfCalculator Picture"
              mediaType={attachmentData.modelType}
              update={update}
              setUpdate={setUpdate}
            />
            <ViewFileComponentV2
              moduleId={id}
              roomName="CpfCalculator"
              recordType="CpfCalculatorPicture"
              update={update}
              setUpdate={setUpdate}
            />
          </FormGroup>
        </Form>
      </ComponentCard>
    </>
  );
};
export default CpfCalculatorEdit;
