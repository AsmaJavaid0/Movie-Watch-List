import { useState } from 'react';
import axios from 'axios';

const genres = ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Horror', 'Romance', 'Thriller'];
const statuses = ['Plan to Watch', 'Watching', 'Watched'];
const emojiChoices = ['🎬', '🍿', '🚀', '👻', '🎭', '🤖', '😱'];
const emojiList = [
  '🎬','🍿','🚀','👻','🎭','🤖','😱','🎥','🎞️','📽️','🌟','🔥','🥇','🏆','💥','🎧','🎸','🎺','🎹','🪩','👽','🧙‍♂️','🦸‍♀️','🦹‍♂️','🕵️‍♂️','👑','👾','🎯','🎲','🪐','🌌','🌠','✨','💫','🪄','🔮','🤩','😎','🧨','⚔️',
];

function MovieForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Action',
    releaseYear: '',
    rating: 5,
    status: 'Plan to Watch',
    posterEmoji: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setRating = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let posterUrl = '';
    let posterPublicId = '';

    const API_BASE = import.meta.env.VITE_API_URL || '';

    if (imageFile) {
      const data = new FormData();
      data.append('poster', imageFile);

      const uploadRes = await axios.post(`${API_BASE}/api/uploads`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      posterUrl = uploadRes.data.url;
      posterPublicId = uploadRes.data.publicId;
    }

    await onAdd({
      ...formData,
      watched: formData.status === 'Watched',
      posterUrl,
      posterPublicId,
    });
    setUploading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">ADD NEW MOVIE</div>
        <button className="modal-close" onClick={onClose} type="button">
          ✕
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-group full">
            <label className="form-label">Movie Title *</label>
            <input
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The Dark Knight"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select
                className="form-select"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Release Year</label>
              <input
                className="form-input"
                name="releaseYear"
                type="number"
                min="1900"
                max="2099"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder="e.g. 2024"
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Your Rating</label>
              <div className="star-picker">
                {Array.from({ length: 10 }, (_, idx) => {
                  const value = idx + 1;
                  return (
                    <span
                      key={value}
                      className={value <= formData.rating ? 'sp lit' : 'sp'}
                      onClick={() => setRating(value)}
                      role="button"
                      tabIndex={0}
                    >
                      ★
                    </span>
                  );
                })}
                <span className="sp-label">{formData.rating} /10</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Poster emoji</label>
              <button
                type="button"
                className="emoji-open-btn"
                onClick={() => setEmojiDialogOpen((open) => !open)}
              >
                {formData.posterEmoji || 'Choose emoji'}
              </button>
              <input
                className="form-input"
                name="posterEmoji"
                value={formData.posterEmoji}
                onChange={handleChange}
                onFocus={() => setEmojiDialogOpen(true)}
                placeholder="Type your emoji here"
              />
              {emojiDialogOpen && (
                <div className="emoji-dialog">
                  <input
                    className="emoji-search"
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    placeholder="Search emoji..."
                  />
                  <div className="emoji-grid">
                    {emojiList
                      .filter((emoji) =>
                        !emojiSearch || emoji.includes(emojiSearch.trim())
                      )
                      .map((emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          className={`emoji-item ${formData.posterEmoji === emoji ? 'active' : ''}`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, posterEmoji: emoji }));
                            setEmojiDialogOpen(false);
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group full">
              <label className="form-label">Movie Poster Image</label>
              <div className="upload-zone">
                <div className="up-icon">☁️</div>
                <div className="up-text">Click to select a poster image</div>
                <div className="up-sub">In the real MERN app this uploads to Cloudinary</div>
                <div className="c-badge">☁️ Powered by Cloudinary</div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              {imagePreview && (
                <div className="preview-img-wrap">
                  <img src={imagePreview} alt="Poster preview" />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-cancel" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-save" type="submit" disabled={uploading}>
              {uploading ? '☁️ Uploading...' : '🎬 Save to Watchlist'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
export default MovieForm;
