import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as numberToWords from 'number-to-words';
import PropTypes from 'prop-types';
//import * as Icon from 'react-feather';
import moment from 'moment';
// import message from '../Message';
import api from '../../constants/api';
import PdfHeader from './PdfHeader';

const PdfQuoteFormat4 = ({ id, quoteId }) => {
    PdfQuoteFormat4.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  };
  const [quote, setQuote] = React.useState([]);
  const [tenderDetails, setTenderDetails] = useState(null);
  const [lineItem, setLineItem] = useState([]);
  const [hfdata, setHeaderFooterData] = React.useState();
  // const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
  const [gTotal, setGtotal] = React.useState(0);
  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, [0]);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  const getCompany = () => {
    api
      .post('/tender/getTendersById', { opportunity_id: id })
      .then((res) => {
        setTenderDetails(res.data.data);
        console.log(res);
      })
      .catch(() => {});
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuote(res.data.data[0]);
      console.log('quote', res.data.data[0]);
    });
  };
  // const calculateTotal = () => {
  //   const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
  //   return grandTotal;
  //   // const gstValue = quote.gst_value || 0;
  //   // const total = grandTotal + gstValue;
  //   // return total;
  // };
  const calculateTotal = () => {
    const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
    const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
    const total = grandTotal - discount; // Deduct the discount from the grand total

    return total;
  };
  const getQuoteById = () => {
    api
      .post('/tender/getQuoteLineItemsById', { quote_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        console.log('quote1', res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
        });
        setGtotal(grandTotal);
      })
      .catch(() => {
        //message('Invoice Data Not Found', 'info');
      });
  };

  // React.useEffect(() => {
  //   const parseHTMLContent = (htmlContent) => {
  //     if (htmlContent) {
  //       // Replace all occurrences of &nbsp; with an empty string
  //       const plainText = htmlContent.replace(/&nbsp;/g, '');

  //       // Remove HTML tags using a regular expression
  //       const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');

  //       setParsedQuoteCondition(plainTextWithoutTags);
  //     }
  //   };
  //   // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
  //   parseHTMLContent(quote.quote_condition);

  //   // Other logic you have here...
  // }, [quote.quote_condition]);
  // const [parsedQuoteCondition1, setParsedQuoteCondition1] = useState('');
  // React.useEffect(() => {
  //   const parseHTMLContent = (htmlContent) => {
  //     if (htmlContent) {
  //       // Replace all occurrences of &nbsp; with an empty string
  //       const plainText = htmlContent.replace(/&nbsp;/g, '');

  //       // Remove HTML tags using a regular expression
  //       const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');

  //       setParsedQuoteCondition1(plainTextWithoutTags);
  //     }
  //   };
  //   // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
  //   parseHTMLContent(quote.job_scope);

  //   // Other logic you have here...
  // }, [quote.job_scope]);

  //The quote_condition content and format it as bullet points
  // const formatQuoteConditions = (conditionsText) => {
  //   const formattedConditions = conditionsText.split(':-').map((condition, index) => {
  //     const trimmedCondition = condition.trim();
  //     return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
  //   });
  //   return formattedConditions;
  // };

  // Format the conditions content for PDF
  // const conditions = formatQuoteConditions(parsedQuoteCondition);
  // const conditionsContent = conditions.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  // }));
  // / Format the conditions content for PDF
  // const conditionsContent = conditions.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  //   lineHeight: 1.2,
  // }));

  // const formatQuoteConditions1 = (conditionsText) => {
  //   const formattedConditions = conditionsText.split(':-').map((condition, index) => {
  //     const trimmedCondition = condition.trim();
  //     return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
  //   });
  //   return formattedConditions;
  // };

  // Format the conditions content for PDF
  // const conditions1 = formatQuoteConditions1(parsedQuoteCondition1);

  // / Format the conditions content for PDF
  // const conditionsContent1 = conditions1.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  //   lineHeight: 1.2,
  // }));

  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getCompany();
  }, []);
  

  const GetPdf = () => {
    const lineItemBody = [
      [
        // {
        //   text: 'SN',
        //   style: 'tableHead',
        // },
        {
          text: 'Item',
          style: 'tableHead',
          alignment: 'center',
        },
        {
            text: 'Asset No',
            style: 'tableHead',
            alignment: 'center',
          },
        {
          text: 'Description',
          style: 'tableHead',
          alignment: 'center',
        },
        // {
        //   text: 'Unit',
        //   style: 'tableHead',
        //   alignment: 'center',
        // },
        {
          text: 'Qty',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: 'Unit Price',
          style: 'tableHead',
          alignment: 'right',
        },
        {
            text: 'From Date',
            style: 'tableHead',
            alignment: 'center',
          },
          {
            text: 'To Date',
            style: 'tableHead',
            alignment: 'center',
          },
          {
            text: 'No of days',
            style: 'tableHead',
            alignment: 'center',
          },
        {
          text: 'Gross Price S$',
          style: 'tableHead',
          alignment: 'right',
        },
      ],
    ];
    lineItem.forEach((element) => {
      const assetNo = element.asset_no || ''; // Set assetNo to an empty string if it's null or undefined
      const fromDate = element.from_date || ''; // Set fromDate to an empty string if it's null or undefined
      const toDate = element.to_date || ''; // Set toDate to an empty string if it's null or undefined   
      const noOfDays = element.no_of_days || '';
      lineItemBody.push([
        // {
        //   text: `${index + 1}`,
        //   style: 'tableBody',
        //   border: [false, false, false, true],
        // },
        {
          text: `${element.title}`,
          border: [true, true, true, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
            text: assetNo,
            border: [true, true, true, true],
            style: 'tableBody',
            alignment: 'left',
          },
        {
          text: `${element.description}`,
          border: [true, true, true, true],
          style: 'tableBody',
          alignment: 'left',
        },
        // {
        //     text: `${element.unit}`,
        //     border: [true, true, true, true],
        //     style: 'tableBody',
        //     alignment: 'center',
        //   },
        {
          text: `${element.quantity}`,
          border: [true, true, true, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
          stack: [
            {
              columns: [
                {
                  text: '$', // Add the "$" symbol
                  alignment: 'left',
                  width: 'auto',
                },
                {
                  text: `${element.unit_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  alignment: 'right', // Align the amount to the right
                  width: '*',
                },
              ],
            },
          ],
          border: [true, true, true, true],
          style: 'tableBody',
        },
        // {
        //   text: `${element.unit_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        //   border: [false, false, false, true],
        //   style: 'tableBody',
        //   alignment: 'right',
        // },
          {
            text: fromDate,
            border: [true, true, true, true],
            style: 'tableBody',
            alignment: 'center',
          },
          {
            text:toDate ,
            border: [true, true, true, true],
            style: 'tableBody',
            alignment: 'center',
          },
          {
            text: noOfDays,
            border: [true, true, true, true],
            style: 'tableBody',
            alignment: 'center',
          },
          {
            stack: [
              {
                columns: [
                  {
                    text: '$', // Add the "$" symbol
                    alignment: 'left',
                    width: 'auto',
                  },
                  {
                    text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                    alignment: 'right', // Align the amount to the right
                    width: '*',
                  },
                ],
              },
            ],
            border: [true, true, true, true],
            style: 'tableBody',
          },
        // {
        //   text: `$  ${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        //   border: [false, false, false, true],
        //   fillColor: '#f5f5f5',
        //   style: 'tableBody',
        //   alignment: 'right',
        //   paddingLeft: 5,
        // },
      ]);
    });

    const dd = {
      header: PdfHeader({ findCompany }),
      pageMargins: [15, 110, 20, 80],
    pagesize: 'A4', 
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
            widths: ['105%', '51%'],

            body: [
              [
                {
                  text: 'QUOTATION',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',

        {
          text: `Client:${tenderDetails.company_name ? tenderDetails.company_name : ''}`,
          style: ['notesText', 'textSize'],
          //bold: 'true',
        },
        '\n',
        {
          text: `Att : ${tenderDetails.first_name ? tenderDetails.first_name : ''}`,
          style: ['notesText', 'textSize'],
          //bold: 'true',
        },

        '\n',
        {
          text: `Email:${tenderDetails.email ? tenderDetails.email : ''}`,
          style: ['notesText', 'textSize'],
          //bold: 'true',
        },
        '\n',
        {
          text: `Project: ${tenderDetails.title ? tenderDetails.title : ''}`,
          style: ['notesText', 'textSize'],

          //bold: 'true',
        },

        {
          text: `Quotation No :${quote.quote_code ? quote.quote_code : ''}`,

          style: ['invoiceAdd', 'textSize'],
          margin: [0, -90, 0, 0],
        },
        '\n',
        // {
        //   text: `Date :${
        //     quote.quote_date ? quote.quote_date  : ''
        //   }`,

        //   style: ['invoiceAdd', 'textSize'],

        // },
        {
          text: `Date :   ${
            quote.quote_date ? moment(quote.quote_date).format('DD-MM-YYYY') : ''
          } `,
          style: ['invoiceAdd', 'textSize'],
        },
        '\n',
        {
          text: `validity :${quote.validity ? quote.validity : ''}`,

          style: ['invoiceAdd', 'textSize'],
        },
        '\n',
        {
          text: `Terms of Payment :${quote.payment_method ? quote.payment_method : ''}`,

          style: ['invoiceAdd', 'textSize'],
        },
        '\n',
        {
          text: `Price : $ ${
            quote.totalamount
              ? quote.totalamount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
              : '0'
          }`,

          style: ['invoiceAdd', 'textSize'],
        },

        // {
        //   text: `Date :   ${(quote.quote_date) ? moment(quote.quote_date).format('DD-MM-YYYY') : ''}
        //    Quote Code :  ${quote.quote_code ? quote.quote_code : ''
        //     }\n \n  `,
        //   style: ['invoiceAdd', 'textSize'],
        //   margin: [0, -60, 0, 0]
        // },

        // '\n\n\n',
        // {
        //   text: `Att : ${tenderDetails.first_name ? tenderDetails.first_name : ''}`,
        //   style: ['notesText', 'textSize'],
        //   bold: 'true'
        // },

        // '\n',

        // {
        //   text: `Project :-    ${tenderDetails.title ? tenderDetails.title : ''}`,
        //   bold: 'true',
        //   style: ['notesText', 'textSize'],
        // },

        '\n\n',

        {
          layout: {
            defaultBorder: true,
            // hLineWidth: () => {
            //   return 1;
            // },
            // vLineWidth: () => {
            //   return 1;
            // },
            // hLineColor: (i) => {
            //   if (i === 1 || i === 0) {
            //     return '#bfdde8';
            //   }
            //   return '#eaeaea';
            // },
            // vLineColor: () => {
            //   return '#eaeaea';
            // },
            // hLineStyle: () => {
            //   // if (i === 0 || i === node.table.body.length) {
            //   return null;
            //   //}
            // },
            // // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: () => {
            //   return 10;
            // },
            // paddingRight: () => {
            //   return 10;
            // },
            // paddingTop: () => {
            //   return 2;  
            // },
            // paddingBottom: () => {
            //   return 2;
            // },
            // fillColor: () => {
            //   return '#fff';
            // },
          },
          table: {
            headerRows: 1,
            widths: [30, 60, 120, 40, 40, 45, 45, 40, 55],
            defaultBorder: false,
            body: lineItemBody,
          },
        },
        '\n',
        {
          stack: [
            {
              text: `SubTotal $ :     ${gTotal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 10, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `Discount  :       ${
                quote.discount
                  ? quote.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                  : '0'
              }`,
              alignment: 'right',
              margin: [0, 0, 15, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `Total Excluding of GST $ :     ${calculateTotal().toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 10, 0],
              style: 'textSize',
            },
            '\n\n\n',

            {
              text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
              style: 'bold',
              fontSize: 8,
              margin: [40, 0, 0, 0],
              alignment: 'center'
            },
          ],
        },
        '\n\n',
        '\n',

        [{
          text: `External Notes: `,
          fontSize: 8,
          // decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize', 'bold'],
        },
        // quote.external_notes, // Add each condition as a separate paragraph
        {
          text: quote.external_notes ? quote.external_notes : '',
          fontSize: 7,
          margin: [5, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
      ],

        '\n\n\n',
        '\n\n\n\n',
        {
          text: 'ACKNOWLEDGE ACCEPTANCE BY',
          style: 'textSize',
          bold: true,
          margin: [10, -50, 0, 0],
          alignment: 'right',
        },
        {
          columns: [
            {
              canvas: [{ type: 'line', x1: 155, y1: 0, x2: 0, y2: 0, lineWidth: 1 }],
              margin: [0, 20, 0, 0],
              alignment: 'right',
            },
          ],
        },

        {
          columns: [
            {
              text: 'Sign with Company Stamp and fax by return',
              style: 'textSize',

              margin: [0, 10, 0, 0],
              alignment: 'right',
            },
          ],
        },
        '\n\n',

        {
          text: `PYRAMID ENGINEERING PRIVATE LTD `,
          fontSize: 8,
          // decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
        // ...conditionsContent1, // Add each condition as a separate paragraph
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
          fontSize: 8,
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 8,
          bold: 'true',
        },
        tableBody: {
          border: [true, true, true, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 8,
        },
        tableBody1: {
          border: [true, true, true, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 8,
        },
        tableBody2: {
          border: [true, true, true, true],
          margin: [0, 5, 35, 5],
          alignment: 'right',
          fontSize:8,
        },
      },
      defaultStyle: {
        columnGap: 10,
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <span onClick={GetPdf}>
        4
      </span>
    </>
  );
};

export default PdfQuoteFormat4;
