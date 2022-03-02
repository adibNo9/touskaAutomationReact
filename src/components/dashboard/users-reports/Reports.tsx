import React, { useState, useEffect, ChangeEvent } from "react";
import classes from "./repports.module.css";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { DayRange } from "react-modern-calendar-datepicker";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import Notification from "../../ui/notification";

import ReportTitles from "./ReportTitles";
import ReportSubtitles from "./ReportSubtitles";
import { Form } from "react-bootstrap";

import { RiSearch2Line } from "react-icons/ri";

export interface typeReportsValue {
  email: string;
  id: number;
  is_active: number;
  name: string;
  role_id: number;
  report_base_Title: { name: string; spend_time: number }[];
  report_base_subTitle: { name: string; spend_time: number }[];
}

export interface typeSums {
  name: string;
  spend_time: number;
}

const Reports: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();
  const [titleReports, setTitleReports] = useState(true);
  const [subtitleReports, setSubtitleReports] = useState(false);
  const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });

  const [reportsValue, setReportsValue] = useState<typeReportsValue[]>([]);
  const [value, setValue] = useState<typeReportsValue[]>([]);

  const [sumTitlesValue, setSumTitlesValue] = useState<typeSums[]>([]);
  const [sumSubtitlesValue, setSumSubtitlesValue] = useState<typeSums[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const searchChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
  };

  function convertNumber(fromNum: string) {
    var persianNums = "۰١۲۳۴۵۶۷۸۹";
    return persianNums.indexOf(fromNum);
  }

  const newToday = new Date().toLocaleDateString("fa-ir").split("/");

  const todayObj = {
    day: newToday[2].split(""),
    month: newToday[1].split(""),
    year: newToday[0].split(""),
  };

  const setDate = (val: string[]) => {
    let value = [];
    for (let i = 0; i < val.length; i++) {
      value[i] = convertNumber(val[i]);
      value[i] = +value[i];
    }

    const posValue = value.map((val) => Math.abs(val));

    return posValue.join("");
  };

  const todayDay = setDate(todayObj.day);
  const todayMonth = setDate(todayObj.month);
  const todayYear = setDate(todayObj.year);
  const maxDate = {
    year: +todayYear,
    month: +todayMonth,
    day: +todayDay,
  };

  useEffect(() => {
    const fromDate = `${selectedDayRange.from?.year}/${selectedDayRange.from?.month}/${selectedDayRange.from?.day}`;
    const toDate = `${selectedDayRange.to?.year}/${selectedDayRange.to?.month}/${selectedDayRange.to?.day}`;

    if (selectedDayRange.from && selectedDayRange.to) {
      setNotification("pending");

      const connectDB = ConnectToDB("report/all/title");

      const fData = new FormData();

      fData.append("from_date", fromDate);
      fData.append("to_date", toDate);

      const headers: AxiosRequestHeaders = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      };

      axios({
        method: "POST",
        url: connectDB,
        headers: headers,
        data: fData,
      })
        .then((res) => {
          if (res.data.status === "success") {
            setNotification(res.data.status);

            setTimeout(() => {
              setNotification("");
              setReportsValue(res.data.report.users);
              setValue(res.data.report.users);
              setSumTitlesValue(res.data.report.sum_all_title);
              setSumSubtitlesValue(res.data.report.sum_all_subTitle);
            }, 2000);
          }
        })
        .catch((err) => {
          console.log("Error", err.response);
          setNotification("error");
          setdataError(err.response.data.user);
        });
    }
  }, [selectedDayRange]);

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  let notifDetails: notificationDetails = {
    status: "",
    title: "",
    message: "",
  };

  if (notification === "pending") {
    notifDetails = {
      status: "pending",
      title: "منتظر بمانید!",
      message: "در حال ارسال اطلاعات",
    };
  }

  if (notification === "success") {
    notifDetails = {
      status: "success",
      title: "موفق!",
      message: "اطلاعات شما با موفقیت ارسال شد!",
    };
  }

  if (notification === "error") {
    notifDetails = {
      status: "error",
      title: "خطا!",
      message: dataError,
    };
  }

  const searchSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const valueSearch = value.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    setReportsValue(valueSearch);
  };

  const setValueHandelr = () => {
    setReportsValue(value);
  };

  const showTitleReports = () => {
    setTitleReports(true);
    setSubtitleReports(false);
  };

  const showSubtitleReports = () => {
    setTitleReports(false);
    setSubtitleReports(true);
  };

  return (
    <section className={classes.reports}>
      <h1>گزارشات</h1>
      <div className={classes.links}>
        <button
          onClick={showTitleReports}
          className={titleReports ? classes.active : classes.noActive}
        >
          گزارش بر اساس عنوان‌ها
        </button>
        <button
          onClick={showSubtitleReports}
          className={subtitleReports ? classes.active : classes.noActive}
        >
          گزارش بر اساس زیر عنوان‌ها
        </button>
      </div>
      <div className={classes.datePicker}>
        <DatePicker
          value={selectedDayRange}
          onChange={setSelectedDayRange}
          inputPlaceholder="بازه زمانی را انتخاب کنید"
          locale="fa"
          calendarClassName={classes.calendar}
          inputClassName={classes.inputCalendar}
          calendarRangeBetweenClassName={classes.rangeInput}
          maximumDate={maxDate}
          shouldHighlightWeekends
        />
      </div>
      <div className={classes.filters}>
        <Form onSubmit={searchSubmitHandler}>
          <Form.Group className={classes.formSearch} controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="نام مورد نظر خود را وارد کنید"
              value={searchValue}
              onChange={searchChangeHandelr}
              onClick={setValueHandelr}
            />
            <button>
              <RiSearch2Line />
            </button>
          </Form.Group>
        </Form>
      </div>
      <div className={classes.content}>
        {titleReports && (
          <ReportTitles
            reportsValue={reportsValue}
            sumTitles={sumTitlesValue}
          />
        )}
        {subtitleReports && (
          <ReportSubtitles
            reportsValue={reportsValue}
            sumSubtitles={sumSubtitlesValue}
          />
        )}
      </div>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </section>
  );
};

export default Reports;
