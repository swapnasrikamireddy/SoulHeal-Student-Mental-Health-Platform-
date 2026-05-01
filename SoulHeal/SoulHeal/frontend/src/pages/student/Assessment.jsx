import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../api';
import toast from 'react-hot-toast';

const assessmentTests = {
  'Stress Test': {
    icon: '😤', color: '#ef4444',
    description: 'Measure how stress from academics, deadlines, and daily life is affecting you',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
      { label: 'Always', value: 4 },
    ],
    questions: [
      'I feel overwhelmed by my academic workload',
      'I have trouble sleeping due to worries',
      'I feel unable to control things in my life',
      'I feel nervous or stressed frequently',
      'I find it hard to relax and unwind',
      'I feel irritable or short-tempered',
      'I have difficulty concentrating on tasks',
      'I feel physically tense or experience headaches',
    ],
  },
  'Anxiety Check': {
    icon: '😰', color: '#f472b6',
    description: 'Identify signs of anxiety that may be impacting your day-to-day life',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'A little', value: 1 },
      { label: 'Moderately', value: 2 },
      { label: 'Quite a bit', value: 3 },
      { label: 'Extremely', value: 4 },
    ],
    questions: [
      'I feel nervous or on edge',
      'I cannot stop or control worrying',
      'I worry too much about different things',
      'I have trouble relaxing even during free time',
      'I feel so restless it is hard to sit still',
      'I become easily annoyed or irritable with others',
      'I feel afraid something awful might happen to me',
      'My heart races or I experience shortness of breath',
    ],
  },
  'Depression Screening': {
    icon: '😢', color: '#6366f1',
    description: 'Screen for signs of low mood, loss of interest, or depressive patterns',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half', value: 2 },
      { label: 'Nearly every day', value: 3 },
      { label: 'Every day', value: 4 },
    ],
    questions: [
      'I have little interest or pleasure in doing things I used to enjoy',
      'I feel down, depressed, or hopeless about the future',
      'I have trouble falling or staying asleep, or I sleep too much',
      'I feel tired or have little energy to do daily tasks',
      'I have poor appetite or I overeat without control',
      'I feel bad about myself or feel like a failure',
      'I have trouble concentrating on reading or other tasks',
      'I feel that things would be better if I were not around',
    ],
  },
  'Emotional Balance': {
    icon: '⚖️', color: '#06b6d4',
    description: 'Check how well you regulate emotions, find purpose, and connect with others',
    options: [
      { label: 'Never', value: 4 },
      { label: 'Rarely', value: 3 },
      { label: 'Sometimes', value: 2 },
      { label: 'Usually', value: 1 },
      { label: 'Always', value: 0 },
    ],
    questions: [
      'I feel emotionally stable and balanced throughout the day',
      'I manage my emotions effectively without losing control',
      'I feel genuinely connected to the people around me',
      'I experience positive emotions like joy, gratitude, or hope regularly',
      'I bounce back from setbacks and disappointments quickly',
      'I feel a sense of purpose and meaning in my daily activities',
      'I express my feelings in healthy and constructive ways',
      'I feel satisfied and at peace with my personal relationships',
    ],
  },
  'Focus & Productivity': {
    icon: '🎯', color: '#f59e0b',
    description: 'Evaluate your concentration, motivation, and ability to stay productive',
    options: [
      { label: 'Never', value: 4 },
      { label: 'Rarely', value: 3 },
      { label: 'Sometimes', value: 2 },
      { label: 'Usually', value: 1 },
      { label: 'Always', value: 0 },
    ],
    questions: [
      'I maintain focus during study or work sessions without getting distracted',
      'I complete tasks and assignments on time without procrastinating',
      'I feel genuinely motivated to work toward my academic or personal goals',
      'I organize and manage my time effectively throughout the day',
      'I recall and retain what I have studied or learned',
      'I feel energized and mentally alert during my study sessions',
      'I am satisfied with the quality of my academic or work output',
      'I set clear priorities and act on the most important tasks first',
    ],
  },
  'Sleep Quality': {
    icon: '😴', color: '#8b5cf6',
    description: 'Assess whether poor sleep is affecting your energy, mood, and performance',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
      { label: 'Daily', value: 4 },
    ],
    questions: [
      'I find it difficult to fall asleep when I go to bed',
      'I wake up in the middle of the night and struggle to fall back asleep',
      'I feel physically tired and mentally fatigued during the day',
      'I depend on caffeine or energy drinks to stay awake and alert',
      'My sleep and wake times are irregular or inconsistent',
      'I experience disturbing dreams or nightmares that disrupt sleep',
      'I feel refreshed and restored when I wake up in the morning',
      'Poor sleep affects my mood, focus, or daily performance',
    ],
  },
};

const durationMap = { 'Stress Test': '4–6 min', 'Anxiety Check': '4–6 min', 'Depression Screening': '4–6 min', 'Emotional Balance': '4–6 min', 'Focus & Productivity': '4–6 min', 'Sleep Quality': '4–6 min' };

