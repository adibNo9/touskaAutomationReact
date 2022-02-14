import React, { ChangeEvent, Fragment, useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import classes from "./auth.module.css";

import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { ConnectToDB } from "../../lib/connect-to-db";
import axios from "axios";
import Notification from "../ui/notification";
import { Link, useHistory } from "react-router-dom";
import { AutoContext } from "../../store/auto-context";

interface notificationDetails {
  status: string;
  title: string;
  message: string;
}

const Login: React.FC = () => {
  const history = useHistory();
  const autoCtx = useContext(AutoContext);
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [showPass, setShowPass] = useState<boolean>(false);

  const [emailVal, setEmailVal] = useState<string>("");
  const [passVal, setPassVal] = useState<string>("");

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setEmailVal(value);
  };

  const passChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setPassVal(value);
  };

  let formValidate = false;

  if (
    emailVal?.trim().includes("@") &&
    emailVal?.trim().includes(".") &&
    passVal.trim().length > 6
  ) {
    formValidate = true;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("login/user/email");

    const fData = new FormData();

    fData.append("email", emailVal);
    fData.append("password", passVal);

    axios({
      method: "POST",
      url: connectDB,
      data: fData,
    })
      .then((res) => {
        console.log(res);
        if (res.data.status === "success") {
          setNotification(res.data.status);
          localStorage.setItem("token", res.data.token);
          autoCtx.getToken(res.data.token);

          setTimeout(() => {
            setNotification("");
            history.replace("/dashboard");
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
    <Fragment>
      <div className={classes.title}>
        <h1> ورود </h1>
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

        <Button disabled={!formValidate} variant="primary" type="submit">
          ورود
        </Button>
        <Link className="mt-3" to="/register">
          ثبت نام نکرده‌اید؟
        </Link>
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

export default Login;
