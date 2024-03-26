import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT, REGISTRY_PORT } from "../config";
import { generateRsaKeyPair, exportPubKey, exportPrvKey } from "../crypto";


export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  // DONE implement the status route
  onionRouter.get("/status", (req, res) => {res.send("live");});

  var lastReceivedEncryptedMessage: string | null = null;
  var lastReceivedDecryptedMessage: string | null = null;
  var lastMessageDestination: number | null = null;
  const keyPair = await generateRsaKeyPair();
  const publicKey = await exportPubKey(keyPair.publicKey);

  onionRouter.get("/getLastReceivedEncryptedMessage",  (req, res) => {
    res.json({ result: lastReceivedEncryptedMessage });
  });

  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.json({ result: lastReceivedDecryptedMessage });
  });

  onionRouter.get("/getLastMessageDestination", (req, res) => {
    res.json({ result: lastMessageDestination });
  });

  await fetch(`http://localhost:${REGISTRY_PORT}/registerNode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nodeId: nodeId,
      pubKey: publicKey
    })
  });

  onionRouter.get("/getPrivateKey", async (req, res) => {
    const privateKey = await exportPrvKey(keyPair.privateKey);
    res.json({ result: privateKey });
  });

  onionRouter.get("/getPublicKey", async (req, res) => {
    const publicKey = await exportPubKey(keyPair.publicKey);
    res.json({ result: publicKey });
  });
  
  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
