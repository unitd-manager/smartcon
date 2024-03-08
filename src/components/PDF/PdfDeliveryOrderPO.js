import React from 'react';
//import { useParams } from 'react-router-dom';
import pdfMake from 'pdfmake';
import * as Icon from 'react-feather';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfDeliveryOrderPO = ({ deliveryOrderId }) => {
  PdfDeliveryOrderPO.propTypes = {
    deliveryOrderId: PropTypes.any,
    
  };
  const [hfdata, setHeaderFooterData] = React.useState();
  const[deliveryData,setdeliveryData]=React.useState();
  const [deliverOrderProducts, setDeliveryOrderProducts] = React.useState();
  //const { id } = useParams();
  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, [0]);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  const GetDeliveryOrder = () => {
    api
      .post('/purchaseorder/getDeliveryOrderPO', { delivery_order_id: deliveryOrderId})
      .then((res) => {
        setdeliveryData(res.data.data[0]);
      })
      .catch(() => {
        
      });
  };

  const getDeliveryOrderId = () => {
    api
      .post('purchaseorder/getDeliveryOrderHistory', { delivery_order_id: deliveryOrderId })
      .then((res) => {
        setDeliveryOrderProducts(res.data.data);
      })
      .catch(() => {
        message('delivery data are not found', 'error');
      });
  };

  React.useEffect(() => {
    getDeliveryOrderId();
    GetDeliveryOrder();
  }, []);

  const GetPdf = () => {
    const productItems = [
      [
        {
          text: 'S.NO',
          style: 'tableHead',
        },
        {
          text: 'EQUIPMENT NO',
          style: 'tableHead',
        },
        {
          text: 'WORK DESCRTPTION',
          style: 'tableHead',
        },
        {
          text: 'ITEM',
          style: 'tableHead',
        },
        {
          text: 'SIZE',
          style: 'tableHead',
        },
        {
          text: 'QTY',
          style: 'tableHead',
        },
        {
          text: 'UNIT',
          style: 'tableHead',
        },
      ],
    ];
    deliverOrderProducts.forEach((element, index) => {
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.equipment_no ? element.equipment_no : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.item_title ? element.item_title : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.item ? element.item : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.size ? element.size : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.quantity ? element.quantity : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.unit ? element.unit : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
      ]);
    });
    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 120, 40, 80],
      footer: PdfFooter,

      content: [
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['101%'],

            body: [
              [
                {
                  text: 'DELIVERY ORDER',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n\n',
        
        {
          text: `Location:${deliveryData.location ? deliveryData.location : ''}`,
          style: ['notesText', 'textSize'],
          margin: [0, 0, 400, 0],
        },
        '\n',
        {
          text: `Scope of Work: ${deliveryData.scope_of_work ? deliveryData.scope_of_work : ''}`,
          style: ['notesText', 'textSize'],
          margin: [0, 0, 400, 0],

          
        },
        '\n',

    {
      text: `Job No :${deliveryData.delivery_order_code ? deliveryData.delivery_order_code : ''}`,
      
      style: ['invoiceAdd', 'textSize'],
      margin: [0, -70, 0, 0],
    },
    '\n',
    {
      text: `P.O No :${
        deliveryData.po_code ? deliveryData.po_code  : ''
      }`,
      
      style: ['invoiceAdd', 'textSize'],
      
    },
    '\n',
    {
      text: `P.O.Date :${
        deliveryData && deliveryData.purchase_order_date ? moment(deliveryData.purchase_order_date).format('DD-MM-YYYY') : ''
      }`,
      
      style: ['invoiceAdd', 'textSize'],
      
    },
    '\n',
    {
      text: `Date :${
        deliveryData && deliveryData.date ? moment(deliveryData.date).format('DD-MM-YYYY') : ''
      }`,
      
      style: ['invoiceAdd', 'textSize'],
      
    },
    '\n\n\n\n\n\n',

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['10%','15%', '31%', '15%', '10%','10%','10%'],

            body: productItems,
          },
        },
        '\n\n\n\n\n',
        '\n\n\n\n\n',

        {
          columns: [
            {
              stack: [
                {
                  text: 'Name :',
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                  style: ['invoiceAdd', 'textSize'],
                },
                '\n',
                {
                  text: 'Designation :',
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                  style: ['invoiceAdd', 'textSize'],
                },
                '\n',
                {
                  text: `Signature:`,
                  alignment: 'left',
                  fontSize: 10,
                  bold: true,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
                '\n',
                {
                  text: `Date:`,
                  alignment: 'left',
                  fontSize: 10,
                  bold: true,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  text: 'Name :',
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                  style: ['invoiceAdd', 'textSize'],
                },
                '\n',
                {
                  text: 'Designation :',
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                  style: ['invoiceAdd', 'textSize'],
                },
                '\n',
                {
                  text: `Signature:`,
                  fontSize: 10,
                  alignment: 'left',
                  bold: true,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
                '\n',
                {
                  text: `Date:`,
                  fontSize: 10,
                  alignment: 'left',
                  bold: true,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
              ],
            },
          ],
        },

        
        '\n\n\n\n\n',
      ],
      margin: [0, 50, 50, 50],
      styles: {
        logo: {
          margin: [-20, 20, 0, 0],
        },
        address: {
          margin: [-10, 20, 0, 0],
        },
        invoice: {
          margin: [0, 30, 0, 10],
          alignment: 'right',
        },
        invoiceAdd: {
          alignment: 'right',
        },
        textSize: {
          fontSize: 10,
          alignment: 'right',
        },
        textSize1: {
          fontSize: 10,
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <span onClick={GetPdf}>
        <Icon.Printer />
      </span>
    </>
  );
};

export default PdfDeliveryOrderPO;
