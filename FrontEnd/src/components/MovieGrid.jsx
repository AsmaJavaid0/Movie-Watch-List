import MovieCard from './MovieCard';

function MovieGrid({ movies, onToggle, onDelete, onOpenModal }) {
  return (
    <div className="grid-wrap">
      <div className="add-card" onClick={onOpenModal} role="button" tabIndex={0}>
        <div className="add-big">+</div>
        <div className="add-title">Add new movie</div>
        <span>Click to add a film to your watchlist</span>
      </div>

      {movies.length === 0 ? (
        <div className="no-results">
          <div className="big">No movies yet.</div>
          <div>Try adding one or adjust the filters.</div>
        </div>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
export default MovieGrid;