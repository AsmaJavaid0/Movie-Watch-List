function MovieCard({ movie, onToggle, onDelete }) {
  const poster = movie.posterUrl ? (
    <img src={movie.posterUrl} alt={movie.title} className="card-poster" />
  ) : (
    <div className="card-placeholder">
      {movie.posterEmoji || '🎬'}
    </div>
  );

  return (
    <div className="movie-card">
      {poster}

      <div className={`watched-badge ${movie.watched ? 'yes' : 'no'}`}>
        {movie.watched ? '✅ Watched' : '⏳ Pending'}
      </div>

      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>

        <div className="card-meta">
          <span className={`card-genre g-${movie.genre}`}>{movie.genre}</span>
          <span className="card-year">{movie.releaseYear}</span>
        </div>

        <div className="star-row">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} className={`star ${index < movie.rating ? 'lit' : ''}`}>
              ★
            </span>
          ))}
          <span className="rating-num">{movie.rating}/10</span>
        </div>

        <div className="card-actions">
          <button
            className={`c-btn ${movie.watched ? 'bw-yes' : 'bw-no'}`}
            onClick={() => onToggle(movie._id, !movie.watched)}
          >
            {movie.watched ? '✅ Watched' : '⏳ Mark Watched'}
          </button>
          <button className="c-btn bdel" onClick={() => onDelete(movie._id)}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;