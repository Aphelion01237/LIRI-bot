require("dotenv").config();
var fs = require("fs");
var moment = require('moment');
const axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var userRequest = process.argv[2];
var userInput = process.argv[3];
errorLogger(userRequest, userInput);
liriBot(userRequest);

function concertFinder() {
    var artist = userInput;
    axios("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=anyplaceholderwilldo").then(function (response) {

        response.data.forEach((event) => {
            console.log("******************")
            console.log("Venue: " + event.venue.name)
            console.log("City: " + event.venue.city)
            var date = moment(event.datetime)
            console.log("When: " + date.format("MM/DD/YYYY"))

        });
    })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};
function songFinder(userInput) {
    var song = userInput;

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        playList = data.tracks.items;

        playList.forEach(function (element) {
            console.log('----------------********************----------------')
            console.log(element.artists[0].name)
            console.log(element.name)
            console.log(element.href)
            console.log(element.album.name)
            console.log('----------------********************----------------')
        })
    });
};
function movieFinder(userInput) {
    var movie = userInput;
    axios("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(function (response) {

            console.log("****************************************")
            console.log("The Title: " + response.data.Title);
            console.log("Year:" + response.data.Year);
            console.log("imdb Rating: " + response.data.imdbRating);
            console.log("Rotton Tomatos: " + response.data.Ratings[1].Value);
            console.log("Produced in: " + response.data.Country);
            console.log("Languages: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("***************************************")
    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
};
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var data = data.split(",");
        userInput = data[1];
        liriBot(data[0]);

    })
};
function liriBot(userRequest) {

    switch (userRequest) {
        case "concert-this":
            concertFinder(userInput);
            break;
        case "spotify-this-song":
            songFinder(userInput);
            break;
        case "movie-this":
            if (!userInput) {
                console.log("Y U NO PICK")
                userInput = "Mr. Nobody"
            }
            movieFinder(userInput);
            break;
        case "do-what-it-says":
            doWhatItSays(userInput);
            break;
        default:
            console.log("ERROR DOES NOT COMPUTE")

    };
}
function errorLogger(userRequest, userInput) {
    fs.appendFile("log.txt", userRequest + ", " + userInput + ", ", (error) => {
        if (error) {
            console.log(error)
        }
    })
} 