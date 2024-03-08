import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import api from '../../constants/api';
import CostingSummaryModal from '../ProjectModal/CostingSummaryModal';
/* eslint-disable */
export default function CostingSummary() {
  const [type, setType] = React.useState('');
  const [addCostingSummaryModal, setAddCostingSummaryModal] = React.useState(false);
  const [chargesdetails, setChargesDetails] = React.useState('');
  const [getCostingSummary, setGetCostingSummary] = React.useState('');
  const [totalMaterial, setTotalMaterial] = React.useState('');
  const { id } = useParams();
  //Api call for getting Vehicle Fuel Data By ID

  const getCostingbySummary = () => {
    api
      .post('/projecttabcostingsummary/getTabCostingSummaryById', { project_id: id })
      .then((res) => {
        setGetCostingSummary(res.data.data[0]);
      }).catch(()=>{});
  };
  const getTotalMaterial = () => {
    api
      .post('/projecttabcostingsummary/getTotalMaterial', { project_id: id })
      .then((res) => {
        setTotalMaterial(res.data.data[0]);
      }).catch(()=>{});
  };
  const [quotation, setQuotation] = React.useState();
  const [receive, setReceive] = React.useState();

  const getQuotations = () => {
    api
      .post('/projecttabquote/getTabQuoteById', { project_id: id })
      .then((res) => {
        setQuotation(res.data.data[0]);
      })
  };
  const getAmountById = () => {
    api
      .post('/project/getAmountByProjectIds', { project_id: id })
      .then((res) => {
        setReceive(res.data.data);
      })
      .catch(() => {

      });
  };

  const [totalCost, setTotalCost] = React.useState(0); // New state for total cost

  // ... (existing code)

  const getCostingSummaryChargesById = () => {
    api
      .post('/projecttabcostingsummary/getCostingSummaryproject', {
        project_id: id,
      })
      .then((res) => {
        setChargesDetails(res.data.data);
        
        // Calculate total cost by summing up individual charges
        const totalCost = (
          (res.data.data && res.data.data.transport_charges) +
          (res.data.data && res.data.data.labour_charges) +
          (res.data.data && res.data.data.sales_commision) +
          (res.data.data && res.data.data.finance_charges) +
          (res.data.data && res.data.data.office_overheads) +
          (res.data.data && res.data.data.other_charges)
        ) || 0;

        setTotalCost(totalCost);
      })
      .catch(() => {});
  };
  useEffect(() => {
    getCostingSummaryChargesById();
    getCostingbySummary();
    getQuotations();
    getAmountById();
    getTotalMaterial();
  }, [id]);

  const profitMargin =
  ((quotation && quotation.totalamount) - totalCost) > 0
    ? (
       
        ((quotation && quotation.totalamount) - totalCost)
      ).toFixed(2) /100
    : 0;

const formattedProfitMargin = isNaN(profitMargin) ? 0 : profitMargin;


  return (
    <>
      <Row>
        <Col md="3">
          <FormGroup>
            <h3>Costing Summary</h3>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Total Cost :{' '} <br />
              <b>
                {
                  <span>
                    {(chargesdetails && chargesdetails.transport_charges) +
                      (chargesdetails && chargesdetails.labour_charges) +
                      (chargesdetails && chargesdetails.sales_commision) +
                      (chargesdetails && chargesdetails.finance_charges) +
                      (chargesdetails && chargesdetails.office_overheads) +
                      (chargesdetails && chargesdetails.other_charges)}
                  </span>
                }
              </b>
            </Label>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              PO Price (S$ W/o GST) : <b>{quotation && quotation.totalamount}</b>
            </Label>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              {' '} 
              Invoiced Price (S$ W/o GST) :
              <b>{receive && receive.amount}</b>
            </Label>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
          <Label>
  Profit Margin :{' '}
  <b>{formattedProfitMargin}% ({getCostingSummary && getCostingSummary.profit})</b>
</Label>
{' '}
          </FormGroup>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Total Material</Label>
            <br />
            <span>{totalMaterial?.total_cost_price * totalMaterial?.total_qty ?? 'N/A'}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Transport Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Transport Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
        
    <span>
          {chargesdetails && chargesdetails.transport_charges} ({getCostingSummary && getCostingSummary.transport_charges})
      </span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Total Labour Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Total Labour Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.labour_charges}(  {(getCostingSummary && getCostingSummary.no_of_days_worked) *
                (getCostingSummary && getCostingSummary.labour_rates_per_day) *
                (getCostingSummary && getCostingSummary.no_of_worker_used)})</span>
          </FormGroup>
        </Col>

        <Col md="3">
          <FormGroup>
            <Label>
              Salesman Commission{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Salesman Commission');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.sales_commision}({getCostingSummary && getCostingSummary.salesman_commission})</span>
          </FormGroup>
        </Col>
      </Row>
      <br />
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>
              {' '}
              Finance Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Finance Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.finance_charges}({getCostingSummary && getCostingSummary.finance_charges})</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Office Overheads{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Office Overheads');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.office_overheads}({getCostingSummary && getCostingSummary.office_overheads})</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Other Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Other Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.other_charges}({getCostingSummary && getCostingSummary.other_charges})</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label> TOTAL COST </Label>
            <br />
            <span>
              {(chargesdetails && chargesdetails.transport_charges) +
                (chargesdetails && chargesdetails.labour_charges) +
                (chargesdetails && chargesdetails.sales_commision) +
                (chargesdetails && chargesdetails.finance_charges) +
                (chargesdetails && chargesdetails.office_overheads) +
                (chargesdetails && chargesdetails.other_charges)}
            </span>
          </FormGroup>
        </Col>
      </Row>
      {addCostingSummaryModal && (
        <CostingSummaryModal
          type={type}
          addCostingSummaryModal={addCostingSummaryModal}
          setAddCostingSummaryModal={setAddCostingSummaryModal}
        />
      )}
    </>
  );
}
