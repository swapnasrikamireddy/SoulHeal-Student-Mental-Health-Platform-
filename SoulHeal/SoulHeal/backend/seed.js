require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Resource = require('./src/models/Resource');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Resource.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create Users
  const users = [
    { name: 'Admin User', email: 'admin@demo.com', password: 'demo123', role: 'admin' },
    { name: 'Seetha Thakur', email: 'seetha@gmail.com', password: 'seetha', role: 'admin' },
    { name: 'Dr. Meera Sharma', email: 'counselor@demo.com', password: 'demo123', role: 'counselor', specialization: 'Student Counseling', bio: 'Helping students navigate stress, anxiety, and academic pressure for over 10 years.', availability: true },
    { name: 'Dr. Rahul Verma', email: 'rahul@demo.com', password: 'demo123', role: 'counselor', specialization: 'Cognitive Behavioral Therapy', bio: 'Specializing in CBT and mindfulness-based approaches for student wellness.', availability: true },
    { name: 'Priya Singh', email: 'student@demo.com', password: 'demo123', role: 'student', department: 'Computer Science', gender: 'female', phone: '+91 9876543210' },
    { name: 'Arjun Patel', email: 'arjun@demo.com', password: 'demo123', role: 'student', department: 'Mechanical Engineering', gender: 'male' },
  ];

  for (const u of users) {
    await User.create(u);
    console.log(`✅ Created: ${u.name} (${u.role})`);
  }

  // Create Resources
  const adminUser = await User.findOne({ role: 'admin' });
  const resources = [
    { title: '5-Minute Breathing Exercise', description: 'A simple box breathing technique to instantly calm your nervous system and reduce stress.', category: 'Breathing Exercise', content: '1. Inhale slowly for 4 counts\n2. Hold your breath for 4 counts\n3. Exhale slowly for 4 counts\n4. Hold for 4 counts\n5. Repeat 4-5 times\n\nThis technique activates your parasympathetic nervous system and reduces cortisol levels immediately.', duration: '5 min', difficulty: 'Beginner', tags: ['stress', 'anxiety', 'calming'], createdBy: adminUser._id },
    { title: 'Guided Morning Meditation', description: 'Start your day with a calm, focused mind. This 10-minute meditation sets a positive tone for the day.', category: 'Meditation', content: '1. Find a comfortable seated position\n2. Close your eyes and take 3 deep breaths\n3. Visualize a warm light filling your body with each inhale\n4. Let go of any tension with each exhale\n5. Set a gentle intention for your day\n6. Slowly open your eyes after 10 minutes', duration: '10 min', difficulty: 'Beginner', tags: ['morning', 'focus', 'mindfulness'], createdBy: adminUser._id },
    { title: 'Managing Exam Stress', description: 'Practical strategies backed by research to help you stay calm and perform your best during exams.', category: 'Stress Management', content: 'Key strategies:\n• Study in 25-min Pomodoro blocks with 5-min breaks\n• Get 7-8 hours of sleep — memory consolidates during sleep\n• Eat brain foods: nuts, berries, dark chocolate\n• Exercise for 20 min daily to boost cognitive function\n• Practice positive self-talk: "I am prepared and capable"\n• Avoid cramming — spaced repetition works better', duration: '8 min read', difficulty: 'Beginner', tags: ['exams', 'study', 'performance'], createdBy: adminUser._id },
    { title: 'Progressive Muscle Relaxation', description: 'A powerful technique to release physical tension caused by stress and anxiety.', category: 'Stress Management', content: '1. Lie down comfortably\n2. Start with your feet — tense for 5 sec, release\n3. Move up: calves, thighs, stomach, hands, arms, shoulders\n4. Hold each muscle group for 5 seconds\n5. Feel the contrast between tension and relaxation\n6. End with slow deep breaths\n\nPractice daily for best results.', duration: '15 min', difficulty: 'Beginner', tags: ['relaxation', 'tension', 'body'], createdBy: adminUser._id },
    { title: 'Journaling for Mental Clarity', description: 'How to use journaling as a powerful tool to process emotions, reduce anxiety, and gain perspective.', category: 'Journaling', content: 'Getting started:\n• Write for 10-15 min each morning or evening\n• Use prompts: "Today I feel...", "I\'m grateful for...", "My biggest worry is..."\n• Don\'t edit — write freely\n• Reflect on patterns over time\n• Try gratitude journaling: list 3 things you\'re grateful for each day\n\nJournaling reduces cortisol and improves emotional processing.', duration: '12 min read', difficulty: 'Beginner', tags: ['journaling', 'emotions', 'clarity'], createdBy: adminUser._id },
    { title: 'iCall Counseling Helpline', description: 'Free, confidential mental health counseling by trained professionals. Available for students across India.', category: 'Helpline', url: 'https://icallhelpline.org', content: 'iCall Helpline: 9152987821\nMonday to Saturday: 8am - 10pm\nEmail: icall@tiss.edu\n\nAll conversations are completely confidential. Trained counselors are available to help with stress, anxiety, depression, relationships, and academic pressure.', difficulty: 'Beginner', tags: ['helpline', 'emergency', 'counseling'], createdBy: adminUser._id },
    { title: 'Sleep Hygiene for Students', description: 'Science-backed tips to improve sleep quality and wake up refreshed, even during stressful periods.', category: 'Sleep', content: 'Sleep hygiene habits:\n• Maintain consistent sleep/wake times (even on weekends)\n• Avoid screens 1 hour before bed — blue light disrupts melatonin\n• Keep room cool (18-20°C is optimal)\n• Try chamomile tea or warm milk before bed\n• Avoid caffeine after 2 PM\n• Use your bed only for sleep\n• Try the 4-7-8 breathing technique before sleep', duration: '7 min read', difficulty: 'Beginner', tags: ['sleep', 'rest', 'recovery'], createdBy: adminUser._id },
    { title: 'Building Resilience & Motivation', description: 'Practical strategies to build mental resilience, stay motivated, and bounce back from setbacks.', category: 'Motivation', content: 'Resilience building blocks:\n• Reframe failures as learning opportunities\n• Build a support network — don\'t face challenges alone\n• Set small, achievable daily goals\n• Celebrate small wins consistently\n• Practice self-compassion — talk to yourself like a good friend\n• Limit social media comparison\n• Remember your "why" — connect with your deeper purpose', duration: '10 min read', difficulty: 'Intermediate', tags: ['resilience', 'motivation', 'mindset'], createdBy: adminUser._id },
  ];

  for (const r of resources) {
    await Resource.create(r);
    console.log(`📚 Created resource: ${r.title}`);
  }

  console.log('\n🌿 ========================');
  console.log('   SoulHeal Seed Complete!');
  console.log('========================');
  console.log('\n📧 Demo Accounts:');
  console.log('   🎓 Student:   student@demo.com / demo123');
  console.log('   🧑‍⚕️ Counselor: counselor@demo.com / demo123');
  console.log('   ⚙️  Admin:     admin@demo.com / demo123');
  console.log('\n🚀 Start backend: npm run dev');
  console.log('🚀 Start frontend: npm run dev\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed error:', err); process.exit(1); });
