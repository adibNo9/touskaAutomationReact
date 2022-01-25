import { typeCharts } from "./TimeSheetForm";
import classes from "./timesheet.module.css";
import { MdDeleteOutline } from "react-icons/md";
import React, { Fragment, useState } from "react";
import Modal from "../../ui/Modal";
import { Col, Row, Button } from "react-bootstrap";
import axios, { AxiosRequestHeaders } from "axios";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Notification from "../../ui/notification";

const TimeSheetItems: React.FC<{
  chartValue: typeCharts;
  getSheet: () => void;
}> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();
  const { chartValue } = props;

  const [showModal, setShowModal] = useState<boolean>(false);

  const deleteHandelr = () => {
    console.log("id", chartValue.id);

    setNotification("pending");

    const connectDB = ConnectToDB("delete/sheet");

    const fData = new FormData();

    fData.append("id", `${chartValue.id}`);

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
        if (res.data.status === "success deleted") {
          setNotification(res.data.status);

          setTimeout(() => {
            setNotification("");
            props.getSheet();
            setShowModal(false);
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

  if (notification === "success deleted") {
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
      <div className={classes.displaySheets}>
        <MdDeleteOutline onClick={() => setShowModal(true)} />

        <h6 dir="ltr">
          {chartValue.title} ({chartValue.category}) :{" "}
          <span dir="rtl">{chartValue.spend_time} ساعت</span>
        </h6>
      </div>
      {showModal && (
        <Modal>
          <Row className="bg-light p-4">
            <Col className="text-center" lg={12}>
              <p>
                آیا از حذف {`${chartValue.title} (${chartValue.category})`}{" "}
                مطمئن هستید ؟
              </p>
            </Col>
            <Col lg={6} className="px-2 text-center">
              <Button
                variant="success deleted"
                className="w-100"
                onClick={deleteHandelr}
              >
                بله
              </Button>
            </Col>

            <Col lg={6} className="px-2 text-center">
              <Button
                className="w-100"
                variant="danger"
                onClick={() => setShowModal(false)}
              >
                خیر
              </Button>
            </Col>
          </Row>
        </Modal>
      )}
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

export default TimeSheetItems;
