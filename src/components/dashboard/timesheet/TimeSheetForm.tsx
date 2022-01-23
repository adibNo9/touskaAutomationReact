import axios, { AxiosRequestHeaders } from "axios";
import React, {
  ChangeEvent,
  Fragment,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Form, Button } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";
import classes from "./timesheet.module.css";
import { typeListTitles } from "../titleandsubtitle/EditTimeSheet";

import { AiFillDelete } from "react-icons/ai";
import TimeSheetChart from "./TimeSheetChart";

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

  console.log("titles:", titles);

  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [timeVal, setTimeVal] = useState<string>("0.5");
  const [commentVal, setCommentVal] = useState<string>("");
  const [valueBox, setValueBox] = useState<string>("");
  const [typeValue, setTypeValue] = useState<number>(0);

  const [subId, setSubId] = useState<number>(0);
  const [subValue, setSubValue] = useState<string>("");

  const [selectedTitles, setSelectedTitles] = useState<typeListTitles[]>([
    { id: 0, title: "", subtitles: [{ id: 0, name: "" }] },
  ]);

  const [chartValue, setChartValue] = useState<typeCharts[]>([]);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value.split(".");

    setTypeValue(+val[0]);

    setValueBox(value);
  };

  const selectSubsHandelr = () => {
    const selectedValue = titles.filter((item) => item.id === typeValue);
    setSelectedTitles(selectedValue);

    console.log("select", selectedTitles);
  };

  const subsChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value.split(".");

    setSubId(+val[0]);

    setSubValue(value);

    console.log("value:", subId, subValue);
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
    const connectDB = ConnectToDB("get/sheet/selected");

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
        console.log(res);
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
    getSheetHandler();
  }, []);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("title_id:", typeValue);
    console.log("category_id", subId);
    console.log("uniquetime", props.selectedDate);
    console.log("spend_time", timeVal);
    console.log("comment", commentVal);

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
        console.log(res);
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

  return (
    <div className={classes.results}>
      <Form onSubmit={submitHandler} className={classes.form}>
        <Form.Group className={classes.formGroup} controlId="formBasicEmail">
          <Form.Label>عنوان‌ها</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            onBlur={selectSubsHandelr}
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
            زیر عنوان‌ها <span>({selectedTitles[0].title})</span>
          </Form.Label>
          <Form.Select
            value={subValue}
            onChange={subsChangeHandler}
            //   disabled={subtitles.length === 0}
            aria-label="Default select example"
          >
            <option>انتخاب زیر عنوان ...</option>
            {selectedTitles[0].subtitles.map((title) => (
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
          <button>تایید</button>
        </div>
        {notification && (
          <Notification
            status={notifDetails.status}
            title={notifDetails.title}
            message={notifDetails.message}
          />
        )}
      </Form>
      <div className={classes.chart}>
        <TimeSheetChart chartValue={chartValue} />
      </div>
    </div>
  );
};

export default TimeSheetForm;