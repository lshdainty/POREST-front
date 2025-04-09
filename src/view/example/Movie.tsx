import {useEffect, useState} from 'react';

const Movie = () => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year`
    )
    .then((resp) => resp.json())
    .then((json) => {
      setMovie(json.data.movies)
      setLoading(false)
    })
  }, []);

  console.log(movie);

  return ( 
    <div>
        {loading ? <h1>Loading.......</h1> : <div>{movie.map(m => <div key={m.id}>{m.title}</div>)}</div>}
    </div>
  )
}

export default Movie;