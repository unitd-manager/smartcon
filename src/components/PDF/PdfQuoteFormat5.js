import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//import * as numberToWords from 'number-to-words';
import PropTypes from 'prop-types';
//import * as Icon from 'react-feather';
import moment from 'moment';
// import message from '../Message';
import api from '../../constants/api';
import PdfHeader from './PdfHeader';

const PdfQuoteFormat5 = ({ id, quoteId }) => {
  PdfQuoteFormat5.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  };
  const [quote, setQuote] = React.useState([]);
  const [tenderDetails, setTenderDetails] = useState(null);
  //const [lineItem, setLineItem] = useState([]);
  const [hfdata, setHeaderFooterData] = React.useState();
  // const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
  //const [gTotal, setGtotal] = React.useState(0);
  const [rateItem, setRateItem] = useState([]);
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
  // const calculateTotal = () => {
  //   const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
  //   const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
  //   const total = grandTotal - discount; // Deduct the discount from the grand total

  //   return total;
  // };
  // const getQuoteById = () => {
  //   api
  //     .post('/tender/getQuoteLineItemsById', { quote_id: quoteId })
  //     .then((res) => {
  //       setLineItem(res.data.data);
  //       console.log('quote1', res.data.data);
  //       //let grandTotal = 0;
  //       res.data.data.forEach((elem) => {
  //         //grandTotal += elem.amount;
  //       });
  //      // setGtotal(grandTotal);
  //     })
  //     .catch(() => {
  //       //message('Invoice Data Not Found', 'info');
  //     });
  // };

  const getRateItemsById = () => {
    api
      .post('/tender/getRateItemsById', { quote_id: quoteId })
      .then((res) => {
        setRateItem(res.data.data);
        console.log('quote1', res.data.data);
        
      })
      .catch(() => {
        //message('Invoice Data Not Found', 'info');
      });
  };


  React.useEffect(() => {
    const parseHTMLContent = (htmlContent) => {
      if (htmlContent) {
        // Replace all occurrences of &nbsp; with an empty string
        //const plainText = htmlContent.replace(/&nbsp;/g, '');

        // Remove HTML tags using a regular expression
       // const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');

        //setParsedQuoteCondition(plainTextWithoutTags);
      }
    };
    // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
    parseHTMLContent(quote.quote_condition);

    // Other logic you have here...
  }, [quote.quote_condition]);

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
  //   fontSize: 8,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  //   lineHeight: 1.2,
  // }));

  React.useEffect(() => {
    getQuote();
    //getQuoteById();
    getCompany();
    getRateItemsById();
  }, []);

  const GetPdf = () => {
    const lineItemTable = [
      [
        {
          text: '',
          style: 'tableHead',
        },
        {
          text: '',
          style: 'tableHead',
        },
        {
          text: '(Monday ~ Friday) 0800hr ~ 1700hr (Saturday) 0800hr ~ 1200hr @ per Hour',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: '(Monday ~ Friday) 1700hr ~ 2200hr (Saturday) 1300hr ~ 2200hr @ per Hour',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: '(Monday - Saturday) 0000hr ~ 0800hr @ per Hour',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: '(Sunday,Public Holiday) Whole Day @ per Hour',
          style: 'tableHead',
          alignment: 'center',
        },

        {
          text: 'Meal Chargeable For Work After 1900hr/ 2300hr/0500hr',
          style: 'tableHead',
          alignment: 'center',
        },
        
      ],
    ];

    rateItem.forEach((element) => {
      lineItemTable.push([
        {
          text: `${element.designation}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: ``,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        // {
        //   text: `${element.mon_to_fri_normal_hr}`,
        //   border: [false, false, false, true],
        //   style: 'tableBody',
        //   alignment: 'center',
        // },
        {
          stack: [
            {
              columns: [
                {
                  text: '$', // Add the "$" symbol
                  alignment: 'left',
                  fontSize: 8,
                  width: 'auto',
                  marginTop: 5,
                  paddingTop: 5,

                },
                {
        text: `${element.mon_to_fri_normal_hr}`,
        border: [false, false, false, true],
        style: 'tableBody',
        alignment: 'center',
      },
              ],
            },
          ],
          
        },
        // {
        //   text: `${element.mon_to_fri_ot_hr}`,
        //   border: [false, false, false, true],
        //   style: 'tableBody',
        //   alignment: 'center',
        // },
        {
          stack: [
            {
              columns: [
                {
                  text: '$', // Add the "$" symbol
                  alignment: 'left',
                  fontSize: 8,
                  width: 'auto',
                  marginTop: 5,
                  paddingTop: 5,

                },
                {
          text: `${element.mon_to_fri_ot_hr}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
              ],
            },
          ],
          
        },
        // {
        //   text: `${element.mon_to_sat_normal_hr}`,
        //   border: [false, false, false, true],
        //   style: 'tableBody',
        //   alignment: 'center',
        // },
        {
          stack: [
            {
              columns: [
                {
                  text: '$', // Add the "$" symbol
                  alignment: 'left',
                  fontSize: 8,
                  width: 'auto',
                  marginTop: 5,
                  paddingTop: 5,

                },
                {
          text: `${element.mon_to_sat_normal_hr}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        
              ],
            },
          ],
          
        },
        // {
        //   text: `${element.sunday_public_holiday}`,
        //   border: [false, false, false, true],
        //   style: 'tableBody',
        //   alignment: 'center',
        // },
        {
          stack: [
            {
              columns: [
                {
                  text: '$', // Add the "$" symbol
                  alignment: 'left',
                  fontSize: 8,
                  width: 'auto',
                  marginTop: 5,
                  paddingTop: 5,

                },
                {
          text: `${element.sunday_public_holiday}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        
              ],
            },
          ],
          
        },
        // {
        //   text: `${element.meal_chargeable}`,
        //   border: [false, false, false, true],
        //   style: 'tableBody',
        //   alignment: 'center',
        // },
        {
          stack: [
            {
              columns: [
                {
                  text: '$', // Add the "$" symbol
                  alignment: 'left',
                  fontSize: 8,
                  width: 'auto',
                  marginTop: 5,
                  paddingTop: 5,

                },
                {
          text: `${element.meal_chargeable}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        
              ],
            },
          ],
          
        },
        
      ]);
    });

    

    const dd = {
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 120, 40, 80],
      pageSize: 'A4',
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
              return 8;
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
          bold: 'true',
        },
        '\n',
        {
          text: `Att : ${tenderDetails.first_name ? tenderDetails.first_name : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true',
        },

        '\n',
        {
          text: `Email:${tenderDetails.email ? tenderDetails.email : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true',
        },
        '\n',
        {
          text: `Project: ${tenderDetails.title ? tenderDetails.title : ''}`,
          style: ['notesText', 'textSize'],

          bold: 'true',
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
          text: `(A) SUB-CONTRACT RATE - DAY SHIFT`,
          style: ['notesText', 'textSize'],
          fontSize: 8,
          decoration: 'underline',
          bold: 'true',
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
              return 6;
            },
            paddingRight: () => {
              return 8;
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
            widths: [50,70, 65, 65, 55, 50,55],

            body: lineItemTable,
          },
          
          
        },
        '\n',
        '\n',
        '\n',
        

        

        [{
          text: `GENERAL`,
          fontSize: 9,
          bold: true,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],

        },
        {
          text: `${quote.general ? quote.general : ''}`,
          fontSize: 9,
          margin: [5, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
      ],
      '\n',
        
        [{
          text: `SCOPE OF WORKS`,
          fontSize: 9,
          bold: true,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],

        },
        {
          text: `${quote.scope_of_works ? quote.scope_of_works : ''}`,
          fontSize: 9,
          margin: [5, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
      ],
      '\n',
      [{
        text: `COMMENCEMENT AND COMPLETION DATES`,
        fontSize: 9,
        bold: true,
        decoration: 'underline',
        margin: [0, 5, 0, 0],
        style: ['notesText', 'textSize'],

      },
      {
        text: `${quote.commencement_and_completion ? quote.commencement_and_completion : ''}`,
        fontSize: 9,
        margin: [5, 5, 0, 0],
        style: ['notesText', 'textSize'],
      },
    ],
      
        '\n',
        [{
          text: `SAFETY`,
          fontSize: 9,
          bold: true,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
  
        },
        {
          text: `${quote.safety ? quote.safety : ''}`,
          fontSize: 9,
          margin: [5, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
      ],
      '\n',
      

        [{
          text: `INSURANCE`,
          fontSize: 9,
          bold: true,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
  
        },
        {
          text: `${quote.insurance ? quote.insurance : ''}`,
          fontSize: 9,
          margin: [5, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
      ],
      '\n', 
      [{
        text: `INVOICES & PAYMENT :`,
        fontSize: 9,
        bold: true,
        decoration: 'underline',
        margin: [0, 5, 0, 0],
        style: ['notesText', 'textSize'],

      },
      {
        text: `${quote.invoices_payment_terms ? quote.invoices_payment_terms : ''}`,
        fontSize: 9,
        margin: [5, 5, 0, 0],
        style: ['notesText', 'textSize'],
      },
    ],
    '\n',
    [{
      text: `NOTICE OF TERMINATION  :`,
      fontSize: 9,
      bold: true,
      decoration: 'underline',
      margin: [0, 5, 0, 0],
      style: ['notesText', 'textSize'],

    },
    {
      text: `${quote.notice_of_termination ? quote.notice_of_termination : ''}`,
      fontSize: 9,
      margin: [5, 5, 0, 0],
      style: ['notesText', 'textSize'],
    },
  ],
    
      '\n',
      [{
        text: `TAXES :`,
        fontSize: 9,
        bold: true,
        decoration: 'underline',
        margin: [0, 5, 0, 0],
        style: ['notesText', 'textSize'],

      },
      {
        text: `${quote.taxes ? quote.taxes : ''}`,
        fontSize: 9,
        margin: [5, 5, 0, 0],
        style: ['notesText', 'textSize'],
      },
    ],

        '\n\n\n',
        '\n',

        {
          width: '100%',
          alignment: 'center',
          text: 'Thank You For your support and commitment.',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 8,
        },
        '\n\n\n',
        [{
          text: `PYRAMID ENGINEERING PRIVATE LTD `,
          fontSize: 8,
          color:'red',
          bold:true,
          // decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
        {
          text: `BALA`,
          color:'blue',
          bold:true,
          fontSize: 7,
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
  
        },
        {
          text: `We accept the above terms and conditions.
          For and on behalf of`,
          fontSize: 7,
          
          alignment:'right',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
  
        },
        {
          text: `${tenderDetails.company_name ? tenderDetails.company_name : ''}`,
          fontSize: 9,
          color:'blue',
          bold:true,
          margin: [0, 5, 0, 0],
          style: ['invoiceAdd', 'textSize'],
        },
      ],
      '\n\n',
      {
        columns: [
          {
            width: '78%',
            text: `Name:`,
            alignment: 'right',
            fontSize: 7,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
          {
            width: '22%',
            text: `${tenderDetails.first_name ? tenderDetails.first_name : ''}`,
            alignment: 'right',
            fontSize: 7,
            color:'blue',
            bold: true,
            margin: [0, 10, 15, 10],
            style: ['invoiceAdd', 'textSize']
          },
        ],
      },
      
      {
        columns: [
          {
            width: '78%',
            text: `Position:`,
            alignment: 'right',
            fontSize: 7,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
          {
            width: '22%',
            text: `${tenderDetails.position ? tenderDetails.position : ''}`,
            alignment: 'right',
            fontSize: 7,
            color:'blue',
            bold: true,
            margin: [0, 10, 60, 10],
            style: ['invoiceAdd', 'textSize']
          },
        ],
      },
      
      {
        columns: [
          {
            width: '78%',
            text: `Date:`,
            alignment: 'right',
            fontSize: 7,
            margin: [0, 10, 0, 10],
            style: ['invoiceAdd', 'textSize']
          },
          {
            width: '22%',
            text: ``,
            alignment: 'right',
            fontSize: 7,
            color:'blue',
            bold: true,
            margin: [0, 10, 10, 10],
            style: ['invoiceAdd', 'textSize']
          },
        ],
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
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 0, 0, 5],
          fontSize: 8,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 8.5,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [0, 5, 35, 5],
          alignment: 'right',
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
         5
      </span>
    </>
  );
};

export default PdfQuoteFormat5;
