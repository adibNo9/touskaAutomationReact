import { typeUsersList } from "./AllUsers";
import classes from "./users.module.css";

import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillCloseSquare } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { BsPersonXFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { Fragment, useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import EditUser, { typeRoles } from "./EditUser";
import UserChangePassword from "./UserChangePassword";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios, { AxiosRequestHeaders } from "axios";
import Notification from "../../ui/notification";
import { Col, Row, Button } from "react-bootstrap";
import { getData } from "../../../lib/get-data";

const User: React.FC<{ listUser: typeUsersList; number: number }> = (props) => {
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const [editUser, setEditUser] = useState<boolean>(true);
  const [changePass, setChangePass] = useState<boolean>(false);

  const [showActivate, setShowActivate] = useState<boolean>(false);
  const [roles, setRoles] = useState<typeRoles[]>([]);

  const { listUser, number } = props;
  const createDate = new Date(listUser.created_at).getTime();
  const today = new Date().getTime();
  const calcCreateDate = Math.round((today - createDate) / (1000 * 86400));

  const updateDate = new Date(listUser.updated_at).getTime();
  const calcUpdateDate = Math.round((today - updateDate) / (1000 * 86400));

  let roleName = "";
  useEffect(() => {
    const getRoles = async () => {
      const roleValues = await getData("get/roles");
      setRoles(roleValues.roles);
    };

    getRoles();
  }, []);

  if (roles.length > 0) {
    const roleId = roles.filter((role) => +role.id === +listUser.role_id);
    console.log(roleId);

    if (roleId.length > 0) {
      roleName = roleId[0].name;
    }
  }

  console.log("roleId", roleName);

  const changePassHandler = () => {
    setEditUser(false);
    setChangePass(true);
  };
  const editUserHandler = () => {
    setEditUser(true);
    setChangePass(false);
  };

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const activeHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("superadmin/adtivedeactive/user");

    const fData = new FormData();

    console.log("id", JSON.stringify(listUser.id));
    fData.append("id", JSON.stringify(listUser.id));

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
        if (res.data.status === "success updated") {
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

  if (notification === "success updated") {
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
      <tr>
        <td>{number}</td>
        <td>
          <img src={listUser.image_profile} />
        </td>
        <td>{listUser.name}</td>
        <td>{listUser.email}</td>
        <td>{roleName}</td>
        <td>
          {listUser.is_active === 1 ? (
            <AiFillCheckSquare className={classes.active} />
          ) : (
            <AiFillCloseSquare className={classes.notActive} />
          )}
        </td>
        {calcCreateDate !== 0 && <td>{calcCreateDate} روز گذشته</td>}
        {calcCreateDate === 0 && <td>امروز</td>}
        {calcUpdateDate !== 0 && <td>{calcUpdateDate} روز گذشته</td>}
        {calcUpdateDate === 0 && <td>امروز</td>}
        <AiFillEdit
          className={classes.editUser}
          onClick={() => setShowEdit(true)}
        />
        {listUser.is_active === 1 && (
          <BsPersonXFill
            onClick={() => setShowActivate(true)}
            className={`${classes.deActive} ${classes.changeActivate}`}
          />
        )}
        {listUser.is_active !== 1 && (
          <BsFillPersonCheckFill
            onClick={() => setShowActivate(true)}
            className={`${classes.activeUser} ${classes.changeActivate}`}
          />
        )}
      </tr>
      {showEdit && (
        <Modal>
          <div className={classes.modal}>
            {editUser && (
              <button
                className={classes.btnChanges}
                onClick={changePassHandler}
              >
                {" "}
                تغییر رمز عبور{" "}
              </button>
            )}
            {changePass && (
              <button className={classes.btnChanges} onClick={editUserHandler}>
                تغییر اطلاعات
              </button>
            )}
            {editUser && <EditUser listUser={listUser} />}
            {changePass && <UserChangePassword id={listUser.id} />}
            <MdOutlineClose
              className={classes.closeModal}
              onClick={() => setShowEdit(false)}
            />
          </div>
        </Modal>
      )}
      {showActivate && (
        <Modal>
          <Row className="bg-light p-2">
            <Col className="mb-3 text-center" lg={12}>
              {listUser.is_active === 1 && (
                <p>از غیر فعال کردن {listUser.name} مطمئن هستید ؟</p>
              )}
              {listUser.is_active !== 1 && (
                <p>از فعال کردن {listUser.name} مطمئن هستید ؟</p>
              )}
            </Col>
            <Col lg={5}>
              <Button
                onClick={activeHandler}
                className="w-100"
                variant="success"
              >
                بله
              </Button>
            </Col>
            <Col lg={2}></Col>
            <Col lg={5}>
              <Button
                onClick={() => setShowActivate(false)}
                className="w-100"
                variant="danger"
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

export default User;
