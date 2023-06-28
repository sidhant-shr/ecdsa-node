const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const hashMessage = require("./scripts/hashMessage");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "02250f532dce7e6a713f2aba6254e84a8b2446168cd7e5a23dfa58201667e0d759": 100,
  "0272d2ce84a58137caf7a69a7376fa3a2bbf625f599b32ce4efcf94145552bc7d3": 50,
  "03a8f37a33928c2448398565d0acb58a1ecd4564a80c8371d7f9357ab019144ae8": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // get a sign from client side application
  // recover the public address from the signature

  const {
    sender,
    recipient,
    amount,
    signedMessage,
    message,
    privateKey,
  } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const senderPublicKey = secp.getPublicKey(privateKey);
  console.log("Sender Public Key: ", senderPublicKey);
  console.log("Sender Private Key: ", privateKey);
  console.log("Sender Message: ", message);
  console.log("Signed Message: ", signedMessage[0]);

  const valid = secp.secp256k1.verify(
    signedMessage,
    hashMessage(message),
    senderPublicKey
  );
  console.log("Is valid transaction ?: ", valid);

  if (valid) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }else{
    res.send("This operation is not allowed from your private key!! ");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
