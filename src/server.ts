import "./config/config";
import cors from "cors";
import express from "express";

const server = express();

server.use(cors());
server.use(express.json());
const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
