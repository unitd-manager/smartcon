import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  ModalBody,
  ModalFooter,
  Modal,
  ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import message from '../Message';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../views/form-editor/editor.scss';

import api from '../../constants/api';

const WorkOrderEditModal = ({ workLine, subWorkData, setSubWorkData,SubConWorkOrderLine,SubConWorkOrder }) => {
  WorkOrderEditModal.propTypes = {
    workLine: PropTypes.object,
    subWorkData: PropTypes.bool,
    setSubWorkData: PropTypes.func,
    SubConWorkOrderLine:PropTypes.any,
    SubConWorkOrder:PropTypes.any,

    // projectId: PropTypes.object
  };

  const [contactinsert, setContactInsert] = useState(null);

  const handleInputs = (e) => {
    setContactInsert({ ...contactinsert, [e.target.name]: e.target.value });
  };

  //Logic for edit data in db

  const editWorkOrderData = () => {
    api
      .post('/projecttabsubconworkorder/editWorkOrder', contactinsert)
      .then(() => {
        message('Record editted successfully', 'success');
        SubConWorkOrderLine();
        SubConWorkOrder();
        setSubWorkData(false);
        //  setTimeout(() => {
        //    window.location.reload()
        //  }, 300);
        // window.location.reload();
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  console.log('subconitem', workLine);
  useEffect(() => {
    console.log('insert');

    // editContactById();
    setContactInsert(workLine);
  }, [workLine]);

  return (
    <>
      <Modal isOpen={subWorkData}>
        <ModalHeader>
          Work Order Details
          <Button
            color="secondary"
            onClick={() => {
              setSubWorkData(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          {/* <Row>
            <Col md="3" className="mb-4 d-flex justify-content-between"></Col>
          </Row> */}
          {/* <Row>
            <Col md="2"> */}
          <FormGroup>
            <Row>
              <Label sm="3">Description </Label>
              <Col sm="5">
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert && contactinsert.description}
                  name="description"
                />
              </Col>
            </Row>
          </FormGroup>
          {/* </Col> */}
          {/* <Col md="2"> */}
          <FormGroup>
            <Row>
              <Label sm="3">Quantity </Label>
              <Col sm="5">
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert && contactinsert.quantity}
                  name="quantity"
                />
              </Col>
            </Row>
          </FormGroup>
          {/* </Col>

            <Col md="2"> */}
          <FormGroup>
            <Row>
              <Label sm="3">unit Rate </Label>
              <Col sm="5">
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert && contactinsert.unit_rate}
                  name="unit_rate"
                />
              </Col>
            </Row>
          </FormGroup>
          {/* </Col>

           
          </Row> */}
        </ModalBody>

        <ModalFooter>
          <Row>
            <div className="pt-3 mt-3 d-flex align-items-center gap-2">
              <Button
                color="primary"
                onClick={() => {
                  editWorkOrderData();
                }}
              >
                Submit
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  setSubWorkData(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Row>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default WorkOrderEditModal;
