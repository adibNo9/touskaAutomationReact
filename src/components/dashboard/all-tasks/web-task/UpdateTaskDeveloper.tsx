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
import { typeWebTasks } from "./ReportWebAdmin";

const UpdateTaskDeveloper: React.FC<{ value: typeWebTasks | undefined }> = (
  props
) => {
  const { value } = props;

  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [dueonTime, setDueonTime] = useState<DayValue>(null);

  const [assignList, setAssignList] = useState<typeUsersList[]>([]);
  const [assignSelected, setAssignSelected] = useState<string>("");

  useEffect(() => {
    const getListUsers = async () => {
      const value = await getData("list/developer/users");
      setAssignList(value.users);
    };
    getListUsers();
  }, []);

  console.log("developers:", assignList);

  const AssignChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setAssignSelected(value);
  };

  let formValidate = false;

  if (assignSelected !== "" || dueonTime) {
    formValidate = true;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("edit/task/developer/admin");

    const fData = new FormData();

    fData.append("task_id", JSON.stringify(value?.id));

    dueonTime &&
      fData.append(
        "due_on",
        `${dueonTime?.year}/${dueonTime?.month}/${dueonTime?.day}`
      );

    assignSelected !== "" && fData.append("assignment_id", assignSelected);

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
        <h3 className="text-center mx-auto bg-light px-4 py-1">
          آپدیت {value?.subject}
        </h3>
        <Form.Group
          className={classes.formGroupUpdate}
          controlId="formBasicDeliveryAssignId"
        >
          <Form.Label className="mx-3">اختصاص به</Form.Label>
          <Form.Select
            value={assignSelected}
            onChange={AssignChangeHandler}
            aria-label="Default select example"
          >
            <option>انتخاب کاربر ...</option>
            {assignList.map((item) => (
              <option value={`${item.id}`} key={item.id}>
                {item.email}({item.name})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group
          className={classes.formGroupDate}
          controlId="formBasicDeliveryTime"
        >
          <Form.Label className="mx-3">مهلت زمان تحویل</Form.Label>
          <DatePicker
            value={dueonTime}
            onChange={setDueonTime}
            inputPlaceholder="انتخاب مهلت تحویل"
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

export default UpdateTaskDeveloper;
