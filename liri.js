//add code to read and set any environment variables with the dotenv package:
require("dotenv").config();

const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
//Add the code required to import the keys.js file and store it in a variable.
const keys = require('./keys.js');

//You should then be able to access your keys information like so
const spotify = new Spotify(keys.spotify);

let apiHit = process.argv[2];

//user input
let userIn = () => {
    let search = "";
    for(let i = 3; i < process.argv.length; i++){
        search += `${process.argv[i]} `
    }
    return search.trim()
}

//appending data to a .txt file
fs.appendFile("log.txt", `${apiHit},"${userIn()}":`, (err) => {
        if(err){
            throw err
        }
        console.log('Data Added');
})    

//
const concert = function(){
    axios
      .get(`https://rest.bandsintown.com/artists/${userIn()}/events?app_id=${keys.bands.key}`)
      .then(function(response) {
        response.data.forEach(element => {
          console.log("----------------------------");
          console.log(`Arena: ${element.venue.name}`);
          console.log(`Location: ${element.venue.city}, ${element.venue.country}`);
          console.log(`Time: ${moment(element.datetime).format("MM/DD/YYYY")} \n`);
        });
      })
      .catch(function(error) {
        console.log(error);
      });
}
const song = function(param){
    spotify.search(
          { type: "track", query: `${param}`, limit: 1},
          function(err, data) {
            if (err) {
              return console.log("Error occurred: " + err);
            }
            console.log('-------------------------')
            console.log(`\nArtist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Track: ${data.tracks.items[0].name}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log(`Preview URL: ${data.tracks.items[0].preview_url} \n`);
            console.log('-------------------------\n');
          }
        );
}
const motionPic = function(){
    axios
      .get(`http://www.omdbapi.com/?apikey=${keys.ombd.key}&t=${userIn()}&type=movie`)
      .then(response => {
        console.log("\n---------------");
        console.log(`Title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`imbd: ${response.data.imbdRating}`);
        console.log(`Rotten Tomato Rating: ${response.data.Ratings[1]}`);
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Actors: ${response.data.Actors}\n`);
      }); 
}
switch(apiHit){
    case 'concert-this':
        concert(userIn())
        break    
    case 'spotify-this-song':
        song(userIn())
        break  
    case 'movie-this':
        motionPic(userIn())
        break
    case 'do-what-it-says':
        fs.readFile('./random.txt', 'utf8',(error, data) => {
            if(error){
                throw error
            }
            const newSearch = data.split(',');
            if(newSearch[0] === 'spotify-this-song'){
                song(newSearch[1])
            }
        })
    break                     
}