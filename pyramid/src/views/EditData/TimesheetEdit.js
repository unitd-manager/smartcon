import React, { useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import ComponentCardV2 from '../../components/ComponentCardV2';
import ApiButton from '../../components/ApiButton';

const TimesheetEdit = () => {
  const [timesheetDetails, setPurchaseOrderDetails] = useState();
  const [staffLinked, setStaffLinked] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputs = (e) => {
    setPurchaseOrderDetails({ ...timesheetDetails, [e.target.name]: e.target.value });
  };
  const getStaff = () => {
    api.get('/timesheet/getStaff', staffLinked).then((res) => {
      setStaffLinked(res.data.data);
    });
  };
  const editPurchaseOrderById = () => {
    api
      .post('/timesheet/getTimeSheetByAttendanceId', { attendance_id: id })
      .then((res) => {
        setPurchaseOrderDetails(res.data.data[0]);
      })
      .catch(() => {
        message('Purchase Order Data Not Found', 'info');
      });
  };
  const editTimesheetData = () => {
    api
      .post('/timesheet/editTimeSheet', timesheetDetails)
      .then(() => {
        message('Record edited successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  useEffect(() => {
    editPurchaseOrderById();
    getStaff();
  }, [id]);
  const backToList = () => {
    navigate('/Leave');
  };

  return (
    <>
      <BreadCrumbs heading={timesheetDetails && timesheetDetails.staff_id} />

      <Form>
        <FormGroup>
          <ComponentCardV2>
            <ApiButton
              editData={editTimesheetData}
              navigate={navigate}
              applyChanges={editTimesheetData}
              backToList={backToList}
              module="Timesheet"
            ></ApiButton>
          </ComponentCardV2>
          <ComponentCard title="`Details">
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Staff</Label>
                  <Input
                    type="select"
                    name="staff_id"
                    value={timesheetDetails && timesheetDetails.staff_id}
                    onChange={handleInputs}
                  >
                    <option value="" selected="selected">
                      Please Select
                    </option>
                    {staffLinked &&
                      staffLinked.map((ele) => {
                        return <option value={ele.staff_id}>{ele.staff_name}</option>;
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={
                      timesheetDetails &&
                      moment(timesheetDetails.creation_date).format('YYYY-MM-DD')
                    }
                    name="creation_date"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> On Leave</Label>
                  <br></br>
                  <Label> Yes </Label>
                  <Input
                    name="on_leave"
                    value="1"
                    type="radio"
                    defaultChecked={timesheetDetails && timesheetDetails.show_title === 1 && true}
                    onChange={handleInputs}
                  />
                  <Label> No </Label>
                  <Input
                    name="on_leave"
                    value="0"
                    type="radio"
                    defaultChecked={timesheetDetails && timesheetDetails.show_title === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Type Of Leave</Label>
                  <Input
                    value={timesheetDetails && timesheetDetails.type_of_leave}
                    type="select"
                    onChange={handleInputs}
                    name="type_of_leave"
                  >
                    <option value="">Please Select</option>
                    <option value="earning leave">Earning Leave</option>
                    <option value="sick leave">Sick Leave</option>
                    <option value="loss of pay">Loss of Pay</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Latitude</Label>
                  <Input
                    value={timesheetDetails && timesheetDetails.latitude}
                    type="text"
                    onChange={handleInputs}
                    name="latitude"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Longitude</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={timesheetDetails && timesheetDetails.longitude}
                    name="longitude"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    type="textarea"
                    value={timesheetDetails && timesheetDetails.notes}
                    onChange={handleInputs}
                    name="notes"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Time in (HH:MM)</Label>
                  <Input
                    type="textarea"
                    value={timesheetDetails && timesheetDetails.time_in}
                    onChange={handleInputs}
                    name="time_in"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Time out (HH:MM)</Label>
                  <Input
                    type="textarea"
                    value={timesheetDetails && timesheetDetails.leave_time}
                    onChange={handleInputs}
                    name="leave_time"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    type="textarea"
                    value={timesheetDetails && timesheetDetails.description}
                    onChange={handleInputs}
                    name="description"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Created By</Label>
                  <Input
                    type="text"
                    value={timesheetDetails && timesheetDetails.created_by}
                    onChange={handleInputs}
                    name="created_by"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Modified By</Label>
                  <Input
                    type="text"
                    value={timesheetDetails && timesheetDetails.modified_by}
                    onChange={handleInputs}
                    name="modified_by"
                  />
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
};

export default TimesheetEdit;
