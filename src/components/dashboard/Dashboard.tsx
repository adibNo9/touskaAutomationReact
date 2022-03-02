import React, { Suspense } from "react";

import axios, { AxiosRequestHeaders } from "axios";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ConnectToDB } from "../../lib/connect-to-db";
import { useHistory } from "react-router-dom";
import classes from "./dashboard.module.css";

import { Route } from "react-router-dom";
import { getData } from "../../lib/get-data";
import Users from "./users/Users";
import EditTimeSheet from "./titleandsubtitle/EditTimeSheet";

import LoadingSpinner from "../ui/LoadingSpinner";

import { CgMenuGridR } from "react-icons/cg";
import { CgClose } from "react-icons/cg";

import { RiNotification3Line } from "react-icons/ri";
import DesignTask from "./all-tasks/design-task/DesignTask";

const Profile = React.lazy(() => import("./profile/Profile"));
const TimeSheet = React.lazy(() => import("./timesheet/TimeSheet"));
const Reports = React.lazy(() => import("./users-reports/Reports"));
const SeoTask = React.lazy(() => import("./all-tasks/seo-task/SeoTask"));
const WebTask = React.lazy(() => import("./all-tasks/web-task/WebTask"));

export interface userType {
  status: string;
  user: {
    email: string;
    name: string | null;
    image_profile: string | undefined;
    role_id: string;
    is_master: null | string;
    id: number;
  };
}

export interface typeNotif {
  notif_data: {
    task_from: string;
    task_id: number;
    task_title: number;
    task_type: string;
  };
  notif_id: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<userType>({
    status: "",
    user: {
      email: "",
      name: "",
      image_profile: "",
      role_id: "0",
      is_master: null,
      id: 0,
    },
  });

  const history = useHistory();

  const [notification, setNotification] = useState<typeNotif[]>([]);
  const [showNotifs, setShowNotifs] = useState<boolean>(false);
  const [taskId, setTaskId] = useState("");

  const [showMenu, setshowMenu] = useState<boolean>(window.outerWidth > 980);
  const [location, setLocation] = useState<string>(history.location.pathname);

  const width = window.outerWidth;

  const userName = userData?.user.name;
  const imageSrc = userData?.user.image_profile;
  const userEmail = userData!.user.email;

  useEffect(() => {
    const getProfile = async () => {
      const data = await getData("profile");
      if (data.status === 500) {
        localStorage.removeItem("token");
      }
      setUserData(data);
    };
    getProfile();

    const getNotification = async () => {
      const data = await getData("user/notification");
      setNotification(data.tasks);
    };
    getNotification();
  }, [taskId, history]);

  const logoutHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const connectDB = ConnectToDB("logout");

