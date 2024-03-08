import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Button,
  Form
  
} from 'reactstrap';
import PropTypes from 'prop-types';
//import { useParams } from 'react-router-dom';
import api from '../../constants/api';
import message from '../Message';

const EditRateItemModal = ({
  editRateModal,
  setEditRateModal,
  FetchRateItemData

}) => {
  EditRateItemModal.propTypes = {
    editRateModal: PropTypes.bool,
    setEditRateModal: PropTypes.func,
    FetchRateItemData: PropTypes.object,
    //rateItem: PropTypes.object,
    
  };

 // const { id } = useParams();
  const [rateItemData, setRateItemData] = useState(null);

  // const [rateItemData, setrateItemData] = useState(rateItemDatas);
  // const [conditions, setConditions] = useState('');
  // const [lineItems, setLineItem] = useState('');

  const handleData = (e) => {
    setRateItemData({ ...rateItemData, [e.target.name]: e.target.value });
  };

  // const getQuote = () => {
  //   api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
  //     setrateItemData(res.data.data[0]);
  //   });
  // };
  
  

  
  const GetEditRate = () => {
    api
      .post('/tender/edit-TabQuoteRate', rateItemData)
      .then(() => {
        message('Rate Item Edited Successfully.', 'success');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        message('Unable to edit quote. please fill all fields', 'error');
      });
  };

  React.useEffect(() => {
    // getQuote();
     setRateItemData(FetchRateItemData);
   }, [FetchRateItemData]);

  return (
    <>
      {/*  Edit Quote Modal */}
      <Modal size="lg" isOpen={editRateModal}>
        <ModalHeader>
          Edit Rate Items
          <Button
            color="secondary"
            onClick={() => {
              setEditRateModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Designation</Label>
                    <Input
                      type="text"
                      name="designation"
                      value={rateItemData && rateItemData.designation}
                      onChange={handleData}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Mon-Fri Normal</Label>
                    <Input
                      value={rateItemData && rateItemData.mon_to_fri_normal_hr}
                      type="text"
                      onChange={handleData}
                      name="mon_to_fri_normal_hr"
                    >
                      
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Mon-Fri OT</Label>
                    <Input
                      type="text"
                      name="mon_to_fri_ot_hr"
                      value={rateItemData && rateItemData.mon_to_fri_ot_hr}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Mon-Sat Normal</Label>
                    <Input
                      type="text"
                      name="mon_to_sat_normal_hr"
                      defaultValue={rateItemData && rateItemData.mon_to_sat_normal_hr}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Public Holiday</Label>
                    <Input
                      type="text"
                      name="sunday_public_holiday"
                      defaultValue={rateItemData && rateItemData.sunday_public_holiday}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Meal Chargeable</Label>
                    <Input
                      type="text"
                      name="meal_chargeable"
                      defaultValue={rateItemData && rateItemData.meal_chargeable}
                      onChange={handleData}
                    >
                      
                    </Input>
                  </FormGroup>
                </Col>

                <Col md="4">
                  <FormGroup>
                    <Label>Shift Allowance</Label>
                    <Input
                      type="text"
                      name="night_shift_allowance"
                      defaultValue={rateItemData && rateItemData.night_shift_allowance}
                      onChange={handleData}
                    >
                      
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              

              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="btn shadow-none mr-2"
                    onClick={() => {
                      
                      GetEditRate();
                      // setrateItemData();
                      setEditRateModal(false);
                      //insertquoteLogLine();
                    }}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    color="secondary"
                    className="shadow-none"
                    onClick={() => {
                      setEditRateModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Row>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      {/* END Edit Quote Modal */}
    </>
  );
};

export default EditRateItemModal;
