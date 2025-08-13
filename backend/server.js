import express from "express";
import { router } from "./routes.js";

const port = process.env.PORT || 3000;

const server = express();

server.use("/api", router);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});