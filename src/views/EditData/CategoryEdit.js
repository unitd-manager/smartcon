import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';
//import CategoryButton from '../../components/CategoryTable/CategoryButton';
import CategoryDetailComp from '../../components/CategoryTable/CategoryDetailComp';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';

const CategoryEdit = () => {
  //All state variables
  const [categoryDetails, setCategoryDetails] = useState();
  const [section, setSection] = useState();
  const [valuelist, setValuelist] = useState();

  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  // // Button Save Apply Back List
  // const applyChanges = () => {};
  // const saveChanges = () => {
  //   if (categoryDetails.category_title !== '') {
  //     navigate('/Category');
  //   }
  // };
  const backToList = () => {
    navigate('/Category');
  };

  //Api call for getting section dropdown
  const getSection = () => {
    api
      .get('/category/getSectionTitle')
      .then((res) => {
        setSection(res.data.data);
      })
      .catch(() => {
        message('Section not found', 'info');
      });
  };

  //Api call for getting valuelist dropdown
  const getValuelist = () => {
    api
      .get('/category/get-ValueList')
      .then((res) => {
        setValuelist(res.data.data);
      })
      .catch(() => {
        message('valuelist not found', 'info');
      });
  };

  const handleInputs = (e) => {
    setCategoryDetails({ ...categoryDetails, [e.target.name]: e.target.value });
  };

  // Get Category By Id
  const CategoryById = () => {
    api
      .post('/category/getCategoryById', { category_id: id })
      .then((res) => {
        setCategoryDetails(res.data.data[0]);
      })
      .catch(() => {
        message('category Data Not Found', 'info');
      });
  };

  //Logic for edit data in db
  const editCategoryData = () => {
    categoryDetails.modification_date = creationdatetime;
    categoryDetails.modified_by = loggedInuser.first_name;
    if (categoryDetails.category_title !== '') {
      api
        .post('/category/edit-Category', categoryDetails)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  //For delete data in db
  const deleteCategoryData = () => {
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
          .post('/category/deleteCategory', { category_id: id })
          .then(() => {
            Swal.fire('Deleted!', 'Your Category has been deleted.', 'success');
            window.location.reload();
          });
      }
    });
  };

  // const deleteCategoryData = () => {
  //   api
  //     .post('/category/deleteCategory', { category_id: id })
  //     .then(() => {
  //       message('Record deteled successfully', 'success');
  //     })
  //     .catch(() => {
  //       message('Unable to delete record.', 'error');
  //     });
  // };

  useEffect(() => {
    CategoryById();
    getSection();
    getValuelist();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>

      {/* Button */}
      {/* <CategoryButton
        editCategoryData={editCategoryData}
        navigate={navigate}
        applyChanges={applyChanges}
        saveChanges={saveChanges}
        deleteCategoryData={deleteCategoryData}
        backToList={backToList}
        id={id}
      ></CategoryButton> */}
<ApiButton
            editData={editCategoryData}
            navigate={navigate}
            //applyChanges={updateData}
            backToList={backToList}
            deleteData={deleteCategoryData}
            module="Category"
          ></ApiButton>

      {/* More details*/}
      <CategoryDetailComp
        categoryDetails={categoryDetails}
        handleInputs={handleInputs}
        section={section}
        valuelist={valuelist}
      ></CategoryDetailComp>
    </>
  );
};
export default CategoryEdit;
