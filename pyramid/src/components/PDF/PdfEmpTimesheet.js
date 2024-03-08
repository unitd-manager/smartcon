import React from 'react';
import { Button } from 'reactstrap';
import pdfMake from 'pdfmake';
import * as Icon from 'react-feather';
import PropTypes from 'prop-types';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import api from '../../constants/api';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfEmpTimesheet = ({ getSingleEmployeeData, dateOfmonth, currentMonth, currentYear,salary,firstMatchData,totalEmpTimesheetRecord }) => {
  PdfEmpTimesheet.propTypes = {
    getSingleEmployeeData: PropTypes.any,
    dateOfmonth: PropTypes.any,
    currentMonth: PropTypes.any,
    currentYear: PropTypes.any,
    salary: PropTypes.any,
    firstMatchData: PropTypes.any,
    totalEmpTimesheetRecord: PropTypes.any,
  };

  console.log("salary",salary)
  // const [totalEmpTimesheetRecord, setTotalEmpTimesheetRecord] = React.useState();
  const [hfdata, setHeaderFooterData] = React.useState();

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
    // api.get('/timesheet/getAllEmpTimesheet').then((res) => {
    //   setTotalEmpTimesheetRecord(res.data.data);
    // });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata?.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  const GetPdf = () => {
    const dates = [];
    const days = [];

    for (let i = 0; i < dateOfmonth.length; i++) {
      dates.push(dateOfmonth[i].date);
      days.push(dateOfmonth[i].day);
    }

    const TimesheetHoureData = [
      [
        {
          text: 'Date',
          style: 'tableHead',
          border: [true, true, true, true],
        },
        {
          text: 'NH',
          style: 'tableHead',
          border: [true, true, true, true],
        },
        {
          text: 'OT',
          style: 'tableHead',
          border: [true, true, true, true],
        },
        {
          text: 'PH',
          style: 'tableHead',
          border: [true, true, true, true],
        },
        {
          text: 'Day',
          style: 'tableHead',
          border: [true, true, true, true],
        },
      ],
    ];

    for (let k = 1; k <= dateOfmonth.length; k++) {
      const currentDate = dateOfmonth[k - 1];
      const { date, day } = currentDate;
      const matchingRecord = totalEmpTimesheetRecord.find(
        (element) =>
          parseInt(element.day, 10) === k &&
          element.month === currentMonth &&
          element.year === currentYear &&
          element.employee_id === getSingleEmployeeData?.employee_id &&
          element.project_id === getSingleEmployeeData?.project_id,
      );

      if (matchingRecord) {
        TimesheetHoureData.push([
          { text: `${date || ''}`, style: 'tableBody', border: [true, true, true, true] },
          {
            text: `${matchingRecord.normal_hours ? matchingRecord.normal_hours : '-'}`,
            style: 'tableBody',
            border: [true, true, true, true],
          },
          {
            text: `${matchingRecord.ot_hours ? matchingRecord.ot_hours : '-'}`,
            style: 'tableBody',
            border: [true, true, true, true],
          }, 
          {
            text: `${matchingRecord.ph_hours ? matchingRecord.ph_hours : '-'}`,
            style: 'tableBody',
            border: [true, true, true, true],
          },
          {
            text: day ? day.split('').join('\n') : '',
            style: 'tableBody',
            border: [true, true, true, true],
          },
        ]);
      } else {
        TimesheetHoureData.push([
          { text: `${date || ''}`, style: 'tableBody', border: [true, true, true, true] },
          { text: '-', style: 'tableBody', border: [true, true, true, true] },
          { text: '-', style: 'tableBody', border: [true, true, true, true] },
          { text: '-', style: 'tableBody', border: [true, true, true, true] },
          { text: day ? day.split('').join('\n') : '', style: 'tableBody', border: [true, true, true, true], },
        ]);
      }
    }

    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 150, 40, 80],
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
              //}
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
                  text: ` Project Name:  ${
                    getSingleEmployeeData.title ? getSingleEmployeeData.title : ''
                  }`,
                  style: ['textSize'],
                },
              ],
              [
                {
                  text: `Direct Workers Timesheet : ${dateOfmonth[0].date}-${currentMonth}-${currentYear} to ${dateOfmonth.length}-${currentMonth}-${currentYear}`,
                  style: ['textSize'],
                },
              ],
              [
                {
                  text: `Employee Name : ${getSingleEmployeeData?.first_name}`,
                  style: ['textSize'],
                },
              ],
            ],
          },
        },

        '\n\n',
        {
          style: 'tableExample',
          table: {
            heights: [100, '*', 200, '*'],
            body: [TimesheetHoureData],
          },
        },

        '\n\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [100, '*', 200, '*'],

            body: [
              [
                { text: '', style: 'textSize' },
                { text: '', style: 'textSize' },
                { text: '', style: 'textSize' },
                { text: 'Total', style: 'textSize' },
              ],

              [
                {},
                {},
                { text: 'NH Total', style: 'textSize', alignment: 'center' },
                { text: `${salary.total_normal_hours ? salary.total_normal_hours : '' } * ${firstMatchData?.normal_hourly_rate
                  ? firstMatchData?.normal_hourly_rate: ''} = ${salary.total_normal_cost? salary.total_normal_cost : '' } `, style: 'textSize', alignment: 'center' },
              ],
              [
                {},
                {},
                { text: 'OT Total', style: 'textSize', alignment: 'center' },
                { text: `${salary.total_ot_hours ? salary.total_ot_hours : '' } * ${firstMatchData?.ot_hourly_rate
                  ? firstMatchData?.ot_hourly_rate: ''} = ${salary.total_ot_cost? salary.total_ot_cost : '' }`, style: 'textSize', alignment: 'center' },
              ],
              [
                {},
                {},
                { text: 'PH Total', style: 'textSize', alignment: 'center' },
                { text: `${salary.total_ph_hours ? salary.total_ph_hours : '' } * ${firstMatchData?.ph_hourly_rate
                  ? firstMatchData?.ph_hourly_rate: ''} = ${salary.total_ph_cost? salary.total_ph_cost : '' }`, style: 'textSize', alignment: 'center' },
              ],
              [
                {},
                {},
                { text: 'Salary', style: 'textSize', alignment: 'center' },
                { text: `${salary.total_cost? salary.total_cost : '' }`, style: 'textSize', alignment: 'center' },
              ],
            ],
          },

          layout: 'lightHorizontalLines',
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
          border: [true, true, true, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 7,
          bold: 'true',
          // writingMode: 'vertical-rl',
        },
        tableHead1: {
          border: [true, true, true, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 7,
          bold: 'true',
        },
        tableBody: {
          border: [true, true, true, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 7,
          bold: 'true',
          width: 5,
        },
        tableBody1: {
          border: [true, true, true, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 6,
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
        <Button style={{ background: '#D11606', border: 'none' }} className="shadow-none">
          <Icon.File /> Report
        </Button>
      </span>
    </>
  );
};

export default PdfEmpTimesheet;
