const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.themoviedb.org/3/';
const configUrl = `${baseUrl}configuration?api_key=${apiKey}`;

function getConfig(url) {
    return axios.get(url)
    .then(response => {
        this.response = response.data
        return this.response;
    })
}

function getMovies(url) {
    return axios.get(url)
        .then(response => {
            this.response = response.data
            return this.response;
        }).catch(error => {
            console.log(error.message);
        })
}
 
app.get('/', function (req, res) {
    res.render('index', {title: 'Movie App', movies: [], err: ''})    
})
  
app.post('/', function (req, res) {
    const searchBaseUrl = `${baseUrl}search/movie?api_key=${apiKey}&query=`;
    const keyword = req.body.keyword;
    const requestUrl = searchBaseUrl + keyword;
    let movies = [];
    let baseImageUrl = '';
    let imageUrl = '';

    getConfig(configUrl)
    .then(data => {
        return data;   
    })
    .then(info => {
        baseImageUrl = info.images.secure_base_url; 
        imageSize = info.images.poster_sizes[3];
        getMovies(requestUrl)
        .then(data => {
            movies = data.results;
            imageUrl = `${baseImageUrl}${imageSize}`;
            res.render('index', { title: 'Movie App', imageUrl: imageUrl, movies: movies, err: '' })
        }).catch(error => {
            res.render('index', {title: 'Movie App', movies: [], err: 'Cannot get movies...'})
        });
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server listening on port 3000...');
})
