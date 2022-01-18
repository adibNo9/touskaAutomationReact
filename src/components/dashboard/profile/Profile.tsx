import classes from "./profile.module.css";
import ProfileUpdate from "./ProfileUpdate";
import { useState } from "react";
import ProfileContent from "./ProfileContent";
import { userType } from "../Dashboard";
import ChangePassword from "./ChangePassword";

const Profile: React.FC<{ userData: userType }> = (props) => {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [showChangePass, setShowChangePass] = useState<boolean>(false);

  const { userData } = props;

  const contentHandler = () => {
    setShowContent(true);
    setShowUpdate(false);
    setShowChangePass(false);
  };

  const updateHandler = () => {
    setShowContent(false);
    setShowUpdate(true);
    setShowChangePass(false);
  };

  const changePassHandler = () => {
    setShowContent(false);
    setShowUpdate(false);
    setShowChangePass(true);
  };
  return (
    <section className={classes.profile}>
      <h1>پروفایل</h1>
      <div className={classes.links}>
        <button onClick={contentHandler}>اطلاعات</button>
        <button onClick={changePassHandler}>تغییر رمز عبور</button>
        <button onClick={updateHandler}>به روزرسانی اطلاعات</button>
      </div>
      {showContent && <ProfileContent userData={userData} />}
      {showUpdate && <ProfileUpdate />}
      {showChangePass && <ChangePassword />}
    </section>
  );
};

export default Profile;
