const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios=require('axios')
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));


const Video = require('./videoModel');

app.get('/data',async (req,res)=>{
    //var final=[];
    var response =await axios.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLesyu_gd_4TENvoa6wLk0zQZc6JsNOslo&key=AIzaSyAk5SqNcTeFlRCylt1eHsVdAdClsQhlj9A')
    for(var item of response.data.items){
        console.log(item.snippet.resourceId.videoId)
        var video=await axios.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id='+item.snippet.resourceId.videoId+'&key=AIzaSyAk5SqNcTeFlRCylt1eHsVdAdClsQhlj9A');
        var obj={
            title:video.data.items[0].snippet.title,
            url:"https://www.youtube.com/watch?v="+video.data.items[0].id,
            description:video.data.items[0].snippet.description,
            videoId:video.data.items[0].id,
            length:video.data.items[0].contentDetails.duration,
            thumbnail:video.data.items[0].snippet.thumbnails
        }
        Video.create(obj);
    }
    res.status(200).json({data:"done"})
});
app.get('/bulkdata',async (req,res)=>{
    const neatCsv = require('neat-csv');
    const fs = require('fs')
    var mydata=[]
    fs.readFile('./data.csv', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    mydata=await neatCsv(data)
    for(var i of mydata){
      
    
    var response =await axios.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+i['Playlist ID']+'&key=AIzaSyAk5SqNcTeFlRCylt1eHsVdAdClsQhlj9A')
    for(var item of response.data.items){
        console.log(item.snippet.resourceId.videoId)
        var video=await axios.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id='+item.snippet.resourceId.videoId+'&key=AIzaSyAk5SqNcTeFlRCylt1eHsVdAdClsQhlj9A');
        var obj={
            title:video.data.items[0].snippet.title,
            url:"https://www.youtube.com/watch?v="+video.data.items[0].id,
            description:video.data.items[0].snippet.description,
            videoId:video.data.items[0].id,
            length:video.data.items[0].contentDetails.duration,
            thumbnail:video.data.items[0].snippet.thumbnails
        }
        Video.create(obj);
  }
  }
  res.status(200).json({data:"done"})
})
    
    
});
app.get('/getdata',async (req,res)=>{
    var data=await Video.find({});
    res.status(200).json({data:data})
})
var port=process.env.PORT||3400
app.listen(port, () => {
    console.log('connected');

})