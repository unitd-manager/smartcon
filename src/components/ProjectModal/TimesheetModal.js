/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import * as $ from 'jquery';
import PropTypes from 'prop-types';
import message from '../Message';
import api from '../../constants/api';
import moment from 'moment';
import creationdatetime from '../../constants/creationdatetime';
import PdfEmployeeSummary from '../PDF/PdfEmployeeSummary';
import PdfEmpTimesheet from '../PDF/PdfEmpTimesheet';

//npm audit fix
const TimesheetModal = ({
  timesheet,
  setTimesheet,
  getSingleEmployeeData,
  currentMonth, currentYear,
}) => {
  TimesheetModal.propTypes = {
    timesheet: PropTypes.bool,
    setTimesheet: PropTypes.func,
    getSingleEmployeeData: PropTypes.any,
    currentMonth : PropTypes.any,
    currentYear: PropTypes.any,
  };

  const { id } = useParams();
  const [dateOfmonth, setDateOfMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const [getGroupDatas, setGroupDatas] = useState();
  const [salary, setSalary] = useState();
  const [totalEmpTimesheetRecord, setTotalEmpTimesheetRecord] = useState();
  const [firstMatchData, setFirstMatchData] = useState({
    normal_hourly_rate: parseFloat($('#totalNormalRate').val()) || '',
    ot_hourly_rate: parseFloat($('#totalOtRate').val()) || '',
    ph_hourly_rate: parseFloat($('#totalPhRate').val()) || '',
  });

  console.log("total Emp Timesheet Record",totalEmpTimesheetRecord)

  const [totalNormal, setTotalNormal] = useState({
    project_id: id,
    employee_id: '',
    creation_date: creationdatetime,
    normal_hours: parseFloat($('#totalNormalHr').val()) || '',
    ot_hours: parseFloat($('#totalOTHr').val()) || '',
    ph_hours: parseFloat($('#totalPHHr').val()) || '',
    normal_hourly_rate: parseFloat($('#totalNormalRate').val()) || '',
    ot_hourly_rate: parseFloat($('#totalOtRate').val()) || '',
    ph_hourly_rate: parseFloat($('#totalPhRate').val()) || '',
    month: currentMonth,
    year: currentYear,
    day: selectedDay,
  });

  //handle inputs
  const handleInputs = (e) => {
    // setTotalNormal({ ...totalNormal, [e.target.name]: e.target.value });

    const { name, value } = e.target;
    setTotalNormal((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

    // Define the onBlur event handler
    const handleInputBlur = (e, name, date) => {
      const value = e.target.value;
      insertTimeSheetData(value, name, date);
    };

  const years = typeof currentYear != 'number' ? parseInt(currentYear) : currentYear;
  const months = typeof currentMonth != 'number' ? parseInt(currentMonth) : currentMonth;

  const insertTimeSheetData = (valObj, name, date) => {
    const existingRecord = totalEmpTimesheetRecord?.find(
      (record) =>
        record.day === date &&
        record.month === months &&
        record.year === years &&
        record.employee_id === getSingleEmployeeData?.employee_id &&
        record.project_id === getSingleEmployeeData?.project_id,
    );

    if (existingRecord && getSingleEmployeeData?.employee_id && id) {
      const updatedRecord = {
        ...existingRecord,
        modification_date: creationdatetime,
        ot_hours: parseFloat(name === 'ot_hours' ? valObj : existingRecord.ot_hours),
        normal_hours: parseFloat(name === 'normal_hours' ? valObj : existingRecord.normal_hours),
        ph_hours: parseFloat(name === 'ph_hours' ? valObj : existingRecord.ph_hours),
        employee_id: getSingleEmployeeData?.employee_id,
        project_id: id,
      };
      api
        .post('/timesheet/updateTimesheetMonth', updatedRecord)
        .then(() => {
          message('Record Update successfully', 'success');
          setTotalNormal('')
          showEmpDataInTimsheet()
          SalaryCalculation()
        })
        .catch(() => {
          message('Unable to insert record.', 'error');
        });
    } else {
      
      if (valObj !== '') {
        totalNormal.project_id = id;
        totalNormal.creation_date = creationdatetime;
        totalNormal.employee_id = getSingleEmployeeData?.employee_id;
        totalNormal.ot_hours = parseFloat(name === 'ot_hours' ? valObj : '0');
        totalNormal.normal_hours = parseFloat(name === 'normal_hours' ? valObj : '0');
        totalNormal.ph_hours = parseFloat(name === 'ph_hours' ? valObj : '0');
        totalNormal.normal_hourly_rate = getSingleEmployeeData?.month === months ? getSingleEmployeeData.normal_hourly_rate : '0';
        totalNormal.ot_hourly_rate = getSingleEmployeeData?.month === months ? getSingleEmployeeData.ot_hourly_rate : '0';
        totalNormal.ph_hourly_rate = getSingleEmployeeData?.month === months ? getSingleEmployeeData.ph_hourly_rate : '0';
        totalNormal.month = months;
        totalNormal.year = years;
        totalNormal.day = selectedDay;

        api
          .post('/timesheet/insertTimesheetMonth', totalNormal)
          .then(() => {
            message('Record inserted successfully', 'success');
            setTotalNormal('')
            SalaryCalculation()
            showEmpDataInTimsheet()
          })
          .catch(() => {
            message('Unable to insert record.', 'error');
          });
      } else {
        message('Please Enter Hours', 'error');
      }
    }
  };

  const showEmpDataInTimsheet = () => {
    api.get('/timesheet/getAllEmpTimesheet').then((res) => {
      setTotalEmpTimesheetRecord(res.data.data);
    });
  };

  const weekDates = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const getDaysOfMonths = (year, month) => {
    var monthIndex = month - 1;

    var date = new Date(year, monthIndex, 1);
    var result = [];
    while (date.getMonth() == monthIndex) {
      result.push({ date: date.getDate(), day: weekDates[date.getDay()] });
      date.setDate(date.getDate() + 1);
    }
    setDateOfMonth(result);
  };

  // Start Logic for per hour data insert and update
const totalHrValue =
  totalEmpTimesheetRecord?.filter(
    (record) =>
      record.employee_id === getSingleEmployeeData?.employee_id &&
      record.project_id === getSingleEmployeeData?.project_id &&
      record?.month === months &&
      record?.year === years
  )

  useEffect(() => {
    const singlePerHourData =
  totalEmpTimesheetRecord?.find(
    (record) =>
      record.employee_id === getSingleEmployeeData?.employee_id &&
      record.project_id === getSingleEmployeeData?.project_id &&
      record?.month === months &&
      record?.year === years
  );
    setFirstMatchData(singlePerHourData);
  }, [totalEmpTimesheetRecord]);

  const timesheethandleInputs = (e) => {
    setFirstMatchData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const updateTimesheetData = () => {

    const existingRecord = totalEmpTimesheetRecord?.find(
      (record) =>
        record.employee_id === getSingleEmployeeData?.employee_id &&
        record.project_id === getSingleEmployeeData?.project_id &&
        record.month === months &&
        record.year=== years
    );
   
    if (existingRecord && getSingleEmployeeData?.employee_id && id) {
      const updatedRecord = {
        ...existingRecord,
        modification_date: creationdatetime,
        ot_hourly_rate: parseFloat(firstMatchData?.ot_hourly_rate),
        normal_hourly_rate: parseFloat(firstMatchData?.normal_hourly_rate),
        ph_hourly_rate: parseFloat(firstMatchData?.ph_hourly_rate),
        employee_id: getSingleEmployeeData?.employee_id,
        project_id: id,
        month: months,
        year: years
      };

      api
        .post('/timesheet/updateTimesheet', updatedRecord)
        .then(() => {
          message('Record updated successfully', 'success');
          setTimeout(() => {
            SalaryCalculation();
            window.location.reload();
          }, 300);
        })
        .catch(() => {
          message('Unable to update record.', 'error');
        });
    } else {
      getSingleEmployeeData.project_id = id;
      getSingleEmployeeData.creation_date = creationdatetime;
      getSingleEmployeeData.employee_id = getSingleEmployeeData?.employee_id;
      getSingleEmployeeData.ot_hourly_rate = parseFloat(firstMatchData?.ot_hourly_rate);
      getSingleEmployeeData.normal_hourly_rate = parseFloat( firstMatchData?.normal_hourly_rate);
      getSingleEmployeeData.ph_hourly_rate = parseFloat(firstMatchData?.ph_hourly_rate);
      getSingleEmployeeData.month = currentMonth;
      getSingleEmployeeData.year = currentYear;
      getSingleEmployeeData.day = moment().date();

      api
        .post('/timesheet/insertTimesheetRate', getSingleEmployeeData)
        .then(() => {
          message('Record inserted successfully', 'success');
          setTimeout(() => {
            SalaryCalculation();
            window.location.reload();
          }, 300);
        })
        .catch(() => {
          message('Unable to insert record.', 'error');
        });
    }
  };

  // End Logic for per hour data insert and update

  // API for Calculate total
  const SalaryCalculation = () => {
    api
      .post('/timesheet/getTotalSalary',{
        month :months,
        year : years
      })
      .then((res) => {        
        const filteredData = res.data.data.filter(
          (entry) =>
            entry.employee_id == getSingleEmployeeData.employee_id &&
            entry.project_id == getSingleEmployeeData.project_id &&
            entry.month == months &&
            entry.year == years
        );        
        if (filteredData.length > 0) {
          setSalary(filteredData[0]);
        } else {
          setSalary('')
        }
      })
      .catch(() => {
        //message('Unable to fetch data.', 'error');
        setSalary(''); 
      });
  };

  const GetGroupData = () => {
    api.post('/timesheet/getGroupData',{ employee_id:getSingleEmployeeData?.employee_id,project_id: id,month: currentMonth,
      year: currentYear}).then((res) => {
      setGroupDatas(res.data.data);
    });
  };

  // const normalhourlyRateData = () => {
  //   if (selectedmonth === totalPerHour.month) {
  //     return totalPerHour.normal_hourly_rate;
  //   }
  //   const totalValue =
  //     totalEmpTimesheetRecord?.find(
  //       (record) =>
  //         record.employee_id === getSingleEmployeeData?.employee_id &&
  //         record.project_id === getSingleEmployeeData?.project_id &&
  //         record?.month === months &&
  //         record?.year === years,
  //     )?.normal_hourly_rate || '';
  //   return totalValue;
  // };
  
  const normalhourlyRateData = () => {

    if (totalHrValue?.length > 0) {
      return totalHrValue[0]?.normal_hourly_rate
    } 
    else{
      return ''
    }
  };

  // to show ot hourly Rate Data
  const othourlyRateData = () => {

    if (totalHrValue?.length > 0) {
      return totalHrValue[0]?.ot_hourly_rate
    } 
    else {
      return ''
    }
  };

  // to show ph hourly Rate Data
  const phhourlyRateData = () => {

    if (totalHrValue?.length > 0) {
      return totalHrValue[0]?.ph_hourly_rate
    } 
    else {
      return ''
    }
  };

  const TotalNormalHRS = () => {   
    if (salary?.total_normal_hours) {
      return salary?.total_normal_hours;
    } else {
      return '';
    }
  };
  const TotalOTHRS = () => {
    if (
      salary?.total_ot_hours
    ) {
      return salary?.total_ot_hours;
    } else {
      return '';
    }
  };
  const TotalPHHRS = () => {
    if (
      salary?.total_ph_hours
    ) {
      return salary?.total_ph_hours;
    } else {
      return '';
    }
  };

  const totalNormalHrDay = (day) => {
    if (day.date === selectedDay) {
      return totalNormal.normal_hours;
    }
    const totalValue =
      totalEmpTimesheetRecord?.find(
        (record) =>
          record.employee_id === getSingleEmployeeData?.employee_id &&
          record.project_id === getSingleEmployeeData?.project_id &&
          record.day === day.date &&
          record?.month === months &&
          record?.year === years,
      )?.normal_hours || '';
    return totalValue;
  };

  const totalOTHr = (day) => {
    if (day.date === selectedDay) {
      return totalNormal.ot_hours;
    }
    const totalValue =
      totalEmpTimesheetRecord?.find(
        (record) =>
          record.employee_id === getSingleEmployeeData?.employee_id &&
          record.project_id === getSingleEmployeeData?.project_id &&
          record.day === day.date &&
          record?.month === months &&
          record?.year === years,
      )?.ot_hours || '';
    return totalValue;
  };

  const totalPHHr = (day) => {
    if (day.date === selectedDay) {
      return totalNormal.ph_hours;
    }
    const totalValue =
      totalEmpTimesheetRecord?.find(
        (record) =>
          record.employee_id === getSingleEmployeeData?.employee_id &&
          record.project_id === getSingleEmployeeData?.project_id &&
          record.day === day.date &&
          record?.month === months &&
          record?.year === years,
      )?.ph_hours || '';
    return totalValue;
  };

  useEffect(() => {
    getDaysOfMonths(currentYear, currentMonth);
   
      GetGroupData();
 
  
    showEmpDataInTimsheet();
    SalaryCalculation();
    return () => {
      getDaysOfMonths(currentYear, currentMonth);
    };
  }, [id, getSingleEmployeeData,currentYear,currentMonth]);

  useEffect(() => {
       SalaryCalculation();
  }, [id, getSingleEmployeeData,months,years]);

  return (
    <>
      <Modal size="xl" isOpen={timesheet}>
        <ModalHeader>
          Add Timesheet
          <Button
            color="secondary"
            onClick={() => {
              setTimesheet(false);
              window.location.reload();
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="12" className="mb-4">
              <Row>
                <Col md="4">
                  <b>Employee Name:</b> {getSingleEmployeeData && getSingleEmployeeData.employee_name}<br/>
                  <b> Month:</b> {currentMonth} <br/>
                  <b> Year:</b>{currentYear}
                </Col>
                <Col md="2"> <b>Total Cost:</b> {salary?.total_cost}</Col>
                <Col md="2">
                   
                </Col>
                <Col md="4" style={{display:'flex',justifyContent:'flex-end'}}>
                < PdfEmployeeSummary 
                  getSingleEmployeeData={getSingleEmployeeData} 
                  totalEmpTimesheetRecord={totalEmpTimesheetRecord}
                  dateOfmonth={dateOfmonth}
                  currentMonth={months} 
                  currentYear={years}
                  salary={salary} 
                  firstMatchData={firstMatchData} 
                />
                 <PdfEmpTimesheet 
                  getSingleEmployeeData={getSingleEmployeeData} 
                  totalEmpTimesheetRecord={totalEmpTimesheetRecord}
                  dateOfmonth={dateOfmonth}
                  currentMonth={months} 
                  currentYear={years}
                  salary={salary}
                  firstMatchData={firstMatchData}
                   />
                </Col>
              </Row>
            </Col>
          </Row>

          <table className="lineitem" id="myTable">
            <thead>
              <tr style={{ display: 'flex', alignItems: 'end' }}>
                <th scope="col" colSpan="2">
                  Normal Rate / HR:
                  <Input
                    type="text"
                    name="normal_hourly_rate"
                    id="totalNormalRate"
                    onChange={timesheethandleInputs}
                    defaultValue={normalhourlyRateData()}                  
                  />
                </th>
                <th scope="col" colSpan="2">
                  OT Rate / HR:
                  <Input
                    type="text"
                    name="ot_hourly_rate"
                    id="totalOtRate"
                    onChange={timesheethandleInputs}
                    defaultValue={othourlyRateData()}
                  />
                </th>
                <th scope="col" colSpan="2">
                  PH Rate / HR:
                  <Input
                    type="text"
                    name="ph_hourly_rate"
                    id="totalPhRate"
                    onChange={timesheethandleInputs}
                    defaultValue={phhourlyRateData()}
                  />
                </th>
                <th scope="col" colSpan="2">
                  Total Normal HRS:
                  <Input type="text" name="Total_Normal_HRS" disabled value={TotalNormalHRS()} />
                </th>
                <th scope="col" colSpan="2">
                  Total OT HRS:
                  <Input type="text" name="Total_OT_HRS" disabled value={TotalOTHRS()} />
                </th>
                <th scope="col" colSpan="2">
                  Total PH HRS:
                  <Input
                    type="text"
                    name="Total_PH_HRS"
                    disabled
                    value={TotalPHHRS()}
                  />
                </th>
                <th scope="col">Normal Rate</th>
                <th scope="col">OT Rate Row 2</th>
                <th scope="col">PH Rate Row 3</th>
                <th scope="col">
                  <Button
                    color="primary"
                    onClick={() => {
                      updateTimesheetData();
                      showEmpDataInTimsheet();
                      SalaryCalculation();
                    }}
                  >
                    Save
                  </Button>
                </th>
              </tr>
            </thead>
          </table>

          <Row>
            {dateOfmonth &&
              dateOfmonth.map((day, index) => {
                return (
                  <Col
                    key={index.toString()}
                    size={1}
                    lg={1}
                    style={{ textAlign: 'center', marginBottom: 20 }}
                    className={
                      day.day == 'sun' ? 'sunday' : '' || day.day == 'sat' ? 'saturday' : ''
                    }
                  >
                    {day.day.charAt(0).toUpperCase() + day.day.slice(1)}
                    <br></br>
                    {day.date}
                    <Input
                      className="mb-1"
                      id="totalNormalHr"
                      name="normal_hours"
                      value={totalNormalHrDay(day)}
                      onChange={handleInputs}
                      onBlur={(e) => handleInputBlur(e, 'normal_hours', day.date)}
                      // onBlur={(e) => {
                      //   insertTimeSheetData(e.target.value, 'normal_hours', day.date);
                      // }}
                      onFocus={() => {
                        setSelectedDay(day.date);
                      }}
                    ></Input>
                    <Input
                      className="mb-1"
                      id="totalOTHr"
                      name="ot_hours"
                      value={totalOTHr(day)}
                      onChange={handleInputs}
                      onBlur={(e) => handleInputBlur(e, 'ot_hours', day.date)}
                      // onBlur={(e) => {
                      //   insertTimeSheetData(e.target.value, 'ot_hours', day.date);
                      // }}
                      onFocus={() => {
                        setSelectedDay(day.date);
                      }}
                    ></Input>
                    <Input
                      className="mb-1"
                      id="totalPHHr"
                      name="ph_hours"
                      value={totalPHHr(day)}
                      onChange={handleInputs}
                      onBlur={(e) => handleInputBlur(e, 'ph_hours', day.date)}
                      // onBlur={(e) => {
                      //   insertTimeSheetData(e.target.value, 'ph_hours', day.date);
                      // }}
                      onFocus={() => {
                        setSelectedDay(day.date);
                      }}
                    ></Input>
                  </Col>
                );
              })}
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setTimesheet(false);
              window.location.reload();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TimesheetModal;
