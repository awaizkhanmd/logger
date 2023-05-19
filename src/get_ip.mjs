import express from 'express'
const app = express()
let port = 6000


app.get('/ip', (req, res) => {
    const ipAddress = req.ip;
    res.json({ ip_address: ipAddress });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


app.get('/ipv4', (req, res) => {
    const ipAddress = req.socket.remoteAddress;
    const ipv4Address = ipAddress.includes(':') ? ipAddress.split(':').pop() : ipAddress;
    res.json({ ip_address: ipv4Address });
  });
/**
 * 
 
const express = require('express');
const requestIp = require('request-ip');
const app = express();
const port = 3000; // You can change the port as needed

// Middleware to extract client's IP address
app.use(requestIp.mw());

// API route to get the user's IPv4 address
app.get('/ip', (req, res) => {
  const clientIp = req.clientIp;
  res.json({ ip_address: clientIp });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
*/