var mysql = require("mysql");
var inquirer = require("inquirer");

// Create connection to MySql Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "MySecretPass",
    database: "topSongs_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
    // console.log("Connected" , connection.threadId);
});

function runSearch() {
    //  check connection
    //  console.log("success");
     inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Find songs by artist",
                "Find all artists who appear more than once",
                "Find data within a specific range",
                "Search for a specific song",
                "Find artists with a top song and top album in the same year"
            ]
        }).then(function (answer) {
            // Note Switch Case, may add more cases
            switch (answer.action) {
                case "Find songs by artist":
                    artistSearch();
                    break;

                case "Find all artists who appear more than once":
                    multiSearch();
                    break;

                case "Find data within a specific range":
                    rangeSearch();
                    break;

                case "Search for a specific song":
                    songSearch();
                    break;

                case "Find artists with a top song and top album in the same year":
                    songAndAlbumSearch();
                    break;
            }
        });
}

function artistSearch() {
    inquirer
      .prompt({
        name: "artist",
        type: "input",
        message: "What artist would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT position, song, year FROM top1000 WHERE ?";
        // create sql query connection
        connection.query(query, { artist: answer.artist }, function(err, res) {
            // Forloop needed because of mutltiple entries
          for (var i = 0; i < res.length; i++) {
            console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
          }
          runSearch();
        });
      });
  }

function multiSearch() {
    // make another inquirer prompt to insert the amount we prefer
    inquirer.prompt({
        name:"number",
        type:"input",
        message:"How many songs must artist have on the list?",
    }).then(function(answer){
        // /and change 1 to + answer.number
    var query = "SELECT artist FROM top1000 GROUP BY artist HAVING count(*) > " + answer.number;
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].artist);
      }
      runSearch();
    }); 
    });
  }
  
  function rangeSearch() {
    inquirer
      .prompt([
        {
          name: "start",
          type: "input",
          message: "Enter starting position: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "end",
          type: "input",
          message: "Enter ending position: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        var query = "SELECT position,song,artist,year FROM top1000 WHERE position BETWEEN ? AND ?";
        connection.query(query, [answer.start, answer.end], function(err, res) {
          for (var i = 0; i < res.length; i++) {
            console.log(
              "Position: " +
                res[i].position +
                " || Song: " +
                res[i].song +
                " || Artist: " +
                res[i].artist +
                " || Year: " +
                res[i].year
            );
          }
          runSearch();
        });
      });
  }
  
  function songSearch() {
    inquirer
      .prompt({
        name: "song",
        type: "input",
        message: "What song would you like to look for?"
      })
      .then(function(answer) {
        var query = "SELECT * FROM top1000 WHERE ?";
        connection.query(query,{song:answer.song },function(err, res){
            // try a different print pattern
          console.log("Position: " + res[0].position +"\nArtist: "+res[0].artist +"\nYear: "+res[0].year+"\n----------\n");
          runSearch();
        });
      });
  }
  
  function songAndAlbumSearch() {
    inquirer
      .prompt({
        name: "artist",
        type: "input",
        message: "What artist would you like to search for?"
      })
      .then(function(answer) {
        //   Note: leave a space at the end of string for parsing
        var query = "SELECT top_albums.year, top_albums.position, top_albums.album, top1000.song, top1000.artist FROM top_albums ";
        query += "INNER JOIN top1000 ON (top_albums.artist = top1000.artist AND top_albums.year = top1000.year) ";
        query += "WHERE (top_albums.artist = ? AND top1000.artist = ?) ORDER BY top_albums.year ";
        connection.query(query, [answer.artist, answer.artist], function(err, res) {
          console.log(res.length + " matches found!");
          for (var i = 0; i < res.length; i++) {
            console.log(
              "Album Position: " +
                res[i].position +
                " || Artist: " +
                res[i].artist +
                " || Song: " +
                res[i].song +
                " || Album: " +
                res[i].album +
                " || Year: " +
                res[i].year
            );
          }
  
          runSearch();
        });
      });
  }