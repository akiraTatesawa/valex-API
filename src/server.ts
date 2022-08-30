import "./config/config.ts";
import cors from "cors";
import express from "express";

const server = express();

server.use(cors());
server.use(express.json());

server.listen(process.env.PORT, () => {
  console.log("server is running on port 3333");
});
