import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
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
//   const [gTotal, setGtotal] = React.useState(0);
//   const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
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
      .post('/project/getProjectAndJobOrderById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data[0]);
        console.log('projectdetails', res.data.data)
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
//   const calculateTotal = () => {
//     const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
//     const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
//     const total = grandTotal - discount; // Deduct the discount from the grand total

//     return total;
//   };
  const getQuoteById = () => {
    api
      .post('/project/getJobLineItemsById', { job_order_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        // let grandTotal = 0;
        // res.data.data.forEach((elem) => {
        //   grandTotal += elem.amount;
        // });
        // setGtotal(grandTotal);
        console.log('quote1', res.data.data);
        //setViewLineModal(true);
      })
      .catch(() => { });
  };
//   React.useEffect(() => {
//     const parseHTMLContent = (htmlContent) => {
//       if (htmlContent) {
//         // Replace all occurrences of &nbsp; with an empty string
//         const plainText = htmlContent.replace(/&nbsp;/g, '');

//         // Remove HTML tags using a regular expression
//         const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');

//         setParsedQuoteCondition(plainTextWithoutTags);
//       }
//     };
//     // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
//     parseHTMLContent(quote.quote_condition);

//     // Other logic you have here...
//   }, [quote.quote_condition]);

  //The quote_condition content and format it as bullet points
//   const formatQuoteConditions = (conditionsText) => {
//     const formattedConditions = conditionsText.split(':-').map((condition, index) => {
//       const trimmedCondition = condition.trim();
//       return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
//     });
//     return formattedConditions;
//   };

  // Format the conditions content for PDF
//   const conditions = formatQuoteConditions(parsedQuoteCondition);
  // const conditionsContent = conditions.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  // }));
  // / Format the conditions content for PDF
//   const conditionsContent = conditions.map((condition) => ({
//     text: `${condition}`,
//     fontSize: 10,
//     margin: [15, 5, 0, 0],
//     style: ['notesText', 'textSize'],
//     lineHeight: 1.2,
//   }));


  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getProjectById();
  }, []);

  const GetPdf = () => {
    const lineItemBody = [
      [
        {
          text: 'S.no',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Work Description',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Qty',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Unit',
          style: 'tableHead',
          alignment: 'right'
        },
      ],
    ];
    lineItem.forEach((element, index ) => {
      lineItemBody.push([
        {
            text: `${index + 1}`, // index + 1 for 1-based numbering
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
            text: `${element.unit}`,
            border: [false, false, false, true],
            style: 'tableBody',
            alignment: 'center'
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
                  text: 'JOB COMPLETION CERTIFICATE',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: ['70%', '30%'],
            body: [
              [
                {
                  text: `
                         Client             :     ${projectDetail.company_name ? projectDetail.company_name : ''}
                      \n Project           :    ${projectDetail.title ? projectDetail.title : ''}
                      \n Location       :      ${projectDetail.project_location ? projectDetail.project_location : ''}
                      \n Date              :      ${projectDetail.witness_by_date ? moment(projectDetail.witness_by_date).format('YYYY-MM-DD') : ''}`,
                  style: ['notesText', 'textSize'],
                  bold: false,
                  // border: [true, true, true, true],
                },
                {
                  text: `
                         JCC No              :  ${projectDetail.job_order_code ? projectDetail.job_order_code : ''}
                      \n PO Number        :  ${projectDetail.po_number ? projectDetail.po_number : ''}
                      \n Quote Number  :  ${quote.quote_code ? quote.quote_code : ''}
                      \n Date                  :      ${projectDetail.date ? moment(projectDetail.date).format('YYYY-MM-DD') : ''}`,
                  style: ['notesText', 'textSize'],
                  bold: false,
                  // border: [true, true, true, true],
                }
              ]
            ]
          },
        },
        // {
        //   text: `Client                     :     ${projectDetail.company_name ? projectDetail.company_name : ''}`,
        //   style: ['notesText', 'textSize'],
        //   bold: 'true',
        // },
        // '\n',
        
        // {
        //   text: `Project                   :    ${projectDetail.title ? projectDetail.title : ''}`,
        //   style: ['notesText', 'textSize'],
        //   bold: 'true',
        // },
        // '\n',
        // {
        //     text: `Location                :      ${projectDetail.project_location ? projectDetail.project_location : ''}`,
        //     style: ['notesText', 'textSize'],
        //     bold: 'true'
        //   },
  
        //   '\n',
        //   {
        //     text: `Scope of Work     :       ${projectDetail.scope_of_work ? projectDetail.scope_of_work : ''}`,
        //     style: ['notesText', 'textSize'],
        //     bold: 'true',
        //   },
          

        // {
        //   text: `JCC No       :  ${projectDetail.job_order_code ? projectDetail.job_order_code : ''}`,

        //   style: ['invoiceAdd', 'textSize'],
        //   margin: [0, -90, 0, 0],
        // },
        // '\n',  
        // {
        //   text: `PO Number     :  ${projectDetail.po_number ? projectDetail.po_number : ''
        //     }`,

        //   style: ['invoiceAdd', 'textSize'],

        // },
        // '\n',
        // {
        //   text: `Quote Number   :  ${quote.quote_code ? quote.quote_code : ''
        //     }`,

        //   style: ['invoiceAdd', 'textSize'],

        // }, '\n',
        // {
        //     text: `Date               :   ${(projectDetail.job_completion_date) ? moment(projectDetail.job_completion_date).format('DD-MM-YYYY') : ''} `,
        //     style: ['invoiceAdd', 'textSize'],
  
        //   },
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
            widths: [30, 270, 65, 65],

            body: lineItemBody,
          },
        },
        '\n',
        '\n',
        '\n',
// Content below the table
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
        return 'black';
      }
      return 'black';
    },
    vLineColor: () => {
      return 'black';
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
    widths: ['4%','48%', '48%'],
    body: [
      [
        {
            image:
              'data:image/jpeg;base64,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9bw/oOuL8x9d80e70eR14vh/ReF9Hqc3zX1Py2n1mWndx0CgAAfKe94Hv9ufaOPQAAB8x9P8x0x7Hfwd+NBK8b2fB3nV9H4ntgY0AAAAAAAAAABj8n9X8p1x9N0cvVz0EoAAAAAHz3RzdPbn7I49AAAAHmen5ep5v03zH0+shz34nN7nzPbn9c5unjsFAAeJ7PyvTPb7fL3RrbGLr8D6PzNzk975L6qzMc9gADUny/1Pyv1vXN8z09fPXzvV527vz9f0JeHTD5T635Lpn6Tq4e7noJQAAPk/f+f9/tz7hx6AAAPl/qPlumPZ9DzvRzoYZr5bq29sel1nHQKAAAAAAAAAABq+W+t5N5dmGeaEoAAAAAHznR6OXTHQOewAAAHlerps+d+o5OvUDGnzP02jWfK9zl6lDNAA83xPpcOmOnI57AatpPkfb37OuegctgAOTr12fLfW8fZqBjXzm71sumNo57fJfW8e86fS1bc0JQAEo+R97Po6Y2jnsAAB8r9Vxbz4/T2TU4OT3eo8j2q56CUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9oADAMBAAIAAwAAACHzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/AM888888888888888888888888888888888888888888888888888888888884wh77w8888888888888888888888888888888888888888888888888888888884MtsitjI08888888888888888888888888888888888888888888888888888884YSM+yvbYY888888888888888888888888888888888888888888888888888884QLwCz7jCLQY8888888888888888888888888888888888888888888888888884E4C3+fff8As8zEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPJMO7zws+8wj/sLFPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPJIGYjs/jz3+4zNCJNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPIDOTU5+hs+5grk5ni5NPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPKHM6MdbSszz28znecDbyNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOGBK8LSks7TojPdwjOYeOCPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOGApTERMNTo/s6szOJAZHV0GPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOBHFjEcLSpUNTJneKYjncBDBmEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPBNN7sLaRMLWkmfV0jOYCPeZX3LEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPJIGTWODsLWgWNTpjcKGTuZWuVScZNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPIJCMjuLWUBcLWlldBaruZVYDGZX8SJNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPIHJlbBO7mZSpxMLW87uYHIrsLW61bRZiNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOGNeLmcDWOL2ZXtyeOaXkzMDf6FXcDe1fCPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOGBjDAPdzcLSddncDsz93cDvILOZTv4MDAkGPPPPPPPPPPPPPPPPPPPPPPPPPPPOBH9tzMDSdfzuJTscTMGdWOQTOJXu0JmdDswmGPPPPPPPPPPPPPPPPPPPPPPPPPPBOHnZSO7uZSlOLmdDEmGeRncDf+UTsLW+3UDkbEPPPPPPPPPPPPPPPPPPPPPPPPJID+393dHXN3cDkvZjcLTncDPIFjcDP5PNDsjtP5FPPPPPPPPPPPPPPPPPPPPPPJJHefK838nMDddzuLatcTJWvS7mZWvILdHtiphmZgJNPPPPPPPPPPPPPPPPPPPPIDLzsrsLDPzsjMDtcL2ZXkj0jMDP/AEc3RrZ6bXmV/I8aDTzzzzzzzzzzzzzzzzzyhi19PMvY7A2DEfI7A7LjYzBnV7S1dnVuZ+gVmV7I/pezQjTzzzzzzzzzzzzzzzzhgI5K5nWtrczAzLwLo7gzO7HrS7dmVuJF3d3R7IKxgXufphjzzzzzzzzzzzzzzzwRy1jZvc3R0Rzc3Q7N43q7g3PqdmVuNT/N3A7cjF2B7o/t09xTzzzzzzzzzzzzzyghhTGz0/K5C1t/jZnV7e436ZnC1+H77MzAzS1ubmX+J6v7vgyjzzzzzzzzzzzzzyjhBE01dGVPcnQrf66BmVrb4/zSz77MzAnS/wCzcwe7AnedxxIYg88888888888888oAgk1pxxZFN0uwtz++/JYla2+++7O4gce+6m5leinTJxhpNwoA88888888888888o4cwBtJpNB9L83Z1a2+++PVtbzm9k/wDvvuzOD5+3aRSaTfUfHKPPPPPPPPPPPPPPKJIEKHZZdSXTXaZRt7M/vvvrvsr/AL7776d2S6f0l0l2WXUngASDzzzzzzzzzzzzzzwiQQgDAGXFm0E021Lm9L7777777777sy/tW000XlkWFCAAxTBzzzzzzzzzzzzzzzzwzByTTjCFEmXEkU10kUPT7777777C8N000l2WVkHDDyTRiRzzzzzzzzzzzzzzzzzzzwxgThjzDQGVkmUE020Kvnb7y2sW00kXlk2FHDThixAxzzzzzzzzzzzzzzzzzzzzzzzywyByTSBShG2VEkU31GW7tU00FmWVkHyDSTQiQzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwxgShigDynVk3UlFnFkEWFl2HThDhizAxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywzBwTQAzwGXHGU3HmXlHwBSRRiQzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwxiShigRz3llnH32gDgizAxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwzBQSQSSQzCxSRRiQzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzww4444444444444444447qN+M+8/MvP444444444444444444445/zzzzzzzzzzzz7PTTzzznfzvDzzz/8A73888Mc438Mc888+1855888886888853888888888888888KNcg888+28ne8885O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O/XkXvuaaK79xFB9B+UG38x6FPFPPPAAAPPPPPPPEBJNQRdoZI/WuW2bbrq6K+PfjsxfuaaKatXuaXKvZII32TQWDCAPPPLAAPPPPPPKAPJNAbYaaWXGbVpRtfXzYqK+PfeYbsSTPfdF/F2OG6+aRXaUPKAPPPPPDPPPPPPLBCOMIXWUQXUftf6/C2PffXvZarR8HL/feYbIbKZuVSUUXXYeLAAPPPPPPPPPPPPPFMECLKcQZYWQYcSU2bFdffffO/rnfffeFmWw/wCmVEmXlGG2hDDRTzzzzzzzzzzzzwCQDDiyylGlVkEFEXdC2PD333333332W/1fVEEVF0F2GyzjhBSBTzzzzzzzzzzzzywiCgjxDjx1G1WmUUGFk3dzX33333kklsmEU2XkHl1zzhygiiAzzzzzzzzzzzzzzzzywzBSRSzTSi3UG1GknEXc/LX33R+VEEll2lWW3zyTwTRCQzzzzzzzzzzzzzzzzzzzzzwxiDgjxiRhRkn0nUVlVXKO9WEUWH0Hl1CzByhijAxzzzzzzzzzzzzzzzzzzzzzzzzzywzBSQSyAzBWVWmXW11UXHkWkWUjRiTwRRCQzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwxiCghxgQCC1GkH3Wkmlk3AxBwgijAxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywzBQQSyghCVkGmklGQiSwRRCQzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywiCgByxAAQRRhBwgijAxzzzzzzzzzzzzzzzzzzzzzzzzzzzzyw444444444444444444LZttsuN9dtfIY4444444444444444445zzzzzzzzzzzzz3nbTzzzbbz3/zzznn33ywiBDTXgCAzzzfTz/8A88888+8888+1408888888888888D26A888pY8E/888r/ALv/ADzzzz1LfzzzzzxrywjzzzyxHzzzy+7uXfzzzzzzzzzzzynb9Tzzzx83Xzzzyp707zzzzzbpbzzzzxLTypHTzzzxXzzzz3/x13zzzzzzzzzzzwn89/zzzy9l7zzzywhzfzzzz1n/AJX8888d+lHi18888Z88885/869888888888888Dc8888888r88888qd8j1888yENZ9888vPtTUtV8884D8888/0+O/888888888888D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" ',
              style: 'logo',
              width: 20,
              alignment: 'right',
              margin: [0, 0, 0, 0],
              border: [true, true, false, true],
            },
        {
          text: `${findCompany("cp.companyName")}
              \n Name                     :     ${projectDetail.name ? projectDetail.name : ''}
              \n Designation           :    ${projectDetail.designation ? projectDetail.designation : ''}
              \n Signature               :      ${projectDetail.signature ? projectDetail.signature : ''}
              \n Date                        :      ${projectDetail.witness_by_date ? moment(projectDetail.witness_by_date).format('YYYY-MM-DD') : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'false',
          border: [false, true, false, true],
        },
        {
          text: `Witness By 
              \n Name                     :     ${projectDetail.witness_by_name ? projectDetail.witness_by_name : ''}
              \n Designation           :    ${projectDetail.witness_by_designation ? projectDetail.witness_by_designation : ''}
              \n Signature               :      ${projectDetail.witness_by_signature ? projectDetail.witness_by_signature : ''}
              \n Date                        :      ${projectDetail.witness_by_date ? moment(projectDetail.witness_by_date).format('YYYY-MM-DD') : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'false',
          border: [true, true, true, true],
        }
      ]
    ]
  }

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
