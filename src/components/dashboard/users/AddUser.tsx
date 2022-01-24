import React, { ChangeEvent, Fragment, useState } from "react";
import { Form, Button } from "react-bootstrap";
import classes from "./users.module.css";

import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsCheckAll } from "react-icons/bs";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios from "axios";
import Notification from "../../ui/notification";

interface notificationDetails {
  status: string;
  title: string;
  message: string;
}

interface typeRoles {
  id: number;
  name: string;
}

const ROLES: typeRoles[] = [
  { id: 1, name: "Superadmin" },
  { id: 2, name: "Admin" },
  { id: 3, name: "Developer" },
  { id: 4, name: "Employee" },
  { id: 5, name: "Apprentice" },
];

const AddUser: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfPass, setShowConfPass] = useState<boolean>(false);

  const [emailVal, setEmailVal] = useState<string>("");
  const [nameVal, setNameVal] = useState<string>("");
  const [passVal, setPassVal] = useState<string>("");
  const [confPassVal, setConfPassVal] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [valueBox, setValueBox] = useState<string>("");

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setValueBox(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.files?.[0];
    console.log(value);
    setSelectedFile(value);
  };

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setEmailVal(value);
  };

  const nameChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNameVal(value);
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
    emailVal?.trim().length > 0 &&
    valueBox !== "" &&
    selectedFile &&
    emailVal?.trim().includes(".") &&
    passVal.trim().length > 6 &&
    correctPass
  ) {
    formValidate = true;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("name", nameVal);
    console.log("email", emailVal);
    console.log("role", valueBox);
    console.log("image", selectedFile ? selectedFile : "");
    console.log("password", passVal);
    console.log("password_confirmation", confPassVal);

    // setNotification("pending");

    // const connectDB = ConnectToDB("register/user/email");

    // const fData = new FormData();

    // fData.append("name", nameVal);
    // fData.append("email", emailVal);
    // fData.append("role", valueBox);
    // fData.append("image", selectedFile ? selectedFile : "");
    // fData.append("password", passVal);
    // fData.append("password_confirmation", confPassVal);

    // axios({
    //   method: "POST",
    //   url: connectDB,
    //   data: fData,
    // })
    //   .then((res) => {
    //     console.log(res);
    //     if (res.data.status === "success") {
    //       setNotification(res.data.status);

    //       setTimeout(() => {
    //         setNotification("");
    //       }, 2000);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("Error", err.response);
    //     setNotification("error");
    //   });
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
      <Form className={classes.form} onSubmit={submitHandler}>
        <Form.Group className={classes.formGroup} controlId="formBasicEmail">
          <Form.Label>نام</Form.Label>
          <Form.Control
            type="text"
            placeholder="نام"
            value={nameVal}
            onChange={nameChangeHandelr}
          />
        </Form.Group>

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

        <Form.Group
          className={classes.formGroup}
          controlId="formBasicDeliveryPriority"
        >
          <Form.Label>نقش</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            aria-label="Default select example"
          >
            <option>انتخاب نقش ...</option>
            {ROLES.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className={classes.formGroup}>
          <Form.Label htmlFor="image">عکس</Form.Label>
          <Form.Control
            name="image"
            id="image"
            type="file"
            onChange={handleChange}
          />
        </Form.Group>

        <div className={classes.actions}>
          <button disabled={!formValidate}>تایید</button>
        </div>
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

export default AddUser;
