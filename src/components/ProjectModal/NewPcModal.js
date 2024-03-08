import React,{useState,useEffect} from 'react'
import { Row,Col,FormGroup,Button,Modal,ModalHeader,ModalBody,Form,Input,Label } from 'reactstrap';
import moment from 'moment'
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types'
import api from '../../constants/api';
import message from '../Message';


function NewPcModal({newPcModal, setNewPcModal,pc,projectClaimId}) {
    NewPcModal.propTypes = {
        newPcModal: PropTypes.bool,
        setNewPcModal: PropTypes.func,
        pc:PropTypes.object,
        projectClaimId:PropTypes.any
      }
      const [claimSeq, setClaimSeq] = useState([]);
      const [claimItems, setClaimItems] = useState([
       
      ]);
      const handleChange=()=>{
        setClaimItems({...claimItems})
      }
const{id}=useParams();
      //get line items
const getClaimLineItems=()=>{
  api.post('/claim/TabClaimPortalLineItemById',{project_id:id,project_claim_id:projectClaimId})
  .then((res)=>{
    setClaimItems(res.data.data);
  }).catch(()=>{
    message('unable to get products','error');
  })
}

      //insert claim payment
      const insertClaimPayment = () => {
        let canInsert = true;
      
        claimItems.forEach((el) => {
          if (el.this_month_amount) {
            const remainingAmount = el.amount - el.prev_amount;
      
            if (el.this_month_amount > remainingAmount) {
              alert('This Month Amount  exceeds the remaining contract amount.');
              canInsert = false;
            }
          }
        });
      
        if (canInsert) {
          claimItems.forEach((el) => {
            if (el.this_month_amount) {
            api.post('/claim/insertClaimPaymenttable', {
              project_claim_id: projectClaimId,
              claim_line_items_id: el.claim_line_items_id,
              status: 'In Progress',
              date: new Date(),
              claim_seq: `Progress Claim ${String(claimSeq.claim_seq + 1).padStart(2, '0')}`,
              project_id: id,
              amount: el.this_month_amount,
            })
            .then(() => {
              message('Record edited successfully', 'success');
              setTimeout(() => {
                 window.location.reload()
              }, 300);
            })
            .catch(() => {
              message('Failed to insert claim payment', 'error');
            });
            }
          });
        }
      };

    function updateState(index,property,e){
 
      const updatedLineItems=[... claimItems];
    const updatedObject = {...updatedLineItems[index], [property]: e.target.value};
    updatedLineItems[index] = updatedObject;
    setClaimItems(updatedLineItems);
    
    };
    
    
    useEffect(() => {
      getClaimLineItems();
  
      // Fetch the claim_seq value from your API or any logic you use
      // For example, you can use the same API call as above and extract the claim_seq value
      // and set it to the state variable.
 
      const fetchClaimSeq = () => {
        api.get('/claim/getClaimSeq').then((res) => {
          const currentClaimSeq = res.data.data[0].claim_seq;
          const numericPart = parseInt(currentClaimSeq.match(/\d+/)[0], 10);
          setClaimSeq({ claim_seq: numericPart });
        });
      };
      console.log("errorfdv: ", claimSeq);
      fetchClaimSeq();
    }, [id, projectClaimId]);

  return (
    <>
<Modal size="lg" isOpen={newPcModal}>
            <ModalHeader> Add New Claim </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Form>
                        <Row>
                        <Col md="4">
                        <FormGroup>
                        <Label>Date</Label>
                        <Input type="date" name="date" value={moment(new Date()).format('YYYY-MM-DD')}  onChange={handleChange}/>
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                        <Label>Project</Label>
                        <Input name="project"  type="text" value={pc && pc.title} disabled/>
                        </FormGroup>
                    </Col>
                    <Col md="4">
  <FormGroup>
    <Label>Claim Sequence</Label>
    <Input
      name="claim_seq"
      type="text"
      value={`Progress Claim ${String(claimSeq.claim_seq + 1).padStart(2, '0')}`}
      onChange={handleChange}
    />
  </FormGroup>
</Col>

                        </Row>
                        <FormGroup>
                        <table className='lineitem' >
            
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Contract Amount</th>
                <th scope="col">PrevAmount</th>
                 <th scope="col">This Month Amount</th>
                <th scope="col">Cum Amount</th>
                <th scope="col">Remarks</th>
              </tr>
            </thead>
            <tbody>

              {claimItems && claimItems.map((res,index)=>{
                return(
                  <>
                    <tr>
                      <td>{res.title}</td>
                      <td>{res.description}</td>
                      <td>{res.amount}</td>
                     <td>{res.prev_amount}</td>
                     <td><Input name='this_month_amount' value={res.this_month_amount} onChange={(e)=>{updateState(index,'this_month_amount',e)}}/></td>
                      <td>{res.prev_amount}</td>
                      <td data-label="Remarks"><Input type="text" name="remarks" value={res.remarks} onchange={(e)=>{updateState(index,'remarks',e)}}></Input></td>
                    </tr>
                  </>
                )
              })}
                
            </tbody>
          </table>
                        
                            <Row>
                            <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                                <Button type="button" className="btn mr-2 shadow-none" color="primary"
                                onClick={()=>{insertClaimPayment()}}
                                >
                                    Save & Continue
                                </Button>
                                <Button color="secondary" className='shadow-none' onClick={()=>{setNewPcModal(false) }}>Cancel</Button>
                            </div>
                            </Row>

                        </FormGroup> 
                    </Form>
                </FormGroup>
            </ModalBody>
        </Modal>
       
    </>
  )
}

export default NewPcModal
