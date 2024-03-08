import React, { useState,useEffect } from 'react';
import {
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../constants/api';

const EditCostingSummaryModal = ({
  editCostingSummaryModel,
  setEditCostingSummaryModel,
  costingsummaries,
}) => {
  EditCostingSummaryModal.propTypes = {
    editCostingSummaryModel: PropTypes.bool,
    setEditCostingSummaryModel: PropTypes.func,
    costingsummaries: PropTypes.object,
  };

  const [editCostingSummaryData, seteditCostingSummaryData] = useState(0);
  const { id } = useParams();
  const [totalLabour, setTotalLabour] = useState();
  const [totalCost, setTotalCost] = useState();
  const [totalProfit, setTotalProfit] = useState(costingsummaries?.profit || 0);

  //edit Tab Costing Summary Form

  const handleCostingSummeryInputs = (e) => {
    seteditCostingSummaryData({ ...editCostingSummaryData, [e.target.name]: e.target.value });
  };

  // const handleCalc = (noofworkerused, noofdaysworked, labourratesperday) => {

  //   noofworkerused = parseFloat(noofworkerused) || 0;
  //   noofdaysworked = parseFloat(noofdaysworked) || 0;
  //   labourratesperday = parseFloat(labourratesperday) || 0;

  //   console.log("set Total Labour",Math.max(0, noofworkerused * noofdaysworked * labourratesperday))
  //   setTotalLabour(Math.max(0, noofworkerused * noofdaysworked * labourratesperday));

  //   // if (!noofworkerused) noofworkerused = 0;
  //   // if (!noofdaysworked) noofdaysworked = 0;
  //   // if (!labourratesperday) labourratesperday = 0;

  //   // setTotalLabour(
  //   //   parseFloat(noofworkerused) * parseFloat(noofdaysworked) * parseFloat(labourratesperday)
  //   // );
  // };

  const handleCalc = (noofworkerused, noofdaysworked, labourratesperday) => {
    noofworkerused = parseFloat(noofworkerused) || 0;
    noofdaysworked = parseFloat(noofdaysworked) || 0;
    labourratesperday = parseFloat(labourratesperday) || 0;

    const calculatedValue = Math.max(0, noofworkerused * noofdaysworked * labourratesperday);

    console.log("Calculated Value", calculatedValue);

    // Set totalLabour and log its value immediately
    setTotalLabour(calculatedValue);

    // Log the value of totalLabour after setting it
    console.log("Total Labour After Setting", totalLabour);
};

  const handleCalcTotal = (totalMaterialPrice, transportCharges, salesmanCommission, financeCharges, officeOverheads, otherCharges) => {
    setTotalCost(
      parseFloat(totalMaterialPrice) + parseFloat(transportCharges) + parseFloat(salesmanCommission) 
      +parseFloat(financeCharges) + parseFloat(officeOverheads) + parseFloat(otherCharges) + parseFloat(totalLabour ?? costingsummaries.total_labour_charges)
    );
  };

  useEffect(() => {
    handleCalcTotal(
      editCostingSummaryData?.total_material_price,
      editCostingSummaryData?.transport_charges,
      editCostingSummaryData?.salesman_commission,
      editCostingSummaryData?.finance_charges,
      editCostingSummaryData?.office_overheads,
      editCostingSummaryData?.other_charges,
      editCostingSummaryData?.profit_percentage,
    );
  }, [totalLabour,editCostingSummaryData?.profit_percentage]);

  useEffect(() => {
    // Calculate profit whenever relevant data changes
    const calculateProfit = () => {
      const profitPercentage = editCostingSummaryData.profit_percentage || costingsummaries.profit_percentage || 0;
      setTotalProfit((profitPercentage / 100) * (totalCost || costingsummaries.total_cost || 0) );
    };

    calculateProfit();
  }, [totalCost, totalLabour, editCostingSummaryData?.profit_percentage, costingsummaries?.profit_percentage]);


  const EditCostingSummary = () => {
    editCostingSummaryData.opportunity_id = id;
    editCostingSummaryData.total_labour_charges = totalLabour || costingsummaries.total_labour_charges;
    editCostingSummaryData.total_cost = totalCost || costingsummaries.total_cost;
    editCostingSummaryData.profit =  totalProfit || costingsummaries.total_labour_charges

    api.post('/tender/edit-TabCostingSummaryForm', editCostingSummaryData).then(() => {
      setEditCostingSummaryModel(false);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 300);
    });
  };

  React.useEffect(() => {
    seteditCostingSummaryData(costingsummaries);
  }, [costingsummaries]);

  return (
    <>
      <Modal size="lg" isOpen={editCostingSummaryModel}>
        <ModalHeader>
          Edit Costing Summary
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditCostingSummaryModel(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="12">
              <CardBody>
                <Form>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>No. of Worker Used</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              e.target.value,
                              editCostingSummaryData.no_of_days_worked,
                              editCostingSummaryData.labour_rates_per_day,
                            );
                          }}
                          defaultValue={costingsummaries && costingsummaries.no_of_worker_used}
                          name="no_of_worker_used"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>No. of Days Worked</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              editCostingSummaryData.no_of_worker_used,
                              e.target.value,
                              editCostingSummaryData.labour_rates_per_day,
                            );
                          }}
                          defaultValue={costingsummaries && costingsummaries.no_of_days_worked}
                          name="no_of_days_worked"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Labout Rates Per Day</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              editCostingSummaryData.no_of_worker_used,
                              editCostingSummaryData.no_of_days_worked,
                              e.target.value,
                            );
                          }}
                          defaultValue={costingsummaries && costingsummaries.labour_rates_per_day}
                          name="labour_rates_per_day"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                    <FormGroup>
                      <Label>Total Charges</Label>
                      <Input
                        type="number"
                        disabled
                        value={totalLabour || costingsummaries && costingsummaries.total_labour_charges}
                        name="total_labour_charges"
                      />
                    </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>

              <CardBody className="bg-light">
                <CardTitle tag="h4" className="mb-0"></CardTitle>
              </CardBody>

              <CardBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Total Material</Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalcTotal(
                              e.target.value, 
                              editCostingSummaryData.transport_charges,
                              editCostingSummaryData.salesman_commission,
                              editCostingSummaryData.finance_charges,
                              editCostingSummaryData.office_overheads,
                              editCostingSummaryData.other_charges,
                          )
                        }}
                        defaultValue={costingsummaries && costingsummaries.total_material_price}
                        name="total_material_price"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Transport Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalcTotal(
                            editCostingSummaryData.total_material_price,
                            e.target.value, 
                            editCostingSummaryData.salesman_commission,
                            editCostingSummaryData.finance_charges,
                            editCostingSummaryData.office_overheads,
                            editCostingSummaryData.other_charges,
                          )
                        }}
                        defaultValue={costingsummaries && costingsummaries.transport_charges}
                        name="transport_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Salesman Commission </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalcTotal(
                            editCostingSummaryData.total_material_price, 
                            editCostingSummaryData.transport_charges,
                            e.target.value, 
                            editCostingSummaryData.finance_charges,
                            editCostingSummaryData.office_overheads,
                            editCostingSummaryData.other_charges,
                          )
                        }}
                        defaultValue={costingsummaries && costingsummaries.salesman_commission}
                        name="salesman_commission"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Finance Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalcTotal(
                            editCostingSummaryData.total_material_price, 
                            editCostingSummaryData.transport_charges,
                            editCostingSummaryData.salesman_commission,
                            e.target.value, 
                            editCostingSummaryData.office_overheads,
                            editCostingSummaryData.other_charges,
                          )
                        }}
                        defaultValue={costingsummaries && costingsummaries.finance_charges}
                        name="finance_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Office Overheads </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalcTotal(
                            editCostingSummaryData.total_material_price, 
                            editCostingSummaryData.transport_charges,
                            editCostingSummaryData.salesman_commission,
                            editCostingSummaryData.finance_charges,
                            e.target.value, 
                            editCostingSummaryData.other_charges,
                          )
                        }}
                        defaultValue={costingsummaries && costingsummaries.office_overheads}
                        name="office_overheads"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Other Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalcTotal(
                            editCostingSummaryData.total_material_price, 
                            editCostingSummaryData.transport_charges,
                            editCostingSummaryData.salesman_commission,
                            editCostingSummaryData.finance_charges,
                            editCostingSummaryData.office_overheads,
                            e.target.value, 
                          )
                        }}
                        defaultValue={costingsummaries && costingsummaries.other_charges}
                        name="other_charges"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>TOTAL COST</Label>
                      <Input
                        type="number"
                        name="total_cost"
                        disabled
                        value={totalCost || costingsummaries && costingsummaries.total_cost }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                      <FormGroup>
                        <Label>Profit Margin %</Label>
                         <Input
        type="number"
        onChange={(e) => {
          handleCostingSummeryInputs(e);
          handleCalcTotal(
            editCostingSummaryData.total_material_price,
            editCostingSummaryData.transport_charges,
            editCostingSummaryData.salesman_commission,
            editCostingSummaryData.finance_charges,
            editCostingSummaryData.office_overheads,
            editCostingSummaryData.other_charges,
          );
        }}
        defaultValue={costingsummaries && costingsummaries.profit_percentage}
        name="profit_percentage"
      />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Profit Margin Value</Label>
                        <Input
                          type="number"
                          disabled
                          value={ totalProfit || costingsummaries && costingsummaries.profit}
                          name="profit"
                        />
                      </FormGroup>
                    </Col>
                </Row>

              </CardBody>
              <CardBody>
                <CardTitle className="mb-0 bg-light"></CardTitle>
              </CardBody>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              EditCostingSummary();
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditCostingSummaryModel(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditCostingSummaryModal;
