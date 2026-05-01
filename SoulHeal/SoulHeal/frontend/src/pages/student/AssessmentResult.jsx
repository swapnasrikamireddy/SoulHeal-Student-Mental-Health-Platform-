import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../api';

const WELLNESS_TYPES = ['Sleep Quality', 'Emotional Balance', 'Focus & Productivity'];

// Standard track: low score = good (Minimal = best, Severe = worst)
const standardConfig = {
  Minimal: { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', icon: '🌟', message: 'Great job! Your mental wellness looks excellent.' },
  Low:     { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #6366f1)', icon: '😊', message: "You're doing well. Keep up your positive habits." },
  Moderate:{ color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '⚠️', message: 'Some areas need attention. Consider the suggestions below.' },
  High:    { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔴', message: 'We recommend seeking support. Reach out to a counselor.' },
  Severe:  { color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #7f1d1d)', icon: '🆘', message: 'Please reach out to a counselor or helpline immediately.' },
};

// Wellness track: low score = good (Perfect = best, Minimal = worst)
const wellnessConfig = {
  Perfect:  { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)', icon: '🌟', message: 'Excellent! Your wellness is in great shape. Keep it up!' },
  High:     { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #6366f1)', icon: '😊', message: 'Your wellness is strong. Keep up your healthy habits.' },
  Moderate: { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '⚠️', message: 'Some areas need a little more attention. See the suggestions below.' },
  Low:      { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔴', message: 'Your wellness needs attention. We recommend speaking to a counselor.' },
  Minimal:  { color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #7f1d1d)', icon: '🆘', message: 'Your wellness is critically low. Please reach out to a counselor immediately.' },
};

const getResultConfig = (result, assessmentType) =>
  WELLNESS_TYPES.includes(assessmentType)
    ? wellnessConfig[result] || wellnessConfig.Moderate
    : standardConfig[result] || standardConfig.Moderate;

export default function AssessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentAPI.getById(id).then(({ data }) => { setAssessment(data.assessment); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!assessment) return <div className="empty-state"><h3>Result not found</h3></div>;

  const cfg = getResultConfig(assessment.result, assessment.assessmentType);
  const pct = Math.round((assessment.score / assessment.maxScore) * 100);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => navigate('/student/assessment')}>← Back to Assessments</button>

      {/* Result Header */}
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', borderColor: `${cfg.color}44`, background: `linear-gradient(135deg, ${cfg.color}10, transparent)` }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>{cfg.icon}</div>
        <h2 style={{ marginBottom: '0.5rem' }}>{assessment.assessmentType}</h2>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: cfg.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '0.5rem' }}>{assessment.result}</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{cfg.message}</p>

        {/* Score ring */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[{ label: 'Your Score', val: `${assessment.score}/${assessment.maxScore}` }, { label: 'Percentage', val: `${pct}%` }, { label: 'Date', val: new Date(assessment.completedAt).toLocaleDateString() }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: cfg.color, fontFamily: 'var(--font-display)' }}>{s.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <div className="progress-bar" style={{ height: '12px', maxWidth: '400px', margin: '0 auto' }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: cfg.gradient }} />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>💡 Personalized Recommendations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {assessment.recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: cfg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Your Answers */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>📝 Your Responses</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {assessment.answers.map((a, i) => {
            const labels = ['Not at all', 'Several days', 'More than half', 'Nearly every day', 'Every day'];
            const scorePct = (a.answer / 4) * 100;
            return (
              <div key={i} style={{ padding: '0.85rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)', flex: 1, marginRight: '1rem' }}>{a.question}</span>
                  <span style={{ color: cfg.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{labels[a.answer]} ({a.answer}/4)</span>
                </div>
                <div className="progress-bar" style={{ height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${scorePct}%`, background: cfg.gradient }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/student/appointments')}>📅 Book Counselor Session</button>
        <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/student/resources')}>📚 View Resources</button>
        <button className="btn btn-secondary" onClick={() => navigate('/student/assessment')} style={{ justifyContent: 'center' }}>📋 Take Another</button>
      </div>
    </div>
  );
}
