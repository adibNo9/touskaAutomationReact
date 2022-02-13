import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import classes from "../tasks.module.css";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
import { getData } from "../../../../lib/get-data";
import { typeUsersList } from "../../users/AllUsers";
import axios, { AxiosRequestHeaders } from "axios";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import Notification from "../../../ui/notification";

const CreateWebTask: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [subjectVal, setSubjectVal] = useState<string>("");
  const [assignmentVal, setAssignmentVal] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<DayValue>(null);
  const [dueonTime, setDueonTime] = useState<DayValue>(null);

  const [valueBox, setValueBox] = useState<string>("");
  const [assignList, setAssignList] = useState<typeUsersList[]>([]);
  const [assignSelected, setAssignSelected] = useState<string>("");
  const [verificationSelected, setVerificationSelected] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [commentVal, setCommentVal] = useState<string>("");

  useEffect(() => {
    const getListUsers = async () => {
      const value = await getData("listuser");
      setAssignList(value.users);
    };
    getListUsers();
  }, []);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setValueBox(value);
  };

  const AssignChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setAssignSelected(value);
  };

  const verificationChangeHandelr = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    setVerificationSelected(value);
  };

  const subjectChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSubjectVal(value);
  };

  const assignmentChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setAssignmentVal(value);
  };

  const commentChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setCommentVal(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.files?.[0];
    console.log(value);
    setSelectedFile(value);
  };

  let formValidate = false;

  if (
    subjectVal.trim().length > 0 &&
    assignmentVal.trim().length > 0 &&
    selectedFile
  ) {
    formValidate = true;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("subjectVal", subjectVal);
    console.log("Assignment", assignmentVal);
    console.log("deliveryTime", deliveryTime);
    console.log("dueonTime", dueonTime);
    console.log("valueBox", valueBox);
    console.log("assignSelected", assignSelected);

    setNotification("pending");

    const connectDB = ConnectToDB("create/task/web");

    const fData = new FormData();

    fData.append("subject", subjectVal);
    fData.append("Assignment", assignmentVal);
    // fData.append(
    //   "delivery_time",
    //   `${deliveryTime?.year}/${deliveryTime?.month}/${deliveryTime?.day}`
    // );
    // fData.append(
    //   "due_on",
    //   `${dueonTime?.year}/${dueonTime?.month}/${dueonTime?.day}`
    // );
    // fData.append("Priority", valueBox);
    // fData.append("assignment_id", assignSelected);
    // fData.append("Status", verificationSelected);
    fData.append("file", selectedFile ? selectedFile : "");

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

  return (
    <section className={classes.seotasks}>
      <Form onSubmit={submitHandler} className={classes.form}>
        <Form.Group className={classes.formGroup} controlId="formBasicSubject">
          <Form.Label>موضوع</Form.Label>
          <Form.Control
            type="text"
            placeholder="موضوع"
            value={subjectVal}
            onChange={subjectChangeHandelr}
          />
        </Form.Group>

        <Form.Group
          className={classes.formGroup}
          controlId="formBasicAssignment"
        >
          <Form.Label>تکلیف</Form.Label>
          <Form.Control
            type="text"
            placeholder="تکلیف"
            value={assignmentVal}
            onChange={assignmentChangeHandelr}
          />
        </Form.Group>

        <Form.Group className={classes.formGroup} controlId="formBasicFile">
          <Form.Label>فایل</Form.Label>
          <Form.Control name="فایل" type="file" onChange={handleChange} />
        </Form.Group>

        <Form.Group
          className={classes.formGroup}
          controlId="formBasicAssignment"
        >
          <Form.Label>دیدگاه</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={5}
            placeholder="دیدگاه"
            value={commentVal}
            onChange={commentChangeHandelr}
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
    </section>
  );
};

export default CreateWebTask;
