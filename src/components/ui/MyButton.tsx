import classes from "./my-button.module.css";

const MyButton: React.FC<{ children: string; clickable: () => any }> = (
  props
) => {
  return <button className={classes.button}>{props.children}</button>;
};

export default MyButton;
