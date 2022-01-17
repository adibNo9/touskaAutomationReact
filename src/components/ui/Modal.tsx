import ReactDOM from "react-dom";

import classes from "./modal.module.css";

const Modal: React.FC = (props) => {
  return ReactDOM.createPortal(
    <div className={classes.modal}>{props.children}</div>,
    document.getElementById("modal") as HTMLElement
  );
};

export default Modal;
