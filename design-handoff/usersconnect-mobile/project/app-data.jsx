
// ── Brand tokens ─────────────────────────────────────────────
const BRAND_GRADIENT = 'linear-gradient(90deg, #007bff, #6610f2)';
const BRAND_START    = '#007bff';
const BRAND_END      = '#6610f2';

// ── Theme factory ─────────────────────────────────────────────
function getTheme(dark) {
  return {
    bg:           dark ? '#0d1117' : '#f0f2f5',
    card:         dark ? '#161b22' : '#ffffff',
    card2:        dark ? '#1c2128' : '#f8f9fa',
    text:         dark ? '#e6edf3' : '#343a40',
    muted:        dark ? '#8b949e' : '#6c757d',
    border:       dark ? '#30363d' : '#e9ecef',
    inputBg:      dark ? '#0d1117' : '#ffffff',
    inputBorder:  dark ? '#30363d' : '#ced4da',
    commentBubble:dark ? '#1c2128' : '#e4e6eb',
    tabBg:        dark ? '#161b22' : '#ffffff',
    tabBorder:    dark ? '#30363d' : '#e9ecef',
  };
}

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

let _nextId = 100;
function uid() { return `gen_${++_nextId}`; }

// ── Mock data ─────────────────────────────────────────────────
const MOCK_USERS = [
  { _id: 'u1', name: 'Alex Rivera',  email: 'alex@example.com',   isEmailPublic: true,  isEmailVerified: true,  avatarURL: 'https://i.pravatar.cc/150?img=11', isAdmin: false },
  { _id: 'u2', name: 'Jamie Chen',   email: 'jamie@example.com',  isEmailPublic: false, isEmailVerified: true,  avatarURL: 'https://i.pravatar.cc/150?img=47', isAdmin: false },
  { _id: 'u3', name: 'Sam Torres',   email: 'sam@example.com',    isEmailPublic: true,  isEmailVerified: false, avatarURL: 'https://i.pravatar.cc/150?img=32', isAdmin: true  },
  { _id: 'u4', name: 'Morgan Lee',   email: 'morgan@example.com', isEmailPublic: false, isEmailVerified: true,  avatarURL: 'https://i.pravatar.cc/150?img=23', isAdmin: false },
  { _id: 'u5', name: 'Jordan Kim',   email: 'jordan@example.com', isEmailPublic: true,  isEmailVerified: true,  avatarURL: 'https://i.pravatar.cc/150?img=55', isAdmin: false },
];

// Logged-in user = Alex Rivera (u1)
const CURRENT_USER = MOCK_USERS[0];

const INITIAL_POSTS = [
  {
    _id: 'p1', title: 'Meet Luna! 🐱',
    content: "Just adopted this beautiful calico cat from the shelter today. She's a little shy but already purring up a storm! 🐾",
    author: MOCK_USERS[1],
    imageURL: 'https://picsum.photos/seed/catLuna/500/280',
    likes: ['u1','u3','u4'], dislikes: [],
    createdAt: new Date(Date.now() - 2*3600000).toISOString(),
    comments: [
      { _id:'c1', content:"She's adorable! 😍", author:MOCK_USERS[0], likes:['u2'], dislikes:[], createdAt:new Date(Date.now()-3600000).toISOString() },
      { _id:'c2', content:'Lucky cat finding such a good home!', author:MOCK_USERS[3], likes:[], dislikes:[], createdAt:new Date(Date.now()-1800000).toISOString() },
    ],
  },
  {
    _id: 'p2', title: "Rocky's first hike 🐕",
    content: "Took my golden retriever Rocky on his first mountain trail today. He absolutely loved it — especially the mud puddles!",
    author: MOCK_USERS[0],
    imageURL: 'https://picsum.photos/seed/dogHike/500/280',
    likes: ['u2','u5'], dislikes: ['u3'],
    createdAt: new Date(Date.now() - 5*3600000).toISOString(),
    comments: [
      { _id:'c3', content:'Golden retrievers and mud — name a better duo 😂', author:MOCK_USERS[2], likes:['u1'], dislikes:[], createdAt:new Date(Date.now()-4*3600000).toISOString() },
    ],
  },
  {
    _id: 'p3', title: 'Reef tank upgrade 🐠',
    content: "Finally finished the 120-gallon reef tank setup. Two years in the making! The corals are starting to colour up beautifully.",
    author: MOCK_USERS[4],
    imageURL: 'https://picsum.photos/seed/reefTank/500/280',
    likes: ['u1','u2','u3','u4'], dislikes: [],
    createdAt: new Date(Date.now() - 24*3600000).toISOString(),
    comments: [],
  },
  {
    _id: 'p4', title: 'Mango says hi 🦜',
    content: "After 6 months of training, Mango finally learned to say his own name! Still working on 'good morning' though.",
    author: MOCK_USERS[2],
    imageURL: null,
    likes: ['u1'], dislikes: [],
    createdAt: new Date(Date.now() - 2*24*3600000).toISOString(),
    comments: [
      { _id:'c4', content:'Parrots are the best! How long did training actually take?', author:MOCK_USERS[1], likes:[], dislikes:[], createdAt:new Date(Date.now()-1.5*24*3600000).toISOString() },
    ],
  },
  {
    _id: 'p5', title: 'Anyone else have a dramatic cat?',
    content: "Cleo knocked over her water bowl for the 3rd time this week and then stared me dead in the eyes while doing it 😤",
    author: MOCK_USERS[3],
    imageURL: null,
    likes: ['u1','u2','u3','u4','u5'], dislikes: [],
    createdAt: new Date(Date.now() - 3*24*3600000).toISOString(),
    comments: [
      { _id:'c5', content:'Cats are chaotic agents of destruction and we love them for it 😂', author:MOCK_USERS[0], likes:['u3','u4'], dislikes:[], createdAt:new Date(Date.now()-2.8*24*3600000).toISOString() },
      { _id:'c6', content:'Mine knocked my entire keyboard off the desk. Twice.', author:MOCK_USERS[1], likes:['u1'], dislikes:[], createdAt:new Date(Date.now()-2.5*24*3600000).toISOString() },
    ],
  },
];

Object.assign(window, {
  BRAND_GRADIENT, BRAND_START, BRAND_END,
  getTheme, timeAgo, uid,
  MOCK_USERS, CURRENT_USER, INITIAL_POSTS,
});
