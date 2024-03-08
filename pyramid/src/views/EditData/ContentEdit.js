import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import Swal from 'sweetalert2';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ComponentCard from '../../components/ComponentCard';
//import ComponentCardV2 from '../../components/ComponentCardV2';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
//import PictureAttachmentModalV2 from '../../components/Tender/PictureAttachmentModalV2';
import message from '../../components/Message';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import ApiButton from '../../components/ApiButton';
import creationdatetime from '../../constants/creationdatetime';

const ContentUpdate = () => {
  // All state variables
  const [lineItem] = useState(null);
  const [RoomName, setRoomName] = useState('');
  const [contentDetails, setContentDetails] = useState();
  const [valuelist, setValuelist] = useState();
  const [sectionLinked, setSectionLinked] = useState();
  const [categoryLinked, setCategoryLinked] = useState();
  const [subcategoryLinked, setSubCategoryLinked] = useState();
  const [description, setDescription] = useState('');
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  // const [pictureData, setDataForPicture] = useState({
  //   modelType: '',
  // });
  const [fileTypes, setFileTypes] = useState('');
  const [update, setUpdate] = useState(false);
  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const backToList = () => {
    navigate('/Content');
  };
  const { loggedInuser } = useContext(AppContext);
  //Setting data in contentDetails
  const handleInputs = (e) => {
    setContentDetails({ ...contentDetails, [e.target.name]: e.target.value });
  };
  //setting data in Description Modal contentDetails
  const handleDataEditor = (e, type) => {
    setContentDetails({
      ...contentDetails,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    });
  };
  //Description Modal
  const convertHtmlToDraft = (existingQuoteformal) => {
    const contentBlock = htmlToDraft(existingQuoteformal && existingQuoteformal);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setDescription(editorState);
    }
  };
  // Get content data By content id
  const getContentById = () => {
    api
      .post('/content/getContentById', { content_id: id })
      .then((res) => {
        setContentDetails(res.data.data);
        convertHtmlToDraft(res.data.data.description);
      })
      .catch(() => {
       
      });
  };

   //Api call for getting valuelist dropdown
   const getValuelist = () => {
    api
      .get('/content/getValueList')
      .then((res) => {
        setValuelist(res.data.data);
      })
      .catch(() => {
        message('valuelist not found', 'info');
      });
  };
  //Edit Content
  const editContentData = () => {
    if (
      contentDetails.title !== '' &&
      contentDetails.title &&
      contentDetails.sub_category_id !== '' &&
      contentDetails.published !== ''
    ) {
      contentDetails.modification_date = creationdatetime;
      contentDetails.modified_by = loggedInuser.first_name;
      api
        .post('/content/editContent', contentDetails)
        .then(() => {
          message('Record edited successfully', 'success');
          
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  // const editContentData1 = () => {
  //   if (
  //     contentDetails.title !== '' &&
  //     contentDetails.sub_category_id !== '' &&
  //     contentDetails.published !== ''
  //   ) {
  //     api
  //       .post('/content/editContent', contentDetails)
  //       .then(() => {
  //         message('Record edited successfully', 'success');
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 400);
  //       })
  //       .catch(() => {
  //         message('Unable to edit record.', 'error');
  //       });
  //   } else {
  //     message('Please fill all required fields', 'warning');
  //   }
  // };
 // getting data from Section
 const getsection = () => {
  api.get('/content/getSection', sectionLinked).then((res) => {
    setSectionLinked(res.data.data);
  });
};
// getting data from Category
const getCategory = (sectionId) => {
  api.post('/section/getSectionCategoryById', { section_id: sectionId }).then((res) => {
    setCategoryLinked(res.data.data);
  });
};

// getting data from SubCategory
const getSubCategory = (categoryId) => {
  api.post('/section/getSectionSubCategoryById', { category_id: categoryId }).then((res) => {
    setSubCategoryLinked(res.data.data);
  });
};
useEffect(() => {
  if (contentDetails?.section_id) {
    // Use taskdetails.project_milestone_id directly to get the selected project ID
    const selectedSection = contentDetails.section_id;
    getCategory(selectedSection);
  }else{
    getCategory(null)
    getSubCategory(null)
  }
}, [contentDetails && contentDetails.section_id]);
useEffect(() => {
  if (contentDetails?.category_id) {
    // Use taskdetails.project_milestone_id directly to get the selected project ID
    const selectedcategory = contentDetails.category_id;
    getSubCategory(selectedcategory);
  }else{
    getSubCategory(null)
  }
}, [contentDetails && contentDetails.category_id]);

    //For delete data in db
    const deleteContentData = () => {
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
            .post('/content/deleteContent', { content_id: id })
            .then(() => {
              Swal.fire('Deleted!', 'Your Content has been deleted.', 'success');
              window.location.reload();
            });
        }
      });
    };

    // const deleteContentData = () => {
    //   api
    //     .post('/content/deleteContent', { content_id: id })
    //     .then(() => {
    //       message('Record deteled successfully', 'success');
    //     })
    //     .catch(() => {
    //       message('Unable to delete record.', 'error');
    //     });
    // };
  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };
  //Pictures
  // const dataForPicture = () => {
  //   setDataForPicture({
  //     modelType: 'picture',
  //   });
  // };
  useEffect(() => {
    getsection();
    getContentById();
    getValuelist();
    console.log(lineItem);
  }, [id]);

  return (
    <>
      <BreadCrumbs heading={contentDetails && contentDetails.title} />
      <Form>
        <FormGroup>
          {/* <ComponentCardV2>
            <Row>
              <Col>
                <Button
                  color="primary"
                  onClick={() => {
                    editContentData();
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button
                  color="secondary"
                  onClick={() => {
                    editContentData1();
                  }}
                >
                  Apply
                </Button>
              </Col>
              <Col>
                <Button
                  color="dark"
                  onClick={() => {
                    navigate('/Content');
                  }}
                >
                  Back to List
                </Button>
              </Col>
            </Row>
          </ComponentCardV2> */}
           <ApiButton
            editData={editContentData}
            navigate={navigate}
            //applyChanges={updateData}
            backToList={backToList}
            deleteData={deleteContentData}
            module="Content"
          ></ApiButton>
          {/* Content Details Form */}
          <ComponentCard title="Content details" creationModificationDate={contentDetails}>
            <ToastContainer></ToastContainer>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label> Title <span className="required"> *</span>{' '}</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contentDetails && contentDetails.title}
                    name="title"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Section title from section table */}
                  <Label>Section</Label>
                  <Input
                    type="select"
                    name="section_id"
                    value={contentDetails && contentDetails.section_id}
                    onChange={handleInputs}
                  >
                    <option value="" selected="selected">
                      Please Select
                    </option>
                    {sectionLinked &&
                      sectionLinked.map((ele) => {
                        return <option value={ele.section_id}>{ele.section_title}</option>;
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Category</Label>
                  <Input
                    type="select"
                    name="category_id"
                    value={contentDetails && contentDetails.category_id}
                    onChange={handleInputs}
                  >
                    <option value="" selected="selected">
                      Please Select
                    </option>
                    {categoryLinked &&
                      categoryLinked.map((ele) => {
                        return <option value={ele.category_id}>{ele.category_title}</option>;
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* subcategory title from sub Category table */}
                  <Label>Sub Category</Label>
                  <Input
                    type="select"
                    name="sub_category_id"
                    value={contentDetails && contentDetails.sub_category_id}
                    onChange={handleInputs}
                  >
                    <option value="" selected="selected">
                      Please Select
                    </option>
                    {subcategoryLinked &&
                      subcategoryLinked.map((ele) => {
                        return (
                          <option value={ele.sub_category_id}>{ele.sub_category_title}</option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Content Type</Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={contentDetails && contentDetails.content_type}
                    name="content_type"
                  >
                   <option defaultValue="selected">Please Select</option>
                    {valuelist &&
                      valuelist.map((e) => {
                        return (
                          <option key={e.value} value={e.value}>
                            {e.value}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
          {/* Content Details Form */}
          <ComponentCard title="Content details">
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label> Show Title</Label>
                  <br></br>
                  <Label> Yes </Label>
                  &nbsp;
                  <Input
                    name="show_title"
                    value="1"
                    type="radio"
                    defaultChecked={contentDetails && contentDetails.show_title === 1 && true}
                    onChange={handleInputs}
                  />
                   &nbsp;
                   &nbsp;
                  <Label> No </Label>
                  &nbsp;
                  <Input
                    name="show_title"
                    value="0"
                    type="radio"
                    defaultChecked={contentDetails && contentDetails.show_title === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Published</Label>
                  <br></br>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="published"
                    value="1"
                    type="radio"
                    defaultChecked={contentDetails && contentDetails.published === 1 && true}
                    onChange={handleInputs}
                  />
                   &nbsp;
                   &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="published"
                    value="0"
                    type="radio"
                    defaultChecked={contentDetails && contentDetails.published === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Content Date</Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={moment(contentDetails && contentDetails.content_date).format(
                      'YYYY-MM-DD',
                    )}
                    name="content_date"
                  />
                </FormGroup>
              </Col>
              {/* Description form */}
              <ComponentCard title="Description">
                <Editor
                  editorState={description}
                  wrapperClassName="demo-wrapper mb-0"
                  editorClassName="demo-editor border mb-4 edi-height"
                  onEditorStateChange={(e) => {
                    handleDataEditor(e, 'description');
                    setDescription(e);
                  }}
                />
              </ComponentCard>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
      {/* Picture and Attachments Form */}
      <Form>
        <FormGroup>
          {/* <ComponentCard title="Picture">
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  color="primary"
                  onClick={() => {
                    dataForPicture();
                    setAttachmentModal(true);
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>
            <PictureAttachmentModalV2
              moduleId={id}
              roomName="Content"
              altTagData="Content Data"
              desc="Content Data"
              modelType={pictureData.modelType}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
            />
            <ViewFileComponentV2 moduleId={id} roomName="Content" />
          </ComponentCard> */}
          <ComponentCard title="Attachments">
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  color="primary"
                  onClick={() => {
                    setRoomName('Staff');
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

      <br />
    </>
  );
};
export default ContentUpdate;