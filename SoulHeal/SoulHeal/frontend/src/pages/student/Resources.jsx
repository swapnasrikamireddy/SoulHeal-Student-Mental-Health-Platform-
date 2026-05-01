import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../../api';
import toast from 'react-hot-toast';

const categories = ['All', 'Meditation', 'Breathing Exercise', 'Article', 'Video', 'Helpline', 'Stress Management', 'Motivation', 'Sleep', 'Journaling'];
const categoryIcons = { Meditation: '🧘', 'Breathing Exercise': '🌬️', Article: '📄', Video: '🎥', Helpline: '📞', 'Stress Management': '💆', Motivation: '💪', Sleep: '😴', Journaling: '📔', All: '🌿' };
const categoryColors = { Meditation: '#10b981', 'Breathing Exercise': '#06b6d4', Article: '#6366f1', Video: '#f472b6', Helpline: '#ef4444', 'Stress Management': '#f59e0b', Motivation: '#8b5cf6', Sleep: '#3b82f6', Journaling: '#ec4899', All: '#7c3aed' };
const difficultyColors = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-danger' };

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewResource, setViewResource] = useState(null);

  useEffect(() => { fetchResources(); }, []);
  useEffect(() => { applyFilter(); }, [resources, selected, search]);

  const fetchResources = async () => {
    try {
      const { data } = await resourceAPI.getAll();
      setResources(data.resources);
    } catch { toast.error('Failed to load resources'); }
    finally { setLoading(false); }
  };

  const applyFilter = () => {
    let res = [...resources];
    if (selected !== 'All') res = res.filter(r => r.category === selected);
    if (search) res = res.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(res);
  };

  const handleView = async (resource) => {
    setViewResource(resource);
    try { await resourceAPI.getById(resource._id); } catch {}
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">📚 Wellness Resources</div>
          <div className="topbar-subtitle">Curated mental health tools and guides for your wellbeing</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            className="form-input"
            placeholder="🔍 Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '240px', padding: '0.7rem 1.1rem', fontSize: '0.88rem' }}
          />
          {search && (
            <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {categories.map(cat => {
          const isActive = selected === cat;
          const color = categoryColors[cat];
          return (
            <button key={cat} onClick={() => setSelected(cat)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
                background: isActive ? `${color}22` : 'rgba(255,255,255,0.04)',
                color: isActive ? color : '#9eb3c8',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-main)',
                fontWeight: isActive ? 700 : 400,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: isActive ? `0 0 12px ${color}33` : 'none',
              }}>
              {categoryIcons[cat]} {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {filtered.length > 0 && (
        <p style={{ fontSize: '0.85rem', color: '#7a94aa', marginBottom: '1.25rem' }}>
          Showing <strong style={{ color: '#a8bdd0' }}>{filtered.length}</strong> resource{filtered.length !== 1 ? 's' : ''}
          {selected !== 'All' ? ` in ${selected}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {/* Resource Cards — 2-col grid so cards are spacious */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {filtered.map(r => {
            const color = categoryColors[r.category] || '#7c3aed';
            return (
              <div key={r._id} className="glass-card"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${color}66` }}>

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '58px', height: '58px', borderRadius: '16px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', border: `1.5px solid ${color}44`, flexShrink: 0 }}>
                    {categoryIcons[r.category]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.35 }}>{r.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', background: `${color}18`, border: `1px solid ${color}44`, color, fontSize: '0.72rem', fontWeight: 600 }}>{r.category}</span>
                      <span className={`badge ${difficultyColors[r.difficulty]}`} style={{ fontSize: '0.72rem' }}>{r.difficulty}</span>
                      {r.duration && <span style={{ fontSize: '0.78rem', color: '#8899aa' }}>⏱ {r.duration}</span>}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.9rem', color: '#b0c4d4', lineHeight: 1.75, flex: 1, marginBottom: '1.5rem' }}>
                  {r.description}
                </p>

                {/* Footer row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6a84a0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    👁 {r.views || 0} views
                  </span>
                  <button className="btn btn-secondary btn-sm"
                    style={{ border: `1px solid ${color}44`, color }}
                    onClick={() => handleView(r)}>
                    View Resource →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No resources found</h3>
          <p>{search ? `No results for "${search}"` : 'No resources in this category yet'}</p>
          {search && <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSearch('')}>Clear search</button>}
        </div>
      )}

      {/* View Modal */}
      {viewResource && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewResource(null)}>
          <div className="modal-box" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${categoryColors[viewResource.category]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: `1.5px solid ${categoryColors[viewResource.category]}44`, flexShrink: 0 }}>
                  {categoryIcons[viewResource.category]}
                </div>
                <h3 className="modal-title" style={{ fontSize: '1.1rem', lineHeight: 1.35 }}>{viewResource.title}</h3>
              </div>
              <button className="modal-close" onClick={() => setViewResource(null)}>×</button>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: `${categoryColors[viewResource.category]}18`, border: `1px solid ${categoryColors[viewResource.category]}44`, color: categoryColors[viewResource.category], fontSize: '0.75rem', fontWeight: 600 }}>{viewResource.category}</span>
              <span className={`badge ${difficultyColors[viewResource.difficulty]}`}>{viewResource.difficulty}</span>
              {viewResource.duration && <span className="badge badge-info">⏱ {viewResource.duration}</span>}
            </div>

            {/* Description */}
            <p style={{ lineHeight: 1.85, color: '#b0c4d4', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{viewResource.description}</p>

            {/* Content */}
            {viewResource.content && (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
                <p style={{ lineHeight: 1.9, color: '#dce8f5', fontSize: '0.93rem', whiteSpace: 'pre-line' }}>{viewResource.content}</p>
              </div>
            )}

            {/* CTA */}
            {viewResource.url && (
              <a href={viewResource.url} target="_blank" rel="noreferrer" className="btn btn-primary w-full" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1rem' }}>
                🔗 Open Resource
              </a>
            )}

            {/* Tags */}
            {viewResource.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {viewResource.tags.map(t => (
                  <span key={t} style={{ padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#8899aa' }}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
