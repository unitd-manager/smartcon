import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Form, FormGroup, Button } from 'reactstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icon from 'react-feather';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import message from '../../components/Message';
import api from '../../constants/api';
import KeyStaffDetails from '../../components/StaffTable/KeyStaffDetails';
import KeyStaffAddress from '../../components/StaffTable/KeyStaffAddress';
//import StaffButton from '../../components/StaffTable/StaffButton';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';
import AppContext from '../../context/AppContext';

const StaffEdit = () => {
  // All state variables
  const [staffeditdetails, setStaffEditDetails] = useState();
  const [stafftypedetails, setStaffTypetDetails] = useState();
  const [staffteamdetails, setStaffTeamDetails] = useState();
  const [userdetails, setUserDetails] = useState();
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [allCountries, setallCountries] = useState([]);
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [update, setUpdate] = useState(false);

  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  //All Functions/Methods
  //  AttachmentModal
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  //attachment for upload file
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  //Setting Data in Staff Details
  const handleInputs = (e) => {
    setStaffEditDetails({ ...staffeditdetails, [e.target.name]: e.target.value });
  };
 

  // Route Change
  // const applyChanges = () => {};
  // const saveChanges = () => {
  //   if (!staffeditdetails.email) {
  //     message('Email is required', 'warning');
  //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(staffeditdetails.email)) {
  //     message('Enter valid email', 'warning');
  //   } else if (staffeditdetails.email !== '' && staffeditdetails.first_name !== '') {
  //     navigate('/Staff');
  //   }
  //   window.location.reload();
  // };
  const backToList = () => {
    navigate('/Staff');
  };

  //Api call for getting Staff Data By ID
  const editStaffById = () => {
    api
      .post('/staff/getStaffById', { staff_id: id })
      .then((res) => {
        const resObj = res.data.data;
        if (!resObj.status) {
          resObj.status = 'Current';
        }
        if (!resObj.user_group_id) {
          resObj.user_group_id = '1';
        }
        setStaffEditDetails(resObj);
      })
      .catch(() => {
        message('Staff Data Not Found', 'info');
      });
  };

  //Api call for Editing Staff Details
  const { loggedInuser } = useContext(AppContext);

  const editStaffData = () => {
    staffeditdetails.modification_date = creationdatetime;
    staffeditdetails.modified_by = loggedInuser.first_name;
    if (!staffeditdetails.email) {
      message('Email is required', 'warning');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(staffeditdetails.email)) {
      message('Enter valid email', 'warning');
    } else if (staffeditdetails.email !== '' && staffeditdetails.first_name !== '') {
      api
        .post('/staff/editStaff', staffeditdetails)
        .then(() => {
          message('Record editted successfully', 'success');
          editStaffById();
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  //Api call for getting Staff Type From Valuelist
  const getStaffType = () => {
    api
      .get('/staff/getStaffTypeFromValueList')
      .then((res) => {
        setStaffTypetDetails(res.data.data);
      })
      .catch(() => {
        message('Staff Data Not Found', 'info');
      });
  };

  //Api call for getting Staff Team From Valuelist
  const getStaffTeam = () => {
    api
      .get('/staff/getStaffTeamFromValueList')
      .then((res) => {
        setStaffTeamDetails(res.data.data);
      })
      .catch(() => {
        message('Staff Data Not Found', 'info');
      });
  };

  //Api call for getting User Group Data
  const getUserGroup = () => {
    api
      .get('/staff/getUserGroup')
      .then((res) => {
        setUserDetails(res.data.data);
      })
      .catch(() => {
        message('Staff Data Not Found', 'info');
      });
  };

  //Api call for Deleting Staff Data
  const deleteStaffData = () => {
    api
      .post('/staff/deleteStaff', { staff_id: id })
      .then(() => {
        message('Record deleted successfully', 'success');
        setTimeout(() => {
          backToList();
          window.location.reload()
         
      }, 400);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  //Api for getting all countries
  const getAllCountries = () => {
    api
      .get('/staff/getCountry')
      .then((res) => {
        setallCountries(res.data.data);
      })
      .catch(() => {
        message('Country Data Not Found', 'info');
      });
  };

  useEffect(() => {
    getStaffType();
    getStaffTeam();
    getUserGroup();
    editStaffById();
    getAllCountries();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />

      {/* Staff Edit Buttons */}
      {/* <StaffButton
        navigate={navigate}
        saveChanges={saveChanges}
        applyChanges={applyChanges}
        backToList={backToList}
        editStaffData={editStaffData}
        deleteStaffData={deleteStaffData}
        id={id}
      ></StaffButton> */}
      <ApiButton
        editData={editStaffData}
        navigate={navigate}
        applyChanges={editStaffData}
        backToList={backToList}
        deleteData={deleteStaffData}
        module="Staff"
      ></ApiButton>
      {/* KeyStaffDetails */}
      {/* <BreadCrumbs heading={staffeditdetails && staffeditdetails.staff_id} /> */}
      <KeyStaffDetails
        stafftypedetails={stafftypedetails}
        staffeditdetails={staffeditdetails}
        handleInputs={handleInputs}
        userdetails={userdetails}
        staffteamdetails={staffteamdetails}
      ></KeyStaffDetails>

      {/* KeyStaffAddress */}
      <KeyStaffAddress
        staffeditdetails={staffeditdetails}
        handleInputs={handleInputs}
        allCountries={allCountries}
      ></KeyStaffAddress>

      {/* Picture Attachment */}
      <Form>
        <FormGroup>
          <ComponentCard title="Picture">
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    setRoomName('Staff');
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
              altTagData="StaffRelated Data"
              desc="StaffRelated Data"
              recordType="RelatedPicture"
              mediaType={attachmentData.modelType}
              update={update}
              setUpdate={setUpdate}
            />
            <ViewFileComponentV2
              moduleId={id}
              roomName="Staff"
              recordType="RelatedPicture"
              update={update}
              setUpdate={setUpdate}
            />
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
};

export default StaffEdit;
