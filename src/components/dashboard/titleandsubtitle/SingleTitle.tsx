import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import classes from "./edit.module.css";
import { typeListTitles, typeSubtitles } from "./EditTimeSheet";

import { AiFillDelete } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { Form } from "react-bootstrap";
import Notification from "../../ui/notification";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";

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
  const [valueBox, setValueBox] = useState<string[]>([]);
  const [typeValue, setTypeValue] = useState<string[]>([]);

  const [deleteVal, setDeleteVal] = useState<string>("");
  const [removeVal, setRemoveVal] = useState<string>("");

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

    console.log("valueBox", valueBox);
  };

  useEffect(() => {
    const deleteHandler = () => {
      const valTitle = valueBox.filter((item) => item !== deleteVal);
      setValueBox(valTitle);
      deleteVal.split(".");

      const valTypes = typeValue.filter((item) => item !== deleteVal[0]);
      setTypeValue(valTypes);
    };

    deleteHandler();
  }, [deleteVal]);

  useEffect(() => {
    const removeHandler = () => {
      if (!removeSubsOld.includes(removeVal)) {
        const val = removeVal.split(".");
        setRemoveSubsOld([...removeSubsOld, `${val[0]}`]);
      }
      const values = nameSubsOld.filter((item) => item !== removeVal);
      setNameSubsOld(values);
    };

    removeHandler();
    console.log("removeSubsOld", removeSubsOld);
  }, [removeVal]);

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const removedVal = removeSubsOld.filter((item) => item !== "");
    console.log("id", value.id);
    console.log("sub_ids_add", JSON.stringify(typeValue));
    console.log("sub_ids_remove", JSON.stringify(removedVal));

    setNotification("pending");

    const connectDB = ConnectToDB("update/title");

    const fData = new FormData();
    fData.append("id", `${value.id}`);
    fData.append("sub_ids_add", JSON.stringify(typeValue));
    fData.append("sub_ids_remove", JSON.stringify(removeSubsOld));

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
        if (res.data.status === "success created") {
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

  if (notification === "success created") {
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
    <div className={classes.singleTitle}>
      <h6>
        <span>#</span>
        {value.id}
      </h6>
      <h2>{value.title}</h2>
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
                  <AiFillDelete onClick={() => setRemoveVal(sub)} />
                </div>
              </div>
            ))}
            {valueBox.map((sub) => (
              <div key={sub} className={classes.subs}>
                <div className={classes.selectedSingleTitle}>
                  <h6>{sub}</h6>
                  <AiFillDelete onClick={() => setDeleteVal(sub)} />
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
