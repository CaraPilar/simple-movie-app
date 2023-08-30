const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const { requestMoviesDB } = require('./movie-route');

dotenv.config();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = process.env.API_KEY; // The Movie DB API Key
const baseUrl = 'https://api.themoviedb.org/3/';
const configUrl = `${baseUrl}configuration?api_key=${apiKey}`;

app.get('/', function (req, res) {
    res.render('index', {title: 'Movie App', movies: [], err: ''})    
})

// function checkGenre(id) {
//     // return movies in Action, Adventure, Fantasy, Family, and Science Fiction
//     return id === 28 || id ===12 || id === 14 || id === 10751 || id === 878;
// }
  
app.post('/', function (req, res) {
    const searchBaseUrl = `${baseUrl}search/movie?api_key=${apiKey}&query=`;
    const keyword = req.body.keyword;
    const requestUrl = searchBaseUrl + keyword;

    requestMoviesDB(configUrl).then(configData=> {
        return configData;   // return system wide configuration information - cache this data
    }).then(info => {
        if(info) { 
            const baseImageUrl = info.images.secure_base_url; 
            const imageSize = info.images.poster_sizes[3];
            let imageUrl = `${baseImageUrl}${imageSize}`;
            let movies = [];
            // let englishMovies= [];

            requestMoviesDB(requestUrl).then(movieData => {
                movies = movieData.results;
                // englishMovies = movies.filter(movie => 
                //     movie.original_language === 'en' 
                // );
                return movies;      
            }).then((data) => {
                let promises = [];
                let filteredMovies = [];
                // filter movies by content rating
                data.forEach(function(movie) {
                    promises.push(
                        requestMoviesDB(`${baseUrl}movie/${movie.id}/release_dates?api_key=${apiKey}`).then(response => {
                            response.results.forEach(function(item) {
                                if(item.iso_3166_1 === 'US' && (item.release_dates[0].certification === 'G' || item.release_dates[0].certification === 'PG' || item.release_dates[0].certification === 'PG-13' || item.release_dates[0].certification === '')) {
                                    filteredMovies.push(movie)
                                }
                            })
                        })
                    )             
                })

                Promise.all(promises).then(()=> {
                    res.render('index', { title: 'Movie App', imageUrl: imageUrl, movies: filteredMovies, err: '' })
                })
            }).catch(error => {
                console.log(error);
                res.render('index', {title: 'Movie App', movies: [], err: ' Error: Cannot get movies...'})
            });

        } else {
            res.render('index', {title: 'Movie App', movies: [], err: 'Error: Cannot get movies...'})
        }
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server listening on port 3000...');
})
