import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ message: "Lecture E-Commerce API is running", port: PORT });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
