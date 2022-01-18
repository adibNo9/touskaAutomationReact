import { userType } from "../Dashboard";

import classes from "./profile.module.css";

const ProfileContent: React.FC<{ userData: userType }> = (props) => {
  const { userData } = props;
  return (
    <div className={classes.content}>
      <h4>نام: {userData.user.name}</h4>
      <h4>ایمیل: {userData.user.email}</h4>
      <h4>ایمیل: {userData.user.email}</h4>
    </div>
  );
};

export default ProfileContent;
