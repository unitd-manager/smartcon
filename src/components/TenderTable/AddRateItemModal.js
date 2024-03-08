import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import api from '../../constants/api';
import message from '../Message';

const AddRateItemModal = ({ rateModal, setRateModal, projectInfo, quoteLine }) => {
  AddRateItemModal.propTypes = {
    rateModal: PropTypes.bool,
    setRateModal: PropTypes.func,
    projectInfo: PropTypes.any,
    quoteLine: PropTypes.any,
  };

  const [addRateItem, setAddRateItem] = useState([
    {
      id: new Date().getTime().toString(),
      mon_to_fri_normal_hr: '',
      mon_to_fri_ot_hr: '',
      mon_to_sat_normal_hr: '',
      sunday_public_holiday: '',
      meal_chargeable: '',
      night_shift_allowance: '',
      designation: '',
    },
  ]);

  const handleInputChange = (id, field, value) => {
    setAddRateItem((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const AddNewLineItem = () => {
    setAddRateItem([
      ...addRateItem,
      {
        id: new Date().getTime().toString(),
        mon_to_fri_normal_hr: '',
        mon_to_fri_ot_hr: '',
        mon_to_sat_normal_hr: '',
        sunday_public_holiday: '',
        meal_chargeable: '',
        night_shift_allowance: '',
        designation: '',
      },
    ]);
  };

  const ClearValue = (ind) => {
    setAddRateItem((current) =>
      current.filter((obj) => obj.id !== ind.id)
    );
  };

  const [designationdetails, setdesignationdetails] = useState([]);

  const getDesignation = () => {
    api.get('/tender/getDesignationFromValueList', designationdetails).then((res) => {
      const items = res.data.data;
      const finaldat = items.map((item) => ({
        value: item.value,
        label: item.value,
      }));
      setdesignationdetails(finaldat);
    });
  };

  const getAllValues = () => {
    addRateItem.forEach((element) => {
      if (element.designation !== '') {
        api
          .post('/tender/insertRateItems', {
            ...element,
            opportunity_id: projectInfo,
            quote_id: quoteLine,
          })
          .then(() => {
            message('Line Item Added Successfully', 'success');
            setRateModal(false);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch(() => {
            message('Cannot Add Line Items', 'error');
          });
      } else {
        message('Please fill all required fields', 'warning');
      }
    });
  };

  useEffect(() => {
    getDesignation();
  }, []);

  return (
    <>
      <Modal size="xl" isOpen={rateModal}>
        <ModalHeader>
          Add Rate Items
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setRateModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Form>
                <Row>
                  <Col md="3" className="mb-4">
                    <Button
                      className="shadow-none"
                      color="primary"
                      type="button"
                      onClick={AddNewLineItem}
                    >
                      Add Line Item
                    </Button>
                  </Col>
                </Row>
                <table className="lineitem">
                  <thead>
                    <tr>
                      <th scope="col">Designation <span className="required"> *</span>{' '}</th>
                      <th scope="col">Mon-Fri Normal </th>
                      <th scope="col">Mon-Fri OT</th>
                      <th scope="col">Mon-Sat Normal</th>
                      <th scope="col">Public Holiday</th>
                      <th scope="col">Meal Chargeable</th>
                      <th scope="col">Shift Allowance</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {addRateItem &&
                      addRateItem.map((item) => (
                        <tr key={item.id}>
                          <td data-label="Designation">
                            <Select
                              name="designation"
                              onChange={(selectedOption) => {
                                handleInputChange(
                                  item.id,
                                  'designation',
                                  selectedOption.value
                                );
                              }}
                              options={designationdetails}
                            />
                          </td>
                          <td data-label="Mon-Fri Normal">
                            <Input
                              value={item.mon_to_fri_normal_hr}
                              type="text"
                              name="mon_to_fri_normal_hr"
                              style={{ width: '70%' }}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  'mon_to_fri_normal_hr',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td data-label="Mon-Fri OT">
                            <Input
                              value={item.mon_to_fri_ot_hr}
                              type="text"
                              name="mon_to_fri_ot_hr"
                              style={{ width: '70%' }}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  'mon_to_fri_ot_hr',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td data-label="Mon-Sat Normal">
                            <Input
                              value={item.mon_to_sat_normal_hr}
                              type="text"
                              name="mon_to_sat_normal_hr"
                              style={{ width: '70%' }}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  'mon_to_sat_normal_hr',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td data-label="Public Holiday">
                            <Input
                              value={item.sunday_public_holiday}
                              type="text"
                              name="sunday_public_holiday"
                              style={{ width: '70%' }}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  'sunday_public_holiday',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td data-label="Meal Chargeable">
                            <Input
                              value={item.meal_chargeable}
                              type="text"
                              name="meal_chargeable"
                              style={{ width: '70%' }}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  'meal_chargeable',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td data-label="Shift Allowance">
                            <Input
                              value={item.night_shift_allowance}
                              type="text"
                              name="night_shift_allowance"
                              style={{ width: '70%' }}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  'night_shift_allowance',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          
                          <td data-label="Action">
                            <Input
                              type="hidden"
                              name="id"
                              value={item.id}
                            ></Input>
                            <span
                              className="addline"
                              onClick={() => {
                                ClearValue(item);
                              }}
                            >
                              Clear
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <ModalFooter>
                  <Button
                    className="shadow-none"
                    color="primary"
                    onClick={getAllValues}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    className="shadow-none"
                    color="secondary"
                    onClick={() => {
                      setRateModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            </Col>
          </Row>
      </ModalBody>
    </Modal>
  </>
  );
};

export default AddRateItemModal;
