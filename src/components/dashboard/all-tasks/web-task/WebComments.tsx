import { ChangeEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import classes from "../tasks.module.css";

import { BsReplyFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import Notification from "../../../ui/notification";

export interface comments {
  comment: string;
  id: number;
  task_seo_id: string;
  user_id: string;
  rep_comment: null | string;
  user: {
    email: string;
    name: string;
    id: number;
  };
}

const WebComments: React.FC<{
  comments: comments[];
  userEmail: string;
  id: number;
  update: () => void;
}> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [commentVal, setCommentVal] = useState<string>("");

  const [selectedReply, setSelectedReply] = useState("");
  const [replyId, setReplyId] = useState<number>(0);

  const commentChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setCommentVal(value);
  };

  const replySelectedHandler = (id: number, value: string) => {
    setReplyId(id);
    setSelectedReply(value);
  };

  const closeReplyHandler = () => {
    setCommentVal("");
    setReplyId(0);
    setSelectedReply("");
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
            setCommentVal("");
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

  let formValidate = false;

  if (commentVal !== "") {
    formValidate = true;
  }

  const replySubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("create/comment");

    const fData = new FormData();

    fData.append("type", "2");
    fData.append("task_id", JSON.stringify(props.id));
    fData.append("comment", commentVal);
    replyId !== 0 && fData.append("reply_to", JSON.stringify(replyId));

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
            setCommentVal("");
            setSelectedReply("");
            setReplyId(0);
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
      <div className={classes.comment}>
        {props.comments.map((comment) => (
          <div
            className={
              comment.user.email === props.userEmail
                ? classes.txtComment
                : `${classes.txtComment} ${classes.replyTxt}`
            }
            key={comment.id}
          >
            {comment.rep_comment && (
              <p className={classes.replyTo}>{comment.rep_comment}</p>
            )}
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
            {comment.user.email === props.userEmail &&
              comment.comment !== "این پیام پاک شده است" && (
                <div
                  className={classes.delCmnt}
                  onClick={() => deleteHandler(comment.id)}
                >
                  <MdOutlineDelete />
                </div>
              )}
          </div>
        ))}
        <Form className={classes.replyForm} onSubmit={replySubmitHandler}>
          <Form.Group
            className={classes.formGroupCmnt}
            controlId="formBasicAssignment"
          >
            {selectedReply !== "" && <p>{selectedReply}</p>}
            {selectedReply === "" && (
              <p className={classes.errorReply}>
                لطفا یک دیدگاه را انتخاب کنید!
              </p>
            )}
            <Form.Control
              type="text"
              as="textarea"
              rows={1}
              placeholder="دیدگاه"
              value={commentVal}
              onChange={commentChangeHandelr}
            />
          </Form.Group>
          <Button
            disabled={!formValidate}
            variant="success"
            onClick={replySubmitHandler}
          >
            ارسال
          </Button>
        </Form>
      </div>

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
