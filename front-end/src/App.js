import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [games, setGames] = useState([]);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  
  const [searchResults, setSearch] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [personSearching, setPersonSearch] = useState("");
  
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [price, setPrice] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [genre, setGenre] = useState("");
  const [imgURL, setURL] = useState("");

  const [personName, setPersonName] = useState("");
  const [favGenre, setFavGenre] = useState("");
  const [prefPlat, setPrefPlat] = useState("");
  const [age, setAge] = useState(0);
  const [personId, setId] = useState("");


  const searchGames = async() => {
    try{
      console.log("Test")
      if (searchTitle.length == 0) {
        return;
      }
      const response = await axios.post("/api/search", {searchTitle: searchTitle});
      console.log(response.data)
      setSearch(response.data)
    }
    catch(error){
      setError("Error searching")
    }
  }
  
  const searchSubmit = async(e) =>{
    e.preventDefault()
    await searchGames();
  }
  
  const getSearchedGenre = async(appID) => {
    try{
      // console.log("FrontEndAppID: " + appID);
      const response = await axios.post("/api/getgenre/" + appID, {searchTitle: searchTitle});
      // console.log("Resonse: " + response.data.searchedGenres)
      // console.log(response.data)
      setSearchGenre(response.data.searchedGenres)
    }
    catch(error){
      setError("Error searching")
    }
  }
  
  
  const addSearchedSubmit = async(appID) => {
    try {
       await getSearchedGenre(appID);
    }
    catch (error) {
      setError("error adding game")
    }
  }
  //game stuff

  const fetchGames = async() => {
    try {      
      const response = await axios.get("/api/games");
      console.log(response.data)
      setGames(response.data.games);
    } catch(error) {
      setError("error retrieving tickets: " + error);
    }
  }
  
  const createGame = async(title, gamePrice, genres, inputName) => {
    try {
      let gamePlatforms = "Steam"
      if (title == null){
        title = game;
        gamePrice = price;
        gamePlatforms = platforms;
        inputName = name
        genres = genre;
      }
      await axios.post("/api/games", {game: title, price: gamePrice, genre: genres, platforms:gamePlatforms, name:inputName});
    } catch(error) {
      setError("error adding a ticket: " + error);
    }
  }
  const deleteOneGame = async(game) => {
    try {
      await axios.delete("/api/games/" + game.id);
    } catch(error) {
      setError("error deleting a game" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchGames();
    fetchPeople();
  },[]);

  const addGame = async(e) => {
    e.preventDefault();
    await createGame();
    fetchGames();
    setGame("");
    setPrice("");
    setGenre("");
    setPlatforms("");
    setName("");
    setURL("")
  }
  
  const addSearchedGame = async(title, price, appID) => {
    console.log("In addingSearchedGame: " + title);
    await getSearchedGenre(appID);
    console.log("Searched Genre: " + searchGenre)
    await createGame(title, price, searchGenre, personSearching);
    fetchGames();
    setGame("");
    setPrice("");
    setGenre("");
    setPlatforms("");
    setName("");
    setURL("")
  }

  const deleteGame = async(game) => {
    await deleteOneGame(game);
    fetchGames();
  }

const updateOneGame = async(game) => {
    try {
      await axios.put("/api/games/" + game.id, {price: price});
    } catch(error) {
      setError("error updating person: " + error);
    }
}

  const updateGame = async(game) => {
    await updateOneGame(game);
    fetchGames();
    setGame("");
    setPrice("");
    setGenre("");
    setPlatforms("");
    setName("");
  }

// people



  const fetchPeople = async() => {
    try {      
      const response = await axios.get("/api/people");
      console.log(response.data)
      setPeople(response.data.person);
    } catch(error) {
      setError("error retrieving tickets: " + error);
    }
  }
  
  const createPerson = async() => {
    try {
      await axios.post("/api/people", {name: personName, favoriteGenre: favGenre, preferredPlatform: prefPlat, age: age});
    } catch(error) {
      setError("error adding a ticket: " + error);
    }
  }
  const deleteOnePerson = async(person) => {
    try {
      await axios.delete("/api/people/" + person.id);
    } catch(error) {
      setError("error deleting a game" + error);
    }
  }

  // fetch ticket data


const updateOnePerson = async(person) => {
    try {
      console.log(age)
   
      await axios.put("/api/people/" + person.id, {preferredPlatform: prefPlat, favoriteGenre:favGenre, age: age});
      console.log("Dome")
    } catch(error) {
      setError("error updating person: " + error);
    }
}

  const addPerson = async(e) => {
    e.preventDefault();
    await createPerson();
    fetchPeople();
    setPersonName("");
    setAge(0);
    setFavGenre("");
    setPrefPlat("");
  }
  
  const updatePerson = async(person) => {
    console.log("Hello, updating")

    await updateOnePerson(person);
    fetchPeople();
    setPersonName("");
    setAge(0);
    setFavGenre("");
    setPrefPlat("");
  }

  const deletePerson = async(person) => {
    await deleteOnePerson(person);
    fetchPeople();
  }


  // render results
  return (
    <div className="App">
      {error}
      
      <div className = "pageHeader">
        <h1 className = "pageDescHead">Videogame wishlist tracker!</h1>
        <div className = "pageDesc">Add your own game to the wishlist! If you cant think of anything, add youself to to list of people to let others what games you may like!</div>
      </div>
      
      <div className = "steamSearchContainer">
        <form className = "formSearch steamSearchForm" onSubmit={searchSubmit}>
              <h1 className = "searchFormHeader">Search</h1>
              <div className = "searchDesc">Use this to search the steam library for games to add to your wishlist! It may be a bit slow due to the API though.</div>
              <div className = "inputFieldGame searchGameField">
                <div className = "boldText">Game:</div>
                <input type="text" class = "searchGameInput" onChange={e => setSearchTitle(e.target.value)} />
              </div>
              
              <div className = "inputFieldGame searchGameField">
                <div className = "boldText">Your name:</div>
                <input type="text" class = "searchGameInput" onChange={e => setPersonSearch(e.target.value)} />
              </div>            
              <input className = "submitButton submitGame searchGameButton" type="submit" value="Search!" />
        </form>
      
        <div className = "searchResults">
        {searchResults.map( game => (
          <div key = {game.title} className="game">
            <div className = "gameInfo">
            
              <div className = "infoItemGame searchInfoGame">
                <img class = "gameImg" src={game.imgUrl} alt={game.game}/> 
              </div>  
            
              <div className = "infoItemGame searchInfoGame">
                <div className = "info">Game:</div>
                <div>{game.title}</div>
              </div>  
  
              <div className = "infoItemGame searchInfoGame">
                <div className = "info">Price:</div>
                <div>{game.price}</div>
              </div>  
  
            <div className = "addSearchedGame">
                <button onClick = {function(){
                  // setGame(game.title);
                  // console.log(game.title + " button clicked")
                  // setPrice(game.price);
                  addSearchedGame(game.title, game.price, game.appId);
                }}>Add game</button>             
            </div>   
              
            </div>
          </div>
        ))}
        </div>
      
      </div>
      
      <div className = "wishlist">
        <form className = "formWishlist" onSubmit={addGame}>
              <h1 className = "formHeader">Wishlist</h1>
              <div className = "inputFieldGame">
                <div>Game:</div>
                <input className = "wishlistInput" type="text" value={game} onChange={e => setGame(e.target.value)} />
              </div>

              <div className = "inputFieldGame">
                <div>Price:</div>
                <input className = "wishlistInput" type= "text" value={price} onChange={e=>setPrice(e.target.value)}></input>
              </div>

              <div className = "inputFieldGame">
                <div>Genre:</div>
                <input className = "wishlistInput" type= "text" value={genre} onChange={e=>setGenre(e.target.value)}></input>
              </div>

          
              <div className = "inputFieldGame">
                <div>Platforms:</div>
              <input className = "wishlistInput" type= "text" value={platforms} onChange={e=>setPlatforms(e.target.value)}></input>
              </div>
              
              <div className = "inputFieldGame">
                <div>Person:</div>
                <input className = "wishlistInput" type= "text" value={name} onChange={e=>setName(e.target.value)}></input>
              </div>
          
              <input className = "submitButton submitGame" type="submit" value="Submit" />
        </form>
        <h2 className = "gamesHeader">Games</h2>
        {games.map( game => (
          <div key={game.id} className="game">
            <div className = "gameInfo">
            
              <div className = "infoItemGame">
                 <img  class = "gameImg" src={game.img} alt={game.game}/> 
              </div>  
            
              <div className = "infoItemGame">
                <div className = "info">Game:</div>
                <div>{game.game}</div>
              </div>  
  
              <div className = "infoItemGame">
                <div className = "info">Price:</div>
                <div>{game.price}</div>
              </div>  
              
              <div className = "infoItemGame">
                <div className = "info">Genre:</div>
                <div>{game.genre}</div>
              </div>
  
              <div className = "infoItemGame">
                <div className = "info">Platforms:</div>
                <div>{game.platforms}</div>
              </div>  
              
              <div className = "infoItemGame">
                <div className = "info">Wishlister:</div>
                <div>{game.name}</div>
              </div> 
              
            </div>
            <div className = "updateBlock">
              <div>
                <button onClick = {e => updateGame(game)}>Update Price</button>             
                <input className = "updateInput" type = "text" onChange = {e => setPrice(e.target.value)}/>
              </div>
              <button onClick={e => deleteGame(game)}>Delete</button>

            </div>    
          </div>
        ))}
      
      
      </div>
      
      <div className = "people">
      
      
          <form onSubmit={addPerson} className = "personForm">
              <h1 className = "formHeader">Add a person to the list!</h1>
        
              <div className = "inputFieldPerson">
                <div>Name:</div>
                <input className = "wishlistInput" type= "text"  onChange={e=>setPersonName(e.target.value)}></input>
              </div>
              
              <div className = "inputFieldPerson">
                <div>Favorite genre:</div>
                <input className = "wishlistInput" type= "text" onChange={e=>setFavGenre(e.target.value)}></input>
              </div>
              <div className = "inputFieldPerson">
                <div>Preferred Platform:</div>
                <input className = "wishlistInput" type= "text" onChange={e=>setPrefPlat(e.target.value)}></input>
              </div>
            
              <div className = "inputFieldPerson">
                <div>Age:</div>
                <input className = "wishlistInput" type= "number" onChange={e=>setAge(e.target.value)}></input>
              </div>
            
              
            <input className = "submitButton" type="submit" value="Submit" />
          </form>
      
      
        <h2 className = "personHeader">People</h2>
        {people.map( person => (
          <div key={person.id} className="person">
            <div className = "personInfo">
            
              <div className = "infoItemPerson">
                <div className = "info">Name:</div>
                <div>{person.name}</div>
              </div>  
  
              <div className = "infoItemPerson">
                <div className = "info">Favorite Genre:</div>
                <div>{person.favoriteGenre}</div>
              </div>  
              
              <div className = "infoItemPerson">
                <div className = "info">Preferred Platform:</div>
                <div>{person.preferredPlatform}</div>
              </div>
  
              <div className = "infoItemPerson">
                <div className = "info">Age:</div>
                <div>{person.age}</div>
              </div>  
            </div>
            <div className = "updateBlock">
            
              <div className = "updateInfo">
                <input className = "updateInput" type = "text" onChange = {e => setFavGenre(e.target.value)}/>
                <div>Update favorite genre</div>
              </div>
              
              <div className = "updateInfo">
                <input className = "updateInput" type = "text" onChange = {e => setPrefPlat(e.target.value)}/>
                <div>Update preferred platform</div>
              </div>
              
              <div className = "updateInfo">
                <input className = "updateInput" type = "number" onChange = {e => setAge(e.target.value)}/>
                <div>Update age</div>
              </div>  
              
              <button onClick = {e => updatePerson(person)}>Update</button>
              <button onClick={e => deletePerson(person)}>Delete</button>
            </div>          

          </div>
        ))}    
      
      </div>
      
      <div className = "footer">
        https://github.com/JustJoshingYa42/CreativeProject4
      </div>
      
    </div>
  );
}

export default App;