export default function Assessment() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('select');

  const handleStart = (type) => {
    setSelectedType(type);
    setAnswers({});
    setStep('quiz');
  };

  const handleAnswer = (qIdx, val) => {
    setAnswers(prev => ({ ...prev, [qIdx]: val }));
  };

  const test = selectedType ? assessmentTests[selectedType] : null;
  const totalQ = test?.questions.length || 0;
  const answered = Object.keys(answers).length;
  const progress = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;

  const handleSubmit = async () => {
    if (answered < totalQ) return toast.error(`Please answer all ${totalQ} questions`);
    setSubmitting(true);
    try {
      const formattedAnswers = test.questions.map((q, i) => ({ question: q, answer: answers[i] }));
      const { data } = await assessmentAPI.submit({ assessmentType: selectedType, answers: formattedAnswers });
      toast.success('Assessment completed! 🎉');
      navigate(`/student/assessment/result/${data.assessment._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  /* ── SELECTION SCREEN ── */
  if (step === 'select') {
    return (
      <div className="animate-fade-in">
        <div className="topbar">
          <div>
            <div className="topbar-title">📋 Self-Assessments</div>
            <div className="topbar-subtitle">Evidence-based tests to help you understand your mental wellness</div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(124,58,237,0.08))', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: '0.92rem', color: '#67e8f9', lineHeight: 1.7, margin: 0 }}>
            <strong>For self-awareness only.</strong> Results do not constitute a clinical diagnosis. Please consult a qualified professional if you have serious concerns.
          </p>
        </div>

        {/* Grid – 2 cols so cards are wide and comfortable */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {Object.entries(assessmentTests).map(([name, t]) => (
            <div key={name} className="glass-card" style={{ padding: '2.25rem', cursor: 'pointer', display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}
              onClick={() => handleStart(name)}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={e => e.currentTarget.style.transform = ''}>
              {/* Icon */}
              <div style={{ width: '68px', height: '68px', borderRadius: '18px', background: `${t.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', border: `1.5px solid ${t.color}44`, flexShrink: 0 }}>
                {t.icon}
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{name}</h3>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', background: `${t.color}18`, border: `1px solid ${t.color}44`, color: t.color, fontSize: '0.75rem', fontWeight: 600 }}>{t.questions.length} questions</span>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9eb3c8', fontSize: '0.75rem' }}>⏱ {durationMap[name]}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#a8bdd0', lineHeight: 1.65, marginBottom: '1.1rem' }}>{t.description}</p>
                {/* Scale preview */}
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#7a94aa', marginRight: '0.25rem' }}>Scale:</span>
                  {t.options.map((o, i) => (
                    <span key={i} style={{ padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', color: '#8899aa' }}>{o.label}</span>
                  ))}
                </div>
                <button className="btn btn-primary btn-sm" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)`, boxShadow: `0 4px 16px ${t.color}44` }}>
                  Start Assessment →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── QUIZ SCREEN ── */
  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{test.icon}</span>
            <div className="topbar-title">{selectedType}</div>
          </div>
          <div className="topbar-subtitle">{answered} of {totalQ} questions answered</div>
        </div>
        <button className="btn btn-secondary" onClick={() => setStep('select')}>← Back</button>
      </div>

      {/* Progress card */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: '#9eb3c8', fontSize: '0.9rem', fontWeight: 500 }}>Progress</span>
          <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="progress-bar" style={{ height: '12px', marginBottom: '1rem' }}>
          <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${test.color}, var(--primary))` }} />
        </div>
        {/* Scale legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {test.options.map((opt, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: `hsl(${(i / (test.options.length - 1)) * 120 + 30}, 80%, 55%)`, margin: '0 auto 0.3rem' }} />
              <span style={{ fontSize: '0.72rem', color: '#8899aa' }}>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {test.questions.map((q, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '2rem', borderColor: answers[idx] !== undefined ? `${test.color}44` : 'var(--border-glass)', transition: 'border-color 0.3s' }}>
            {/* Question */}
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: answers[idx] !== undefined ? test.color : 'rgba(255,255,255,0.05)', border: `2px solid ${answers[idx] !== undefined ? test.color : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: answers[idx] !== undefined ? 'white' : '#9eb3c8', flexShrink: 0, transition: 'all 0.3s' }}>
                {idx + 1}
              </div>
              <p style={{ color: '#dce8f5', fontSize: '1rem', lineHeight: 1.75, paddingTop: '0.35rem', fontWeight: 500, flex: 1 }}>{q}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
              {test.options.map(opt => {
                const isSelected = answers[idx] === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => handleAnswer(idx, opt.value)}
                    style={{
                      padding: '0.9rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? test.color : 'rgba(255,255,255,0.1)'}`,
                      background: isSelected ? `${test.color}22` : 'rgba(255,255,255,0.03)',
                      color: isSelected ? test.color : '#a8bdd0',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 400,
                      transition: 'all 0.2s',
                      fontFamily: 'var(--font-main)',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      boxShadow: isSelected ? `0 0 12px ${test.color}44` : 'none',
                    }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={handleSubmit} disabled={submitting || answered < totalQ}>
        {submitting
          ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Analyzing your responses...</>
          : answered < totalQ
            ? `Answer ${totalQ - answered} more question${totalQ - answered > 1 ? 's' : ''} to continue`
            : '🎯 Submit & Get Results'}
      </button>
    </div>
  );
}
