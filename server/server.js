const express = require("express");
const path = require("path");

const PORT = 8080;
const application = express();

application.use(express.json());
application.use(express.static(path.join(__dirname, "..", "public")));

application.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "public", 'index.html'));
});

application.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "public", 'error.html'));
});

application.listen(PORT, "0.0.0.0", ()=>{
  console.log(`[STARTING] Server is starting...`)
  console.log("\n\n[DETAILS] For reference: http://localhost:8080/ or http://IPv4:8080/\nThe IPv4 is should be the IP address\nof the device running the server.\n\n")

  setTimeout(()=>{
    console.log(`[LISTENING] Server is running on port: ${PORT}`);
    console.log("To stop the server press: 'CTRL + C' or close this window")
  }, 1000);
});