const app = require('../Backend/app.js');

const cloudinary = require("cloudinary")
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

app.listen(process.env.PORT, () => {
    console.log(`server is created at port no. ${process.env.PORT}`)
})