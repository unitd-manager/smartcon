import React, { useEffect, useState } from 'react'
import { FormGroup} from 'reactstrap';
import PropTypes from 'prop-types'
import moment from 'moment';
import message from '../Message';
import api from '../../constants/api';
import EditPcItems from './EditPcItems';
import PdfProjectClaim from '../PDF/PdfProjectClaim';
import PdfPcSummary from '../PDF/PdfPcSummary';


function ClaimItems({projectClaimId,projectId,checkId,POId,projectDetail,deliveryData,editPo}) {
    ClaimItems.propTypes = {
        projectClaimId:PropTypes.any,
        projectId:PropTypes.any,
        checkId:PropTypes.any,
        POId:PropTypes.any,
        projectDetail:PropTypes.any,
        deliveryData:PropTypes.any,
        editPo:PropTypes.any
    
      }
   
      const[claimItemsData,setClaimItemsData]=useState([]);
      const[editPcItems,setEditPcItems]=useState(false);
      const[editClaim,setEditClaim]=useState();
      const[editClaim1,setEditClaim1]=useState();
        // Get ClaimPayment By ProjectId and project claim id

        const getClaimPaymentById = () => {
          api.post('/claim/getTabClaimPaymentPortalById',{project_id:projectId,project_claim_id:projectClaimId})
         .then((res) => {
          setClaimItemsData(res.data.data)
        })
        .catch(()=>{
          message("claim payment not found","info")
        })
        }
        useEffect(()=>{
          getClaimPaymentById();
        },[])
  return (
    <div>
         <FormGroup>
                        <table className='lineitem' >
            
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Claim Sequence</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                 <th scope="col">Edit</th>
                <th scope="col">Print</th>
                
              </tr>
            </thead>
            <tbody>

              {claimItemsData && claimItemsData.map((res)=>{
                return(
                  <>
                    <tr>
                      <td>{res.date ? moment(res.date).format('DD-MM-YYYY') : ''}</td>
                      <td>{res.claim_seq}</td>
                      <td>{res.claim_amount}</td>
                     <td>{res.status}</td>
                     <td><span onClick={()=>{setEditClaim1(res.claim_seq);setEditClaim(res.claim_payment_id);setEditPcItems(true)}}>Edit Pc items</span></td>
                      <td> <PdfProjectClaim
                 checkId = {checkId}
                  POId = {POId}
                  editClaim1={res.claim_seq}
                  claimpay={res.claim_payment_id}
                  claimline={res.claim_line_items_id}
                  projectClaimId={projectClaimId} projectId={projectId}
                  ></PdfProjectClaim></td>
                      <td> 
                  <PdfPcSummary
                   projectDetail = {projectDetail}
                  deliveryData = {deliveryData}
                  editPo = {editPo}
                  editClaim1={res.claim_seq}
                  claimpay={res.claim_payment_id}
                  claimline={res.claim_line_items_id}
                  projectClaimId={projectClaimId} projectId={projectId}
                  title={`Claim Sequence: ${res.claim_seq}`} // Add this line
                  ></PdfPcSummary>
                  </td>
                    </tr>
                  </>
                )
              })}
                
            </tbody>
          </table>
          
          {editPcItems && <EditPcItems getClaimPaymentById={getClaimPaymentById} editPcItems={editPcItems} setEditPcItems={setEditPcItems} pc={projectDetail} projectClaimId={projectClaimId} projectId={projectId} editClaim1={editClaim1} editClaim={editClaim}/>}
          </FormGroup>
    </div>
  )
}

export default ClaimItems