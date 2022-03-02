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

  if (!res.ok) {
    localStorage.removeItem("Please Login again!");
  }

  const data = await res.json();

  return data;
};
