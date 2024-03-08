import React, { useContext,useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
//import SubCategoryButton from '../../components/SubCategoryTable/SubCategoryButton';
import SubCategoryEditDetails from '../../components/SubCategoryTable/SubCategoryEditDetails';
import SubCategoryPageMetaData from '../../components/SubCategoryTable/SubCategoryPageMetaData';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';
import AppContext from '../../context/AppContext';

const SubCategoryEdit = () => {
  // All state variables
  const [category, setCategory] = useState();
  const [subcategoryeditdetails, setSubCategoryEditDetails] = useState();
  const [subcategorytypedetails, setSubCategoryTypetDetails] = useState();
  const { loggedInuser } = useContext(AppContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  //All Functions/Methods

  //Setting Data in SubCategory Edit Details
  const handleInputs = (e) => {
    setSubCategoryEditDetails({ ...subcategoryeditdetails, [e.target.name]: e.target.value });
  };

  // Route Change
  // const applyChanges = () => {};
  // const saveChanges = () => {
  //   if (subcategoryeditdetails.sub_category_title !== '') {
  //     navigate('/SubCategory');
  //   }
  //   window.location.reload();
  // };
  const backToList = () => {
    navigate('/SubCategory');
  };

  //Api call for Category Dropdown data
  const getCategory = () => {
    api
      .get('/subcategory/getCategory')
      .then((res) => {
        setCategory(res.data.data);
      })
      .catch(() => {
        message('SubCategory Data Not Found', 'info');
      });
  };

  //Api call for Editting SubCategory By Id
  const editSubCategoryById = () => {
    api
      .post('/subcategory/getSubCategoryById', { sub_category_id: id })
      .then((res) => {
        const resObj = res.data.data[0];
        if (!resObj.sub_category_type) {
          resObj.sub_category_type = 'Content';
        }
        setSubCategoryEditDetails(resObj);
      })
      .catch(() => {
        message('SubCategory Data Not Found', 'info');
      });
  };

  //Api call for getting Staff Type From Valuelist
  const getSubCategoryType = () => {
    api
      .get('/subcategory/getSubCategoryTypeFromValueList')
      .then((res) => {
        setSubCategoryTypetDetails(res.data.data);
      })
      .catch(() => {
        message('SubCategory Type Data Not Found', 'info');
      });
  };

  //Api call for Editing SubCategory Details
  const editSubCategoryData = () => {
    setFormSubmitted(true);
    subcategoryeditdetails.modification_date = moment().format('DD-MM-YYYY');
    if (subcategoryeditdetails.sub_category_title !== '') {
      subcategoryeditdetails.modification_date = creationdatetime;
      subcategoryeditdetails.modified_by = loggedInuser.first_name;
      api
        .post('/subcategory/editSubCategory', subcategoryeditdetails)
        .then(() => {
          message('Record editted successfully', 'success');
          editSubCategoryById();
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  //Api call for Deleting SubCategory Details
  const deleteSubCategoryData = () => {
    api
      .post('/subcategory/deleteSubCategory', { sub_category_id: id })
      .then(() => {
        message('Record deleted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    editSubCategoryById();
    getCategory();
    getSubCategoryType();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />
      {/* SubCategory Button Details */}
      {/* <SubCategoryButton
        saveChanges={saveChanges}
        applyChanges={applyChanges}
        backToList={backToList}
        editSubCategoryData={editSubCategoryData}
        deleteSubCategoryData={deleteSubCategoryData}
        navigate={navigate}
        id={id}
      ></SubCategoryButton> */}
<ApiButton
            editData={editSubCategoryData}
            navigate={navigate}
            //applyChanges={updateData}
            backToList={backToList}
            deleteData={deleteSubCategoryData}
            module="SubCategory"
          ></ApiButton>
      {/* Sub Category  Details */}
    
      <SubCategoryEditDetails
        subcategoryeditdetails={subcategoryeditdetails}
        handleInputs={handleInputs}
        category={category}
        subcategorytypedetails={subcategorytypedetails}
        formSubmitted={formSubmitted}
      ></SubCategoryEditDetails>

      {/* Page Meta Data Details */}
      <SubCategoryPageMetaData
        subcategoryeditdetails={subcategoryeditdetails}
        handleInputs={handleInputs}
      ></SubCategoryPageMetaData>
    </>
  );
};

export default SubCategoryEdit;
