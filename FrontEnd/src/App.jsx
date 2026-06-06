import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieForm from './components/MovieForm';
import MovieGrid from './components/MovieGrid';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API = `${API_BASE}/api/movies`;

const navItems = [
  { label: 'All Movies', value: 'all' },
  { label: 'Watchlist', value: 'watchlist' },
  { label: 'Watched', value: 'watched' },
  { label: 'Favourites', value: 'favourites' },
];

const filterChips = [
  { label: 'All', value: 'all', className: '' },
  { label: '✅ Watched', value: 'watched', className: 'c-watched' },
  { label: '⏳ Unwatched', value: 'unwatched', className: 'c-unwatched' },
  { label: '🎭 Action', value: 'g-Action', className: '' },
  { label: '🎭 Drama', value: 'g-Drama', className: '' },
  { label: '🚀 Sci-Fi', value: 'g-Sci-Fi', className: '' },
  { label: '😂 Comedy', value: 'g-Comedy', className: '' },
  { label: '👻 Horror', value: 'g-Horror', className: '' },
];

function App() {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeNav, setActiveNav] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(API);
      setMovies(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addMovie = async (movieData) => {
    const res = await axios.post(API, movieData);
    const newMovie = {
      ...res.data,
      posterEmoji: movieData.posterEmoji || res.data.posterEmoji,
    };
    setMovies([newMovie, ...movies]);
    setToast({ message: '🎬 Movie added to watchlist!', type: 'green' });
  };

  const toggleWatched = async (id, watched) => {
    const res = await axios.put(`${API}/${id}`, { watched });
    setMovies(movies.map((m) => (m._id === id ? res.data : m)));
    setToast({
      message: watched ? '✅ Marked as Watched!' : '⏳ Moved back to Watchlist',
      type: 'gold',
    });
  };

  const deleteMovie = async (id) => {
    await axios.delete(`${API}/${id}`);
    setMovies(movies.filter((m) => m._id !== id));
    setToast({ message: '🗑️ Movie removed', type: 'red' });
  };

  const handleNavClick = (value) => {
    setActiveNav(value);
    if (value === 'watchlist') {
      setActiveFilter('unwatched');
    } else if (value === 'watched') {
      setActiveFilter('watched');
    } else {
      setActiveFilter('all');
    }
  };

  const visibleMovies = movies
    .filter((movie) => {
      if (activeFilter === 'watched') return movie.watched === true;
      if (activeFilter === 'unwatched') return movie.watched === false;
      if (activeFilter.startsWith('g-')) return movie.genre === activeFilter.slice(2);
      return true;
    })
    .filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()));

  const stats = {
    total: movies.length,
    watched: movies.filter((movie) => movie.watched).length,
    pending: movies.filter((movie) => !movie.watched).length,
    avg: movies.length
      ? (movies.reduce((sum, movie) => sum + (movie.rating || 0), 0) / movies.length).toFixed(1)
      : '—',
  };

  return (
    <div className="app">


      <nav className="navbar">
        <div className="nav-logo">
          🎬 CINE<span className="dot">.</span>VAULT
        </div>

        <div className="nav-links">
          {navItems.map((item) => (
            <div
              key={item.value}
              className={`nav-link ${activeNav === item.value ? 'active' : ''}`}
              onClick={() => handleNavClick(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="nav-right">
          <input
            className="search-box"
            placeholder="🔍  Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-add-movie" onClick={() => setShowForm(true)}>
            + Add Movie
          </button>
        </div>
      </nav>

      <div className="hero-strip">
        <div>
          <div className="hero-title">
            MY <span>WATCHLIST</span>
          </div>
          <div className="hero-sub">Track every film you've watched or plan to watch</div>
        </div>
        <div className="stats-strip">
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--gold)' }}>{stats.total}</div>
            <div className="stat-l">Total</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--green)' }}>{stats.watched}</div>
            <div className="stat-l">Watched</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--red)' }}>{stats.pending}</div>
            <div className="stat-l">Pending</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--gold)' }}>{stats.avg}</div>
            <div className="stat-l">Avg Rating</div>
          </div>
        </div>
      </div>

      <div className="filters">
        <span className="filter-label">Filter:</span>
        {filterChips.map((chip) => (
          <div
            key={chip.value}
            className={`chip ${chip.className} ${activeFilter === chip.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(chip.value)}
          >
            {chip.label}
          </div>
        ))}
      </div>

      <MovieGrid
        movies={visibleMovies}
        onToggle={toggleWatched}
        onDelete={deleteMovie}
        onOpenModal={() => setShowForm(true)}
      />

      {showForm && (
        <MovieForm
          onAdd={addMovie}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;
