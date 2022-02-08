export const ConnectToDB = (db: string) => {
  const connectDB = `https://api.touskaweb.com/api/${db}`;

  return connectDB;
};
