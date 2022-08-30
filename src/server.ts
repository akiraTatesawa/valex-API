import "./config/config";
import cors from "cors";
import express from "express";
import { serverRouter } from "./routes";

const server = express();

server.use(cors());
server.use(express.json());

server.use(serverRouter);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
