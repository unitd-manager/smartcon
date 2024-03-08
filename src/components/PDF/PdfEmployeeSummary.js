import React from 'react';
import { Button } from 'reactstrap';
import pdfMake from 'pdfmake';
import * as Icon from 'react-feather';
import PropTypes from 'prop-types';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import api from '../../constants/api';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfEmployeeSummary = ({getSingleEmployeeData,firstMatchData,salary,dateOfmonth,currentMonth, currentYear, }) => {
    PdfEmployeeSummary.propTypes = {
        getSingleEmployeeData:PropTypes.any,
        currentMonth: PropTypes.any,
        currentYear: PropTypes.any,
        firstMatchData: PropTypes.any,
        salary: PropTypes.any,
        dateOfmonth:PropTypes.any,
      }

  // const [totalEmpTimesheetRecord, setTotalEmpTimesheetRecord] = React.useState();
  const [hfdata, setHeaderFooterData] = React.useState();
  // const [salary, setSalary] = React.useState();

      // API for Calculate total
      // const SalaryCalculation = () => {
      //   api
      //     .post('/timesheet/getTotalSalary',{
      //       month :months,
      //       year : years
      //     })
      //     .then((res) => {        
      //       const filteredData = res.data.data.filter(
      //         (entry) =>
      //           entry.employee_id === getSingleEmployeeData.employee_id &&
      //           entry.project_id === getSingleEmployeeData.project_id &&
      //           entry.month === months &&
      //           entry.year === years
      //       );        
      //       if (filteredData.length > 0) {
      //         setSalary(filteredData[0]);
      //       } else {
      //         setSalary('')
      //       }
      //     })
      //     .catch(() => {
      //       setSalary(''); 
      //     });
      // };

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
    // api.get('/timesheet/getAllEmpTimesheet').then((res) => {
    //   setTotalEmpTimesheetRecord(res.data.data);
    // });
  // SalaryCalculation()
  }, []);


 const findCompany = (key) => {
    const filteredResult = hfdata?.find((e) => e.key_text === key);
    return filteredResult.value;
  };


  const GetPdf = () => {
    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [ 40, 150, 40,80 ],
      footer: PdfFooter,
      content: [
	 
        '\n',
           
           {
       canvas: [
           { type: 'line', x1: 0, y1: -35, x2: 510, y2: -35, lineWidth: 1 }, //Bottom line
       ],
   },
   
           {
             layout: {
               defaultBorder: false,
               hLineWidth: () => {
                 return 1;
               },
   
               hLineColor: (i) => {
                 if (i === 1 || i === 0) {
                   return '#bfdde8';
                 }
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
               widths: ['104%', '41%'],
   
               body: [
                 [
                     {
                       text: ` Project Name: ${getSingleEmployeeData.title?getSingleEmployeeData.title:''}`,
                       style: ['textSize'],
                     },
                 ],
                 [
                   {
                     text: `Direct Workers Timesheet :  ${dateOfmonth[0].date}-${currentMonth}-${currentYear} to ${dateOfmonth.length}-${currentMonth}-${currentYear}`,
                      // ${getSingleEmployeeData.month?getSingleEmployeeData.month:''} - ${getSingleEmployeeData.year?getSingleEmployeeData.year:''}
                     style: ['textSize'],
                   },
                 ],
                 [
                   {
                     text: `Employee Name :  ${getSingleEmployeeData?.first_name}`,
                     style: ['textSize'],
                   },
                 ],
               ],
             },
           },
   
           '\n\n',
         
           {
               style: 'tableExample',
               color: '#444',
               table: {
                   body: [
                       [
                       {text: 'S.NO',style: 'tableHeader',rowSpan: 2, alignment: 'center'}, 
                       {text:'EMPLOYEE NAME',style: 'tableHeader',rowSpan: 2}, 
                       {text: 'DESIGNATION', style: 'tableHeader', alignment: 'center',rowSpan: 2},
                       {text: 'NORMAL WORKING HOURS',colSpan: 3 ,style: 'tableHeader', alignment: 'center'},
                       {},
                       {},
                       {text: 'OVERTIME HOURS ', colSpan: 3, style: 'tableHeader', alignment: 'center'},
                       {},
                       {},
                       {text: 'SUN/PH HOURS ',colSpan: 3, style: 'tableHeader', alignment: 'center'},
                       {},
                       {},
                       {text: 'SUB TOTAL (S$)', style: 'tableHeader', alignment: 'center',rowSpan: 2},
   
                       ],
   [
       {text: 'Header with Colspan = 2', style: 'tableHeader', alignment: 'center'}, 
       {}, 
       {},
       
       {text: 'HOURS', style: 'tableHeader', alignment: 'center'},
       {text: 'UNIT PRICE (S$)', style: 'tableHeader', alignment: 'center'},
       {text: 'AMOUNT (S$)', style: 'tableHeader', alignment: 'center'},
       
       {text: 'HOURS', style: 'tableHeader', alignment: 'center'},
       {text: 'UNIT PRICE (S$)', style: 'tableHeader', alignment: 'center'},
       {text: 'AMOUNT (S$)', style: 'tableHeader', alignment: 'center'},
       
       {text: 'HOURS', style: 'tableHeader', alignment: 'center'},
       {text: 'UNIT PRICE (S$)', style: 'tableHeader', alignment: 'center'},
       {text: 'AMOUNT (S$)', style: 'tableHeader', alignment: 'center'},
       {text: 'AMOUNT (S$)', style: 'tableHeader', alignment: 'center'},
   ],
   [
       {text: '1', style: 'tableHeader', alignment: 'center'}, 
       {text: `${getSingleEmployeeData?.first_name}`, style: 'tableHeader', alignment: 'center'},
       {},
       
       {text: `${salary?.total_normal_hours}`, style: 'tableHeader', alignment: 'center'},
       {text: `${firstMatchData?.normal_hourly_rate}`, style: 'tableHeader', alignment: 'center'},
       {text: `${salary?.total_normal_cost}`, style: 'tableHeader', alignment: 'center'},
       
       {text: `${salary?.total_ot_hours}`, style: 'tableHeader', alignment: 'center'},
       {text: `${firstMatchData?.ot_hourly_rate}`, style: 'tableHeader', alignment: 'center'},
       {text: `${salary?.total_ot_cost}`, style: 'tableHeader', alignment: 'center'},
       
       {text: `${salary?.total_ph_hours}`, style: 'tableHeader', alignment: 'center'},
       {text: `${firstMatchData?.ph_hourly_rate}`, style: 'tableHeader', alignment: 'center'},
       {text: `${salary?.total_ph_cost}`, style: 'tableHeader', alignment: 'center'},
       {text: `${salary?.total_cost}`, style: 'tableHeader', alignment: 'center'},
   ],
   [
       {text: 'Total Hours', style: 'tableHeader', alignment: 'right',colSpan: 3}, 
       {text: 'Renuka', style: 'tableHeader', alignment: 'center'},
       {},
       
       {text: `${salary?.total_normal_hours}`, style: 'tableHeader', alignment: 'center'},
       {text: '', style: 'tableHeader', alignment: 'center',colSpan: 2},
       {},
       
       {text: `${salary?.total_ot_hours}`, style: 'tableHeader', alignment: 'center'},
       {text: '', style: 'tableHeader', alignment: 'center',colSpan: 2},
       {text: '', style: 'tableHeader', alignment: 'center'},
       
       {text: `${salary?.total_ph_hours}`, style: 'tableHeader', alignment: 'center'},
       {text: 'Amount', style: 'tableHeader', alignment: 'right',colSpan: 2},
       {},
       {text:`${salary?.total_cost}`, style: 'tableHeader', alignment: 'center'},
   ],
   [
       {text: 'GST 7%', style: 'tableHeader', alignment: 'right',colSpan: 12}, 
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {text: '', style: 'tableHeader', alignment: 'center'},
   ],
   [
       {text: 'Total Amount', style: 'tableHeader', alignment: 'right',colSpan: 12}, 
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {},
       {text: `${salary?.total_cost}`, style: 'tableHeader', alignment: 'center'},
   ],
   
   ]
               }
           },
       
       '\n\n',
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
             fontSize: 7,
             bold: 'true',
              writingMode:'vertical-rl',
           },
           tableHead1: {
             border: [false, true, false, true],
             fillColor: '#eaf2f5',
             margin: [0, 5, 0, 5],
             fontSize: 7,
             bold: 'true',
              writingMode:'vertical-rl',
            
           },
           tableBody: {
             border: [false, false, false, true],
             margin: [0, 5, 0, 5],
             alignment: 'left',
             fontSize: 7,
             bold: 'true',
             writingMode:'vertical-rl',
             width:5,
           },
           tableBody1: {
             border: [false, false, false, true],
             margin: [0, 5, 0, 5],
             alignment: 'left',
             fontSize: 6,
             writingMode: 'vertical-rl',
           },
           tableHeader:{
               fontSize: 7,
               bold: true,
               color:'#000'
           }
         },
         defaultStyle: {
           columnGap: 20,
         } 
     
 };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
     <span onClick={GetPdf}>
      <Button
            style={{ background: '#008000', border: 'none',marginRight:10 }}
            className="shadow-none"
          >
            <Icon.File /> Summary
          </Button>
        </span>
    </>
    
  );
};

export default PdfEmployeeSummary;
