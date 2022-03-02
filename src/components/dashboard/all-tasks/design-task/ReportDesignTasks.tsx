import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getData } from "../../../../lib/get-data";
import classes from "../tasks.module.css";
import { Button, Form } from "react-bootstrap";

import Modal from "../../../ui/Modal";

import { RiEditFill } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { IoMdChatboxes } from "react-icons/io";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import Notification from "../../../ui/notification";
import SeoComments, { comments } from "./DesignComments";

export interface typeTasks {
  Assignment: string;
  Priority: string;
  Status: string;
  Verification: string;
  assignment_id: number;
  comments: comments[];
  delivery_time: string;
  due_on: string;
  file: {
    name: string;
    url: string;
  }[];
  subject: string;
  admin_task_email: {
    email: string;
    name: string;
  };
  assigned_to: null | {
    email: string;
    name: string;
  };
  id: number;
}

const ReportDesignTasks: React.FC<{ userEmail: string }> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [tasks, setTasks] = useState<typeTasks[]>([]);

  const [id, setId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [valueBox, setValueBox] = useState<string>("");
  const [commentsModal, setCommentsModal] = useState<boolean>(false);
  const [commentsDetails, setCommentsDetails] = useState<comments[]>([]);

  const [taskId, setTaskId] = useState<string>("");

  const getTasks = async () => {
    const data = await getData("get/task/design/user");
    setTasks(data.task);
    if (id !== 0) {
      const value = data.task.filter((task: typeTasks) => task.id === id);
      setCommentsDetails(value[0].comments);
    }
  };

  const history = useHistory();

  useEffect(() => {
    const tasksHandler = async () => {
      const data = await getData("get/task/design/user");
      setTasks(data.task);
    };
    tasksHandler();

    const pathName = history.location.pathname.split("/");
    setTaskId(pathName[pathName.length - 1]);
  }, [history.location.pathname]);

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
    setId(id);
    setTaskId("");
  };

  const updateTasks = () => {
    getTasks();
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("edit/task/design/user");

    const fData = new FormData();

    fData.append("task_id", JSON.stringify(id));
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
        if (res.data.status === "done") {
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

  if (notification === "done") {
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
                  <a href={task.file[task.file.length - 1].url}>دانلود فایل</a>
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
            {task.Status !== "done" && (
              <div className={classes.status}>
                <RiEditFill
                  onClick={() => showMOdalHandler(task.id, task.subject)}
                />
              </div>
            )}
            <div
              onClick={() => commentsHandler(task.comments, task.id)}
              className={classes.commentIcon}
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
              <p>
                فرستنده:{" "}
                {task.admin_task_email.name
                  ? task.admin_task_email.name
                  : task.admin_task_email.email}
              </p>
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
                <option>انتخاب اولویت ...</option>
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
            <SeoComments
              comments={commentsDetails}
              userEmail={props.userEmail}
              id={id}
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

export default ReportDesignTasks;
