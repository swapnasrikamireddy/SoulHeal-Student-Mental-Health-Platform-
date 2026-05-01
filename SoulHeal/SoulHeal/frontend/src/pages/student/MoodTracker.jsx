import React, { useState, useEffect } from 'react';
import { moodAPI } from '../../api';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const moods = [
  { mood: 'Happy', emoji: '😊', score: 9 }, { mood: 'Motivated', emoji: '💪', score: 8 },
  { mood: 'Calm', emoji: '😌', score: 7 }, { mood: 'Hopeful', emoji: '🌟', score: 7 },
  { mood: 'Anxious', emoji: '😰', score: 4 }, { mood: 'Stressed', emoji: '😤', score: 3 },
  { mood: 'Overwhelmed', emoji: '😵', score: 2 }, { mood: 'Sad', emoji: '😢', score: 3 },
  { mood: 'Lonely', emoji: '😔', score: 3 }, { mood: 'Angry', emoji: '😠', score: 2 },
];

const tags = ['Exams', 'Assignments', 'Relationships', 'Family', 'Health', 'Sleep', 'Work', 'Social', 'Money', 'Future'];

export default function MoodTracker() {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('log');
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [histRes, analRes] = await Promise.all([moodAPI.getAll({ limit: 20 }), moodAPI.getAnalytics()]);
      setHistory(histRes.data.moods);
      setAnalytics(analRes.data.analytics);
    } catch (err) { console.error(err); }
  };

  const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error('Please select a mood first');
    setSaving(true);
    try {
      const payload = { mood: selected.mood, moodScore: selected.score, notes: note, tags: selectedTags };
      if (editId) {
        await moodAPI.update(editId, payload);
        toast.success('Mood updated! 💭');
        setEditId(null);
      } else {
        await moodAPI.create(payload);
        toast.success('Mood logged successfully! 🌟');
      }
      setSelected(null); setNote(''); setSelectedTags([]);
      fetchData();
      setActiveTab('history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save mood');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mood entry?')) return;
    try {
      await moodAPI.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  const chartData = (analytics?.recentMoods || []).map(m => ({
    date: new Date(m.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: m.moodScore,
    mood: m.mood,
  }));

  const moodColors = { Happy: '#10b981', Motivated: '#06b6d4', Calm: '#6366f1', Hopeful: '#f59e0b', Anxious: '#f472b6', Stressed: '#ef4444', Overwhelmed: '#dc2626', Sad: '#64748b', Lonely: '#94a3b8', Angry: '#b91c1c' };

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">💭 Mood Tracker</div>
          <div className="topbar-subtitle">Track your daily emotions and discover patterns</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          {['log', 'history', 'analytics'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize', padding: '0.5rem 1rem' }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Entries', value: analytics?.totalEntries || 0, icon: '📝' },
          { label: 'Avg Score (30d)', value: analytics?.averageScore ? `${analytics.averageScore}/10` : 'N/A', icon: '⭐' },
          { label: 'Most Felt', value: analytics?.moodCounts ? Object.entries(analytics.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A', icon: '💡' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>{s.icon}</div>
            <div className="stat-value" style={{ background: 'var(--gradient-mood)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.6rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Log Tab */}
      {activeTab === 'log' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>{editId ? '✏️ Edit Mood Entry' : '✨ How are you feeling today?'}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Select the mood that best describes your current state</p>
          <form onSubmit={handleSubmit}>
            <div className="mood-grid" style={{ marginBottom: '1.75rem' }}>
              {moods.map(m => (
                <div key={m.mood} className={`mood-option ${selected?.mood === m.mood ? 'selected' : ''}`} onClick={() => setSelected(m)}>
                  <span className="emoji">{m.emoji}</span>
                  <span>{m.mood}</span>
                </div>
              ))}
            </div>

            {selected && (
              <div className="animate-slide-up" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(124,58,237,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>
                  {selected.emoji} <strong>{selected.mood}</strong> — Mood Score: <strong>{selected.score}/10</strong>
                </p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">What's on your mind? (optional)</label>
              <textarea className="form-textarea" placeholder="Share what's affecting your mood today..." value={note} onChange={e => setNote(e.target.value)} rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label">Related to (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.map(tag => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    style={{ padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: `1px solid ${selectedTags.includes(tag) ? 'var(--primary)' : 'var(--border-glass)'}`, background: selectedTags.includes(tag) ? 'rgba(124,58,237,0.2)' : 'var(--bg-glass)', color: selectedTags.includes(tag) ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s', fontFamily: 'var(--font-main)' }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setSelected(null); setNote(''); setSelectedTags([]); }}>Cancel</button>}
              <button className="btn btn-primary" type="submit" disabled={saving || !selected} style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Saving...</> : editId ? '✏️ Update Mood' : '💾 Log Mood'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>📜 Mood History</h3>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map(m => (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${moodColors[m.mood]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: `1px solid ${moodColors[m.mood]}44` }}>
                      {moods.find(x => x.mood === m.mood)?.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{m.mood}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(m.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      {m.notes && <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.notes}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: moodColors[m.mood], fontSize: '1.1rem' }}>{m.moodScore}/10</div>
                      {m.tags?.length > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.tags.join(', ')}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { const mo = moods.find(x => x.mood === m.mood); setSelected(mo); setNote(m.notes || ''); setSelectedTags(m.tags || []); setEditId(m._id); setActiveTab('log'); }} title="Edit">✏️</button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(m._id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-icon">💭</div><h3>No mood entries yet</h3><p>Start tracking your mood to see patterns</p></div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📈 7-Day Mood Trend</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                    <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label}</p>
                      <p style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{payload[0].payload.mood} ({payload[0].value}/10)</p>
                    </div>
                  ) : null} />
                  <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#f472b6', r: 5 }} activeDot={{ r: 7, fill: '#7c3aed' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="empty-state"><p>Not enough data yet</p></div>}
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>🎨 Mood Frequency</h3>
            {analytics?.moodCounts && Object.keys(analytics.moodCounts).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(analytics.moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => {
                  const max = Math.max(...Object.values(analytics.moodCounts));
                  const pct = Math.round((count / max) * 100);
                  const emoji = moods.find(m => m.mood === mood)?.emoji || '😐';
                  return (
                    <div key={mood}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                        <span>{emoji} {mood}</span>
                        <span style={{ color: moodColors[mood], fontWeight: 600 }}>{count} times</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${moodColors[mood]}, ${moodColors[mood]}88)` }} /></div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="empty-state"><p>Log more moods to see analytics</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
