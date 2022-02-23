const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb('678efbcb0a6b399df093b5572e25ddfd');

const newError = (name) => {
    const e = new Error(name)
    e.name = name
    return Promise.reject(e)
  }

exports.searchMovieByTitle = async (name) => {
    const parameters = {
        query: name,
        language: 'it',
    }
    try {
        const res = await moviedb.searchMovie(parameters)
        return res.results;
    } catch (error) {
        return newError(error);
    }
}

exports.searchMovieById = async (id) => {
    const parameters = {
        id: id,
        language: 'it'
    }
    try {
        const res = await moviedb.movieInfo(parameters)
        return res;
    } catch (error) {
        return newError(error);
    }
}


/*          SERIE TV            */

exports.searchSerieByTitle = async (name) => {
    const parameters = {
        query: name,
        language: 'it',
    }
    try {
        const res = await moviedb.searchTv(parameters);
        return res.results;
    } catch (error) {
        return newError(error);
    }
}

exports.searchSerieById = async (id) => {
    const parameters = {
        id: id,
        language: 'it'
    }
    try {
        const res = await moviedb.tvInfo(parameters);
        return res;
    } catch (error) {
        return newError(error);
    }
}