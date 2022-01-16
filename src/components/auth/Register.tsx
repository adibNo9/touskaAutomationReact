import React, {
  ChangeEvent,
  FormEventHandler,
  Fragment,
  useState,
} from "react";
import { Form, Button } from "react-bootstrap";
import classes from "./auth.module.css";

import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsCheckAll } from "react-icons/bs";
import { ConnectToDB } from "../../lib/connect-to-db";
import axios from "axios";
import Notification from "../ui/notification";

interface notificationDetails {
  status: string;
  title: string;
  message: string;
}

const Register: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfPass, setShowConfPass] = useState<boolean>(false);

  const [emailVal, setEmailVal] = useState<string>("");
  const [passVal, setPassVal] = useState<string>("");
  const [confPassVal, setConfPassVal] = useState<string>("");

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setEmailVal(value);
  };

  const passChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setPassVal(value);
  };

  const confPassChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setConfPassVal(value);
  };

  let correctPass = false;

  if (passVal === confPassVal) {
    correctPass = true;
  }

  let formValidate = false;

  if (
    emailVal?.trim().includes("@") &&
    emailVal?.trim().includes(".") &&
    correctPass
  ) {
    formValidate = true;
  }

  const connectDB = ConnectToDB("register/user/email");

  //   async function createUser(
  //     email: string,
  //     password: string,
  //     password_confirmation: string
  //   ) {
  //     const response = await fetch(connectDB, {
  //       method: "POST",
  //       body: JSON.stringify({ email, password, password_confirmation }),
  //       headers: {
  //         "Content-type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       // throw new Error(data.message || "Something went wrong!");
  //       setdataError(data.msg);
  //     }

  //     return data;
  //   }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("email:", emailVal);
    console.log("pass:", passVal);
    console.log("conf:", confPassVal);

    // try {
    //   const result = await createUser(emailVal, passVal, confPassVal);
    //   console.log(result);

    //   setNotification(result.status);
    //   setdataError(result.user);
    // } catch (error) {
    //   console.log("error", error);
    //   return;
    // }

    setNotification("pending");

    const connectDB = ConnectToDB("register/user/email");

    const fData = new FormData();

    fData.append("email", emailVal);
    fData.append("password", passVal);
    fData.append("password_confirmation", confPassVal);

    axios({
      method: "POST",
      url: connectDB,
      data: fData,
    })
      .then((res) => {
        console.log(res);
        if (res.data.status === "success created") {
          setNotification(res.data.status);

          setNotification(res.data.status);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
        setNotification("error");
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
    <Fragment>
      <div className={classes.title}>
        <h1> ثبت نام </h1>
      </div>
      <Form className={classes.form} onSubmit={submitHandler}>
        <Form.Group className={classes.formGroup} controlId="formBasicEmail">
          <Form.Label>ایمیل</Form.Label>
          <Form.Control
            type="email"
            placeholder="ایمیل"
            value={emailVal}
            onChange={emailChangeHandelr}
          />
        </Form.Group>

        <Form.Group className={classes.formGroup} controlId="formBasicPassword">
          <Form.Label>رمز عبور</Form.Label>
          <Form.Control
            type={showPass ? `text` : `password`}
            placeholder="رمز عبور"
            value={passVal}
            onChange={passChangeHandelr}
          />
          {!showPass && (
            <AiFillEye
              className={classes.showsIconPass}
              onClick={() => setShowPass(true)}
            />
          )}
          {showPass && (
            <AiFillEyeInvisible
              className={classes.showsIconPass}
              onClick={() => setShowPass(false)}
            />
          )}
        </Form.Group>

        <Form.Group className={classes.formGroup} controlId="formBasicPassword">
          <Form.Label>تایید رمز عبور</Form.Label>
          <Form.Control
            type={showConfPass ? `text` : `password`}
            placeholder="تایید رمز عبور"
            value={confPassVal}
            onChange={confPassChangeHandelr}
          />
          {!showConfPass && (
            <AiFillEye
              className={classes.showsIconPass}
              onClick={() => setShowConfPass(true)}
            />
          )}
          {showConfPass && (
            <AiFillEyeInvisible
              className={classes.showsIconPass}
              onClick={() => setShowConfPass(false)}
            />
          )}
          {correctPass && <BsCheckAll className={classes.checkPass} />}
        </Form.Group>

        <Button disabled={!formValidate} variant="primary" type="submit">
          تایید و ارسال
        </Button>
      </Form>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </Fragment>
  );
};

export default Register;
