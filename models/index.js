//const dbConfig = require('./db.config.js');

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.movie = require('./movie.model')(mongoose, mongoosePaginate);
db.serie = require('./serie.model')(mongoose, mongoosePaginate);
db.user = require('./user.model')(mongoose);
db.admin = require('./admin.model')(mongoose);
db.Bot = require('./bot.model')(mongoose);

db.url = "mongodb+srv://andrearuta:123Stellone@cluster0.fgpjs.mongodb.net/movies_db?retryWrites=true&w=majority"


//  configurazione locale con file db.config.js
//  db.url = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;

module.exports = db;
