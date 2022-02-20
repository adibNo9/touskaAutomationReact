import React, { ChangeEvent, useEffect, useState } from "react";
import { getData } from "../../../lib/get-data";

import classes from "./users.module.css";

import { RiSearch2Line } from "react-icons/ri";
import User from "./User";
import { Form, Table } from "react-bootstrap";

export interface typeUsersList {
  id: number;
  role_id: number;
  is_active: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  image_profile: string;
}

const AllUsers: React.FC = () => {
  const [listUsers, setListUsers] = useState<typeUsersList[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");

  const [getValue, setGetValue] = useState<typeUsersList[]>([]);

  const [activeBtn, setActiveBtn] = useState<string>("allUsers");

  useEffect(() => {
    const getListUsers = async () => {
      const value = await getData("listuser");
      setListUsers(value.users);
      setGetValue(value.users);
    };
    getListUsers();
  }, []);

  const searchChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    setListUsers(getValue);
    const username = event.currentTarget.value;
    setSearchVal(username);
    if (searchVal === "") {
      setListUsers(getValue);
    }
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchVal !== "") {
      const val = listUsers.filter((user) =>
        (user.name || user.email).includes(searchVal)
      );
      setListUsers(val);
      if (val.length === 0) {
        setListUsers(getValue);
        const emailval = listUsers.filter((user) =>
          user.email.includes(searchVal)
        );
        setListUsers(emailval);
      }
    } else {
      setListUsers(getValue);
    }
  };

  const allUsersHandler = () => {
    setListUsers(getValue);
    setActiveBtn("allUsers");
  };

  const activeUsersHandler = () => {
    const value = getValue.filter((user) => user.is_active === "1");
    setListUsers(value);
    setActiveBtn("activeUsers");
  };

  const deactiveUsersHandler = () => {
    const value = getValue.filter((user) => user.is_active !== "1");
    setListUsers(value);
    setActiveBtn("deActiveUsers");
  };

  let users = [];

  for (let i = 0; i < listUsers.length; i++) {
    users[i] = <User key={i + 1} number={i + 1} listUser={listUsers[i]} />;
  }

  return (
    <section className={classes.users}>
      <div className={classes.options}>
        <Form onSubmit={submitHandler}>
          <Form.Group className={classes.formGroup} controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="نام یا ایمیل مورد نظر را وارد کنید"
              value={searchVal}
              onChange={searchChangeHandelr}
            />
            <RiSearch2Line
              onClick={submitHandler}
              className={classes.searchIcon}
            />
          </Form.Group>
        </Form>
        <div className={classes.btnsOptions}>
          <button
            onClick={allUsersHandler}
            className={
              activeBtn === "allUsers" ? classes.active : classes.noActive
            }
          >
            همه کاربران
          </button>
          <button
            onClick={activeUsersHandler}
            className={
              activeBtn === "activeUsers" ? classes.active : classes.noActive
            }
          >
            کاربران فعال
          </button>
          <button
            onClick={deactiveUsersHandler}
            className={
              activeBtn === "deActiveUsers" ? classes.active : classes.noActive
            }
          >
            کاربران غیر فعال
          </button>
        </div>
      </div>
      <Table striped bordered hover responsive>
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
