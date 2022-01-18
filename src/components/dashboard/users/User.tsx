import { typeUsersList } from "./AllUsers";
import classes from "./users.module.css";

import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillCloseSquare } from "react-icons/ai";

const User: React.FC<{ listUser: typeUsersList; number: number }> = (props) => {
  const { listUser, number } = props;
  const createDate = new Date(listUser.created_at).getTime();
  const today = new Date().getTime();
  const calcCreateDate = Math.round((today - createDate) / (1000 * 86400));

  const updateDate = new Date(listUser.updated_at).getTime();
  const calcUpdateDate = Math.round((today - updateDate) / (1000 * 86400));

  return (
    <tr>
      <td>{number}</td>
      <td>
        <img src={listUser.image_profile} />
      </td>
      <td>{listUser.name}</td>
      <td>{listUser.email}</td>
      <td>{listUser.role_id}</td>
      <td>
        {listUser.is_active === 1 ? (
          <AiFillCheckSquare className={classes.active} />
        ) : (
          <AiFillCloseSquare className={classes.notActive} />
        )}
      </td>
      {calcCreateDate !== 0 && <td>{calcCreateDate} روز گذشته</td>}
      {calcCreateDate === 0 && <td>امروز</td>}
      {calcUpdateDate !== 0 && <td>{calcUpdateDate} روز گذشته</td>}
      {calcUpdateDate === 0 && <td>امروز</td>}
    </tr>
  );
};

export default User;
