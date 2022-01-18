import axios, { AxiosRequestHeaders } from "axios";
import { ChangeEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";
import classes from "./profile.module.css";

const ProfileUpdate: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [nameVal, setNameVal] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNameVal(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.files?.[0];
    console.log(value);
    setSelectedFile(value);
  };

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("file:", selectedFile);
    {
      nameVal && console.log("name:", nameVal);
    }
    {
      selectedFile && console.log("image", selectedFile ? selectedFile : "");
    }
    setNotification("pending");

    const connectDB = ConnectToDB("update/user");

    const fData = new FormData();

    {
      nameVal && fData.append("name", nameVal);
    }
    {
      selectedFile && fData.append("image", selectedFile ? selectedFile : "");
    }

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
        if (res.data.status === "success updated") {
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

  return (
    <Form onSubmit={submitHandler} className={classes.form}>
      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>نام</Form.Label>
        <Form.Control
          type="text"
          placeholder="نام"
          value={nameVal}
          onChange={emailChangeHandelr}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="image">عکس</Form.Label>
        <Form.Control
          name="image"
          id="image"
          type="file"
          onChange={handleChange}
          size="sm"
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

export default ProfileUpdate;
