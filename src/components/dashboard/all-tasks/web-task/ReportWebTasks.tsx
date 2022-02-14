import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getData } from "../../../../lib/get-data";
import classes from "../tasks.module.css";
import { Button, Form } from "react-bootstrap";

import Modal from "../../../ui/Modal";

import { RiEditFill } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import Notification from "../../../ui/notification";
import WebComments, { comments } from "./WebComments";
import { IoMdChatboxes } from "react-icons/io";

export interface typeTasks {
  Assignment: string;
  Priority: string;
  admin_task_email: string;
  delivery_time: string;
  due_on: string;
  subject: string;
  Status: string;
  Verification: string;
  assigned_to: string;
  file: {
    name: string;
    url: string;
  }[];
  comments: comments[];
  assignment_id: number;
  id: number;
}

const ReportWebTasks: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [tasks, setTasks] = useState<typeTasks[]>([]);

  const [id, setId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [valueBox, setValueBox] = useState<string>("");

  const [commentsModal, setCommentsModal] = useState<boolean>(false);
  const [idCmnt, setIdCmnt] = useState<number>(0);
  const [commentsDetails, setCommentsDetails] = useState<comments[]>([]);

  const [taskId, setTaskId] = useState<string>("");

  const getTasks = async () => {
    const data = await getData("task/assigned/developer");
    setTasks(data.tasks);
    if (idCmnt !== 0) {
      const value = data.tasks.filter((task: typeTasks) => task.id === idCmnt);
      setCommentsDetails(value[0].comments);
      console.log("value[0].comments:", value);
    }
  };

  const history = useHistory();

  useEffect(() => {
    const getTask = async () => {
      const data = await getData("task/assigned/developer");
      setTasks(data.tasks);
    };
    getTask();

    const pathName = history.location.pathname.split("/");
    setTaskId(pathName[pathName.length - 1]);
  }, [history.location.pathname]);

  const updateTasks = () => {
    getTasks();
  };

  console.log("singleTasks:", tasks);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setValueBox(value);
  };

  const showMOdalHandler = (id: number, title: string) => {
    setId(id);
    setTitle(title);
    setShowModal(true);
  };

  const closeMOdalHandler = () => {
    setId(0);
    setShowModal(false);
  };

  const commentsHandler = (comments: comments[], id: number) => {
    setCommentsModal(true);
    setCommentsDetails(comments);
    setIdCmnt(id);
    setTaskId("");
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("id", JSON.stringify(id));
    console.log("type", "1");
    console.log("Status", valueBox);

    setNotification("pending");

    const connectDB = ConnectToDB("edit/task/web/userDeveloper");

    const fData = new FormData();

    fData.append("task_id", JSON.stringify(id));
    // fData.append("type", "1");
    fData.append("Status", valueBox);

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
    <div className={classes.reports}>
      <div className={classes.allTasks}>
        {tasks.map((task) => (
          <div
            className={
              taskId.replace("msg", "") === `${task.id}`
                ? `${classes.activeTask} ${classes.singleTask}`
                : classes.singleTask
            }
            key={task.id}
          >
            <h4>{task.subject}</h4>
            <p className={classes.text}>{task.Assignment}</p>
            <div className={classes.dates}>
              <p>تاریخ ارسال: {task.delivery_time}</p>
              <p>تاریخ تحویل: {task.due_on}</p>
            </div>
            {task.file.length > 0 && (
              <div className={classes.download}>
                <Button variant="info">
                  <a href={task.file[0].url}>دانلود فایل</a>
                </Button>
              </div>
            )}
            {task.file.length === 0 && (
              <div className={classes.download}>
                <Button variant="danger">
                  <p>بدون فایل</p>
                </Button>
              </div>
            )}
            <div className={classes.status}>
              <RiEditFill
                onClick={() => showMOdalHandler(task.id, task.subject)}
              />
            </div>
            <div
              className={classes.commentIcon}
              onClick={() => commentsHandler(task.comments, task.id)}
            >
              <IoMdChatboxes />
              {taskId === `${task.id}msg` && <h6>جدید</h6>}
            </div>
            <div className={classes.statusText}>
              <p>وضعیت: {task.Status ? task.Status : "مشخص نشده"}</p>
              <p>
                تاییدیه: {task.Verification ? task.Verification : "مشخص نشده"}
              </p>
            </div>
            <div className={classes.adminEmail}>
              <p>فرستنده: {task.admin_task_email}</p>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <Modal>
          <div className={classes.modal}>
            <h3 className="text-center">
              وضعیت پروژه را برای <span>{title}</span> مشخص کنید!
            </h3>

            <Form className="mt-3" onSubmit={submitHandler}>
              <Form.Select
                value={valueBox}
                onChange={changeHandler}
                aria-label="Default select example"
              >
                <option>انتخاب وضعیت ...</option>
                <option value="skipped">Skipped</option>
                <option value="Not Started">Not Started</option>
                <option value="done">Done</option>
                <option value="in Progress">In Progress</option>
              </Form.Select>
              <p className="text-center mt-3">
                {" "}
                وضعیت پروژه: <span>{valueBox}</span>
              </p>
              {valueBox !== "" && (
                <Button
                  variant="success"
                  className="text-center"
                  onClick={submitHandler}
                >
                  تایید
                </Button>
              )}
            </Form>
          </div>
          <RiCloseFill
            className={classes.closeModal}
            onClick={closeMOdalHandler}
          />
        </Modal>
      )}
      {commentsModal && (
        <Modal>
          <div className={classes.modal}>
            <WebComments
              comments={commentsDetails}
              id={idCmnt}
              update={updateTasks}
            />
          </div>
          <RiCloseFill
            className={classes.closeModal}
            onClick={() => setCommentsModal(false)}
          />
        </Modal>
      )}
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </div>
  );
};

export default ReportWebTasks;
