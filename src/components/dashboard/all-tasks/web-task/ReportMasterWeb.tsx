import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getData } from "../../../../lib/get-data";
import classes from "../tasks.module.css";
import { Button, Col, Row } from "react-bootstrap";

import Modal from "../../../ui/Modal";

import { RiEditFill } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { typeTasks } from "./ReportWebTasks";
import axios, { AxiosRequestHeaders } from "axios";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import Notification from "../../../ui/notification";
import UpdateTaskDeveloper from "./UpdateTaskDeveloper";
import { typeWebTasks } from "./ReportWebAdmin";

const ReportMasterWeb: React.FC = () => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();
  const [tasks, setTasks] = useState<typeTasks[]>([]);

  const [id, setId] = useState<number>(0);
  const [delId, setDelId] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<typeWebTasks>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [delModal, setDelModal] = useState<boolean>(false);

  const [taskWeb, setTaskWeb] = useState<typeWebTasks[]>([]);

  const getTaskWeb = async () => {
    const data = await getData("assigned/task/all/accepted");
    setTaskWeb(data.tasks);
  };

  useEffect(() => {
    getTaskWeb();
  }, []);

  console.log("taskWeb:", taskWeb);
  const history = useHistory();
  const pathName = history.location.pathname.split("/");
  const taskId = pathName[pathName.length - 1];

  console.log("tasks", tasks);

  const showMOdalHandler = (task: typeWebTasks) => {
    console.log(task);
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeMOdalHandler = () => {
    setId(0);
    setShowModal(false);
  };

  const delIdHandler = (id: number) => {
    setDelId(id);
    setDelModal(true);
  };

  const deleteHandler = () => {
    setNotification("pending");

    const connectDB = ConnectToDB("delete/tasks/Assigned");

    const fData = new FormData();
    fData.append("id", JSON.stringify(delId));

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
            // window.location.reload();
            getTaskWeb();
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
        {taskWeb.map((task) => (
          <div
            className={
              `${task.id}` === taskId
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
            <div className={classes.status}>
              <RiEditFill onClick={() => showMOdalHandler(task)} />
            </div>
            <div className={classes.statusText}>
              <p>وضعیت: {task.Status ? task.Status : "مشخص نشده"}</p>
              <p>
                تاییدیه: {task.Verification ? task.Verification : "مشخص نشده"}
              </p>
            </div>
            <div className={classes.adminEmail}>
              <p>گیرنده: {task.assigned_to}</p>
            </div>
            <MdDelete
              className={classes.delete}
              onClick={() => delIdHandler(task.id)}
            />
          </div>
        ))}
      </div>
      {delModal && (
        <Modal>
          <Row className="bg-light p-2" dir="ltr">
            <Col className="text-center mb-2" dir="ltr" lg={12}>
              Are you sure ?
            </Col>
            <Col lg={6}>
              <Button
                className="w-100"
                variant="success"
                onClick={deleteHandler}
              >
                Yes
              </Button>
            </Col>
            <Col lg={6}>
              <Button
                className="w-100"
                variant="danger"
                onClick={() => setDelModal(false)}
              >
                No
              </Button>
            </Col>
          </Row>
        </Modal>
      )}
      {showModal && (
        <Modal>
          <div className={classes.modal}>
            <UpdateTaskDeveloper value={selectedTask} />
          </div>
          <RiCloseFill
            className={classes.closeModal}
            onClick={closeMOdalHandler}
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

export default ReportMasterWeb;
