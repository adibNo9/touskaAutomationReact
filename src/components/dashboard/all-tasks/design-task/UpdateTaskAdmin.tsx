import { ChangeEvent, useState } from "react";
import { Form } from "react-bootstrap";
import classes from "../tasks.module.css";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
import axios, { AxiosRequestHeaders } from "axios";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import Notification from "../../../ui/notification";
import { typeTasks } from "./ReportDesignTasks";

const UpdateTaskAdmin: React.FC<{ value: typeTasks | undefined }> = (props) => {
  const { value } = props;

  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [subjectVal, setSubjectVal] = useState<string>("");
  const [assignmentVal, setAssignmentVal] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<DayValue>(null);

  const [valueBox, setValueBox] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setValueBox(value);
  };

  const subjectChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSubjectVal(value);
  };

  const assignmentChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setAssignmentVal(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.files?.[0];
    setSelectedFile(value);
  };

  let formValidate = false;

  if (
    subjectVal.trim().length > 0 ||
    assignmentVal.trim().length > 0 ||
    selectedFile ||
    deliveryTime ||
    valueBox !== ""
  ) {
    formValidate = true;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("edit/task/design/superadmin");

    const fData = new FormData();

    fData.append("task_id", JSON.stringify(value?.id));

    subjectVal !== "" && fData.append("subject", subjectVal);

    assignmentVal !== "" && fData.append("Assignment", assignmentVal);

    deliveryTime &&
      fData.append(
        "delivery_time",
        `${deliveryTime?.year}/${deliveryTime?.month}/${deliveryTime?.day}`
      );

    valueBox !== "" && fData.append("Priority", valueBox);

    selectedFile && fData.append("file", selectedFile ? selectedFile : "");

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
        console.log("res", res);
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
        <h3 className="text-center mx-auto bg-light px-4 py-1">
          آپدیت {value?.subject}
        </h3>
        <Form.Group
          className={classes.formGroupUpdate}
          controlId="formBasicSubject"
        >
          <Form.Label>موضوع</Form.Label>
          <Form.Control
            type="text"
            placeholder="موضوع"
            value={subjectVal}
            onChange={subjectChangeHandelr}
          />
        </Form.Group>

        <Form.Group
          className={classes.formGroupUpdate}
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

        <Form.Group
          className={classes.formGroupUpdate}
          controlId="formBasicFile"
        >
          <Form.Label>فایل</Form.Label>
          <Form.Control name="فایل" type="file" onChange={handleChange} />
        </Form.Group>

        <Form.Group
          className={classes.formGroupUpdate}
          controlId="formBasicDeliveryPriority"
        >
          <Form.Label className="mx-3">اولویت</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            aria-label="Default select example"
          >
            <option>انتخاب اولویت ...</option>
            <option value="0">اورژانسی</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Form.Select>
        </Form.Group>

        <Form.Group
          className={classes.formGroupDate}
          controlId="formBasicDeliveryTime"
        >
          <Form.Label className="mx-3">زمان ارسال</Form.Label>
          <DatePicker
            value={deliveryTime}
            onChange={setDeliveryTime}
            inputPlaceholder="انتخاب زمان تحویل"
            locale="fa"
            calendarClassName={classes.calendar}
            inputClassName={classes.InputCalendar}
            shouldHighlightWeekends
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

export default UpdateTaskAdmin;
