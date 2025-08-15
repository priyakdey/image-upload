import cors from "cors";
import express from "express";
import { router } from "./routes.js";

const port = process.env.PORT || 3000;

const server = express();

const corsOptions = {
  origin: "http://localhost:5173",  // TODO: env driven
  methods: "POST,OPTIONS",
  headers: [ "Origin", "X-Powered-By", "Location", "Content-Type", "Accept" ],
  exposedHeaders: [ "Location", "X-Powered-By" ]
};

server.use(cors(corsOptions));
server.use("/api", router);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});