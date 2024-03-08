import React, { useEffect,useState } from 'react';
import { Button, Col } from 'reactstrap';
// import * as Icon from 'react-feather';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-fixedheader';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import { columns } from '../../data/Tender/ProductData';
import api from '../../constants/api';
import message from '../../components/Message';

const Test = () => {
  //state variables
  const [loading, setLoading] = useState(false)

  const changePublishStatus = (publishValue, id) => {
    setLoading(true)
    api
      .post('/commonApi/updatePublish', {
        tablename: 'product',
        idColumn: 'product_id',
        idValue: id,
        value: parseInt(publishValue,10),
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
  };
  const getAllProducts = () => {
    /* eslint-disable */
setLoading(true)
    $('#example').DataTable({
      dom: 'Bfrtip',
      serverSide: true,
      searching: true,
      scrollX: true,
      lengthChange: false,
      pageLength: 50,
      buttons: [],
      bDestroy: true,
      ajax: {
        type: 'POST',
        url: 'http://43.228.126.245:4011/product/getPaginationForProducts',
      },
      lengthMenu: [
        [10, 100, -1],
        [10, 100, 'All'],
      ],
      drawCallback: function (settings) {
        $(document).on('click', '#publish', function (e) {
          e.preventDefault();
          changePublishStatus($(this).attr('data-status'), $(this).attr('data-value'));
        });
        $(document).on('click', '.notes', function (e) {
          e.preventDefault();
          toggle();
        });
      },
      select: true,
      colReorder: true,
      columns: [
        {
          render: function (data, type, row, meta) {
            return row.product_id
          },
        },
        {
          render: function (data, type, row, meta) {
            return '<a href="#/ProductEdit/' + row.product_id + '"><i class="fas fa-pencil-alt"></i></a>';
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.item_code;
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.title;
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.product_type;
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.price;
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.unit;
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.qty_in_stock;
          },
        },
        {
          render: function (data, type, row, meta) {
            return row.modified_by;
          },
        },
        {
          render: function (data, type, row, meta) {
            if (row.published == 1) {
              return `<span data-status='0' data-value=${row.product_id} id="publish" class="cursor-pointer badge bg-success"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>`;
            } else {
              return `<span data-status='1' data-value=${row.product_id} id="publish" class="cursor-pointer badge bg-danger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>`;
            }
          },
        },
      ],
      
    });

    setLoading(false)
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />

        <CommonTable
        loading={loading}
          additionalClasses={'table'}
          title="Product List"
          Button={
            <>
              <Col>
                <Link to="/ProductDetails">
                  <Button color="primary" className="shadow-none">
                    Add New
                  </Button>
                </Link>
              </Col>
              <Col>
                <a
                  href="http://43.228.126.245/pyramidapi/storage/excelsheets/Product.xlsx"
                  download
                >
                  <Button color="primary" className="shadow-none">
                    Sample
                  </Button>
                </a>
              </Col>
            </>
          }
        >
          <thead>
            <tr className="filters">
              {columns.map((cell) => {
                return (
                  <th key={cell.name}>
                    {cell.name}
                    {cell.sorttype && cell.sorttype === 'select' && (
                      <div className={'select'}></div>
                    )}
                    {cell.sorttype && cell.sorttype === 'input' && <div className={'input'}></div>}
                    {!cell.sorttype && <div></div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
           
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Test;
