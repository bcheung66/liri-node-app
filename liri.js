require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");
var key = require("./key");

var log = fs.createWriteStream('./hw.log', { flags: 'a' })

var command = process.argv[2];
var arg = process.argv[3];

var execCmd = function () {
    if (command === "my-tweets") {
        var twitter = new Twitter(key.twitter);
        twitter.get('search/tweets', { q: 'bcheung2018' }, function (error, tweets, response) {
            if (error) {
                console.log(error);
                log.write(error);
            }

            tweets.statuses.forEach(status => {
                console.log(status.text + " created at " + status.created_at);
                log.write(status.text + " created at " + status.created_at + "\r\n");
            });
        });
    }
    else if (command === "spotify-this-song") {
        var spotify = new Spotify(key.spotify);

        if (arg !== undefined) {
            //console.log(process.argv[2] + "-" + arg);
            spotify.search({ type: 'track', query: arg, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                    return log.write('Error occurred: ' + err);
                }
                //console.log(data);
                data.tracks.items.forEach(element => {
                    console.log("Preview link: " + element.preview_url);
                    log.write("Preview link: " + element.preview_url + "\r\n");
                    console.log("Album: " + element.album.name);
                    log.write("Album: " + element.album.name + "\r\n");
                    element.artists.forEach(artist => {
                        console.log("Artist(s): " + artist.name);
                        log.write("Artist(s): " + artist.name + "\r\n");
                    })
                    console.log("Song: " + element.name);
                    log.write("Song: " + element.name + "\r\n");
                });
            });
        }
        else {
            /* console.log("No song specified!");
            log.write("No song specified!" + "\r\n"); */
            console.log("\"The Sign\" by Ace of Base.");
            log.write("\"The Sign\" by Ace of Base." + "\r\n");

            var arg1 = "Ace of Base"
            //console.log(process.argv[2] + "-" + arg);
            spotify.search({ type: 'track', query: arg1, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                    return log.write('Error occurred: ' + err);
                }
                //console.log(data);
                data.tracks.items.forEach(element => {
                    console.log("Preview link: " + element.preview_url);
                    log.write("Preview link: " + element.preview_url + "\r\n");
                    console.log("Album: " + element.album.name);
                    log.write("Album: " + element.album.name + "\r\n");
                    element.artists.forEach(artist => {
                        console.log("Artist(s): " + artist.name);
                        log.write("Artist(s): " + artist.name + "\r\n");
                    })
                    console.log("Song: " + element.name);
                    log.write("Song: " + element.name + "\r\n");
                });
            });
        }
    }
    else if (command === "movie-this") {
        if (arg === undefined) {
            request('http://www.omdbapi.com/?apikey=de266c37&t=' + "Mr. Nobody.",
                function (error, response, bodyStr) {
                    if (response.statusCode === 200) {
                        var body = JSON.parse(bodyStr);
                        console.log("Title: " + body.Title);
                        log.write("Title: " + body.Title + "\r\n");
                        console.log("Year: " + body.Year);
                        log.write("Year: " + body.Year + "\r\n");
                        console.log("IMDB Rating: " + body.imdbRating);
                        log.write("IMDB Rating: " + body.imdbRating + "\r\n");
                        body.Ratings.forEach(rating => {
                            if (rating.Source === "Rotten Tomatoes") {
                                console.log("Rotten Tomatoes Rating: " + rating.Value);
                                log.write("Rotten Tomatoes Rating: " + rating.Value) + "\r\n";
                            }
                        })
                        console.log("Country: " + body.Country);
                        log.write("Country: " + body.Country + "\r\n");
                        console.log("Language: " + body.Language);
                        log.write("Language: " + body.Language + "\r\n");
                        console.log("Plot: " + body.Plot);
                        log.write("Plot: " + body.Plot + "\r\n");
                        console.log("Actors: " + body.Actors);
                        log.write("Actors: " + body.Actors + "\r\n");
                    }
                })
        }
        else {
            request('http://www.omdbapi.com/?apikey=de266c37&t=' + arg,
                function (error, response, bodyStr) {
                    if (response.statusCode === 200) {
                        var body = JSON.parse(bodyStr);
                        console.log("Title: " + body.Title);
                        log.write("Title: " + body.Title + "\r\n");
                        console.log("Year: " + body.Year);
                        log.write("Year: " + body.Year + "\r\n");
                        console.log("IMDB Rating: " + body.imdbRating);
                        log.write("IMDB Rating: " + body.imdbRating + "\r\n");
                        body.Ratings.forEach(rating => {
                            if (rating.Source === "Rotten Tomatoes") {
                                console.log("Rotten Tomatoes Rating: " + rating.Value);
                                log.write("Rotten Tomatoes Rating: " + rating.Value + "\r\n");
                            }
                        })
                        console.log("Country: " + body.Country);
                        log.write("Country: " + body.Country + "\r\n");
                        console.log("Language: " + body.Language);
                        log.write("Language: " + body.Language + "\r\n");
                        console.log("Plot: " + body.Plot);
                        log.write("Plot: " + body.Plot) + "\r\n";
                        console.log("Actors: " + body.Actors);
                        log.write("Actors: " + body.Actors + "\r\n");
                    }
                })
        }
    }
}

if (command === "do-what-it-says") {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) {
            console.log("Cannot access the file: random.txt");
            log.write("Cannot access the file: random.txt" + "\r\n");
        }
        command = data.split(",")[0];
        arg = data.split(",")[1];
        execCmd();
    });
}
else {
    execCmd();
}