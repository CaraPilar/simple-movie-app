const axios = require('axios');

function requestMoviesDB(url) {
    return axios.get(url)
        .then(response => {
            this.response = response.data
            return this.response;
        }).catch(error => {
            console.log('Error: ' + error.message);
        })
}


module.exports = { requestMoviesDB };