import axios, { AxiosRequestHeaders } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import { getData } from "../../../lib/get-data";
import Notification from "../../ui/notification";
import { typeUsersList } from "./AllUsers";
import classes from "./users.module.css";

export interface typeRoles {
  id: number;
  name: string;
}

const EditUser: React.FC<{ listUser: typeUsersList }> = (props) => {
  const { listUser } = props;
  const [dataError, setdataError] = useState<string>("خطایی رخ داده است!");
  const [notification, setNotification] = useState<string>();

  const [nameVal, setNameVal] = useState<string>(listUser.name);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [roles, setRoles] = useState<typeRoles[]>([]);

  const [valueBox, setValueBox] = useState<string>("");

  const emailChangeHandelr = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setNameVal(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.files?.[0];

    setSelectedFile(value);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setValueBox(value);
  };

  useEffect(() => {
    const getRoles = async () => {
      const roleValues = await getData("get/roles");
      setRoles(roleValues.roles);
    };

    getRoles();
  }, []);

  let formValidate = false;

  if (valueBox || nameVal || selectedFile) {
    formValidate = true;
  }

  interface notificationDetails {
    status: string;
    title: string;
    message: string;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setNotification("pending");

    const connectDB = ConnectToDB("superadmin/update/user");

    const fData = new FormData();

    fData.append("id", JSON.stringify(listUser.id));
    valueBox && fData.append("role_id", valueBox);

    nameVal && fData.append("name", nameVal);

    selectedFile && fData.append("image", selectedFile ? selectedFile : "");

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
    <Form onSubmit={submitHandler} className={classes.form}>
      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>نام</Form.Label>
        <Form.Control
          type="text"
          placeholder="نام"
          value={nameVal}
          onChange={emailChangeHandelr}
        />
      </Form.Group>

      <Form.Group className={classes.formGroup} controlId="formBasicEmail">
        <Form.Label>نقش</Form.Label>
        <Form.Select
          value={valueBox}
          onChange={changeHandler}
          aria-label="Default select example"
        >
          <option>انتخاب عنوان ...</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="image">عکس</Form.Label>
        <Form.Control
          name="image"
          id="image"
          type="file"
          onChange={handleChange}
          size="sm"
        />
      </Form.Group>
      <div className={classes.actions}>
        <button disabled={!formValidate}>تایید</button>
      </div>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </Form>
  );
};

export default EditUser;
