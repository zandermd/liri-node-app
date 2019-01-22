//add code to read and set any environment variables with the dotenv package
require("dotenv").config();

//package requirements
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');

//Add the code required to import the keys.js file and store it in a variable
const keys = require('./keys.js');

//access your keys information
const spotify = new Spotify(keys.spotify);

//returns an array containing the command line arguments passed
let api = process.argv[2];

//user input
let userIn = () => {
    let search = [];
    for (let i = 3; i < process.argv.length; i++) {
        search += `${process.argv[i]} `
    }
    return search.trim() //trim results
}

//output of the data to a log.txt file 
fs.appendFile("log.txt", `${api},"${userIn()}":`, (err) => {
    if (err) {
        throw err
    }
    //console.log('Added');
})


//using bands in town api to pull concert info concert-this
const concert = function () {
    axios.get(`https://rest.bandsintown.com/artists/${userIn()}/events?app_id=${keys.bands.key}`)
        .then(function (response) {
            response.data.forEach(element => {
                console.log("----------------------------");
                console.log(`Arena: ${element.venue.name}`);
                console.log(`Location: ${element.venue.city}, ${element.venue.country}`);
                console.log(`Time: ${moment(element.datetime).format("MM/DD/YYYY")} \n`);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

//using spotify api to pull song info spofity-this-song
const song = function (param) {
    spotify.search(
        { type: "track", query: `${param}`, limit: 1 },
        function (err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            console.log('\n---------------')
            console.log(`\nArtist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Track: ${data.tracks.items[0].name}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log(`Preview URL: ${data.tracks.items[0].preview_url} \n`);
            console.log('---------------\n');
        }
    );
}

//axios for OMDB API
function motionPic(userInput) {
    if(!userInput) {
         userInput = `Mr.+Nobody`;
         console.log(`Can't think of a movie to search for, huh? Here's one you might like!
         `);
    }

    let movieUrl = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=trilogy`;

    axios.get(movieUrl).then(
        function(response) {
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
            let exportMovie = (`movie-this / Title: ${response.data.Title} / Year: ${response.data.Year} / Plot: ${response.data.Plot},
            `)
            fs.appendFile('log.txt', exportMovie, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Movie information added to search log!`);
                    }
                })
        }
      ).catch(function (error) {
        console.log(error);
      });
} // ends movieSearch function
// const motionPic = function () {
//     if(!userIn){
//         userIn = `Mr. +Nobody`;
//         console.log(`Can't think of a movie? Here's a movie you might like!`);
//     }
//     let movieUrl = `http://www.omdbapi.com/?t=${userIn}&y=&plot=short&apikey=trilogy`;
//     axios.get(movieUrl).then(
//         function (response) {
//             console.log("\n---------------");
//             console.log("\n---------------");
//             console.log(`Title: ${response.data.Title}`);
//             console.log(`Year: ${response.data.Year}`);
//             console.log(`imbd: ${response.data.imbdRating}`);
//             console.log(`Rotten Tomato Rating: ${response.data.Ratings[1].Value}`);
//             console.log(`Country: ${response.data.Country}`);
//             console.log(`Language: ${response.data.Language}`);
//             console.log(`Plot: ${response.data.Plot}`);
//             console.log(`Actors: ${response.data.Actors}\n`);

//         }
//     );
// }

switch (api) {
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
        fs.readFile('./random.txt', 'utf8', (error, data) => {
            if (error) {
                throw error
            }
            const newSearch = data.split(',');
            if (newSearch[0] === 'spotify-this-song') {
                song(newSearch[1])
            }
        })
        break
}