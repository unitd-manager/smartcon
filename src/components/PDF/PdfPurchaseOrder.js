import React from 'react';
import { useParams } from 'react-router-dom';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import moment from 'moment';
import api from '../../constants/api';
// import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';


const PdfPurchaseOrder = () => {
  const { id } = useParams();
  const [hfdata, setHeaderFooterData] = React.useState();
  const [products, setProducts] = React.useState([]);
  const [purchaseDetails, setPurchaseDetails] = React.useState();
  const [gTotal, setGtotal] = React. useState(0);
  const [terms, setTerms] = React. useState();
  // const [gstTotal, setGsttotal] = React. useState(0);
  // const [Total, setTotal] = React. useState(0);
console.log('terms',terms)

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
     
    });
  }, []);

  React.useEffect(() => {
    api.get('/setting/getSettingsForTerms').then((res) => {
      setTerms(res.data.data[0]);
     
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    console.log('filteredResult',filteredResult.value)
    return filteredResult.value;
  };
  // Gettind data from Job By Id
  const getPoProduct = () => {
    api
      .post('/purchaseorder/getPurchaseOrderById', { purchase_order_id: id })
      .then((res) => {
        setPurchaseDetails(res.data.data[0]);
        
      })
      .catch(() => {
         
      });
  };
  const getPurchaseOrderId = () => {
    api
      .post('/purchaseorder/getPurchaseOrderByPdf', { purchase_order_id: id })
      .then((res) => {
        setProducts(res.data.data);
          //grand total
          let grandTotal = 0;
        //   let grand = 0;
        //  let gst = 0;
         res.data.data.forEach((elem) => {
           grandTotal += elem.total_price;
          //  grand += elem.actual_value;
         });
         setGtotal(grandTotal);
        //  gst=grandTotal*0.07
        //  setGsttotal(gst);
        //  grand=grandTotal+gst
        //  setTotal(grand);
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
          text: 'Sn',
          style: 'tableHead',
        },
        {
          text: 'Description',
          style: 'tableHead',
        },
        {
          text: 'Uom',
          style: 'tableHead',
        },
        {
          text: 'Qty',
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
    products.forEach((element, index) => {
      
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.item_title? element.item_title : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.unit? element.unit : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.po_QTY ? element.po_QTY : ''}`,
          border: [false, false, false, true],
          style: 'tableBody2',
        },
        {
          text: `${(element.cost_price  .toLocaleString('en-IN', {  minimumFractionDigits: 2 }))}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',
        },
        {
          border: [false, false, false, true],
          text: `${(element.total_price  .toLocaleString('en-IN', {  minimumFractionDigits: 2 }))}`,
          fillColor: '#f5f5f5',
          style: 'tableBody1',
        },
      ]);
    });

    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 150, 40, 80],
      // footer: PdfFooter,
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
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
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
            widths: ['101%',],

            body: [
              [
                {
                  text: `~PURCHASE ORDER~`,
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
                {text:` Po Number :${purchaseDetails.po_code?purchaseDetails.po_code:''} `,style: [ 'textSize'],margin:[120,0,0,0]  },
                {text:` Date : ${(purchaseDetails.purchase_order_date)? moment(purchaseDetails.purchase_order_date).format('DD-MM-YYYY'):''} `,style: [ 'textSize'],margin:[120,0,0,0]  },
                {text:` Yr Ref No :${purchaseDetails.supplier_reference_no?purchaseDetails.supplier_reference_no:''} `,style: [ 'textSize'],margin:[120,0,0,0]  },
                {text:` Yr Quote Date : ${(purchaseDetails.yr_quote_date)? moment(purchaseDetails.yr_quote_date).format('DD-MM-YYYY'):''} `,style: [ 'textSize'],margin:[120,0,0,0]  },
                {text:` Delivery Date : ${(purchaseDetails.delivery_date)? moment(purchaseDetails.delivery_date).format('DD-MM-YYYY'):''} `,style: [ 'textSize'],margin:[120,0,0,0]  },

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
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
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
            widths: ['34%','33%', '33%'],

            body: [
              [
                {
                  text: 'Item',
                  alignment: 'left',
                  style: 'tableHead',
                },
                {
                  text: 'Payment Terms',
                  alignment: 'right',
                  style: 'tableHead',
                },
                {
                  text: 'Currency',
                  alignment: 'right',
                  style: 'tableHead',
                },
              ],
              [
                {
                  text: `${purchaseDetails.purchase_item ? purchaseDetails.purchase_item : ''}`,
                  alignment: 'left',
                  style: 'tableBody',
                  border: [false, false, false, true],
                },
                {
                  text: `${purchaseDetails.payment_terms ? purchaseDetails.payment_terms : ''}`,
                  alignment: 'right',
                  style: 'tableBody',
                  border: [false, false, false, true],
                },
                {
                  text: `${purchaseDetails.currency ? purchaseDetails.currency : ''}`,
                  alignment: 'right',
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
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
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
            widths: [20, 155,'*' , '*', 60, 83],

            body: productItems,
          },
        },
        '\n\n',
        {
          columns: [
              {
              text: `General Condition : \n${(purchaseDetails.notes ? purchaseDetails.notes : '')}`,
              alignment: 'left',
              bold: true,
              style: ['invoiceAdd', 'textSize']
            },
          
             {   stack:[
    {text:`Total Proviional Amount $ : ${(gTotal.toLocaleString('en-IN', {  minimumFractionDigits: 2 }))}`, style: [ 'textSize'], margin :[130,0,0,0] },
     '\n',
   
    //  {text:`GST:    ${(gstTotal.toLocaleString('en-IN', {  minimumFractionDigits: 2 }))}`, style: [ 'textSize'], margin :[160,0,0,0]  },
    //  '\n',
    //   {text:`Total $ :  ${(Total.toLocaleString('en-IN', {  minimumFractionDigits: 2 }))}`, style: [ 'textSize'], margin :[145,0,0,0] },
     
      ]},
      
            
          ],
          
        },
        
    {
        columns: [
          {
          stack: [
          {
            
            width: '40%',
            text: `Authorized By`,
            alignment: 'right',
            bold: true,
            margin: [-10, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
          {
            
            width: '40%',
            text: `PYRAMID ENGINEERING PRIVATE LTD`,
            alignment: 'right',
            bold: true,
            color:'brown',
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
        ],
      },
        ],
      },
      '\n',
      '\n',
      '\n',
      {
        columns: [
          {
            width: '80%',
            text: `Name`,
            alignment: 'right',
            bold: true,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
          {
            width: '20%',
            text: `Bala`,
            alignment: 'right',
            bold: true,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
        ],
      },
      {
        columns: [
          {
            width: '80%',
            text: `Date`,
            alignment: 'right',
            bold: true,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
          {
            width: '20%',
            text: `12.03.24`,
            alignment: 'right',
            bold: true,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
        ],
      },
      {
          width: '100%',
          alignment: 'center',
          text: 'PURCHASE ORDER ACKNOWLEDGEMENT',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 12,
        },
       
        {
          columns: [
            {
              stack: [
               {text:` Sign and Return within Three Days after receipt of This Order `,style: [ 'textSize'],margin:[20,0,0,0]  },
                {text:` Name: ${(purchaseDetails.purchase_order_date)? moment(purchaseDetails.purchase_order_date).format('DD-MM-YYYY'):''} `,style: [ 'textSize'],margin:[20,0,0,0]  },
                {text:` Signature:${purchaseDetails.supplier_reference_no?purchaseDetails.supplier_reference_no:''} `,style: [ 'textSize'],margin:[20,0,0,0]  },
                {text:` Date : ${(purchaseDetails.yr_quote_date)? moment(purchaseDetails.yr_quote_date).format('DD-MM-YYYY'):''} `,style: [ 'textSize'],margin:[20,0,0,0]  },
              
              ],
            },
        
          ],
        },
        
        {
          width: '100%',
          alignment: 'center',
          text: 'Company Stamp',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 9,
        },
        
        {
          width: '100%',
          alignment: 'center',
          text: '10 BUROH STREET, WEST CONNECT BUILDING #07-34, SINGAPORE 627564 Tel: 62599046 UEN: 200821275M email: accounts@pyramid-groups.com',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 6,
        },

        {
          width: '100%',
          alignment: 'center',
          text: 'PURCHASE ORDER (Back Page)',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 12,
        },

        {
          width: '100%',
          alignment: 'center',
          text: 'Terms And Conditions',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 12,
        },

        {
          width: '100%',
          alignment: 'left',
          text: `${terms && terms.value ? terms.value : ''}`,
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 6,
        },

        {
          width: '100%',
          alignment: 'left',
          text: 'Acknowledge By',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 8,
        },
        '\n',
        '\n',
        '\n',
        '\n',

        {
          width: '100%',
          alignment: 'center',
          text: '10 BUROH STREET, WEST CONNECT BUILDING #07-34, SINGAPORE 627564 Tel: 62599046 UEN: 200821275M email: accounts@pyramid-groups.com',
          bold: true,
          margin: [10, 10, 0, 10],
          fontSize: 5,
        },
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
        textSize1: {
          fontSize: 7,
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
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Purchase Order
      </Button>
    </>
  );
};

export default PdfPurchaseOrder;
