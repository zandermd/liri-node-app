//add code to read and set any environment variables with the dotenv package
require('dotenv').config();

//add the code required to import the keys.js file and store it in a variable
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const fs = require(`fs`);

//access your keys information
const spotify = new Spotify(keys.spotify);


//returns an array containing the command line arguments passed
let nodeArgs = process.argv;
let command = process.argv[2];

//capture user input
let userInput = '';
for (let i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        userInput = `${userInput}+${nodeArgs[i]}`;
    }
    else {
        userInput += nodeArgs[i];
    }
}

//switch stmnts
switch (command) {
    case 'concert-this':
        concertSearch(userInput);
        break;

    case 'spotify-this-song':
        spotifySearch(userInput);
        break;

    case 'movie-this':
        movieSearch(userInput);
        break;

    case 'do-what-it-says':
        randomTxt();
        break;

    default:
        console.log(`
    Oops! Please enter a valid command:
    For concert info, enter 'concert-this' and an artist
    For movie info, enter 'movie-this' and a movie name
    For song info, enter 'spotify-this-song' and a song name
    Or surprise yourself by entering 'do-what-it-says'!
    `)
}

//using bands in town api to pull concert info concert-this
function concertSearch(userInput) {
    if (!userInput) {
        userInput = `Blink 182`;
        console.log(`Can't think of a band you want to see? Treat yourself to some 90s alt!
        `);
    }

    let concertUrl = `https://rest.bandsintown.com/artists/${userInput}/events?app_id=codingbootcamp`;

    axios.get(concertUrl).then(
        function (response) {
            if (response.data[0] === undefined) {
                console.log(`No upcoming events for that artist...try another one!`);
            }
            else {
                console.log(`Artist: ${response.data[0].lineup[0]}`);
                console.log(`Venue: ${response.data[0].venue.name}`);
                console.log(`Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country}`);
                let momentDate = moment(response.data[0].datetime).format(`MM DD YYYY`);
                console.log(`Date: ${momentDate}`);
                let exportConcert = (`concert-this / Artist: ${response.data[0].lineup[0]} / Venue: ${response.data[0].venue.name} / Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country} / Date: ${momentDate},
            `);
                fs.appendFile('log.txt', exportConcert, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`
                    Concert information added to search log!`);
                    }
                })
            }

        }
    ).catch(function (error) {
        console.log(error);
    });
} // ends concertSearch function


////axios for OMDB API
function movieSearch(userInput) {
    if (!userInput) {
        userInput = `Mr.+Nobody`;
        console.log(`Can't think of a movie to search for? Here's one you might like!
         `);
    }

    let movieUrl = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=trilogy`;

    axios.get(movieUrl).then(
        function (response) {
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
            fs.appendFile('log.txt', exportMovie, function (err) {
                if (err) {
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


//using spotify api to pull song info spofity-this-song
function spotifySearch(userInput) {
    if (!userInput) {
        userInput = `The Sign Ace of Base`;
        console.log(`Uh-oh, you didn't input a song name! Try again!
        `);
    }

    spotify.search({ type: `track`, query: userInput, limit: 1 })
        .then(function (response) {
            //console.log(JSON.stringify(response, null, 2));
            console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
            console.log(`Song Title: ${response.tracks.items[0].name}`);
            console.log(`Album: ${response.tracks.items[0].album.name}`);
            let preview;
            if (response.tracks.items[0].preview_url === undefined || response.tracks.items[0].preview_url === null) {
                preview = `Sorry...there is no preview available for this song!`;
            } else {
                preview = response.tracks.items[0].preview_url;
            }
            console.log(`Preview URL: ${preview}`);
            let exportTrack = (`spotify-this-song / Artist: ${response.tracks.items[0].artists[0].name} / Song Title: ${response.tracks.items[0].name} / Album: ${response.tracks.items[0].album.name},
               `);
            fs.appendFile('log.txt', exportTrack, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Track information added to search log!`);
                }
            })
        })
        .catch(function (err) {
            console.log(err);
        });
} // ends spotifySearch function

//output of the data to a log.txt file 
function randomTxt() {
    fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        //console.log(data);

        let dataArr = data.split(',');

        //console.log(dataArr);

        if (dataArr[0] === 'spotify-this-song') {
            let textSong = dataArr[1];
            console.log(textSong);
            spotifySearch(textSong);
        }
        else if (dataArr[0] === 'concert-this') {
            let textArtist = dataArr[1];
            console.log(textArtist);
            concertSearch(textArtist);
        }
        else if (dataArr[0] === 'movie-this') {
            let textMovie = dataArr[1];
            console.log(textMovie);
            movieSearch(textMovie);
        }
    });
} // ends randomTxt function
