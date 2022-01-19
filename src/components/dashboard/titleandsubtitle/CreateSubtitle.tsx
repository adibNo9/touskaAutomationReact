import axios, { AxiosRequestHeaders } from "axios";
import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Form, Button } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";
import classes from "./edit.module.css";
import { typeListTitles } from "./EditTimeSheet";

import { AiFillDelete } from "react-icons/ai";

const CreateSubtitle: React.FC<{ titles: typeListTitles[] }> = (props) => {
  const { titles } = props;

  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [nameVal, setNameVal] = useState<string>("");
  const [valueBox, setValueBox] = useState<string[]>([]);
  const [typeValue, setTypeValue] = useState<string[]>([]);

  const [deleteVal, setDeleteVal] = useState<string>("");

  let typeArray: string[] = [];
  let titleArray = [];

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value.split(".");

    if (!typeValue.includes(`${+val[0]}`)) {
      setTypeValue([...typeValue, `${+val[0]}`]);
    }

    if (!valueBox.includes(value)) {
      setValueBox([...valueBox, value]);
    }
  };

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNameVal(value);
  };

  useEffect(() => {
    const deleteHandler = () => {
      const valTitle = valueBox.filter((item) => item !== deleteVal);
      setValueBox(valTitle);
      deleteVal.split(".");

      const valTypes = typeValue.filter((item) => item !== deleteVal[0]);
      setTypeValue(valTypes);
    };

    deleteHandler();
  }, [deleteVal]);

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("name:", nameVal);
    console.log("titlesId", JSON.stringify(typeValue));

    setNotification("pending");

    const connectDB = ConnectToDB("create/subtitle");

    const fData = new FormData();
    fData.append("name", nameVal);
    fData.append("titlesId", JSON.stringify(typeValue));

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
        if (res.data.status === "success created") {
          setNotification(res.data.status);

          setTimeout(() => {
            setNotification("");
            window.location.reload();
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

  if (notification === "success created") {
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
    <Form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.selectedTitles}>
        <h5 className="text-center" dir="rtl">
          {" "}
          عنوان‌های انتخاب شده:{" "}
        </h5>
        {valueBox.map((item, index) => (
          <div className={classes.selectedSingleTitle} key={index}>
            <h6>{item}</h6>
            <AiFillDelete onClick={() => setDeleteVal(item)} />
          </div>
        ))}
      </div>
      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>عنوان‌ها</Form.Label>
        <Form.Select
          value={valueBox}
          onChange={changeHandler}
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
        <Form.Label>Subtitle</Form.Label>
        <Form.Control
          type="text"
          placeholder="Subtitle"
          value={nameVal}
          onChange={emailChangeHandelr}
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
  );
};

export default CreateSubtitle;
