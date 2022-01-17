import axios, { AxiosRequestHeaders } from "axios";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ConnectToDB } from "../../lib/connect-to-db";
import { AutoContext } from "../../store/auto-context";
import { useNavigate } from "react-router-dom";
import classes from "./dashboard.module.css";

const Dashboard: React.FC = () => {
  const auto_ctx = useContext(AutoContext);

  const navigate = useNavigate();

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
            navigate("/");
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
        <Link to="/login">پروفایل</Link>

        <Link to="/login">درخواست‌ها</Link>

        <Link to="/login">تسک‌ها</Link>

        <Link to="/login">تایم شیت</Link>

        <Button variant="danger" onClick={logoutHandler}>
          خروج
        </Button>
      </div>
    </section>
  );
};

export default Dashboard;
