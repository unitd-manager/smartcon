import React from 'react';
import PropTypes from 'prop-types';
import { Input, Row, Col } from 'reactstrap';
// import * as Icon from 'react-feather';
import api from '../constants/api';
import message from './Message';

const SortOrder = ({ value, tablename, idColumn, idValue }) => {
  SortOrder.propTypes = {
    tablename: PropTypes.string,
    idColumn: PropTypes.string,
    idValue: PropTypes.any,
    value: PropTypes.any,
  };
  const SortingOrder = (e) => {
    if (e.target.value === '') {
      message('Enter valid sort order', 'warning');
    } else {
      api
        .post('/commonApi/updateSortOrder', {
          tablename,
          idColumn,
          idValue,
          value: e.target.value,
        })
        .then((res) => {
          if (res.status === 200) {
            window.location.reload();
          } else {
            message('Unable to edit record.', 'error');
          }
        })
        .catch(() => {
          message('Network connection error.');
        });
    }
  };
  return (
    <div>
      <Row>
        <Col md="4" className="mx-0 px-0">
          <Input
            onBlur={(e) => {
              SortingOrder(e);
            }}
            style={{ minWidth: 70 }}
            type="number"
            name="sort_order"
            defaultValue={value ? value.toString() : '0'}
          ></Input>
        </Col>
      </Row>
    </div>
  );
};

export default SortOrder;
