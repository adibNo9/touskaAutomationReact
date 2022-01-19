import axios, { AxiosRequestHeaders } from "axios";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ConnectToDB } from "../../lib/connect-to-db";
import { AutoContext } from "../../store/auto-context";
import { useHistory } from "react-router-dom";
import classes from "./dashboard.module.css";

import { Route } from "react-router-dom";
import Profile from "./profile/Profile";
import { getData } from "../../lib/get-data";
import Users from "./users/Users";
import EditTimeSheet from "./titleandsubtitle/EditTimeSheet";

export interface userType {
  status: string;
  user: {
    email: string;
    name: string | null;
    image_profile: string | undefined;
    role_id: number;
  };
}
const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<userType>({
    status: "",
    user: {
      email: "",
      name: "",
      image_profile: "",
      role_id: 0,
    },
  });

  const userName = userData?.user.name;
  const imageSrc = userData?.user.image_profile;
  const userEmail = userData!.user.email;

  const history = useHistory();

  useEffect(() => {
    const getProfile = async () => {
      const data = await getData("profile");
      setUserData(data);
    };
    getProfile();
    const removeToken = () => {
      if (userData.status === "nothing") {
        localStorage.removeItem("token");
      }
    };
    // removeToken();
  }, []);

  console.log("profile:", userData);

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
        console.log(res);
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
  return (
    <section className={classes.dashboard}>
      <div className={classes.sidebar}>
        <div className={classes.imageUser}>
          <img src={imageSrc} />
        </div>
        <div className={classes.user}>
          <h6> {userName ? userName : userEmail} </h6>
        </div>

        <Link to="/dashboard/profile">پروفایل</Link>

        {userData.user.role_id === 1 && (
          <Link to="/dashboard/users">کاربران</Link>
        )}

        <Link to="/dashboard/edit-timesheet">آپدیت تایم شیت</Link>

        <Link to="/login">تسک‌ها</Link>

        <Link to="/login">تایم شیت</Link>

        <Button variant="danger" onClick={logoutHandler}>
          خروج
        </Button>
      </div>
      <div className={classes.content}>
        <Route path="/dashboard/profile">
          <Profile userData={userData} />
        </Route>
        <Route path="/dashboard/users">
          <Users />
        </Route>
        <Route path="/dashboard/edit-timesheet">
          <EditTimeSheet />
        </Route>
      </div>
    </section>
  );
};

export default Dashboard;
