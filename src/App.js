import React, { Fragment, useState } from 'react';
import './App.css';

/** 
 * STATE OF MOVIE IS KEPT IN MOVIE COMPONENT
 * NO WAY FOR OTHER COMPONENTS IN TREE TO ACCESS IT
 * AS WE UPDATE EACH MOVIE, THE TOTAL LIKES AND HARD-CODED MOVIE DOESN'T UPDATE
 */

const movieList = [
  { id: 0, name: "The Shawshank Redemption", likes: 0 },
  { id: 1, name: "The Godfather", likes: 0 },
  { id: 2, name: "The Godfather II", likes: 0 },
  { id: 3, name: "The Dark Knight", likes: 0 },
  { id: 4, name: "12 Angry Men", likes: 0 },
  { id: 5, name: "Schindler's List", likes: 0 },
  { id: 6, name: "Return of the King", likes: 0 },
  { id: 7, name: "Pulp Fiction", likes: 0 },
  { id: 8, name: "The Good, the Bad and the Ugly", likes: 0 },
  { id: 9, name: "Fellowship of the Ring", likes: 0 }
];

const App = () => (
  <Fragment>
    <Nav />
    <Body />
  </Fragment>
);

const Nav = () => {
  const [movies] = useState([{ id: 0, name: "Hard-Coded Movie", likes: 0 }]);
  const topMovieName = movies.reduce((max, current) => (current.likes > max.likes ? current : max), movies[0]).name;
  const totalLikes = movies.reduce((acc, movie) => acc + movie.likes, 0);

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
  const [movieIds] = useState(movieList.map(movie => movie.id));

  return (
    <div className="movie-title">
      <h2>Movies</h2>
      <div className="movie-list">
        {movieIds.map(id => (<Movie key={id} id={id} />))}
      </div>
    </div>
  );
};

const Movie = ({ id }) => {
  const [movie, setMovie] = useState(movieList[id]);

  const updateLikes = value => {
    setMovie(m => ({ ...m, likes: m.likes + value }))
  };

  const like = () => updateLikes(1);
  const dislike = () => updateLikes(-1);

  return (
    <div className="movie-item">
      <div>{movie.name}</div>
      <div>{movie.likes}</div>
      <div>
        <button onClick={() => like()}>
          <span role="img" aria-label="like">👍🏼</span>
        </button>
        <button onClick={() => dislike()}>
          <span role="img" aria-label="like">👎🏼</span>
        </button>
      </div>
    </div>
  );
};

export default App;