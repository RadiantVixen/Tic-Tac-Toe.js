import React, { useEffect, useState } from 'react';
import axios from './axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(fetchUrl);
                setMovies(request.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl(""); // Close trailer if already open
        }

        // Try finding the trailer using different movie name variations
        movieTrailer(movie?.name || movie?.title || movie?.original_name || movie?.original_title || "")
            .then((url) => {
                if (url) {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v")); // Set the YouTube video ID
                } else {
                    console.warn("Trailer not found for:", movie?.name || movie?.title);
                }
            })
            .catch((error) => console.error("Error finding trailer:", error));
    };

    return (
        <div className='row'>
            <h2>{title}</h2>
            <div className="row__posters">
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie?.name || movie?.title || "Movie Poster"}
                    />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;
