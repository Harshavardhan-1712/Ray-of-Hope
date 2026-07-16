/**
 * Seed script – run once to populate MongoDB with initial data.
 * Usage:  node seed.js
 *
 * ⚠️  This will DELETE all existing data in the seeded collections.
 */
require('dotenv').config();
const mongoose = require('mongoose');

const Article   = require('./models/Article');
const Video     = require('./models/Video');
const Podcast   = require('./models/Podcast');
const Expert    = require('./models/Expert');

const connectDB = require('./config/db');

// ── Seed data ─────────────────────────────────────────────────────────────────

const articles = [
  { title: 'Understanding Anxiety: Signs, Causes & Coping Strategies', category: 'Mental Health', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80', description: 'Learn to identify the early warning signs of anxiety and discover evidence-based techniques to manage symptoms effectively in daily life.', readTime: '6 min read' },
  { title: 'Rebuilding After a Breakup: A Step-by-Step Guide', category: 'Relationships', image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80', description: 'Heartbreak is one of life's most painful experiences. This guide walks you through healing stages with compassion and practical steps.', readTime: '8 min read' },
  { title: 'Navigating Career Transitions with Confidence', category: 'Life Transitions', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80', description: 'Whether you're switching careers or facing an unexpected job change, this article explores how to embrace uncertainty and grow through change.', readTime: '5 min read' },
  { title: 'Financial Stress and Mental Health: Breaking the Cycle', category: 'Financial Stress', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80', description: 'Money worries can severely impact mental well-being. Discover psychological tools and financial mindset shifts that bring relief.', readTime: '7 min read' },
  { title: 'The Science of Sleep: How Rest Heals Your Mind', category: 'Mental Health', image: 'https://images.unsplash.com/photo-1455642305367-68834a9d5e73?w=400&q=80', description: 'Sleep deprivation is linked to depression, anxiety, and cognitive decline. Learn sleep hygiene practices backed by neuroscience.', readTime: '6 min read' },
  { title: 'Setting Healthy Boundaries in Relationships', category: 'Relationships', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80', description: 'Boundaries aren't walls — they're bridges to healthier connections. This article teaches you how to communicate limits with love.', readTime: '5 min read' },
  { title: 'Mindfulness for Beginners: Your 7-Day Starter Guide', category: 'Mental Health', image: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=80', description: 'You don't need years of practice to benefit from mindfulness. Start with just 5 minutes a day and watch your stress dissolve.', readTime: '4 min read' },
  { title: 'Coping with Grief: There\'s No Right Way to Heal', category: 'Life Transitions', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80', description: 'Loss comes in many forms. This compassionate guide explores the many faces of grief and honors your unique healing journey.', readTime: '9 min read' },
];

const videos = [
  { title: 'How to Manage Anxiety — Practical CBT Techniques', videoId: 'WWloIAQpMcQ', category: 'Therapy Techniques', description: 'Dr. Judith Beck explains cognitive behavioral therapy strategies for managing everyday anxiety.', duration: '14:32' },
  { title: 'The Power of Vulnerability | Brené Brown TED Talk', videoId: 'iCvmsMzlF7o', category: 'Expert Interviews', description: 'A landmark talk on connection, shame, and the courage to be seen — viewed over 60 million times.', duration: '20:19' },
  { title: 'Overcoming Depression: One Person\'s Story', videoId: 'XiCrniLQGYc', category: 'Motivational Stories', description: 'A raw and honest account of living with depression and the small steps that led to recovery.', duration: '11:04' },
  { title: 'Mindfulness Meditation for Stress Relief', videoId: 'inpok4MKVLM', category: 'Therapy Techniques', description: 'A guided 10-minute body scan meditation to release tension and return to the present moment.', duration: '10:00' },
  { title: 'Why We All Need to Practice Emotional First Aid', videoId: 'F2hc2FLOdhI', category: 'Expert Interviews', description: 'Psychologist Guy Winch explains why we need to treat emotional injuries as seriously as physical ones.', duration: '17:22' },
  { title: 'From Anxiety to Confidence: A Real Transformation', videoId: 'ZizdB0TgAVM', category: 'Motivational Stories', description: 'One woman\'s journey from crippling social anxiety to public speaking on national stages.', duration: '9:45' },
];

const podcasts = [
  { title: 'The Mindfulness & Meditation Podcast', host: 'Mary Meckley', category: 'Mindfulness', description: 'Daily guided meditations and mindfulness techniques to center yourself in a noisy world.', episodes: '400+ episodes', color: '#6366f1', link: 'https://open.spotify.com' },
  { title: 'The Happiness Lab with Dr. Laurie Santos', host: 'Dr. Laurie Santos', category: 'Positive Psychology', description: 'Yale professor reveals the science of what actually makes us happy — often not what you\'d think.', episodes: '120+ episodes', color: '#f59e0b', link: 'https://open.spotify.com' },
  { title: 'Unlocking Us with Brené Brown', host: 'Brené Brown', category: 'Self-Improvement', description: 'Conversations about the ideas, stories, and experiences that bring meaning to our lives.', episodes: '150+ episodes', color: '#ec4899', link: 'https://open.spotify.com' },
  { title: 'Calm It Down', host: 'Sarah Shook', category: 'Mindfulness', description: 'Bite-sized episodes on managing overwhelm, anxiety, and sensory overload in modern life.', episodes: '200+ episodes', color: '#10b981', link: 'https://open.spotify.com' },
  { title: 'Hidden Brain', host: 'Shankar Vedantam', category: 'Positive Psychology', description: 'NPR\'s exploration of unconscious patterns that drive human behavior — fascinating and insightful.', episodes: '300+ episodes', color: '#8b5cf6', link: 'https://open.spotify.com' },
  { title: 'The School of Greatness', host: 'Lewis Howes', category: 'Self-Improvement', description: 'Interviews with world-class performers on mindset, resilience, purpose, and personal growth.', episodes: '1400+ episodes', color: '#f97316', link: 'https://open.spotify.com' },
];

const experts = [
  { name: 'Dr. Priya Sharma', role: 'Clinical Psychologist', specialization: 'Anxiety & Depression', type: 'Therapist', availability: 'Available', sessions: '500+ sessions', avatar: 'PS', color: '#6366f1' },
  { name: 'Marcus Chen', role: 'Certified Life Coach', specialization: 'Career & Life Transitions', type: 'Life Coach', availability: 'Available', sessions: '300+ sessions', avatar: 'MC', color: '#10b981' },
  { name: 'Dr. Amelia Foster', role: 'Couples Therapist', specialization: 'Relationship & Communication', type: 'Therapist', availability: 'Busy', sessions: '800+ sessions', avatar: 'AF', color: '#ec4899' },
  { name: 'James Okonkwo', role: 'Mindfulness Coach', specialization: 'Stress & Burnout', type: 'Life Coach', availability: 'Available', sessions: '250+ sessions', avatar: 'JO', color: '#f59e0b' },
  { name: 'Sunrise Recovery Group', role: 'Peer Support Circle', specialization: 'Grief & Loss', type: 'Support Group', availability: 'Weekly', sessions: 'Open to all', avatar: 'SR', color: '#8b5cf6' },
  { name: 'Dr. Rania Al-Hassan', role: 'Trauma Specialist', specialization: 'PTSD & Trauma Recovery', type: 'Therapist', availability: 'Available', sessions: '600+ sessions', avatar: 'RA', color: '#0ea5e9' },
];

// ── Run seed ──────────────────────────────────────────────────────────────────
async function seed() {
  await connectDB();
  console.log('🌱 Starting seed...');

  await Article.deleteMany({});
  await Video.deleteMany({});
  await Podcast.deleteMany({});
  await Expert.deleteMany({});

  await Article.insertMany(articles);
  console.log(`✅ Inserted ${articles.length} articles`);

  await Video.insertMany(videos);
  console.log(`✅ Inserted ${videos.length} videos`);

  await Podcast.insertMany(podcasts);
  console.log(`✅ Inserted ${podcasts.length} podcasts`);

  await Expert.insertMany(experts);
  console.log(`✅ Inserted ${experts.length} experts`);

  console.log('\n🎉 Seed complete! Your database is ready.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
