const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const gameSchema = new mongoose.Schema({
   game: String,
   price: String,
   genre: String,
   platforms: String,
   name: String,
   img : String
});

const personSchema = new mongoose.Schema({
   name: String,
   favoriteGenre: String,
   preferredPlatform: String,
   age: Number
});

gameSchema.virtual('id')
    .get(function() {
        return this._id.toHexString();
    });
    
personSchema.virtual('id')
    .get(function() {
        return this._id.toHexString();
    });
    
gameSchema.set('toJSON', {
  virtuals: true
});    

personSchema.set('toJSON', {
  virtuals: true
});  
    
const Game = mongoose.model('Game', gameSchema);
const Person = mongoose.model('Person', personSchema);




app.get('/api/games', async (req, res) => {
  try {
    let games = await Game.find();
    res.send({games: games});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/games', async (req, res) => {
  
    console.log("In Post")
    let gameName = req.body.game;

    // console.log(req.body);
    let image = "";
    const options = {
        method: 'GET',
        url: 'https://steam2.p.rapidapi.com/search/'+ gameName +'/page/1',
        headers: {
          'X-RapidAPI-Key': 'ff1ad2b7cbmshae12a1eaaa686dbp13ec02jsn18d683023303',
          'X-RapidAPI-Host': 'steam2.p.rapidapi.com'
        }
      };
      
      await axios.request(options).then(function (response) {
        if (response.data.length > 0){
          image = response.data[0].imgUrl;
        }
      }).catch(function (error) {
      	console.error(error);
      });
  
  
  console.log("New Game Genre:" + req.body.genre)
  
    const game = new Game({
    game: req.body.game,
    price: req.body.price,
    genre: req.body.genre,
    platforms: req.body.platforms,
    name: req.body.name,
    img: image
    

  });
  try {
    await game.save();
    res.send({game:game});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    await Game.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/games/:id', async (req, res) => {
    console.log("In Server update");
    try {
      let thisId = req.params.id;
      let newPrice = req.body.price;
      
      let foundGame = await Game.find({id:thisId});

      
      if (foundGame) {
          
          
       let updatedGame = await Game.findOneAndUpdate({id:thisId}, {price:newPrice}, {new:true});
          
          res.send(updatedGame);
      }
      
      else {
        res.status(404)
          .send("Sorry, that game doesn't exist");
      }
      
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }    
});

// Person API
app.get('/api/people', async (req, res) => {
  try {
    let person = await Person.find();
    res.send({person: person});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/people', async (req, res) => {
    const person = new Person({
    name: req.body.name,
    favoriteGenre: req.body.favoriteGenre,
    preferredPlatform: req.body.preferredPlatform,
    age: req.body.age,

  });
  try {
    await person.save();
    res.send({person:person});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/people/:id', async (req, res) => {
  try {
    await Person.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/people/:id', async(req, res) => {
    console.log("In Server update")
    try {
      let thisId = req.params.id;
      console.log(thisId)
      let favoriteGenre = req.body.favoriteGenre;
      let preferredPlatform = req.body.preferredPlatform;
      let newAge = parseInt(req.body.age);
      
      console.log(favoriteGenre)
      
      let foundPerson = await Person.find({id:thisId});

      if (foundPerson) {
          
          if (favoriteGenre == null || favoriteGenre.length == 0) {
              favoriteGenre = foundPerson.favoriteGenre
          }
          if (newAge == null || newAge == 0) {
              newAge = foundPerson.age
          }
          if (preferredPlatform == null || preferredPlatform.length == 0) {
              preferredPlatform = foundPerson.preferredPlatform
          }
          
          let updatedPerson = await Person.findOneAndUpdate({id:thisId}, {favoriteGenre:favoriteGenre, age:newAge, preferredPlatform:preferredPlatform} ,{ new:true})
          
          res.send(updatedPerson)
      }
      
      else {
        res.status(404)
          .send("Sorry, that game doesn't exist");
      }
      
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    
});


app.post('/api/search', async(req, res) => {
  console.log("Searching Steam");
  try{
    // console.log(req)
    let gameName = req.body.searchTitle;
    let responseData;
    const options = {
      method: 'GET',
      url: 'https://steam2.p.rapidapi.com/search/'+ gameName +'/page/1',
      headers: {
        'X-RapidAPI-Key': 'ff1ad2b7cbmshae12a1eaaa686dbp13ec02jsn18d683023303',
        'X-RapidAPI-Host': 'steam2.p.rapidapi.com'
      }
    };
    
    console.log(gameName);
    

      
    await axios.request(options).then(function (response) {
      responseData = response.data;
      
      let initialLength = responseData.length;
    
      for (let i = initialLength; responseData.length > 5; i--){
        responseData.pop();
      }
      
      responseData.map(function(game) {
        // console.log(game.price.trim())
        let price = game.price;

        if (price != "Free To Play" && price != "Free" && price.length != 0) {
          price.trim();
          price = price.split("\u20AC")[0] + 	"\u20AC";
          }
      }
      );
    }).catch(function (error) {
    	console.error(error);
    });
    res.send(responseData);
  }
  catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/api/getgenre/:appId", async(req, res)=> {
  try{
    let appID = req.params.appId;
    console.log("App ID = " + appID);
    let genres = "";
    
    const options = {
      method: 'GET',
      url: 'https://steam2.p.rapidapi.com/appDetail/' + appID,
      headers: {
        'X-RapidAPI-Key': 'ff1ad2b7cbmshae12a1eaaa686dbp13ec02jsn18d683023303',
        'X-RapidAPI-Host': 'steam2.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
    	let tags = response.data.tags;
    // 	console.log(tags);
    	for (let i = 0; i <= 1; i++){
    	  genres = genres + tags[i].name;
    	  if (i != 1){
    	    genres = genres + ", "
    	  }
    	}
    	console.log(genres);
    	
    	var jsonData = {
    	  "searchedGenres": genres
    	}
    	
    	res.send(jsonData);
    }).catch(function (error) {
    	console.error(error);
    });
        
      }
      catch (error){
        console.log(error);
        res.sendStatus(500);
      }
    })

app.listen(3000, () => console.log('Server listening on port 3000!'));