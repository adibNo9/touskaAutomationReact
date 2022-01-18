import classes from "./header.module.css";

const Layout: React.FC = (props) => {
  return <section className={classes.layout}>{props.children}</section>;
};

export default Layout;
