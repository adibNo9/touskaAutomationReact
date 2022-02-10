import { NavLink, Route } from "react-router-dom";
import { userType } from "../../Dashboard";
import classes from "../tasks.module.css";
import CreateSeoTask from "./CreateSeoTask";
import ReportSeoAdmin from "./ReportSeoAdmin";
import ReportSeoTasks from "./ReportSeoTasks";

const SeoTask: React.FC<{ userData: userType }> = (props) => {
  const { userData } = props;

  return (
    <section className={classes.tasks}>
      <h1>تسک سئو</h1>
      <div className={classes.links}>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-seo/create"
          >
            ایجاد تسک سئو
          </NavLink>
        )}
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-seo/reports"
        >
          تسک‌های شما
        </NavLink>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-seo/admin-reports"
          >
            گزارشات
          </NavLink>
        )}
      </div>
      <div className={classes.content}>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <Route path="/dashboard/task-seo/create">
            <CreateSeoTask />
          </Route>
        )}
        <Route path="/dashboard/task-seo/reports">
          <ReportSeoTasks />
        </Route>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <Route path="/dashboard/task-seo/admin-reports">
            <ReportSeoAdmin />
          </Route>
        )}
      </div>
    </section>
  );
};

export default SeoTask;
