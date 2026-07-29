import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './style/AdminEventForm.css';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  price: '',
  vipPrice: '',
  availableTickets: '',
  category: 'Music',
  image: ''
};

export default function AdminEventForm() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const evt = await api.getEvent(id);
        const d = evt?.date ? new Date(evt.date) : null;
        setForm({
          title: evt.title || '',
          description: evt.description || '',
          date: d ? d.toISOString().slice(0, 10) : '',
          time: d ? d.toISOString().slice(11, 16) : '',
          venue: evt.venue || evt.location || '',
          price: evt.ticketPrice ?? evt.price ?? '',
          vipPrice: evt.vipPrice ?? '',
          availableTickets: evt.availableTickets ?? evt.ticketsAvailable ?? '',
          category: evt.category || 'Music',
          image: evt.image || ''
        });
      } catch {
        setErrorMsg('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const isoDate =
        form.date && form.time ? new Date(`${form.date}T${form.time}`).toISOString() : form.date;

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: isoDate,
        time: form.time,
        venue: form.venue.trim(),
        location: form.venue.trim(),
        price: Number(form.price) || 0,
        ticketPrice: Number(form.price) || 0,
        vipPrice: form.vipPrice ? Number(form.vipPrice) : undefined,
        availableTickets: Number(form.availableTickets) || 0,
        category: form.category,
        image: form.image.trim()
      };

      if (isEdit) {
        await api.updateEvent(id, payload);
      } else {
        await api.createEvent(payload);
      }
      navigate('/admin/events');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Loading event...</p></div>;

  return (
    <div className="container admin-event-form">
      <div className="form-header">
        <h1>{isEdit ? 'Edit Event' : 'Create Event'}</h1>
        <div className="form-actions-inline">
          <Link to="/admin/events" className="btn btn-outline">Back to Events</Link>
        </div>
      </div>

      {errorMsg && <div className="alert-error">{errorMsg}</div>}

      <form onSubmit={onSubmit} className="card form-card">
        <div className="grid-2">
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={onChange('title')} required />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={onChange('category')}>
              <option value="Music">Music</option>
              <option value="Conference">Conference</option>
              <option value="Food">Food</option>
              <option value="Comedy">Comedy</option>
              <option value="Art">Art</option>
              <option value="Sports">Sports</option>
              <option value="Theater">Theater</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={onChange('description')} rows={5} required />
        </div>

        <div className="grid-3">
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={onChange('date')} required />
          </div>
          <div className="field">
            <label>Time</label>
            <input type="time" value={form.time} onChange={onChange('time')} required />
          </div>
          <div className="field">
            <label>Venue</label>
            <input value={form.venue} onChange={onChange('venue')} required />
          </div>
        </div>

        <div className="grid-3">
          <div className="field">
            <label>Price (Regular)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={onChange('price')} required />
          </div>
          <div className="field">
            <label>VIP Price</label>
            <input type="number" min="0" step="0.01" value={form.vipPrice} onChange={onChange('vipPrice')} />
          </div>
          <div className="field">
            <label>Available Tickets</label>
            <input type="number" min="0" value={form.availableTickets} onChange={onChange('availableTickets')} required />
          </div>
        </div>

        <div className="field">
          <label>Image URL</label>
          <input type="url" value={form.image} onChange={onChange('image')} placeholder="https://..." />
        </div>

        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/events')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : (isEdit ? 'Update Event' : 'Create Event')}
          </button>
        </div>
      </form>
    </div>
  );
}
