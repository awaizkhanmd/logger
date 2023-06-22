import express from 'express';
import http from 'http';
import os from 'os'
import dns from 'dns'
import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import axios from 'axios';
import useragent from 'express-useragent';
import net from 'net'




//=> '46.5.21.123'

const app = express();

const resolve4Async = dns.promises.resolve4;

const convertIPv6ToIPv4 = (ipv6) => {
  const ipv6Regex = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;
  const match = ipv6.match(ipv6Regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};

app.get('/ipv6', async (req, res) => {
  try {
    const ipArray = await resolve4Async('api.ipify.org');
    const ip = ipArray[0];
    const ipv4Address = convertIPv6ToIPv4(ip);
    res.setHeader('Content-Type', 'text/plain');
    res.end(`My public IPv4 address is: ${ipv4Address || ip}`);
  } catch (err) {
    console.error('Error retrieving IP address:', err);
    res.status(500).end('Internal Server Error');
  }
});



















app.get('/ipdns', (req, res) => {


  dns.lookup(os.hostname(), (err, address) => {
    if (err) {
      console.error('Error retrieving IP address:', err);
      res.status(500).end('Internal Server Error');
      return;
    }

    res.setHeader('Content-Type', 'text/plain');
    res.end(`My public IP address is: ${address}`);
  });
});




app.get('/ipv4', async (req, res) => {
  try {
    const ip = await publicIp.v4();
    res.setHeader('Content-Type', 'text/plain');
    res.end(`My public IP address is: ${ip}`);
  } catch (err) {
    console.error('Error retrieving IP address:', err);
    res.status(500).end('Internal Server Error');
  }
});
app.get('/ip', (req, res) => {
  const options = {
    hostname: 'api.ipify.org',
    port: 80,
    path: '/',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const ip = data.trim();
      res.setHeader('Content-Type', 'text/plain');
      res.end(`My public IP address is: ${ip}`);
    });
  });

  request.on('error', (error) => {
    console.error('Error retrieving IP address:', error);
    res.status(500).end('Internal Server Error');
  });

  request.end();
});




import express from 'express'
import http from 'http'







const server1 = http.createServer((req, res) => {
  if (req.url === '/ip') {
    const options = {
      hostname: 'api.ipify.org',
      port: 80,
      path: '/',
      method: 'GET'
    };

    const request = http.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const ip = data.trim();
        res.setHeader('Content-Type', 'text/plain');
        res.end(`My public IP address is: ${ip}`);
      });
    });

    request.on('error', (error) => {
      console.error('Error retrieving IP address:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });

    request.end();
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server1.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




const server = http.createServer((req, res) => {
  http.get('http://api.ipify.org', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      const ip = data.toString();
      res.setHeader('Content-Type', 'text/plain');
      res.end(`My public IP address is: ${ip}`);
    });
  }).on('error', (err) => {
    console.error('Error retrieving IP address:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

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

 
const express = require('express');
const requestIp = require('request-ip');

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



app.use(useragent.express());

app.get('/ipall', async (req, res) => {
  const options = {
    hostname: 'api.ipify.org',
    port: 80,
    path: '/',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', async () => {
      const ip = data.trim();
      const ipv4 = await dns.promises.resolve4('api.ipify.org');
      const ipv6 = await dns.promises.resolve6('api.ipify.org');
      const dnsDevice = dns.getServers();

      try {
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const { country, regionName, city, isp } = geoResponse.data;
        const deviceName = req.useragent && req.useragent.isMobile ? 'Mobile Device' : 'Desktop Device';
        const browserName = req.useragent ? req.useragent.browser : 'Unknown';

        res.setHeader('Content-Type', 'text/plain');
        res.end(`My public IP address is: ${ip}\nIPv4: ${ipv4.join(', ')}\nIPv6: ${ipv6.join(', ')}\nDNS Device: ${dnsDevice.join(', ')}\nDevice Name: ${deviceName}\nBrowser Name: ${browserName}\nGeolocation: ${city}, ${regionName}, ${country}\nISP: ${isp}`);
      } catch (error) {
        console.error('Error retrieving IP address:', error);
        res.status(500).end('Internal Server Error');
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error retrieving IP address:', error);
    res.status(500).end('Internal Server Error');
  });

  request.end();
});
const port = 5000;
const interfaces = os.networkInterfaces();
let host;

Object.keys(interfaces).forEach((interfaceName) => {
  const networkInterface = interfaces[interfaceName];
  for (let i = 0; i < networkInterface.length; i++) {
    const iface = networkInterface[i];
    if (iface.family === 'IPv4' && !iface.internal) {
      host = iface.address;
      break;
    }
  }
});

app.get('/ipdir', async() => {
  try{
    console.log(await publicIp()); // Falls back to IPv4
    //=> 'fe80::200:f8ff:fe21:67cf'
    
    console.log(await publicIpv6());
    //=> 'fe80::200:f8ff:fe21:67cf'
    
    console.log(await publicIpv4());
    console.dir(req.ip)
   
  }catch (error) {
    res.send(500).send({message:"internal server error"})
  }
})

if (!host) {
  console.error('Unable to determine the public IP address.');
  process.exit(1);
}


app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});