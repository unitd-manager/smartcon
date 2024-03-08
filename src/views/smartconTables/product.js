import React, { useState, useEffect } from 'react';
import { Button, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
// import Flag from '../../components/Flag';
// import message from '../../components/Message';

const Test = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Columns definition for DataGrid
  const columns = [
    { field: 'product_id', headerName: 'Product ID', width: 100 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 75,
      renderCell: (params) => (
        <Link to={`/ProductEdit/${params.row.product_id}`}>
          <i className="fas fa-pencil-alt"></i>
        </Link>
      ),
    },
    { field: 'item_code', headerName: 'Item Code', width: 150 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'product_type', headerName: 'Product Type', width: 150 },
    { field: 'price', headerName: 'Price' , width: 100},
    { field: 'unit', headerName: 'Unit', width: 100 },
    { field: 'qty_in_stock', headerName: 'Qty in Stock', width: 100 },
    { field: 'modified_by', headerName: 'Modified By', width: 125 },
    // {
    //   field: 'published',
    //   headerName: 'Published',
    //   width: 75,
    //   renderCell: (params) => (
    //     <span
    //       onClick={() => {
    //         changePublishStatus(params.row.published === 1 ? 0 : 1, params.row.product_id);
    //       }}
    //       className={`cursor-pointer badge bg-${params.row.published === 1 ? 'success' : 'danger'}`}
    //     >
    //       <Flag value={params.row.published === 1 ? 1 : 0} />
    //     </span>
    //   ),
    // },
  ];

  // Rows data for DataGrid
  const rows = products ? products.map((element) => ({ id: element.product_id, ...element })) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('http://43.228.126.245:4011/product/getProductsPagination');

        if (res.status === 200) {
          setProducts(res.data.data);
        } else {
          console.error('Request failed with status:', res.status);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <CommonTable
        loading={loading}
        additionalClasses='table'
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
              <a href="http://43.228.126.245/pyramidapi/storage/excelsheets/Product.xlsx" download>
                <Button color="primary" className="shadow-none">
                  Sample
                </Button>
              </a>
            </Col>
          </>
        }
      >
        <div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={25}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      </CommonTable>
    </>
  );
};

export default Test;
