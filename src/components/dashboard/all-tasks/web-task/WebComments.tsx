import { ChangeEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import classes from "../tasks.module.css";

import { RiAddBoxFill } from "react-icons/ri";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import Notification from "../../../ui/notification";
import WebReplies from "./WebReplies";

export interface comments {
  comment: string;
  id: number;
  task_seo_id: string;
  user_id: string;
  user: {
    email: string;
    name: string;
    id: number;
  };
  rep: {
    comment: string;
    reply_to: string;
    rep_comment: string;
    id: number;
    user: {
      email: string;
      name: string;
      id: number;
    };
  }[];
}

const WebComments: React.FC<{
  comments: comments[];
  id: number;
  update: () => void;
}> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [commentVal, setCommentVal] = useState<string>("");
  const [newCmnt, setNewCmnt] = useState<boolean>(false);

  const commentChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setCommentVal(value);
  };

  let formValidate = false;

  if (commentVal !== "") {
    formValidate = true;
  }

  let webReplies = [];

  for (let i = 0; i < props.comments.length; i++) {
    webReplies[i] = (
      <WebReplies
        comments={props.comments[i]}
        id={props.id}
        update={props.update}
      />
    );
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("create/comment");

    const fData = new FormData();

    fData.append("type", "2");
    fData.append("task_id", JSON.stringify(props.id));
    fData.append("comment", commentVal);

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

          props.update();
          setTimeout(() => {
            setNotification("");
            setCommentVal("");
            setNewCmnt(false);
          }, 500);
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
    <div className={classes.comments}>
      <div className={classes.oldComments}>
        {props.comments.length > 0 && webReplies}
      </div>
      <RiAddBoxFill
        className={classes.btnCmnt}
        onClick={() => setNewCmnt(!newCmnt)}
      />
      {newCmnt && (
        <Form className={classes.newComment} onSubmit={submitHandler}>
          <Form.Group
            className={classes.formGroupCmnt}
            controlId="formBasicAssignment"
          >
            <Form.Label>ایجاد دیدگاه جدید</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows={5}
              placeholder="دیدگاه"
              value={commentVal}
              onChange={commentChangeHandelr}
            />
          </Form.Group>
          <Button
            disabled={!formValidate}
            variant="success"
            onClick={submitHandler}
          >
            تایید و ارسال
          </Button>
        </Form>
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

export default WebComments;
