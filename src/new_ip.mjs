import express from "express";
import expressDevice from "express-device";
import userAgent from "user-agent";
import { publicIpv4 } from "public-ip";
import os from 'os'
import device from "express-device"
import browserDetect from "browser-detect";
import browser from 'browser-detect'
import geoip from 'geoip-lite'
import Lookup from "geoip-lite";
import useragent from 'useragent';
import cookieParser from "cookie-parser";
import axios from "axios";


const app = express();



app.use(device.capture());
import router from "express";


const interfaces = os.networkInterfaces();
let HOST;

Object.keys(interfaces).forEach((interfaceName) => {
    const networkInterface = interfaces[interfaceName];
    for (let i = 0; i < networkInterface.length; i++) {
        const iface = networkInterface[i];
        if (iface.family === 'IPv4' && !iface.internal) {
            HOST = iface.address;
            break;
        }
    }
});
const getIp=()=>{
const ip=publicIpv4();
const geo=geoip.lookup(ip);
const ua=userAgent.parse(req.headers['user-agent']);
const browser=browserDetect(ua);
const os=os.hostname();
const device=req.device;
const data={ip,geo,ua,browser,os,device}
const windowsVersion=process.platform==='win32';
if(windowsVersion){
    return data;
}
return data;

}



const getPublic = async (req, res) => {
    try {
        const ipv6_public = await publicIpv4();
        const localAddress = req.ip;
        const deviceUsed = req.device.type.toUpperCase();
        const geo = geoip.lookup(ipv6_public);
        const userAgent = useragent.parse(req.headers['user-agent']);
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: true,
            Local_IP_Address: localAddress,
            Public_IP_Address: ipv6_public,
            Device_Used: deviceUsed,
            geo,

        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const browserDetails=(userAgent)=>{
    return browser(userAgent);

}
const getPublicAll = async (req, res) => {
    try {
      const ipv6_public = await publicIpv4();
      const localAddress = req.ip;
      const userAgentString = req.headers['user-agent'];
      const deviceUsed = req.device.type.toUpperCase();
  
      // Parse user agent string to get browser and OS information
      const agent = useragent.parse(userAgentString);
      const isDesktop = req.device.type === 'desktop';
      const isChrome = agent.family.toLowerCase() === 'chrome';
  
      // Use Axios to make a GET request to the IP geolocation API
      const response = await axios.get(`http://ip-api.com/json/${ipv6_public}`);
      
      const { city, regionName, country, query, lat, lon, timezone, currency, isp, org, as, asname, mobile, proxy, hosting } = response.data;
  
      const fullAddress = `${city}, ${regionName}, ${country}`;
  
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({
        status: true,
        Local_IP_Address: localAddress,   
        //add the 
        Public_IP_Address: ipv6_public,
        Device_Used: deviceUsed,
        Is_Desktop: isDesktop,
       Full_Address: fullAddress,
        IP: query,
        Latitude: lat,
        Longitude: lon,
        Timezone: timezone,
        Currency: currency,
        ISP: isp,
        Organization: org,
        AS: as,
        AS_Name: asname,
        Mobile: mobile,
        Proxy: proxy,
        Hosting: hosting
      });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  }

  

//create  a function 

/*
const getPublic = async (req, res) => {
    try {

        const ipv6_public = await publicIpv4();
        const LocalAddress = req.ip;
        const Device_Used = req.device.type.toUpperCase()
        
      
        var geo = geoip.lookup(ipv6_public);
       


        res.setHeader('Content-Type', 'application/json');



        res.status(200).json({
            status: true,
            Local_IP_Address: LocalAddress,
            Public_IP_Address: ipv6_public
            Device_Used: Device_Used 
            ,geo,
          
        });


    } catch (error) {
        res.status(500).send({ status: "false", message: error.message })
    }

}
*/
const getcookie=(req,res)=>{
    res.json(req.cookies);

}
//how to cookies from the broswer


if (!HOST) {
    console.error('Unable to determine the public IP address.');
    process.exit(1);
}
let PORT = 4000;

app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);

})
app.get('/getPublicAll', getPublicAll);
app.get('/getpublic', getPublic);
app.get ('/getip', getIp);
app.get('/getcookie',getcookie);
 // Route for setting the cookies
app.get('/setcookie', function (req, res) {
 
    // Setting a cookie with key 'my_cookie'
    // and value 'geeksforgeeks'
    res.cookie('my_cookie', 'geeksforgeeks');
    res.send('Cookies added');
})

// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//     cloud_name: 'dvnkqrzqk',
//     api_key: '651779585937892',    
//     api_secret: '3j2YtQKw9Kdvk4Mz-J0Tp3lK3w',

// })
/*const upload = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.json(result);
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const uploadtomongoDb=async(req,res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.json(result);
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const uploadtodb=async(req,res)=>{
    try {
        
        
        const result = await cloudinary.uploader.upload(req.file.path);

        res.json(result);
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
//create a route that accepests a post request to upload a file to cloudinary USING MONGO DB
app.post('/upload', uploadtomongoDb);
app.post('/uploadtodb', uploadtodb);    
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    image: String,      
})
const User = mongoose.model('User', UserSchema);   
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
})
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
})
app.get('/getuser', async (req, res) => {
    
})
app.post('/getuser', async (req, res) => {
    
})
T


app.get('/getuser', async (req, res) => {
    
})
app.post('/getuser', async (req, res) => {
    
})  

app.get('/getuser', async (req, res) => {
    
})              */