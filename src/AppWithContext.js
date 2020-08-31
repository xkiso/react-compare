import React, { useContext, useState, useCallback, Fragment, memo } from 'react';
import './App.css';

const movieList = [
  { id: 0, name: 'The Shawshank Redemption', likes: 0 },
  { id: 1, name: 'The Godfather', likes: 0 },
  { id: 2, name: 'The Godfather: Part II', likes: 0 },
  { id: 3, name: 'The Dark Knight', likes: 0 },
  { id: 4, name: '12 Angry Men', likes: 0 },
  { id: 5, name: "Schindler's List", likes: 0 },
  { id: 6, name: 'The Lord of the Rings: The Return of the King ', likes: 0 },
  { id: 7, name: 'Pulp Fiction', likes: 0 },
  { id: 8, name: 'The Good, the Bad and the Ugly', likes: 0 },
  { id: 9, name: 'The Lord of the Rings: The Fellowship of the Ring', likes: 0 },
];

// First thing you do is create MovieContent using React.createContext()
// What createContext() gives you is a Provider and Consumer
const MovieContext = React.createContext([]);

const MovieProvider = (props) => {
  const [movies, setMovies] = useState(movieList);

  const updateLikes = (id, value) => {
    setMovies((movies) => {
      const index = movies.findIndex((movie) => movie.id === id);
      const movie = movies[index];
      return [...movies.slice(0, index), { ...movie, likes: movie.likes + value }, ...movies.slice(index + 1)];
    });
  };

  // We use React.Memo to wrap the 'Movie' component, which works by itself works by caching each movie
  // But in MovieProvider, everytime the movie changes, we recreate 'like' and 'dislike' functions so we wrap them in useCallback() to cache functions as well
  const like = useCallback((id) => updateLikes(id, 1), []);
  const dislike = useCallback((id) => updateLikes(id, -1), []);

  // We pass in the MovieContext value as an array and render all the children - so all children can access this value
  return <MovieContext.Provider value={[movies, like, dislike]}>{props.children}</MovieContext.Provider>;
};

// You wrap components inside MovieProvider and that gives each component access, via Consumer, to MovieProvider's value
const App = () => (
  <Fragment>
    <MovieProvider>
      <Nav />
      <Body />
    </MovieProvider>
  </Fragment>
);

// In 'Nav' component', we can use useContext (and pass in MovieContext) and destructure 'movies' out of 'MovieContext'
const Nav = () => {
  const [movies] = useContext(MovieContext);
  const topMovieName = movies.reduce((max, current) => (current.likes > max.likes ? current : max), movies[0]).name;
  const totalLikes = movies.reduce((accumulator, movie) => accumulator + movie.likes, 0);

  return (
    <div className="nav">
      <TopMovie topMovieName={topMovieName} />
      <TotalLikes totalLikes={totalLikes} />
    </div>
  );
};

const TopMovie = ({ topMovieName }) => <div>{topMovieName}</div>;

const TotalLikes = ({ totalLikes }) => <div>Total Likes: {totalLikes}</div>;

const Body = () => (
  <div className="body">
    <Movies />
  </div>
);

// In Movies component, we deconstruct 'movies', 'like', and 'dislike' from 'MovieContext'
const Movies = () => {
  const [movieIds] = useState(movieList.map((movie) => movie.id));
  const [movies, like, dislike] = useContext(MovieContext);

  return (
    <div>
      <h2>Movies</h2>
      <div className="movie-list">
        {movieIds.map((id) => (
          <Movie key={id} movie={movies[id]} like={like} dislike={dislike} />
        ))}
      </div>
    </div>
  );
};

// Memo by itself works by caching each movie
// But in provider, everytime the movie changes, we recreate like and dislike function so we wrap them in useCallback() to cache functions
const Movie = memo(({ movie, like, dislike }) => {
  console.log('render: ', movie.id)
  return (
    <div className="movie-item">
      <div>{movie.name}</div>
      <div>{movie.likes}</div>
      <div>
        <button onClick={() => like(movie.id)}>
          <span role="img" aria-label="like">
            👍🏼
        </span>
        </button>
        <button onClick={() => dislike(movie.id)}>
          <span role="img" aria-label="dislike">
            👎🏼
        </span>
        </button>
      </div>
    </div>
  );
});

export default App;