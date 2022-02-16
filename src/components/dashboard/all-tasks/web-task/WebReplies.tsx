import { comments } from "./WebComments";
import classes from "../tasks.module.css";

import { BsReplyFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { ChangeEvent, useState } from "react";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import { Form, Button } from "react-bootstrap";
import Notification from "../../../ui/notification";
import { MdOutlineDelete } from "react-icons/md";

const WebReplies: React.FC<{
  comments: comments;
  id: number;
  update: () => void;
}> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();
  const { comments } = props;

  const [replyId, setReplyId] = useState<number>(0);
  const [replyVal, setReplyVal] = useState<string>("");

  const [selectedReply, setSelectedReply] = useState("");

  const replyChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setReplyVal(value);
  };

  const replySelectedHandler = (id: number, value: string) => {
    setReplyId(id);
    setSelectedReply(value);
  };

  const closeReplyHandler = () => {
    setReplyVal("");
    setReplyId(0);
    setSelectedReply("");
  };

  let replyFormValidate = false;

  if (replyVal !== "") {
    replyFormValidate = true;
  }

  const replySubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("create/comment");

    const fData = new FormData();

    fData.append("type", "2");
    fData.append("task_id", JSON.stringify(props.id));
    fData.append("comment", replyVal);
    fData.append("reply_to", JSON.stringify(replyId));

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
          props.update();
          setTimeout(() => {
            setNotification("");
            setReplyVal("");
            setReplyId(0);
            setSelectedReply("");
          }, 500);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
        setNotification("error");
        setdataError(err.response.data.user);
      });
  };

  const deleteHandler = (idDel: number) => {
    setNotification("pending");

    const connectDB = ConnectToDB("delete/comment");

    const fData = new FormData();

    fData.append("comment_id", JSON.stringify(idDel));

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
          props.update();
          setTimeout(() => {
            setNotification("");
            setReplyVal("");
            setReplyId(0);
            setSelectedReply("");
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
    <div className={classes.comment}>
      <div className={classes.chat}>
        <div className={classes.txtComment}>
          <p className={classes.userChat}>
            {comments.user.name ? comments.user.name : comments.user.email}
          </p>
          <p className={classes.txtChat}>{comments.comment}</p>
          {replyId !== comments.id && (
            <div
              className={classes.reply}
              onClick={() =>
                replySelectedHandler(comments.id, comments.comment)
              }
            >
              <BsReplyFill />
            </div>
          )}
          {replyId === comments.id && (
            <div className={classes.close} onClick={closeReplyHandler}>
              <AiOutlineClose />
            </div>
          )}
          <div
            className={classes.delCmnt}
            onClick={() => deleteHandler(comments.id)}
          >
            <MdOutlineDelete />
          </div>
        </div>

        {comments.rep.map((comment) => (
          <div
            className={
              comment.user.id === comments.user.id
                ? classes.txtComment
                : `${classes.txtComment} ${classes.replyTxt}`
            }
            key={comment.id}
          >
            <p className={classes.replyTo}>{comment.rep_comment}</p>
            <p className={classes.userChat}>
              {comment.user.name ? comment.user.name : comment.user.email}
            </p>
            <p className={classes.txtChat}>{comment.comment}</p>
            {replyId !== comment.id && (
              <div
                className={classes.reply}
                onClick={() =>
                  replySelectedHandler(comment.id, comment.comment)
                }
              >
                <BsReplyFill />
              </div>
            )}
            {replyId === comment.id && (
              <div className={classes.close} onClick={closeReplyHandler}>
                <AiOutlineClose />
              </div>
            )}
            <div
              className={classes.delCmnt}
              onClick={() => deleteHandler(comment.id)}
            >
              <MdOutlineDelete />
            </div>
          </div>
        ))}
      </div>

      <Form className={classes.replyForm} onSubmit={replySubmitHandler}>
        <Form.Group
          className={classes.formGroupCmnt}
          controlId="formBasicAssignment"
        >
          {selectedReply !== "" && <p>{selectedReply}</p>}
          {selectedReply === "" && (
            <p className={classes.errorReply}>لطفا یک دیدگاه را انتخاب کنید!</p>
          )}
          <Form.Control
            type="text"
            as="textarea"
            rows={1}
            placeholder="دیدگاه"
            value={replyVal}
            onChange={replyChangeHandelr}
            disabled={replyId === 0}
          />
        </Form.Group>
        <Button
          disabled={!replyFormValidate}
          variant="success"
          onClick={replySubmitHandler}
        >
          ارسال
        </Button>
      </Form>
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

export default WebReplies;