    const headers: AxiosRequestHeaders = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
    })
      .then((res) => {
        if (res.data.token === "Token deleted") {
          localStorage.removeItem("token");

          setTimeout(() => {
            history.replace("/login");
            window.location.reload();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
      });
  };

  const notifHandler = (id: string, IdOfTask: number, typeTask: string) => {
    setTaskId(id);

    const connectDB = ConnectToDB("read/notif/user");

    const headers: AxiosRequestHeaders = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    const fData = new FormData();

    fData.append("id", id);

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        if (res.data.status === "success") {
          setTaskId("");
          localStorage.setItem("taskId", `${IdOfTask}`);
          if (
            typeTask === "seo_created" ||
            typeTask === "seo_delete" ||
            typeTask === "seo_task_done"
          ) {
            history.push(`/dashboard/task-seo/reports/${IdOfTask}`);
          }
          if (typeTask === "web_superadmin") {
            history.push(`/dashboard/task-web/admin-reports/${IdOfTask}`);
          }
          if (
            typeTask === "admin_accept_task" ||
            typeTask === "admin_reject_task" ||
            (typeTask === "developer_task_done" &&
              userData.user.role_id !== "3")
          ) {
            history.push(`/dashboard/task-web/tasks-reports/${IdOfTask}`);
          }
          if (
            typeTask === "developeradmin_accept_task" ||
            (typeTask === "developer_task_done" &&
              userData.user.role_id === "3")
          ) {
            history.push(`/dashboard/task-web/developer-reports/${IdOfTask}`);
          }
          if (typeTask === "developer_task_assign") {
            history.push(`/dashboard/task-web/reports/${IdOfTask}`);
          }
          if (typeTask === "seo_comment_user") {
            history.push(`/dashboard/task-seo/reports/${IdOfTask}msg`);
          }
          if (typeTask === "seo_comment_admin") {
            history.push(`/dashboard/task-seo/admin-reports/${IdOfTask}msg`);
          }
          if (typeTask === "web_comment_user") {
            history.push(`/dashboard/task-web/reports/${IdOfTask}msg`);
          }
          if (typeTask === "web_comment_admin") {
            history.push(`/dashboard/task-web/admin-reports/${IdOfTask}msg`);
          }
          if (
            typeTask === "web_comment_admin" &&
            userData.user.role_id !== "1"
          ) {
            history.push(`/dashboard/task-web/tasks-reports/${IdOfTask}msg`);
          }

          if (typeTask === "design_superadmin") {
            history.push(`/dashboard/task-design/admin-reports/${IdOfTask}`);
          }

          if (typeTask === "design_accept_task") {
            history.push(`/dashboard/task-design/reports/${IdOfTask}`);
          }

          if (typeTask === "designer_task_accepted") {
            history.push(`/dashboard/task-design/admin-reports/${IdOfTask}`);
          }

          if (typeTask === "designer_task_done") {
            history.push(`/dashboard/task-design/admin-reports/${IdOfTask}`);
          }

          setShowNotifs(false);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
      });
  };

  let sidebarClasses = `${classes.sidebar}`;

  const mobileMenuHandler = () => {
    setshowMenu(!showMenu);
  };

  return (
    <section className={classes.dashboard}>
      {width < 980 && location !== "/dashboard" && (
        <div className={classes.burgerMenu}>
          <CgMenuGridR onClick={mobileMenuHandler} />
        </div>
      )}

      <div className={classes.notifications}>
        <div
          className={classes.notifDing}
          onClick={() => setShowNotifs(!showNotifs)}
        >
          <RiNotification3Line className={classes.notif} />
          <span>{notification.length}</span>
        </div>
        {showNotifs && (
          <div className={classes.notifContent}>
            {notification.map((notif) => (
              <div
                key={notif.notif_id}
                className={classes.singleNotif}
                onClick={() =>
                  notifHandler(
                    notif.notif_id,
                    notif.notif_data.task_id,
                    notif.notif_data.task_type
                  )
                }
              >
                {notif.notif_data.task_type === "seo_created" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    تسک سئوی جدید برای شما
                  </Alert>
                )}
                {notif.notif_data.task_type === "seo_task_done" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    تسک سئوی مورد نظر با موفقیت انجام شده است!
                  </Alert>
                )}
                {notif.notif_data.task_type === "seo_delete" && (
                  <Alert
                    className={`${classes.alertNotifDanger} ${classes.alertNotif}`}
                  >
                    این تسک سئو برای شما حذف شده است
                  </Alert>
                )}
                {notif.notif_data.task_type === "web_superadmin" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک تسک وب در انتظار تایید شما
                  </Alert>
                )}
                {notif.notif_data.task_type ===
                  "developeradmin_accept_task" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک تسک وب تاییدی در انتظار بررسی
                  </Alert>
                )}
                {notif.notif_data.task_type === "admin_accept_task" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    تسک وب درخواستی شما مورد موافقت قرار گرفت!
                  </Alert>
                )}
                {notif.notif_data.task_type === "admin_reject_task" && (
                  <Alert
                    className={`${classes.alertNotifDanger} ${classes.alertNotif}`}
                  >
                    تسک وب درخواستی شما رد شده است!
                  </Alert>
                )}
                {notif.notif_data.task_type === "developer_task_assign" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک تسک وب برای شما ارسال شده است!
                  </Alert>
                )}
                {notif.notif_data.task_type === "developer_task_done" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    تسک وب مورد نظر با موفقیت انجام شد!
                  </Alert>
                )}
                {notif.notif_data.task_type === "web_comment_user" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک پیام جدید برای تسک وب مورد نظر دارید!
                  </Alert>
                )}
                {notif.notif_data.task_type === "web_comment_admin" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک پیام جدید برای تسک وب مورد نظر دارید!
                  </Alert>
                )}
                {notif.notif_data.task_type === "seo_comment_user" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک پیام جدید برای تسک سئو مورد نظر دارید!
                  </Alert>
                )}
                {notif.notif_data.task_type === "seo_comment_admin" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک پیام جدید برای تسک سئو مورد نظر دارید!
                  </Alert>
                )}

                {notif.notif_data.task_type === "design_superadmin" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک تسک دیزاین در انتظار تایید شما
                  </Alert>
                )}
                {notif.notif_data.task_type === "designer_task_accepted" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    تسک دیزاین درخواستی شما مورد موافقت قرار گرفت!
                  </Alert>
                )}
                {notif.notif_data.task_type === "admin_reject_task_design" && (
                  <Alert
                    className={`${classes.alertNotifDanger} ${classes.alertNotif}`}
                  >
                    تسک دیزاین درخواستی شما رد شده است!
                  </Alert>
                )}
                {notif.notif_data.task_type === "design_accept_task" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    یک تسک دیزاین برای شما ارسال شده است!
                  </Alert>
                )}
                {notif.notif_data.task_type === "designer_task_done" && (
                  <Alert
                    className={`${classes.alertNotifSuccess} ${classes.alertNotif}`}
                  >
                    تسک دیزاین مورد نظر با موفقیت انجام شد!
                  </Alert>
                )}
                <h5>{notif.notif_data.task_title}</h5>
                <p>فرستنده: {notif.notif_data.task_from}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showMenu && (
        <div className={sidebarClasses}>
          {width < 980 && (
            <CgClose
              className={classes.closeMenu}
              onClick={() => setshowMenu(false)}
            />
          )}
          <div className={classes.imageUser}>
            <img src={imageSrc} alt={userName ? userName : userEmail} />
          </div>
          <div className={classes.user}>
            <h6> {userName ? userName : userEmail} </h6>
          </div>

          <NavLink
            activeClassName={classes.activeLink}
            to="/dashboard/profile"
            onClick={
              width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
            }
          >
            پروفایل
          </NavLink>

          {userData.user.role_id === "1" && (
            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/users"
              onClick={
                width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
              }
            >
              کاربران
            </NavLink>
          )}

          {userData.user.role_id === "1" && (
            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/edit-timesheet"
              onClick={
                width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
              }
            >
              آپدیت تایم شیت
            </NavLink>
          )}

          <NavLink
            activeClassName={classes.activeLink}
            to="/dashboard/timesheet"
            onClick={
              width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
            }
          >
            تایم شیت
          </NavLink>

          {userData.user.role_id === "1" && (
            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/reports"
              onClick={
                width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
              }
            >
              گزارشات
            </NavLink>
          )}

          {userData.user.role_id !== "3" && (
            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/task-seo"
              onClick={
                width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
              }
            >
              تسک سئو
            </NavLink>
          )}

          {(userData.user.role_id === "1" ||
            userData.user.role_id === "2" ||
            userData.user.role_id === "3") && (
            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/task-web"
              onClick={
                width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
              }
            >
              تسک وب
            </NavLink>
          )}

          {(userData.user.role_id === "1" ||
            userData.user.role_id === "2" ||
            userData.user.role_id === "3") && (
            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/task-design"
              onClick={
                width < 980 ? () => setshowMenu(false) : () => setshowMenu(true)
              }
            >
              تسک دیزاین
            </NavLink>
          )}

          <Button variant="danger" onClick={logoutHandler}>
            خروج
          </Button>
        </div>
      )}
      <div className={classes.content}>
        {location === "/dashboard" && width < 980 && (
          <div className={classes.linkInContent}>
            <div className={classes.imageUser}>
              <img src={imageSrc} alt={userName ? userName : userEmail} />
            </div>

            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/profile"
              onClick={() => setLocation("profile")}
            >
              پروفایل
            </NavLink>

            {userData.user.role_id === "1" && (
              <NavLink
                activeClassName={classes.activeLink}
                to="/dashboard/users"
                onClick={() => setLocation("users")}
              >
                کاربران
              </NavLink>
            )}

            {userData.user.role_id === "1" && (
              <NavLink
                activeClassName={classes.activeLink}
                to="/dashboard/edit-timesheet"
                onClick={() => setLocation("edit-timesheet")}
              >
                آپدیت تایم شیت
              </NavLink>
            )}

            <NavLink
              activeClassName={classes.activeLink}
              to="/dashboard/timesheet"
              onClick={() => setLocation("timesheet")}
            >
              تایم شیت
            </NavLink>

            {userData.user.role_id === "1" && (
              <NavLink
                activeClassName={classes.activeLink}
                to="/dashboard/reports"
                onClick={() => setLocation("reports")}
              >
                گزارشات
              </NavLink>
            )}

            {userData.user.role_id !== "3" && (
              <NavLink
                activeClassName={classes.activeLink}
                to="/dashboard/task-seo"
                onClick={() => setLocation("task-seo")}
              >
                تسک سئو
              </NavLink>
            )}

            {(userData.user.role_id === "1" ||
              userData.user.role_id === "2" ||
              userData.user.role_id === "3") && (
              <NavLink
                activeClassName={classes.activeLink}
                to="/dashboard/task-web"
                onClick={() => setLocation("task-web")}
              >
                تسک وب
              </NavLink>
            )}

            {(userData.user.role_id === "1" ||
              userData.user.role_id === "2" ||
              userData.user.role_id === "3") && (
              <NavLink
                activeClassName={classes.activeLink}
                to="/dashboard/task-design"
                onClick={() => setLocation("task-design")}
              >
                تسک دیزاین
              </NavLink>
            )}
          </div>
        )}
        <Suspense
          fallback={
            <div className="spinner">
              <LoadingSpinner />
            </div>
          }
        >
          <Route path="/dashboard/profile">
            <Profile userData={userData} />
          </Route>
          {userData.user.role_id === "1" && (
            <Route path="/dashboard/users">
              <Users />
            </Route>
          )}
          {userData.user.role_id === "1" && (
            <Route path="/dashboard/edit-timesheet">
              <EditTimeSheet />
            </Route>
          )}
          <Route path="/dashboard/timesheet">
            <TimeSheet />
          </Route>
          {userData.user.role_id === "1" && (
            <Route path="/dashboard/reports">
              <Reports />
            </Route>
          )}
          {userData.user.role_id !== "3" && (
            <Route path="/dashboard/task-seo">
              <SeoTask userData={userData} />
            </Route>
          )}
          {(userData.user.role_id === "1" ||
            userData.user.role_id === "2" ||
            userData.user.role_id === "3") && (
            <Route path="/dashboard/task-web">
              <WebTask userData={userData} />
            </Route>
          )}
          {(userData.user.role_id === "1" ||
            userData.user.role_id === "2" ||
            userData.user.role_id === "3") && (
            <Route path="/dashboard/task-design">
              <DesignTask userData={userData} />
            </Route>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default Dashboard;
