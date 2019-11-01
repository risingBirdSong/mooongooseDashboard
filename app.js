const express = require("express");

const app = express();


app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoosedatabase', { useNewUrlParser: true });

const MooongooseSchema = new mongoose.Schema({
  name: String,
  height: Number,
  sound: String
})

const MooonGoose = mongoose.model('MooonGoose', MooongooseSchema);


app.get('/', (req, res) => {
  MooonGoose.find()
    .then(mongooseData => {
      res.render('index', { mongooses: mongooseData });
    })
    .catch(err => console.log('the error ___', err))
})

app.get('/mongooses/new', (req, res) => {
  res.render('new');
})

app.post('/mongooses', (req, res) => {
  let newMongo = new MooonGoose();
  newMongo.name = req.body.mongoose_name;
  newMongo.height = req.body.mongoose_height;
  newMongo.sound = req.body.mongoose_sound;
  newMongo.save()
    .then(newData => console.log('the new data ---->', newData))
    .catch(err => console.log(err));
  res.redirect('/');
  //MooonGoose.create(req.body)
})

app.get('/mongooses/deleteall', (req, res) => {
  MooonGoose.deleteMany({})
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log('the error --->', err))
})

app.get('/mongooses/details/:id', (req, res) => {
  MooonGoose.find({_id : req.params.id})
    .then(mongoosearray => {
      let mongoose = mongoosearray[0];
      res.render('details', { mg : mongoose});
    })
})

app.get('/mongooses/edit/:id', (req, res) => {
  MooonGoose.find({ _id: req.params.id })
    .then(mongoose => {
      let myGoose = mongoose[0];
      res.render('edit', { mg: myGoose });
    })
})

app.post('/mongooses/:id', (req, res) => {
  MooonGoose.findOne({ _id: req.params.id })
    .then(mongoose => {
      mongoose.name = req.body.mongoose_name;
      mongoose.height = req.body.mongoose_height;
      mongoose.sound = req.body.mongoose_sound;
      return mongoose.save();
    })
    .then(() => {
      res.redirect('/');
    })
});



// MooonGoose.findOneAndUpdate({_id : req.params.id}, )

app.get('/mongooses/destroy/:id', (req, res) => {
  MooonGoose.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log('error _____', err));
})

app.listen(8000, () => console.log('listening on port 8000'));