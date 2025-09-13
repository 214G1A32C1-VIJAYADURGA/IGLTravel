import connectDb from "./shared/utils/connectDb";
import app from "./app";

const PORT: number = Number(process.env.PORT) || 8080;

connectDb().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});