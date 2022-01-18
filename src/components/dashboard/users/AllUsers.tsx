import { useEffect, useState } from "react";
import { getData } from "../../../lib/get-data";
import { userType } from "../Dashboard";

import classes from "./users.module.css";

import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillCloseSquare } from "react-icons/ai";
import User from "./User";
import { Table } from "react-bootstrap";

export interface typeUsersList {
  id: number;
  role_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  image_profile: string;
}

const AllUsers: React.FC = () => {
  const [listUsers, setListUsers] = useState<typeUsersList[]>([]);

  useEffect(() => {
    const getListUsers = async () => {
      const value = await getData("listuser");
      setListUsers(value.users);
    };
    getListUsers();
  }, []);

  let users = [];

  for (let i = 0; i < listUsers.length; i++) {
    users[i] = <User key={i + 1} number={i + 1} listUser={listUsers[i]} />;
  }

  console.log("listUsers", listUsers);
  return (
    <section className={classes.users}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>عکس</th>
            <th>نام</th>
            <th>ایمیل</th>
            <th>نقش</th>
            <th>فعال</th>
            <th>تاریخ ساخت</th>
            <th>تاریخ آپدیت</th>
          </tr>
        </thead>
        <tbody>{users}</tbody>
      </Table>
    </section>
  );
};

export default AllUsers;
