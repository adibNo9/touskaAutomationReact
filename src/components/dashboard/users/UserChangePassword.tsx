import axios, { AxiosRequestHeaders } from "axios";
import { ChangeEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";
import classes from "./users.module.css";

import { BsCheckAll } from "react-icons/bs";

const UserChangePassword: React.FC<{ id: number }> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [oldPassVal, setOldPassVal] = useState<string>("");
  const [newPassVal, setNewPassVal] = useState<string>("");
  const [confPassVal, setConfPassVal] = useState<string>("");

  const oldPassChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setOldPassVal(value);
  };

  const newPassChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNewPassVal(value);
  };

  const confChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setConfPassVal(value);
  };

  let correctPass = false;

  if (newPassVal.trim().length > 6 && newPassVal === confPassVal) {
    correctPass = true;
  }

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("superadmin/update/user");

    const fData = new FormData();

    fData.append("id", JSON.stringify(props.id));
    fData.append("oldpassword", oldPassVal);
    fData.append("password", newPassVal);
    fData.append("password_confirmation", confPassVal);

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
        if (res.data.status === "success updated") {
          setNotification(res.data.status);

          setTimeout(() => {
            setNotification("");
            localStorage.removeItem("token");
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

  if (notification === "success updated") {
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

  let formValid: boolean = false;

  if (
    newPassVal.trim().length > 6 &&
    correctPass &&
    oldPassVal.trim().length > 6
  ) {
    formValid = true;
  }

  return (
    <Form onSubmit={submitHandler} className={classes.form}>
      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>رمز عبور فعلی</Form.Label>
        <Form.Control
          type="password"
          placeholder="رمز عبور فعلی"
          value={oldPassVal}
          onChange={oldPassChangeHandelr}
        />
      </Form.Group>

      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>رمز عبور جدید</Form.Label>
        <Form.Control
          type="password"
          placeholder="رمز عبور جدید"
          value={newPassVal}
          onChange={newPassChangeHandelr}
        />
      </Form.Group>

      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>تایید رمز عبور جدید</Form.Label>
        <Form.Control
          type="password"
          placeholder="تایید رمز عبور جدید"
          value={confPassVal}
          onChange={confChangeHandelr}
        />
        {correctPass && <BsCheckAll className={classes.correctPass} />}
      </Form.Group>
      <div className={classes.actions}>
        <button disabled={!formValid}>تایید</button>
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

export default UserChangePassword;
