import axios, { AxiosRequestHeaders } from "axios";
import { ChangeEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";
import classes from "./edit.module.css";

const CreateTitle: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [nameVal, setNameVal] = useState<string>("");

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNameVal(value);
  };

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("title:", nameVal);

    setNotification("pending");

    const connectDB = ConnectToDB("create/title");

    const fData = new FormData();
    fData.append("title", nameVal);

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
      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>عنوان</Form.Label>
        <Form.Control
          type="text"
          placeholder="عنوان"
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

export default CreateTitle;
