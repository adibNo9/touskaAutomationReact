export const ConnectToDB = (db: string) => {
  const connectDB = `http://192.168.7.19/autom/public/api/${db}`;

  return connectDB;
};
