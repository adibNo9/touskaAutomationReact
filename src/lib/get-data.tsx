import { ConnectToDB } from "./connect-to-db";

export const getData = async (db: string) => {
  const login_token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${login_token}`,
  };

  const connectDB = ConnectToDB(db);

  const res = await fetch(connectDB, {
    headers,
  });

  // if (!res.ok) {
  //   localStorage.removeItem("token");
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 2000);
  //   console.log("PLeasr Login Again!");

  //   return res;
  // }

  // const data = await res.json();

  // return data;

  if (res.ok) {
    return res.json();
  } else {
    localStorage.removeItem("token");
    window.location.reload();
    return Promise.reject(res);
  }
};
