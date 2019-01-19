const dotEnv = require("dotenv").config();
var keys = require("./keys.js");
var spotify = new spotify(keys.spotify);

var userInput = process.argv[2];

var request = require("request");
var nodeArgs = process.argv;

var movie = function () {
    var movieName = "";

    
}