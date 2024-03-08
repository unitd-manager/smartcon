import React from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as numberToWords from 'number-to-words';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfCreditNote = ({creditId}) => {
  PdfCreditNote.propTypes = {
    creditId: PropTypes.any
  }
     const [note, setNote] = React.useState();
    const [notes, setNotes] = React.useState();
    const [hfdata, setHeaderFooterData] = React.useState();
    const [gTotal, setGtotal] = React.useState(0);

  const getCreditNote = () => {
    api
      .post('/finance/getCreditNoteById', { credit_note_id :creditId  })
      .then((res) => {
        setNotes(res.data.data[0]);
      })
      .catch(() => {
        message('Finance Data Not Found', 'info');
      });
  };
  const getCreditNoteId = () => {
    api
      .post('/finance/getCreditNoteById', { credit_note_id :creditId  })
      .then((res) => {
        setNote(res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
        });

        setGtotal(grandTotal);
      })
      .catch(() => {
        message('Finance Data Not Found', 'info');
      });
  };
  console.log('gTotal',gTotal)
 React.useEffect(() => {
    getCreditNoteId();
    getCreditNote();
  }, []);

  const grantTotal = (gTotal && notes && notes.gst_percentage) ? (gTotal * notes.gst_percentage) / 100 : 0;
  console.log('grantTotal', grantTotal);
  const totalAmount = parseFloat(grantTotal) + parseFloat(gTotal);
  console.log('totalAmount', totalAmount);
    React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

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
          text: 'Amount',
          style: 'tableHead',
        },
        
      ],
    ];
    note.forEach((element, index) => {
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.description? element.description : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.amount ? element.amount : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        
      ]);
    });
    const dd = {
      pageSize: 'A4',     
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 120, 40, 10],
      //pageMargins: [40, 40, 30, 0],
      footer: PdfFooter,
      content: [
        {columns: [
          {
            stack: [
              {
                text: `To `,
                style: ['textSize'],
                margin: [30, 0, 0, 0],
              },
              {
                text: ` \n${notes.cust_company_name ? notes.cust_company_name : ''}`,
                color: 'blue',
                style: ['textSize'],
                margin: [30, 3, 0, 0],
              },
              {
                text: ` ${notes.cust_address1 ? notes.cust_address1 : ''
                  }\n ${notes.cust_address2 ? notes.cust_address2 : ''}\n${notes.cust_address_country ? notes.cust_address_country : ''
                  } ${notes.cust_address_po_code ? notes.cust_address_po_code : ''
                  }`,
                style: ['textSize'],
                margin: [30, 3, 0, 0],
              },
              '\n',
            ],
          },
          {
              stack: [
                {
                  text: ` CN No                 : ${notes.credit_note_code ? notes.credit_note_code : ''
                    } `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                { 
                  text: `Date                    : ${moment(
                    notes.from_date ? notes.from_date : '',
                  ).format('DD-MM-YYYY')}  `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: ` Your Po               : ${notes.po_number ? notes.po_number : ''} `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: `Our Invoice No   : ${notes.invoice_code ? notes.invoice_code : ''} `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                { 
                  text: `Invoice Date       : ${moment(
                    notes.invoice_date ? notes.invoice_date : '',
                  ).format('DD-MM-YYYY')}  `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                '\n',
              ],
            },
              ],},
              '\n',
              
           {columns: [
            {
              text: `ATTN : ${notes.cust_first_name ? notes.cust_first_name : ''
                }  `,
              style: 'textSize',
              margin: [30, 0, 0, 0],
              bold: true,
            },
            
              ],},
              '\n\n\n',
  
      
        {
              layout: {
                defaultBorder: false,
                hLineWidth: ()=> {
                  return 1;
                },
                vLineWidth: ()=> {
                  return 1;
                },
                hLineColor: (i)=> {
                  if (i === 1 || i === 0) {
                    return '#bfdde8';
                  }
                  return '#eaeaea';
                },
                vLineColor: ()=> {
                  return '#eaeaea';
                },
                hLineStyle: ()=> {
                  // if (i === 0 || i === node.table.body.length) {
                  return null;
                  //}
                },
                // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
                paddingLeft: ()=> {
                  return 10;
                },
                paddingRight: ()=> {
                  return 10;
                },
                paddingTop: ()=> {
                  return 2;
                },
                paddingBottom: ()=> {
                  return 2;
                },
                fillColor: ()=> {
                  return '#fff';
                },
              },
              table: {
                headerRows: 1,
                widths: ['10%','65%', '25%' ],
                
    
                  body: productItems,
               
                  
                },
            },
        '\n',
        '\n\n',
        {
          stack: [
            {
              text: `TOTAL $ : ${gTotal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 5, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `GST ${notes.gst_percentage ? notes.gst_percentage : ''}% : ${grantTotal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 5, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `GRAND TOTAL $ : ${totalAmount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 5, 0],
              style: 'textSize',
            },
            '\n\n\n',
            {
              text: `TOTAL :  ${numberToWords.toWords(totalAmount).toUpperCase()}`, // Convert total to words in uppercase
              bold: 'true',
              fontSize: '11',
              margin: [40, 0, 0, 0],
            },
            // '\n',
            // {
            //   text: `GRAND TOTAL ($) : ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            //   alignment: 'right',
            //   margin: [0, 0, 5, 0],
            //   style: 'textSize',
            // },
            // '\n\n\n',
            // {
            //   text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
            //   bold: 'true',
            //   fontSize: '11',
            //   margin: [40, 0, 0, 0],
            // },

          ],
        },
         '\n\n',
         '\n\n',
         '\n\n',
         {
          width: '100%',
          alignment: 'center',
          text: 'This is system generated document and does not need any signature',
          bold: true,
          margin: [0, 0, 0, 0],
          fontSize: 8,
        },
      
      '\n\n',
      '\n\n',
      '\n\n',
      {
                width: '100%',
                alignment: 'center',
                text: 'Thank you for your Business',
                bold: true,
                margin: [0, 0, 0, 0],
                fontSize: 12,
              },
              {
                width: '100%',
                alignment: 'center',
                text: 'Should you have any further enquiries, please do not hesitate and contact us @ Tel : +65-62599046',
                bold: true,
                margin: [0, 0, 0, 0],
                fontSize: 6,
              },
        
],
      margin:[0,50,50,50],
      styles: {
        logo:{
            margin:[-20,20,0,0],
        },
        address:{
          margin:[-10,20,0,0],
        },
        invoice:{
           margin:[0,30,0,10],
           alignment:'right',
        },
        invoiceAdd:{
           alignment:'right',
        },
        textSize: {
           fontSize: 10
        },
        notesTitle: {
       bold: true,
       margin: [0, 50, 0, 3],
     },
       tableHead:{
           border: [false, true, false, true],
           fillColor: '#eaf2f5',
           margin: [0, 5, 0, 5],
           fontSize: 10,
           bold:'true',
     },
       tableBody:{
         border: [false, false, false, true],
           margin: [0, 5, 0, 5],
           alignment: 'left',
           fontSize:10
       }
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
       <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print CreditNote
      </Button>
    </>
  );
};


export default PdfCreditNote;
