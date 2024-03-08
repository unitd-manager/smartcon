import React from 'react';
import pdfMake from 'pdfmake';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import api from '../../constants/api';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfMaterialPurchaseOrder = ({tabPurchaseOrderLineItemTable,purchasePoOrder}) => {
  PdfMaterialPurchaseOrder.propTypes = {
    tabPurchaseOrderLineItemTable: PropTypes.any,
    purchasePoOrder:PropTypes.any,
    };

  const { id } = useParams();
  const [hfdata, setHeaderFooterData] = React.useState();
  //const [addPurchaseOrderModal, setAddPurchaseOrderModal] = React.useState();
  // const [tabPurchaseOrderLineItemTable, setTabPurchaseOrderLineItemTable] = React.useState();
  //const [gTotal, setGtotal] = React.useState(0);
  

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);
  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };
  const getPoProduct = () => {
    api
      .post('/purchaseorder/getProjectMaterialPurchaseByPdf', { project_id: id })
      .then(() => {
        //setAddPurchaseOrderModal(res.data.data[0]);
      })
      .catch(() => {
         
      });
  };
  console.log("0",purchasePoOrder);
  const calculateTotal = () => {
    const grandTotal = tabPurchaseOrderLineItemTable.reduce(
      (acc, element) => acc + element.qty * element.cost_price,
      0
    );
  
    return grandTotal;
  };
  const calculateGSTTotal = () => {
    const gstValue = (purchasePoOrder.gst_percentage / 100) * calculateTotal() ;
    console.log("PO1",gstValue);
    
    return gstValue;
  };
   const calculateGSTAmount = () => {
    const gstAmountValue = calculateTotal() + calculateGSTTotal();
    return gstAmountValue;
  };
  const getPurchaseOrderId = () => {
    api
      .post('/purchaseorder/getProjectMaterialPurchaseByPdf', { project_id: id })
      .then(() => {
        //setTabPurchaseOrderLineItemTable(res.data.data);
        //grand total
        // let grandTotal = 0;
        //     res.data.data.forEach((elem) => {
        //   grandTotal += elem.amount;
        // });
        // setGtotal(grandTotal);
        
      })
      .catch(() => {
         
      });
  };
  React.useEffect(() => {
    getPurchaseOrderId();
    getPoProduct();
  }, []);

  const GetPdf = () => {
    const productItems = [
      [
        {
          text: 'S.NO',
          style: 'tableHead',
        },
        {
          text: 'Product Name',
          style: 'tableHead',
        },
        {
          text: 'Uom',
          style: 'tableHead',
        },
        {
          text: 'Quantity',
          style: 'tableHead',
        },
        {
          text: 'Unit Price S$ ',
          style: 'tableHead',
        },
        {
          text: 'Amount S$',
          style: 'tableHead',
        },
      ],
    ];
    tabPurchaseOrderLineItemTable.forEach((element, index) => {
      const quantity = element.qty || 0;
      const unitPrice = element.cost_price || 0;
      const amount11 = quantity * unitPrice;
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.item_title ? element.item_title : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.unit ? element.unit : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.qty ? element.qty : ''}`,
          border: [false, false, false, true],
          style: 'tableBody2',
        },
        {
          text: `${element.cost_price?element.cost_price.toLocaleString('en-IN', { minimumFractionDigits: 2 }):''}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',
        },
        {
          border: [false, false, false, true],
          text: `${amount11.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          fillColor: '#f5f5f5',
          style: 'tableBody1',
        },
      ]);
    });
    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 150, 40, 80],
      footer: PdfFooter,
      content: [
        {
          columns: [
            {
              stack: [
                { text: `From:`, style: ['textSize'] },
                '\n',

                {
                  text: `10 Jalan Besar, #15-02 Sim Lim Tower, \n  Singapore - 208787, \n Email:arif@usoftsolutions.com`,
                  style: ['textSize'],
                },
              ],
            },
            {
              stack: [
                {
                  text: ` Po Number :${
                    purchasePoOrder.po_code ? purchasePoOrder.po_code : ''
                  } `,
                  style: ['textSize'],
                  margin: [120, 0, 0, 0],
                },
                {
                  text: ` Po Date : ${
                    purchasePoOrder.purchase_order_date
                      ? moment(purchasePoOrder.purchase_order_date).format('DD-MM-YYYY')
                      : ''
                  } `,
                  style: ['textSize'],
                  margin: [135, 0, 0, 0],
                },
                {
                  text: ` Your Ref :${
                    purchasePoOrder.supplier_reference_no
                      ? purchasePoOrder.supplier_reference_no
                      : ''
                  } `,
                  style: ['textSize'],
                  margin: [132, 0, 0, 0],
                },
                {
                  text: ` Our Ref : ${
                    purchasePoOrder.our_reference_no
                      ? purchasePoOrder.our_reference_no
                      : ''
                  }`,
                  style: ['textSize'],
                  margin: [137, 0, 0, 0],
                },
                { text: ` Site Address :`, style: ['textSize'], margin: [120, 0, 0, 0] },
              ],
            },
          ],
        },
        '\n',
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
            widths: ['50%', '51%'],

            body: [
              [
                {
                  text: 'Vendor Name',
                  alignment: 'center',
                  style: 'tableHead',
                },
                {
                  text: 'Ship To Address',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',
        {
          columns: [
            {
              stack: [
                {
                  text: `TO: ${
                    purchasePoOrder.supplier_name ? purchasePoOrder.supplier_name : ''
                  }\n `,
                  style: ['address', 'textSize'],
                  margin: [20, 0, 0, 0],
                },
                '\n',

                {
                  text: `Contact Name :${
                    purchasePoOrder.first_name ? purchasePoOrder.first_name : ''
                  }`,
                  style: ['textSize'],
                  margin: [20, 0, 0, 0],
                },
              ],
            },
            {
              text: `${
                purchasePoOrder.company_name ? purchasePoOrder.company_name : ''
              }\n ${purchasePoOrder.address_flat ? purchasePoOrder.address_flat : ''} ${
                purchasePoOrder.address_state ? purchasePoOrder.address_state : ''
              }\n ${
                purchasePoOrder.address_street ? purchasePoOrder.address_street : ''
              }\n ${
                purchasePoOrder.address_country ? purchasePoOrder.address_country : ''
              }\n ${
                purchasePoOrder.address_po_code ? purchasePoOrder.address_po_code : ''
              }`,
              alignment: 'left',
              style: ['address', 'textSize'],
              margin: [75, 0, 75, 0],
            },
          ],
        },
        '\n',
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
            widths: ['50%', '51%'],

            body: [
              [
                {
                  text: 'Payment Terms',
                  alignment: 'center',
                  style: 'tableHead',
                },
                {
                  text: 'Required By Date',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: `${
                    purchasePoOrder.payment_terms ? purchasePoOrder.payment_terms : ''
                  }`,
                  alignment: 'center',
                  style: 'tableBody',
                  border: [false, false, false, true],
                },
                {
                  text: `${
                    purchasePoOrder.creation_date
                      ? moment(purchasePoOrder.creation_date).format('DD-MM-YYYY')
                      : ''
                  }`,
                  alignment: 'center',
                  border: [false, false, false, true],
                  style: 'tableBody',
                },
              ],
            ],
          },
        },

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
            widths: ['8%', '31%', '14%', '14%', '20%', '20%', '14%'],

            body: productItems,
          },
        },
        '\n',
        '\n',

        {
          columns: [
            {
              text: `Approved By :${purchasePoOrder.po_code}`,
              alignment: 'left',
              style: ['invoiceAdd', 'textSize'],
            },
            {
              stack: [
                {
                  text: `SubTotal $ :    ${calculateTotal().toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize'],
                  margin: [130, 0, 0, 0],
                },
                '\n',
               

                {
                  text: `GST:        ${calculateGSTTotal().toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize'],
                  margin: [160, 0, 0, 0],
                },
                '\n',
                {
                  text: `Total $ :     ${calculateGSTAmount().toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize'],
                  margin: [145, 0, 0, 0],
                },
              ],
            },
          ],
        },
        '\n',
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
        tableBody1: {
          border: [false, false, false, true],
          margin: [10, 5, 0, 5],
          alignment: 'right',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [15, 5, 0, 5],
          alignment: 'center',
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
        Print Pdf
      </span>
    </>
  );
};

export default PdfMaterialPurchaseOrder;
