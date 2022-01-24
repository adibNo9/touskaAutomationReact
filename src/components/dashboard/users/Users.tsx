import { useState } from "react";
import AddUser from "./AddUser";
import AllUsers from "./AllUsers";
import classes from "./users.module.css";

const Users = () => {
  const [showUsers, setShowUsers] = useState<boolean>(true);
  const [showAddUsers, setShowAddUsers] = useState<boolean>(false);

  const showUsersHandler = () => {
    setShowAddUsers(false);
    setShowUsers(true);
  };

  const showAddUserHandler = () => {
    setShowAddUsers(true);
    setShowUsers(false);
  };

  return (
    <section className={classes.usersPage}>
      <h1>کاربران</h1>
      <div className={classes.links}>
        <button
          onClick={showUsersHandler}
          className={showUsers ? classes.active : classes.noActive}
        >
          مشاهده کاربران
        </button>
        <button
          onClick={showAddUserHandler}
          className={showAddUsers ? classes.active : classes.noActive}
        >
          اضافه کردن کاربر جدید
        </button>
      </div>
      {showUsers && <AllUsers />}
      {showAddUsers && <AddUser />}
    </section>
  );
};

export default Users;
