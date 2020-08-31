import React, { useState, memo, Fragment } from 'react';
import './App.css';
import { atom, RecoilRoot, selector, useRecoilState, useRecoilValue } from 'recoil';

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

// Defining an atom
// Atom here is wrapped in a function that takes in a movie id, and gives you back the key for that movie
const movieWithId = (id) =>
  // Typically would wrap this around/in memo function
  atom({
    key: `movie-${id}`,
    default: movieList[id],
  });

// Defining first selector
// Have access to existing atoms so we're taking movie IDs and mapping them and getting all movies
const topMovieNameState = selector({
  key: 'topMovieName',
  get: ({ get }) => {
    // This could have been in its own selector with its own atom instead of duplication
    const movieIds = movieList.map((movie) => movie.id);
    // This could have been in its own selector with its own atom instead of duplication
    const movies = movieIds.map((id) => get(movieWithId(id)));
    return movies.reduce((max, current) => (current.likes > max.likes ? current : max), movies[0]).name;
  },
});

// Defining second selector
const totalLikesState = selector({
  key: 'totalLikes',
  get: ({ get }) => {
    // This could have been in its own selector with its own atom instead of duplication
    const movieIds = movieList.map((movie) => movie.id);
    // This could have been in its own selector with its own atom instead of duplication
    const movies = movieIds.map((id) => get(movieWithId(id)));
    return movies.reduce((accumulator, movie) => accumulator + movie.likes, 0);
  },
});

// Wrap app in RecoilRoot to give access to all the components to the atoms and selectors
const App = () => (
  <Fragment>
    <RecoilRoot>
      <Nav />
      <Body />
    </RecoilRoot>
  </Fragment>
);

// The movieName and totalLikes calls the selectors directly via useRecoilValue
// Can access state directly
const Nav = () => {
  const topMovieName = useRecoilValue(topMovieNameState);
  const totalLikes = useRecoilValue(totalLikesState);

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

const Movies = () => {
  const [movieIds] = useState(movieList.map((movie) => movie.id));

  return (
    <div>
      <h2>Movies</h2>
      <div className="movie-list">
        {movieIds.map((id) => (
          <Movie key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

// useRecoilState instead of useState
// Can access state directly
// Movie component itself is creating the state so re-rendering once
const Movie = memo(({ id }) => {
  const [movie, setMovie] = useRecoilState(movieWithId(id));

  const updateLikes = (value) => {
    setMovie((m) => ({ ...m, likes: m.likes + value }));
  };

  const like = () => updateLikes(1);
  const dislike = () => updateLikes(-1);

  return (
    <div className="movie-item">
      <div>{movie.name}</div>
      <div>{movie.likes}</div>
      <div>
        <button onClick={() => like()}>
          <span role="img" aria-label="like">
            👍🏼
          </span>
        </button>
        <button onClick={() => dislike()}>
          <span role="img" aria-label="dislike">
            👎🏼
          </span>
        </button>
      </div>
    </div>
  );
});

export default App;