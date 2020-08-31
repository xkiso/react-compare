import React, { useState, Fragment } from 'react';
import './App.css';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';

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

const {
  actions: { like, dislike },
  reducer,
  // createSlice here is from Redux Toolkit
} = createSlice({
  name: 'movies',
  // assigning initialState here, same movieList as before
  initialState: movieList,
  // We have two reducers, like and dislike
  // createSlice will take each key from our reducer and turn it into an action; returns actions and reducers
  // Within those actions, we have an action for each of these keys: like and dislike 
  // When we dispatch these actions, it will run the reducer here
  reducers: {
    like: (state, action) => {
      // It looks like we're mutating state but Redux is shipped with library called Immer which allows you to seem like you're 'mutating' or 'modifying' state
      // Under the hood, Immer is updating state for you
      state[action.payload].likes += 1;
    },
    dislike: (state, action) => {
      // Under the hood, Immer is updating state for you here as well
      state[action.payload].likes -= 1;
    },
  },
});

const store = configureStore({ reducer });

// We're mapping the state to props so they can be passed into the component via connect method 
const mapStateMovie = (state, props) => ({ movie: state[props.id] });
const mapStateNav = (state) => ({
  topMovieName: state.reduce((max, current) => (current.likes > max.likes ? current : max), state[0]).name,
  totalLikes: state.reduce((accumulator, movie) => accumulator + movie.likes, 0),
});

const mapDispatch = { like, dislike };

// We have Provider wrapped around entire app with store so we can access that from within any component
const App = () => (
  <Fragment>
    <Provider store={store}>
      <Nav />
      <Body />
    </Provider>
  </Fragment>
);

// Nav bar now takes in the movie name and likes as props and we have connect function to map the state to these two props here
const Nav = connect(mapStateNav)(({ topMovieName, totalLikes }) => (
  <div className="nav">
    <TopMovie topMovieName={topMovieName} />
    <TotalLikes totalLikes={totalLikes} />
  </div>
));

const TopMovie = ({ topMovieName }) => <div>{topMovieName}</div>;

const TotalLikes = ({ totalLikes }) => <div>Total Likes: {totalLikes}</div>;

const Body = () => (
  <div className="body">
    <Movies />
  </div>
);

// Movies hasn't changed from original App.js - still has list of IDs and passing in IDs
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

// Updated Movie component, taking in mapState and mapDispatch and using movie ID to pass in as props
// Cool thing here is that rendering is already optimized for each movie
// Connect function here does some pre-optimization, memo-izes component out of the box
const Movie = connect(
  mapStateMovie,
  mapDispatch
)(({ movie, like, dislike }) => {
  console.log("render: ", movie.id)
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
  )
});

export default App;