import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moodAPI, assessmentAPI } from '../../api';

const moodEmoji = { Happy: '😊', Calm: '😌', Anxious: '😰', Sad: '😢', Stressed: '😤', Angry: '😠', Overwhelmed: '😵', Motivated: '💪', Lonely: '😔', Hopeful: '🌟' };
const resultColors = { Minimal: '#10b981', Low: '#06b6d4', Moderate: '#f59e0b', High: '#ef4444', Severe: '#dc2626' };

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('moods');

  useEffect(() => {
    Promise.all([moodAPI.getStudentMoods(id), assessmentAPI.getStudentAssessments(id)])
      .then(([moodRes, assRes]) => {
        setMoods(moodRes.data.moods);
        setAssessments(assRes.data.assessments);
      }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const latestAssessment = assessments[0];
  const avgMood = moods.length > 0 ? (moods.reduce((s, m) => s + m.moodScore, 0) / moods.length).toFixed(1) : 'N/A';

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>← Back</button>

      <div className="topbar">
        <div>
          <div className="topbar-title">👤 Student Wellness Overview</div>
          <div className="topbar-subtitle">Mood history and assessment results for this student</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '📝', label: 'Mood Entries', value: moods.length, color: 'var(--gradient-mood)' },
          { icon: '⭐', label: 'Avg Mood Score', value: `${avgMood}/10`, color: 'var(--gradient-primary)' },
          { icon: '📋', label: 'Assessments Taken', value: assessments.length, color: 'var(--gradient-success)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.6rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Latest Assessment Alert */}
      {latestAssessment && (
        <div style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', border: `1px solid ${resultColors[latestAssessment.result]}44`, background: `${resultColors[latestAssessment.result]}11`, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Latest Assessment: {latestAssessment.assessmentType}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Taken on {new Date(latestAssessment.completedAt).toLocaleDateString()} · Score: {latestAssessment.score}/{latestAssessment.maxScore}</div>
          </div>
          <div style={{ padding: '0.4rem 1.25rem', borderRadius: 'var(--radius-full)', background: `${resultColors[latestAssessment.result]}22`, border: `1px solid ${resultColors[latestAssessment.result]}44`, color: resultColors[latestAssessment.result], fontWeight: 700, fontSize: '0.95rem' }}>
            {latestAssessment.result}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'moods' ? 'active' : ''}`} onClick={() => setActiveTab('moods')}>💭 Mood History ({moods.length})</button>
        <button className={`tab-btn ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')}>📋 Assessments ({assessments.length})</button>
      </div>

      {activeTab === 'moods' && (
        moods.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {moods.map(m => (
              <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{moodEmoji[m.mood]}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.mood}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(m.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    {m.notes && <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.notes}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {m.tags?.length > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.tags.slice(0, 3).join(', ')}</div>}
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: m.moodScore >= 7 ? '#10b981' : m.moodScore >= 4 ? '#f59e0b' : '#ef4444' }}>{m.moodScore}/10</div>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="empty-state"><div className="empty-icon">💭</div><p>No mood entries found for this student</p></div>
      )}

      {activeTab === 'assessments' && (
        assessments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assessments.map(a => (
              <div key={a._id} className="glass-card" style={{ padding: '1.5rem', borderColor: `${resultColors[a.result]}33` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{a.assessmentType}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(a.completedAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: resultColors[a.result] }}>{a.score}/{a.maxScore}</div>
                    <div style={{ padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: `${resultColors[a.result]}22`, border: `1px solid ${resultColors[a.result]}44`, color: resultColors[a.result], fontWeight: 700, fontSize: '0.85rem' }}>{a.result}</div>
                  </div>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.round((a.score / a.maxScore) * 100)}%`, background: `linear-gradient(90deg, ${resultColors[a.result]}, ${resultColors[a.result]}88)` }} /></div>
                {a.recommendations?.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Recommendations</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {a.recommendations.slice(0, 3).map((r, i) => <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem' }}><span style={{ color: resultColors[a.result] }}>→</span> {r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <div className="empty-state"><div className="empty-icon">📋</div><p>No assessments taken yet</p></div>
      )}
    </div>
  );
}
