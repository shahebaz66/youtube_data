const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.set('debug', true);
mongoose.Promise = Promise;
//mongodb://127.0.0.1:27017/cloud?retryWrites=true&w=majority
mongoose
  .connect(`mongodb://127.0.0.1:27017/video`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successfull!'));
const videoSchema = new Schema({
    title:String,
    url:String,
    description:String,
    videoId:String,
    length:String,
    thumbnail:Object
});

module.exports = Video = mongoose.model('Store', videoSchema);
