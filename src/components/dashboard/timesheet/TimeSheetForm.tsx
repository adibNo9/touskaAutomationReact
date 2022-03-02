import axios, { AxiosRequestHeaders } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";
import classes from "./timesheet.module.css";
import { typeListTitles } from "../titleandsubtitle/EditTimeSheet";

import TimeSheetChart2 from "./TimeSheetChart2";
import TimeSheetItems from "./TimeSheetItems";

export interface typeCharts {
  category: string;
  title: string;
  spend_time: string;
  id: number;
}

const TimeSheetForm: React.FC<{
  titles: typeListTitles[];
  selectedDate: string;
}> = (props) => {
  const { titles } = props;

  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [timeVal, setTimeVal] = useState<string>("0.5");
  const [commentVal, setCommentVal] = useState<string>("");
  const [valueBox, setValueBox] = useState<string>("");
  const [typeValue, setTypeValue] = useState<number>(0);

  const [subId, setSubId] = useState<number>(0);
  const [subValue, setSubValue] = useState<string>("");

  const [selectedTitles, setSelectedTitles] = useState<typeListTitles[]>([]);

  const [chartValue, setChartValue] = useState<typeCharts[]>([]);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value.split(".");

    setTypeValue(+val[0]);

    setValueBox(value);

    const selectedValue = titles.filter((item) => item.id === typeValue);
    setSelectedTitles(selectedValue);
  };

  // const selectSubsHandelr = () => {
  //   const selectedValue = titles.filter((item) => item.id === typeValue);
  //   setSelectedTitles(selectedValue);
  // };

  useEffect(() => {
    const selectedValue = titles.filter((item) => item.id === typeValue);
    setSelectedTitles(selectedValue);
  }, [typeValue, titles]);

  const subsChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value.split(".");

    setSubId(+val[0]);

    setSubValue(value);
  };

  const timeChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setTimeVal(value);
  };

  const commentChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setCommentVal(value);
  };

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const getSheetHandler = () => {
    const connectDB = ConnectToDB("get/sheet/selected/userlogin");

    const fData = new FormData();

    fData.append("from_date", props.selectedDate);
    fData.append("to_date", props.selectedDate);

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
          setChartValue(res.data.timesheets);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
        setdataError(err.response.data.user);
      });
  };

  useEffect(() => {
    const getSheets = () => {
      const connectDB = ConnectToDB("get/sheet/selected/userlogin");

      const fData = new FormData();

      fData.append("from_date", props.selectedDate);
      fData.append("to_date", props.selectedDate);

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
            setChartValue(res.data.timesheets);
          }
        })
        .catch((err) => {
          console.log("Error", err.response);
          setdataError(err.response.data.user);
        });
    };

    getSheets();
  }, [props.selectedDate]);

  let formValidate = false;

  if (typeValue !== 0 && subId !== 0) {
    formValidate = true;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("create/sheet");

    const fData = new FormData();

    fData.append("title_id", `${typeValue}`);
    fData.append("category_id", `${subId}`);
    fData.append("uniquetime", props.selectedDate);
    fData.append("spend_time", timeVal);
    fData.append("comment", commentVal);

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
            getSheetHandler();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
        setNotification("error");
        setdataError(err.response.data.user);
      });
  };

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

  let sheets = [];

  for (let i = 0; i < chartValue.length; i++) {
    sheets[i] = (
      <TimeSheetItems
        key={i}
        chartValue={chartValue[i]}
        getSheet={getSheetHandler}
      />
    );
  }

  return (
    <div className={classes.results}>
      <Form onSubmit={submitHandler} className={classes.form}>
        <Form.Group className={classes.formGroup} controlId="formBasicEmail">
          <Form.Label>عنوان‌ها</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            // onClick={selectSubsHandelr}
            aria-label="Default select example"
          >
            <option>انتخاب عنوان ...</option>
            {titles.map((title) => (
              <option key={title.id} value={`${title.id}.${title.title}`}>
                {title.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className={classes.formGroup} controlId="formBasicEmail">
          <Form.Label>
            {" "}
            زیر عنوان‌ها{" "}
            <span>
              ({selectedTitles.length > 0 && selectedTitles[0].title})
            </span>
          </Form.Label>
          <Form.Select
            value={subValue}
            onChange={subsChangeHandler}
            //   disabled={subtitles.length === 0}
            aria-label="Default select example"
          >
            <option>انتخاب زیر عنوان ...</option>
            {selectedTitles.length > 0 &&
              selectedTitles[0].subtitles.map((title) => (
                <option key={title.id} value={`${title.id}.${title.name}`}>
                  {title.name}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className={classes.formGroup} controlId="formBasicEmail">
          <Form.Label>زمان</Form.Label>
          <Form.Control
            type="number"
            placeholder="زمان"
            value={timeVal}
            onChange={timeChangeHandelr}
            step="0.5"
            min="0.5"
            max="10"
          />
        </Form.Group>
        <Form.Group
          className={classes.formGroupMessage}
          controlId="formBasicEmail"
        >
          <Form.Label>توضیحات</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            placeholder="توضیحات"
            value={commentVal}
            onChange={commentChangeHandelr}
          />
        </Form.Group>
        <div className={classes.actions}>
          <button disabled={!formValidate}>تایید</button>
        </div>
        {notification && (
          <Notification
            status={notifDetails.status}
            title={notifDetails.title}
            message={notifDetails.message}
          />
        )}
      </Form>
      <div className={classes.sheets}>{sheets}</div>

      <div className={classes.chart}>
        <TimeSheetChart2 chartValue={chartValue} />
      </div>
    </div>
  );
};

export default TimeSheetForm;
