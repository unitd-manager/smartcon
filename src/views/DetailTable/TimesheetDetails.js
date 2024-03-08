// import React, {useEffect, useState} from 'react';
// import {
//     Card,
//     CardBody,
//     Row,
//     Col,
//     Form,
//     FormGroup,
//     Label,
//     Input,
//     Button,Modal, ModalHeader, ModalBody,ModalFooter
//   } from 'reactstrap';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
// import ComponentCard from '../../components/ComponentCard';
// import api from '../../constants/api';

// const TimesheetDetails = () => {
//     const [modal, setModal] = useState(false);
//     const [staffLinked, setStaffLinked] = useState();
//     const [staffLinked, setStaffLinked] = useState();

//     const toggle = () => {
//       setModal(!modal);
//     };
//     const getStaff = () => {
//       api.get('/timesheet/getStaff', staffLinked).then((res) => {
//         setStaffLinked(res.data.data);
//       });
//     };
//       //Insert Content Data
//   const insertTimesheetData = () => {  
//     api.post('/timesheet/insertTimesheet', timesheetDetails)
//     .then((res) => {
//       const insertedDataId= res.data.data.insertId
//       console.log(insertedDataId)
//       message('Content inserted successfully.','success')
//       setTimeout(()=> {
//         navigate(`/ContentEdit/${insertedDataId}`)
//       },300);     
//     })
//     .catch(() => {
//       message('Unable to edit record.', 'error')
//     })
//   }
//     useEffect(() => {
//       getStaff();
//     }, []);
//   return (
//     <div>
//       <BreadCrumbs />
//       <Row>
//         <Col md="12">
//           <ComponentCard title="Key Details">
//             <Form>
//               <FormGroup>
//                 <Row>
//                 <Col md="3">
//                 <FormGroup>
//                   <Label>Staff</Label>
//                   <Input type="select" name="staff_id" value={timesheetDetails && timesheetDetails.staff_id} onChange={handleInputs}>
//                     <option value="" selected="selected">
//                       Please Select
//                     </option>
//                     {staffLinked && staffLinked.map((ele) => {
//                         return (
//                           <option value={ele.staff_id}>{ele.staff_name}</option>
//                         );})}
//                   </Input>
//                 </FormGroup>
//               </Col>
//                 {/* <Col md="2">
//                     <Label>Add New Customer</Label>
//                     <Button color="primary" onClick={toggle.bind(null)}>Add New</Button>
//                 </Col> */}
//                 </Row>
//                 <Row>
//                     <div className="pt-3 mt-3 d-flex align-items-center gap-2">
//                         <Button type="submit" className="btn btn-success mr-2">
//                         Save & Continue
//                         </Button>
//                         <Button type="submit" className="btn btn-dark">
//                         Cancel
//                         </Button>
//                      </div>
//                 </Row>
//               </FormGroup>
//             </Form>
//           </ComponentCard>
//         </Col>
        
//       </Row>
//       <Modal isOpen={modal} toggle={toggle.bind(null)}>
//       <ModalHeader toggle={toggle.bind(null)}>New Customer</ModalHeader>
//       <ModalBody>
//         <Row>
//         <Col md="12">
//           <Card>
//             <CardBody>
//               <Form>
//                 <Row>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Name</Label>
//                       <Input type="text" />
//                     </FormGroup>
//                   </Col>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Phone</Label>
//                       <Input type="text"  />
//                     </FormGroup>
//                   </Col>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Website</Label>
//                       <Input type="text"  />
//                     </FormGroup>
//                   </Col>
//                   <Col md="12">
//                   <FormGroup>
//                     <Label>Address 1</Label>
//                     <Input type="text" placeholder=" " />
//                   </FormGroup>
//                 </Col>
//                 <Col md="12">
//                   <FormGroup>
//                     <Label>Address 2</Label>
//                     <Input type="text" placeholder="" />
//                   </FormGroup>
//                 </Col>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Area</Label>
//                       <Input type="text"  />
//                     </FormGroup>
//                   </Col>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Zip Code</Label>
//                       <Input type="text"  />
//                     </FormGroup>
//                   </Col>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Latitude</Label>
//                       <Input type="text"  />
//                     </FormGroup>
//                   </Col>
//                   <Col md="12">
//                     <FormGroup>
//                       <Label>Longitude</Label>
//                       <Input type="text"  />
//                     </FormGroup>
//                   </Col>   
//                 </Row>
//               </Form>
//             </CardBody>

//           </Card>
//         </Col>
//         </Row>  
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={toggle.bind(null)}>
//           Save & Continue
//         </Button>
//         <Button color="secondary" onClick={toggle.bind(null)}>
//           Cancel
//         </Button>
//       </ModalFooter>
//     </Modal>
//     </div>
//   );
// };

// export default TimesheetDetails;
