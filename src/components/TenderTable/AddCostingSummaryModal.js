import React, { useState } from 'react';
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
  Label,
  FormGroup,
  CardBody,
  CardTitle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';

const AddCostingSummaryModal = ({
  addCostingSummaryModel,
  setAddCostingSummaryModel,
  projectInfo,
}) => {
  AddCostingSummaryModal.propTypes = {
    addCostingSummaryModel: PropTypes.bool,
    setAddCostingSummaryModel: PropTypes.func,
    projectInfo: PropTypes.func,
  };
  // const setAddCostingSummaryModal = ({ addLineItemModal, setAddLineItemModal, projectInfo, quoteLine }) => {
  //   setAddCostingSummaryModal.propTypes = {
  //     addLineItemModal: PropTypes.bool,
  //     setAddLineItemModal: PropTypes.func,
  //     projectInfo: PropTypes.any,
  //     quoteLine: PropTypes.any,
  //   };
  //All state Varible
  //const [totalAmount, setTotalAmount] = useState(0);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      unit: '',
      no_of_days_worked: '',
      no_of_worker_used:'',
      labour_rates_per_day: '',
      transport_charges: '',
      other_charges: '',
      salesman_commission: '',
      profit_percentage:'',
    },
  ]);
  
  const AddCostingSummary = (obj) => {
    //obj.opportunity_costing_summary_id=id;
    obj.opportunity_id = projectInfo;
    api
      .post('/tender/insertTabcostingsummary', obj)
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
        window.location.reload();
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
  };

  
  //Invoice item values
  const getAllValues = () => {
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
      result.push(allValues);
    });
    //setTotalAmount(0);
    console.log(result);
    result.forEach((element) => {
      AddCostingSummary(element);
    });
    console.log(result);
  };

  const calculateTotal = () => {
    const result = addLineItem.map((item) => {
      const allValues = { ...item };

      const totalLabourCharges =
        parseFloat(allValues.no_of_worker_used) *
        parseFloat(allValues.no_of_days_worked) *
        parseFloat(allValues.labour_rates_per_day);

      const transportCharges = parseFloat(allValues.transport_charges) || 0;
      const salesmanCommission = parseFloat(allValues.salesman_commission) || 0;
      const financeCharges = parseFloat(allValues.finance_charges) || 0;
      const officeOverHeads = parseFloat(allValues.office_overheads) || 0;
      const otherCharges = parseFloat(allValues.other_charges) || 0;
      const totalMaterialPrice = parseFloat(allValues.total_material_price) || 0;

      allValues.total_labour_charges = totalLabourCharges.toFixed(2);

      allValues.total_cost =
        transportCharges +
        totalLabourCharges +
        salesmanCommission +
        financeCharges +
        officeOverHeads +
        otherCharges +
        totalMaterialPrice;

      allValues.profit =
        (parseFloat(allValues.profit_percentage || 0) / 100) *
        parseFloat(allValues.total_cost);

      return allValues;
    });

    setAddLineItem(result);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...addLineItem];
    list[index][name] = value;
    setAddLineItem(list);
    calculateTotal(); // Recalculate totals on every input change
  };

  
  return (
    <>
      <Modal size="lg" isOpen={addCostingSummaryModel}>
        <ModalHeader>
          Add Costing Summary
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddCostingSummaryModel(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <table className="lineitem">
          <tbody>
            {addLineItem &&
              addLineItem.map((item,index) => {
                return (
                  <tr key={item.id}>
                    <ModalBody>
                      <Row>
                        <Col md="12">
                          <CardBody>
                            <Form>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>No of Worker Used</Label>
                                    <Input
                                      Value={item.no_of_worker_used}
                                      type="number"
                                      name="no_of_worker_used"
                                      onChange={(e) => handleInputChange(index, e)}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>No of Days Worked</Label>
                                    <Input
                                      Value={item.no_of_days_worked}
                                      type="number"
                                      name="no_of_days_worked"
                                      onChange={(e) => handleInputChange(index, e)}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Labour Rates Per Day</Label>
                                    <Input
                                      Value={item.labour_rates_per_day}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="number"
                                      name="labour_rates_per_day"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                             
                              <CardBody className="bg-light">
                                <CardTitle tag="h4" className="mb-0"></CardTitle>
                              </CardBody>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Total Labour Charges</Label>
                                    <Input
                                      Value={item.total_labour_charges}
                                      type="number"
                                      name="total_labour_charges"
                                      disabled
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                              <Col md="4">
                                  <FormGroup>
                                    <Label>Total Material</Label>
                                    <Input
                                      Value={item.total_material_price}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="text"
                                      name="total_material_price"
                                     
                                    />
                                  </FormGroup>
                                </Col>

                                <Col md="4">
                                  <FormGroup>
                                    <Label>Transport Charges</Label>
                                    <Input
                                      Value={item.transport_charges}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="number"
                                      name="transport_charges"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Salesman Commission</Label>
                                    <Input
                                      Value={item.salesman_commission}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="number"
                                      name="salesman_commission"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Finance Charges</Label>
                                    <Input
                                      Value={item.finance_charges}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="number"
                                      name="finance_charges"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Office Overheads</Label>
                                    <Input
                                      Value={item.office_overheads}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="number"
                                      name="office_overheads"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Other Charges</Label>
                                    <Input
                                      Value={item.other_charges}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="number"
                                      name="other_charges"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                               
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Total Cost</Label>
                                    <Input
                                      Value={item.total_cost}
                                      onChange={(e) => handleInputChange(index, e)}
                                      type="numbtexter"
                                      name="total_cost"
                                      disabled
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Profit Margin%</Label>
                                    <Input
                                      Value={item.profit_percentage}
                                      type="text"
                                      name="profit_percentage"
                                      onChange={(e) => handleInputChange(index, e)}
                                      />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Profit Margin Value</Label>
                                    <Input
                                      Value={item.profit}
                                      type="text"
                                      name="profit"
                                      disabled
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Col>
                      </Row>
                    </ModalBody>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <ModalFooter>
          <Button
            className="shadow-none"
            color="primary"
            onClick={() => {
              getAllValues();
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddCostingSummaryModel(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default AddCostingSummaryModal;
