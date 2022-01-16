import { Link } from "react-router-dom";

import classes from "./header.module.css";

const Header: React.FC = () => {
  return (
    <section className={classes.header}>
      <Link to="/register">ثبت نام</Link>
      <a href="https://touskaweb.com/">
        <img src="/images/logo.png" />
      </a>
      <Link to="/login">ورود</Link>
    </section>
  );
};

export default Header;
