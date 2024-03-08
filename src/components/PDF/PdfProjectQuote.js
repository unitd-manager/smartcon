import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as numberToWords from 'number-to-words';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import moment from 'moment';
import api from '../../constants/api';
import PdfHeader from './PdfHeader';

const PdfProjectQuote = ({ id, quoteId }) => {
  PdfProjectQuote.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = React.useState();
  const [quote, setQuote] = React.useState([]);
  const [projectDetail, setProjectDetail] = useState();
  const [lineItem, setLineItem] = useState([]);
  const [gTotal, setGtotal] = React.useState(0);
  const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
  //const [lineItem, setLineItem] = useState(null);

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  const getProjectById = () => {
    api
      .post('/project/getProjectById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data[0]);
      })
      .catch(() => { });
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/project/getTabQuoteById', { project_id: id }).then((res) => {
      setQuote(res.data.data[0]);
      console.log('quote2', res.data.data[0]);
    });
  };
  const calculateTotal = () => {
    const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
    const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
    const total = grandTotal - discount; // Deduct the discount from the grand total

    return total;
  };
  const getQuoteById = () => {
    api
      .post('/project/getQuoteLineItemsById', { quote_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
        });
        setGtotal(grandTotal);
        console.log('quote1', res.data.data);
        //setViewLineModal(true);
      })
      .catch(() => { });
  };
  React.useEffect(() => {
    const parseHTMLContent = (htmlContent) => {
      if (htmlContent) {
        // Replace <br /> or <br> with a newline character (\n)
        const plainTextWithNewlines = htmlContent.replace(/<br\s*\/?>/g, '\n');
        
        // Replace &amp; with an ampersand (&)
        const plainTextWithAmpersand = plainTextWithNewlines.replace(/&amp;/g, '&');
    
        // Replace &nbsp; with a regular space
        const plainText = plainTextWithAmpersand.replace(/&nbsp;/g, ' ');
    
        // Remove HTML tags using a regular expression
        const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');
    
        setParsedQuoteCondition(plainTextWithoutTags);
      }
    };
    // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
    parseHTMLContent(quote.quote_condition);

    // Other logic you have here...
  }, [quote.quote_condition]);

  //The quote_condition content and format it as bullet points
  const formatQuoteConditions = (conditionsText) => {
    const formattedConditions = conditionsText.split(':-').map((condition, index) => {
      const trimmedCondition = condition.trim();
      return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
    });
    return formattedConditions;
  };

  // Format the conditions content for PDF
  const conditions = formatQuoteConditions(parsedQuoteCondition);
  // const conditionsContent = conditions.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  // }));
  // / Format the conditions content for PDF
  const conditionsContent = conditions.map((condition) => ({
    text: `${condition}`,
    fontSize: 10,
    margin: [15, 5, 0, 0],
    style: ['notesText', 'textSize'],
    lineHeight: 1.2,
  }));


  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getProjectById();
  }, []);

  const GetPdf = () => {
    const lineItemBody = [
      [
        {
          text: 'Item',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Description',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Qty',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Unit Price',
          style: 'tableHead',
          alignment: 'right'
        },

        {
          text: 'Amount S$',
          style: 'tableHead',
          alignment: 'right'
        },
      ],
    ];
    lineItem.forEach((element) => {
      lineItemBody.push([
        {
          text: `${element.title}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center'
        },
        {
          text: `${element.description}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center'
        },
        {
          text: `${element.quantity}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center'
        },
        {
          text: `${element.unit_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'right'
        },

        {
          text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          fillColor: '#f5f5f5',
          style: 'tableBody',
          alignment: 'right'
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
          text: `Client:${projectDetail.company_name ? projectDetail.company_name : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true',
        },
        '\n',
        {
          text: `Att : ${projectDetail.first_name ? projectDetail.first_name : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true'
        },

        '\n',
        {
          text: `Email:${projectDetail.email ? projectDetail.email : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true',
        },
        '\n',
        {
          text: `Project: ${projectDetail.title ? projectDetail.title : ''}`,
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
          text: `Date :   ${(quote.quote_date) ? moment(quote.quote_date).format('DD-MM-YYYY') : ''} `,
          style: ['invoiceAdd', 'textSize'],

        },
        '\n',
        {
          text: `validity :${quote.validity ? quote.validity : ''
            }`,

          style: ['invoiceAdd', 'textSize'],

        },
        '\n',
        {
          text: `Terms of Payment :${quote.payment_method ? quote.payment_method : ''
            }`,

          style: ['invoiceAdd', 'textSize'],

        }, '\n',
        {
          text: `Price :  $  ${quote.totalamount ? quote.totalamount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0'} `,
margin:[0,0,0,0],
alignment:"right",
          style: ['invoiceAdd', 'textSize'],

        },

        '\n',
        '\n',

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
            widths: [50, 105, 85, 80, 90],

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
              text: `Discount  :       ${quote.discount ? quote.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0'}`,
              alignment: 'right',
              margin: [0, 0, 10, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `Total $ :     ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
              alignment: 'right',
              margin: [0, 0, 10, 0],
              style: 'textSize',
            },
            '\n\n\n',
            {
              text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
              bold: 'true',
              fontSize: '11',
              margin: [40, 0, 0, 0],
            },
          ],
        },
        '\n\n',
        '\n',

        {
          text: `Terms and Conditions: `,
          fontSize: 11,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
        ...conditionsContent, // Add each condition as a separate paragraph

        '\n',
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
          alignment: 'center',
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10.5,
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
        <Icon.Printer />
      </span>
    </>
  );
};

export default PdfProjectQuote;
