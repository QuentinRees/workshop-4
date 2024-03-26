import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

var lastReceivedMessage: string | null = null;
var lastastSentMessage: string | null = null;

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // DONE implement the status route
  _user.get("/status", (req, res) => {res.send("live");});

  _user.get("/getLastReceivedMessage",  (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastastSentMessage });
  });

  _user.post("/message", (req, res) => {
    const sendMessageBody = req.body as SendMessageBody;
    lastReceivedMessage = sendMessageBody.message;
    res.send("message received");
  });

  _user.post('/sendMessage', async (req, res) => {
    const sendMessageBody = req.body as SendMessageBody;

  });

  
  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
