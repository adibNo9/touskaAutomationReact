import { useState } from "react";
import Modal from "../../ui/Modal";
import classes from "./edit.module.css";
import { typeListTitles, typeSubtitles } from "./EditTimeSheet";

import { AiFillDelete } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { Col, Form, Row, Button } from "react-bootstrap";
import Notification from "../../ui/notification";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";

import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillCloseSquare } from "react-icons/ai";

const SingleTitle: React.FC<{
  value: typeListTitles;
  subtitles: typeSubtitles[];
}> = (props) => {
  const { value, subtitles } = props;
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const oldSubNames = value.subtitles.map((sub) => `${sub.id}.${sub.name}`);
  const oldSubIds = value.subtitles.map((sub) => `${sub.id}`);

  const [nameSubsOld, setNameSubsOld] = useState<string[]>(oldSubNames);
  const [removeSubsOld, setRemoveSubsOld] = useState<string[]>([]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [valueBox, setValueBox] = useState<string[]>([]);
  const [typeValue, setTypeValue] = useState<string[]>([]);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value.split(".");

    if (
      !typeValue.includes(`${+val[0]}`) &&
      !oldSubIds.includes(`${+val[0]}`)
    ) {
      setTypeValue([...typeValue, `${+val[0]}`]);
    }

    if (!valueBox.includes(value) && !oldSubNames.includes(value)) {
      setValueBox([...valueBox, value]);
    }
  };

  const deleteHandler = (del: any) => {
    const valTitle = valueBox.filter((item) => item !== del);
    setValueBox(valTitle);
    const delSplit = del.split(".");

    const valTypes = typeValue.filter((item) => item !== delSplit[0]);
    setTypeValue(valTypes);
    console.log(del, typeValue);
  };

  const removeHandler = (sub: any) => {
    if (!removeSubsOld.includes(sub)) {
      const val = sub.split(".");
      setRemoveSubsOld([...removeSubsOld, `${val[0]}`]);
    }
    const values = nameSubsOld.filter((item) => item !== sub);
    setNameSubsOld(values);
  };

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const removedVal = removeSubsOld.filter((item) => item !== "");

    setNotification("pending");

    const connectDB = ConnectToDB("update/title");

    const fData = new FormData();
    fData.append("id", `${value.id}`);
    fData.append("sub_ids_add", JSON.stringify(typeValue));
    fData.append("sub_ids_remove", JSON.stringify(removedVal));

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

  const activateHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("title/activeOrdeactive");

    const fData = new FormData();
    fData.append("id", `${value.id}`);

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
    <div
      className={
        value.is_active === null
          ? `${classes.singleTitle}`
          : `${classes.singleTitle} ${classes.deactiveTitle}`
      }
    >
      <h6>
        <span>#</span>
        {value.id}
      </h6>
      <h2>{value.title}</h2>
      <div
        onClick={() => setShowModal(true)}
        className={classes.changeActivate}
      >
        {value.is_active !== null && (
          <AiFillCheckSquare className={classes.checkIcon} />
        )}
        {value.is_active === null && (
          <AiFillCloseSquare className={classes.closeIcon} />
        )}
      </div>
      <button onClick={() => setOpenModal(true)}>زیر مجموعه‌ها</button>
      {openModal && (
        <Modal>
          <Form onSubmit={submitHandler} className={classes.modal}>
            <Form.Group
              className={classes.formGroup}
              controlId="formBasicEmail"
            >
              <Form.Label>عنوان‌ها</Form.Label>
              <Form.Select
                value={valueBox}
                onChange={changeHandler}
                aria-label="Default select example"
              >
                <option>انتخاب عنوان ...</option>
                {subtitles.map((item) => (
                  <option key={item.id} value={`${item.id}.${item.name}`}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {nameSubsOld.map((sub, index) => (
              <div key={index} className={classes.subs}>
                <div className={classes.selectedSingleTitle}>
                  <h6>{sub}</h6>
                  <AiFillDelete onClick={() => removeHandler(sub)} />
                </div>
              </div>
            ))}
            {valueBox.map((sub) => (
              <div key={sub} className={classes.subs}>
                <div className={classes.selectedSingleTitle}>
                  <h6>{sub}</h6>
                  <AiFillDelete onClick={() => deleteHandler(sub)} />
                </div>
              </div>
            ))}
            <div className={classes.actions}>
              <button>تایید</button>
            </div>
          </Form>
          <MdClose
            className={classes.closeModal}
            onClick={() => setOpenModal(false)}
          />
        </Modal>
      )}
      {showModal && (
        <Modal>
          <Row dir="rtl" className="mt-5 bg-light p-3">
            <Col lg={12}>
              {value.is_active === null && (
                <p className="text-center">
                  آیا از غیر فعال کردن {value.title} مطمئن هستید ؟
                </p>
              )}
              {value.is_active !== null && (
                <p className="text-center">
                  آیا از فعال کردن {value.title} مطمئن هستید ؟
                </p>
              )}
            </Col>
            <Col lg={6}>
              <Button
                className="text-center w-100"
                variant="success"
                onClick={activateHandler}
              >
                بله
              </Button>
            </Col>
            <Col lg={6}>
              <Button
                className="text-center w-100"
                variant="danger"
                onClick={() => setShowModal(false)}
              >
                خیر
              </Button>
            </Col>
          </Row>
          <MdClose
            className={classes.closeModal}
            onClick={() => setShowModal(false)}
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

export default SingleTitle;
