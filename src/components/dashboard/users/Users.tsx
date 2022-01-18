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
        <button onClick={showUsersHandler}>همه کاربران</button>
        <button onClick={showAddUserHandler}>اضافه کردن کاربر جدید</button>
      </div>
      {showUsers && <AllUsers />}
      {showAddUsers && <AddUser />}
    </section>
  );
};

export default Users;
