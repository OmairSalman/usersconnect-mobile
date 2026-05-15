
const { useState, useRef } = React;

// ── Shared UI atoms ───────────────────────────────────────────

function Avatar({ user, size = 36, gradientBorder = false, onClick }) {
  if (gradientBorder) {
    return (
      <div onClick={onClick} style={{ width: size+4, height: size+4, borderRadius: '50%', background: BRAND_GRADIENT, padding: 2, flexShrink: 0, cursor: onClick ? 'pointer' : 'default' }}>
        <img src={user.avatarURL} alt={user.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return <img src={user.avatarURL} alt={user.name} onClick={onClick}
    style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, cursor: onClick ? 'pointer' : 'default' }} />;
}

function GradientText({ children, style = {} }) {
  return (
    <span style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', ...style }}>
      {children}
    </span>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, theme }) {
  return (
    <div>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: theme.text, marginBottom: 6, display: 'block' }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${theme.inputBorder}`, background: theme.inputBg, color: theme.text, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, fullWidth = true, small = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#aaa' : BRAND_GRADIENT,
      color: 'white', border: 'none', borderRadius: 50,
      padding: small ? '8px 18px' : '13px 24px',
      fontWeight: 600, fontSize: small ? 13 : 15, cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : 'auto', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

// ── Who-liked popup ───────────────────────────────────────────
function LikesPopup({ userIds, title, accentColor, onClose, theme }) {
  const users = (userIds || []).map(id => MOCK_USERS.find(u => u._id === id)).filter(Boolean);
  const grad = accentColor === 'red' ? 'linear-gradient(90deg,#dc3545,#c82333)' : BRAND_GRADIENT;
  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:theme.card, borderRadius:'20px 20px 0 0', width:'100%', maxHeight:'60%', display:'flex', flexDirection:'column', padding:'16px 0 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:theme.border, margin:'0 auto 14px' }}></div>
        <div style={{ fontWeight:700, fontSize:15, textAlign:'center', marginBottom:14,
          background: grad, WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>{title}</div>
        <div style={{ flex:1, overflow:'auto', padding:'0 18px' }}>
          {users.length === 0
            ? <div style={{ color:theme.muted, textAlign:'center', fontSize:13, padding:'20px 0' }}>Nobody yet</div>
            : users.map(u => (
              <div key={u._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${theme.border}` }}>
                <Avatar user={u} size={36} />
                <span style={{ fontWeight:500, fontSize:14, color:theme.text }}>{u.name}</span>
                {u._id === CURRENT_USER._id && <span style={{ marginLeft:'auto', fontSize:11, color:theme.muted }}>You</span>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────
function ConfirmSheet({ message, onConfirm, onCancel, confirmLabel = 'Delete', theme }) {
  return (
    <div onClick={onCancel} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:theme.card, borderRadius:'20px 20px 0 0', width:'100%', padding:'20px 18px 44px', display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:theme.border, margin:'0 auto 6px' }}></div>
        <div style={{ fontSize:14, color:theme.text, textAlign:'center', lineHeight:1.5 }}>{message}</div>
        <button onClick={onConfirm} style={{ background:'#dc3545', color:'white', border:'none', borderRadius:12, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer' }}>{confirmLabel}</button>
        <button onClick={onCancel} style={{ background:'none', border:`1px solid ${theme.border}`, color:theme.muted, borderRadius:12, padding:'12px', fontSize:14, cursor:'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Reaction row ──────────────────────────────────────────────
function ReactionRow({ likes, dislikes, currentUserId, onToggleLike, onToggleDislike, onShowLikes, onShowDislikes, theme, compact = false }) {
  const isLiked    = likes.includes(currentUserId);
  const isDisliked = dislikes.includes(currentUserId);
  const sz = compact ? 26 : 30;
  const r  = compact ? 5 : 7;
  const fs = compact ? 10 : 12;

  const likeBtn = {
    width: sz, height: sz, borderRadius: r, flexShrink: 0,
    border: isLiked ? 'none' : `1px solid ${BRAND_START}`,
    background: isLiked ? BRAND_GRADIENT : 'transparent',
    color: isLiked ? 'white' : BRAND_START,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const dislikeBtn = {
    width: sz, height: sz, borderRadius: r, flexShrink: 0,
    border: isDisliked ? 'none' : '1px solid #dc3545',
    background: isDisliked ? 'linear-gradient(135deg,#dc3545,#c82333)' : 'transparent',
    color: isDisliked ? 'white' : '#dc3545',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  // Count box — same size & shape as reaction buttons
  const countBtn = (active, color) => ({
    width: sz, height: sz, borderRadius: r, flexShrink: 0,
    border: `1px solid ${active ? color : theme.border}`,
    background: 'transparent',
    color: active ? color : theme.muted,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: compact ? 11 : 12, fontWeight: active ? 700 : 400,
  });

  return (
    <div style={{ display:'flex', alignItems:'center', gap: compact ? 4 : 5 }}>
      <button onClick={e => { e.stopPropagation(); onToggleLike(); }} style={likeBtn}>
        <i className="fa-solid fa-thumbs-up" style={{ fontSize: fs }}></i>
      </button>
      <button onClick={e => { e.stopPropagation(); onShowLikes(); }} style={countBtn(isLiked, BRAND_START)}>
        {likes.length}
      </button>
      <button onClick={e => { e.stopPropagation(); onToggleDislike(); }} style={dislikeBtn}>
        <i className="fa-solid fa-thumbs-down" style={{ fontSize: fs }}></i>
      </button>
      <button onClick={e => { e.stopPropagation(); onShowDislikes(); }} style={countBtn(isDisliked, '#dc3545')}>
        {dislikes.length}
      </button>
    </div>
  );
}

// ── Comment card ──────────────────────────────────────────────
function CommentCard({ comment, currentUser, onDelete, onUpdate, onViewProfile, onShowPopup, theme }) {
  const isAuthor   = comment.author._id === currentUser._id;
  const isAdmin    = currentUser.isAdmin;
  const [likes, setLikes]       = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes || []);
  const [editing, setEditing]   = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const isLiked    = likes.includes(currentUser._id);
  const isDisliked = dislikes.includes(currentUser._id);

  const toggleLike = () => {
    setLikes(prev => isLiked ? prev.filter(id=>id!==currentUser._id) : [...prev, currentUser._id]);
    if (isDisliked) setDislikes(prev => prev.filter(id=>id!==currentUser._id));
  };
  const toggleDislike = () => {
    setDislikes(prev => isDisliked ? prev.filter(id=>id!==currentUser._id) : [...prev, currentUser._id]);
    if (isLiked) setLikes(prev => prev.filter(id=>id!==currentUser._id));
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    onUpdate && onUpdate({ ...comment, content: editText.trim() });
    setEditing(false);
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <Avatar user={comment.author} size={28} onClick={() => onViewProfile && onViewProfile(comment.author)} />
      <div style={{ flex: 1 }}>
        {editing ? (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} autoFocus
              style={{ width:'100%', borderRadius:10, border:`1px solid ${BRAND_START}`, background:theme.inputBg, color:theme.text, padding:'8px 12px', fontSize:13, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={saveEdit} style={{ flex:2, background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'7px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Save</button>
              <button onClick={()=>{ setEditing(false); setEditText(comment.content); }} style={{ flex:1, background:'none', border:`1px solid ${theme.border}`, color:theme.muted, borderRadius:8, padding:'7px', fontSize:12, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ background: theme.commentBubble, borderRadius: '4px 12px 12px 12px', padding: '8px 12px' }}>
              <span onClick={() => onViewProfile && onViewProfile(comment.author)}
                style={{ fontWeight: 600, fontSize: 12, color: theme.text, marginBottom: 3, display:'block', cursor:'pointer' }}>
                {comment.author.name}
              </span>
              <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{comment.content}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, paddingLeft: 4 }}>
              <span style={{ fontSize: 11, color: theme.muted }}>{timeAgo(comment.createdAt)}</span>
              <ReactionRow
                likes={likes} dislikes={dislikes} currentUserId={currentUser._id}
                onToggleLike={toggleLike} onToggleDislike={toggleDislike}
                onShowLikes={() => onShowPopup && onShowPopup(likes, 'Liked by', 'blue')}
                onShowDislikes={() => onShowPopup && onShowPopup(dislikes, 'Disliked by', 'red')}
                theme={theme} compact={true}
              />
              {(isAuthor || isAdmin) && (
                <div style={{ marginLeft:'auto', display:'flex', gap:5 }}>
                  {isAuthor && (
                    <button onClick={() => setEditing(true)} style={{ background:'none', border:`1px solid ${BRAND_START}`, borderRadius:5, color:BRAND_START, width:22, height:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <i className="fa-solid fa-pen" style={{ fontSize:9 }}></i>
                    </button>
                  )}
                  <button onClick={() => onDelete && onDelete(comment._id)} style={{ background:'none', border:'1px solid #dc3545', borderRadius:5, color:'#dc3545', width:22, height:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className="fa-solid fa-trash" style={{ fontSize:9 }}></i>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Post card ─────────────────────────────────────────────────
function PostCard({ post, currentUser, onUpdate, onDelete, onViewPost, onViewProfile, onShowPopup, theme, cardStyle }) {
  const [p, setP] = useState(post);
  const isLiked    = p.likes.includes(currentUser._id);
  const isDisliked = p.dislikes.includes(currentUser._id);
  const isAuthor   = p.author._id === currentUser._id;
  const isAdmin    = currentUser.isAdmin;

  const toggleLike = () => {
    const next = { ...p, likes: isLiked ? p.likes.filter(id=>id!==currentUser._id) : [...p.likes, currentUser._id], dislikes: p.dislikes.filter(id=>id!==currentUser._id) };
    setP(next); onUpdate && onUpdate(next);
  };
  const toggleDislike = () => {
    const next = { ...p, dislikes: isDisliked ? p.dislikes.filter(id=>id!==currentUser._id) : [...p.dislikes, currentUser._id], likes: p.likes.filter(id=>id!==currentUser._id) };
    setP(next); onUpdate && onUpdate(next);
  };

  const isVisual  = cardStyle === 'visual';
  const isCompact = cardStyle === 'compact';

  return (
    <div onClick={() => onViewPost(p)} style={{ background: theme.card, borderRadius: 14, marginBottom: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
      {isVisual && p.imageURL && <img src={p.imageURL} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />}
      <div style={{ padding: isCompact ? '10px 12px' : '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Avatar user={p.author} size={isCompact ? 26 : 32} onClick={e => { e.stopPropagation(); onViewProfile && onViewProfile(p.author); }} />
          <div style={{ flex: 1 }} onClick={e => { e.stopPropagation(); onViewProfile && onViewProfile(p.author); }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: theme.text, cursor:'pointer' }}>{p.author.name}</div>
            <div style={{ fontSize: 11, color: theme.muted }}>{timeAgo(p.createdAt)}</div>
          </div>
          {(isAuthor || isAdmin) && (
            <div style={{ display:'flex', gap:5, flexShrink:0 }} onClick={e => e.stopPropagation()}>
              {isAuthor && (
                <button onClick={e => { e.stopPropagation(); onViewPost({ ...p, _openEdit: true }); }} style={{ background:'none', border:`1px solid ${BRAND_START}`, borderRadius:6, color:BRAND_START, width:26, height:26, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className="fa-solid fa-pen" style={{ fontSize: 10 }}></i>
                </button>
              )}
              <button onClick={e => { e.stopPropagation(); onDelete && onDelete(p._id); }} style={{ background:'none', border:`1px solid #dc3545`, borderRadius:6, color:'#dc3545', width:26, height:26, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="fa-solid fa-trash" style={{ fontSize: 10 }}></i>
              </button>
            </div>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: isCompact ? 14 : 15, color: theme.text, marginBottom: isCompact ? 0 : 5 }}>{p.title}</div>
        {!isVisual && !isCompact && p.imageURL && (
          <img src={p.imageURL} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8, maxHeight: 220, objectFit: 'cover', display: 'block' }} />
        )}
        {!isCompact && (
          <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.55, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.content}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: `1px solid ${theme.border}`, paddingTop: 9, marginTop: isCompact ? 8 : 0 }}>
          <ReactionRow
            likes={p.likes} dislikes={p.dislikes} currentUserId={currentUser._id}
            onToggleLike={toggleLike} onToggleDislike={toggleDislike}
            onShowLikes={() => onShowPopup && onShowPopup(p.likes, 'Liked by', 'blue')}
            onShowDislikes={() => onShowPopup && onShowPopup(p.dislikes, 'Disliked by', 'red')}
            theme={theme}
          />
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, color: theme.muted, fontSize: 12 }}>
            <i className="fa-regular fa-comment"></i> <span>{p.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister, theme }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const submit = () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const match = MOCK_USERS.find(u => u.name.toLowerCase().includes(email.toLowerCase()) || u.email.toLowerCase() === email.toLowerCase());
    onLogin(match || MOCK_USERS[0]);
  };

  return (
    <div style={{ padding: '28px 22px', paddingTop: 80, display: 'flex', flexDirection: 'column', gap: 18, minHeight: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <img src="src/public/images/logo-icon.svg" alt="UsersConnect" style={{ width: 72, height: 72, margin: '0 auto 10px', display: 'block' }} />
        <GradientText style={{ fontSize: 26, fontWeight: 800, display: 'block' }}>UsersConnect</GradientText>
        <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>Sign in to your account</div>
      </div>
      <div style={{ background: theme.card, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
        <InputField label="Email or Name" type="text" value={email} onChange={setEmail} placeholder="you@example.com" theme={theme} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" theme={theme} />
        {error && <div style={{ color:'#dc3545', fontSize:12 }}>{error}</div>}
        <PrimaryBtn onClick={submit}>Login</PrimaryBtn>
        <div style={{ textAlign:'center', fontSize:12, color:theme.muted, cursor:'pointer' }}>Forgot password? <span style={{ color:BRAND_START, fontWeight:600 }}>Reset it</span></div>
      </div>
      <div style={{ background: theme.card, borderRadius: 14, padding: '14px 16px', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted, textTransform:'uppercase', letterSpacing:0.6, marginBottom: 10 }}>Demo Accounts</div>
        {MOCK_USERS.map(u => (
          <button key={u._id} onClick={() => onLogin(u)} style={{ width:'100%', background:'none', border:'none', display:'flex', alignItems:'center', gap:10, padding:'8px 0', cursor:'pointer', borderBottom:`1px solid ${theme.border}` }}>
            <Avatar user={u} size={32} />
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontWeight:600, fontSize:13, color:theme.text }}>{u.name}</div>
              <div style={{ fontSize:11, color:theme.muted }}>{u.email}</div>
            </div>
            {u.isAdmin && <span style={{ background:'#ffc107', color:'#212529', fontSize:10, fontWeight:700, borderRadius:50, padding:'2px 7px' }}>Admin</span>}
          </button>
        ))}
      </div>
      <div style={{ textAlign:'center', fontSize:13, color:theme.muted }}>
        Don't have an account?{' '}
        <span onClick={onRegister} style={{ color:BRAND_END, fontWeight:700, cursor:'pointer' }}>Register</span>
      </div>
    </div>
  );
}

// ── REGISTER ──────────────────────────────────────────────────
function RegisterScreen({ onRegister, onLogin, theme }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');

  const submit = () => {
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    onRegister();
  };

  return (
    <div style={{ padding: '28px 22px', paddingTop: 80, display: 'flex', flexDirection: 'column', gap: 18, minHeight: '100%' }}>
      <div style={{ textAlign:'center' }}>
        <img src="src/public/images/logo-icon.svg" alt="UsersConnect" style={{ width:60, height:60, margin:'0 auto 10px', display:'block' }} />
        <GradientText style={{ fontSize:22, fontWeight:800, display:'block' }}>Create Account</GradientText>
        <div style={{ color:theme.muted, fontSize:13, marginTop:3 }}>Join the community</div>
      </div>
      <div style={{ background:theme.card, borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:12, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
        <InputField label="Full Name" value={name} onChange={setName} placeholder="John Doe" theme={theme} />
        <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" theme={theme} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="Choose a password" theme={theme} />
        <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Re-enter password" theme={theme} />
        {error && <div style={{ color:'#dc3545', fontSize:12 }}>{error}</div>}
        <PrimaryBtn onClick={submit}>Create Account</PrimaryBtn>
      </div>
      <div style={{ textAlign:'center', fontSize:13, color:theme.muted }}>
        Already have an account?{' '}
        <span onClick={onLogin} style={{ color:BRAND_END, fontWeight:700, cursor:'pointer' }}>Login</span>
      </div>
    </div>
  );
}

// ── FEED ──────────────────────────────────────────────────────
function FeedScreen({ posts, currentUser, onPostUpdate, onPostDelete, onViewPost, onViewProfile, onCreatePost, onShowPopup, theme, cardStyle }) {
  return (
    <div style={{ padding: '12px 14px' }}>
      <div onClick={onCreatePost} style={{ background:theme.card, borderRadius:14, padding:'12px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:10, cursor:'pointer', boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
        <Avatar user={currentUser} size={36} />
        <div style={{ flex:1, background:theme.card2, borderRadius:50, padding:'9px 16px', color:theme.muted, fontSize:13, border:`1px solid ${theme.border}` }}>
          What's on your mind?
        </div>
      </div>
      {posts.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:theme.muted }}>
          <i className="fa-regular fa-face-smile" style={{ fontSize:40, marginBottom:12, display:'block' }}></i>
          <div style={{ fontWeight:700, fontSize:18 }}>No posts yet</div>
          <div style={{ fontSize:13, marginTop:4 }}>Be the first to post!</div>
        </div>
      ) : posts.map(post => (
        <PostCard key={post._id} post={post} currentUser={currentUser}
          onUpdate={onPostUpdate} onDelete={onPostDelete}
          onViewPost={onViewPost} onViewProfile={onViewProfile}
          onShowPopup={onShowPopup} theme={theme} cardStyle={cardStyle} />
      ))}
    </div>
  );
}

// ── POST DETAIL ───────────────────────────────────────────────
function PostDetailScreen({ post, currentUser, onBack, onPostUpdate, onViewProfile, onShowPopup, theme }) {
  const [p, setP]               = useState(post);
  const [commentText, setCommentText] = useState('');
  const [editingPost, setEditingPost] = useState(!!post._openEdit);
  const [editTitle, setEditTitle]     = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [confirmDelete, setConfirmDelete] = useState(null); // 'post' | commentId
  const isLiked    = p.likes.includes(currentUser._id);
  const isDisliked = p.dislikes.includes(currentUser._id);
  const isAuthor   = p.author._id === currentUser._id;
  const isAdmin    = currentUser.isAdmin;

  const handleUpdate = (next) => { setP(next); onPostUpdate && onPostUpdate(next); };

  const toggleLike = () => handleUpdate({ ...p, likes: isLiked ? p.likes.filter(id=>id!==currentUser._id) : [...p.likes, currentUser._id], dislikes: p.dislikes.filter(id=>id!==currentUser._id) });
  const toggleDislike = () => handleUpdate({ ...p, dislikes: isDisliked ? p.dislikes.filter(id=>id!==currentUser._id) : [...p.dislikes, currentUser._id], likes: p.likes.filter(id=>id!==currentUser._id) });

  const savePostEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    handleUpdate({ ...p, title: editTitle.trim(), content: editContent.trim() });
    setEditingPost(false);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const c = { _id: uid(), content: commentText.trim(), author: currentUser, likes:[], dislikes:[], createdAt: new Date().toISOString() };
    handleUpdate({ ...p, comments: [...p.comments, c] });
    setCommentText('');
  };

  const updateComment = (updated) => handleUpdate({ ...p, comments: p.comments.map(c => c._id === updated._id ? updated : c) });
  const deleteComment = (cid) => { setConfirmDelete(cid); };
  const confirmDeleteComment = () => { handleUpdate({ ...p, comments: p.comments.filter(c => c._id !== confirmDelete) }); setConfirmDelete(null); };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', position:'relative' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px 10px', paddingTop:70, background: BRAND_GRADIENT, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'white', opacity:0.9, fontSize:15, display:'flex', alignItems:'center', gap:6, padding:0, fontWeight:600 }}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span style={{ fontWeight:800, fontSize:18, color:'white' }}>Post</span>
        </div>
        {(isAuthor || isAdmin) && !editingPost && (
          <div style={{ display:'flex', gap:8 }}>
            {isAuthor && (
              <button onClick={() => setEditingPost(true)} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, color:'white', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="fa-solid fa-pen" style={{ fontSize:12 }}></i>
              </button>
            )}
            <button onClick={() => setConfirmDelete('post')} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, color:'white', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="fa-solid fa-trash" style={{ fontSize:12 }}></i>
            </button>
          </div>
        )}
      </div>

      {/* Scrollable */}
      <div style={{ flex:1, overflow:'auto', padding:'16px 14px' }}>
        {/* Author */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, cursor:'pointer' }} onClick={() => onViewProfile && onViewProfile(p.author)}>
          <Avatar user={p.author} size={40} gradientBorder />
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:theme.text }}>{p.author.name}</div>
            <div style={{ fontSize:11, color:theme.muted }}>{timeAgo(p.createdAt)}</div>
          </div>
        </div>

        {editingPost ? (
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            <input value={editTitle} onChange={e=>setEditTitle(e.target.value)}
              style={{ padding:'10px 12px', borderRadius:10, border:`1px solid ${BRAND_START}`, background:theme.inputBg, color:theme.text, fontSize:16, fontWeight:700, outline:'none', boxSizing:'border-box', width:'100%' }} />
            <textarea value={editContent} onChange={e=>setEditContent(e.target.value)} rows={5}
              style={{ padding:'10px 12px', borderRadius:10, border:`1px solid ${BRAND_START}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box', lineHeight:1.6, width:'100%' }} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={savePostEdit} style={{ flex:2, background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Save</button>
              <button onClick={()=>{ setEditingPost(false); setEditTitle(p.title); setEditContent(p.content); }} style={{ flex:1, background:'none', border:`1px solid ${theme.border}`, color:theme.muted, borderRadius:10, padding:'10px', fontSize:13, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontWeight:800, fontSize:19, color:theme.text, marginBottom:8 }}>{p.title}</div>
            {p.imageURL && <img src={p.imageURL} alt="" style={{ width:'100%', borderRadius:12, marginBottom:12, maxHeight:260, objectFit:'cover' }} />}
            <div style={{ fontSize:14, color:theme.text, lineHeight:1.65, marginBottom:16 }}>{p.content}</div>
          </>
        )}

        {/* Reactions */}
        <div style={{ display:'flex', gap:8, marginBottom:18, paddingBottom:16, borderBottom:`1px solid ${theme.border}` }}>
          <ReactionRow
            likes={p.likes} dislikes={p.dislikes} currentUserId={currentUser._id}
            onToggleLike={toggleLike} onToggleDislike={toggleDislike}
            onShowLikes={() => onShowPopup && onShowPopup(p.likes, 'Liked by', 'blue')}
            onShowDislikes={() => onShowPopup && onShowPopup(p.dislikes, 'Disliked by', 'red')}
            theme={theme}
          />
        </div>

        {/* Comments */}
        <div style={{ fontWeight:700, fontSize:14, color:theme.text, marginBottom:12 }}>Comments ({p.comments.length})</div>
        {p.comments.length === 0 && <div style={{ color:theme.muted, fontSize:13, marginBottom:16 }}>No comments yet. Be the first!</div>}
        {p.comments.map(c => (
          <CommentCard key={c._id} comment={c} currentUser={currentUser}
            onDelete={deleteComment} onUpdate={updateComment}
            onViewProfile={onViewProfile} onShowPopup={onShowPopup} theme={theme} />
        ))}
        <div style={{ height:8 }}></div>
      </div>

      {/* Comment input */}
      <div style={{ padding:'10px 14px 44px', background:theme.card, borderTop:`1px solid ${theme.border}`, display:'flex', gap:8, alignItems:'flex-end', flexShrink:0 }}>
        <Avatar user={currentUser} size={30} />
        <textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Write a comment…" rows={1}
          style={{ flex:1, borderRadius:20, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, padding:'8px 14px', fontSize:13, outline:'none', resize:'none', fontFamily:'inherit' }} />
        <button onClick={addComment} disabled={!commentText.trim()} style={{ background:commentText.trim()?BRAND_GRADIENT:'#ccc', color:'white', border:'none', borderRadius:50, padding:'8px 14px', cursor:commentText.trim()?'pointer':'default', fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
          Post
        </button>
      </div>

      {/* Confirm delete overlays */}
      {confirmDelete === 'post' && (
        <ConfirmSheet message="Delete this post? This cannot be undone." onConfirm={() => { onPostUpdate && onPostUpdate({ ...p, _deleted: true }); onBack(); }} onCancel={() => setConfirmDelete(null)} theme={theme} />
      )}
      {confirmDelete && confirmDelete !== 'post' && (
        <ConfirmSheet message="Delete this comment?" onConfirm={confirmDeleteComment} onCancel={() => setConfirmDelete(null)} theme={theme} />
      )}
    </div>
  );
}

// ── CREATE POST ───────────────────────────────────────────────
function CreatePostScreen({ currentUser, onSubmit, onBack, theme }) {
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [hasImage, setHasImage] = useState(false);

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ _id: uid(), title: title.trim(), content: content.trim(), author: currentUser,
      imageURL: hasImage ? `https://picsum.photos/seed/${uid()}/500/280` : null,
      likes:[], dislikes:[], createdAt: new Date().toISOString(), comments:[] });
  };

  return (
    <div style={{ padding:'14px' }}>
      <div style={{ background:theme.card, borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:14, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Avatar user={currentUser} size={38} gradientBorder />
          <div style={{ fontWeight:600, fontSize:14, color:theme.text }}>{currentUser.name}</div>
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:theme.text, marginBottom:6, display:'block' }}>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give your post a title…"
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', boxSizing:'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:theme.text, marginBottom:6, display:'block' }}>Content</label>
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="What's on your mind?" rows={5}
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box', lineHeight:1.6 }} />
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:theme.text, marginBottom:8, display:'block' }}>Attach image</label>
          {!hasImage ? (
            <button onClick={()=>setHasImage(true)} style={{ background:'none', border:`2px dashed ${theme.inputBorder}`, borderRadius:10, padding:'14px', width:'100%', color:theme.muted, cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <i className="fa-solid fa-image" style={{ fontSize:18 }}></i> Tap to add image
            </button>
          ) : (
            <div style={{ position:'relative' }}>
              <img src="https://picsum.photos/seed/preview/400/180" alt="preview" style={{ width:'100%', borderRadius:10, objectFit:'cover', height:120 }} />
              <button onClick={()=>setHasImage(false)} style={{ position:'absolute', top:6, right:6, background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:26, height:26, color:'white', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          )}
        </div>
        <PrimaryBtn onClick={submit} disabled={!title.trim() || !content.trim()}>Post</PrimaryBtn>
      </div>
    </div>
  );
}

// ── EDIT PROFILE ──────────────────────────────────────────────
function EditProfileScreen({ user, onBack, onSave, theme }) {
  const [name, setName]                 = useState(user.name);
  const [isEmailPublic, setEmailPublic] = useState(user.isEmailPublic);
  const [currentPwd, setCurrentPwd]     = useState('');
  const [newPwd, setNewPwd]             = useState('');
  const [confirmPwd, setConfirmPwd]     = useState('');
  const [pwdError, setPwdError]         = useState('');
  const [pwdSuccess, setPwdSuccess]     = useState(false);
  const [emailFlow, setEmailFlow]       = useState('idle');
  const [emailCode1, setEmailCode1]     = useState('');
  const [newEmail, setNewEmail]         = useState('');
  const [emailCode2, setEmailCode2]     = useState('');
  const [emailError, setEmailError]     = useState('');
  const nameChanged = name.trim() !== user.name;

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6, paddingLeft: 4 }}>{title}</div>
      <div style={{ background: theme.card, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>{children}</div>
    </div>
  );
  const Row = ({ children, noBorder }) => (
    <div style={{ padding: '13px 16px', borderBottom: noBorder ? 'none' : `1px solid ${theme.border}` }}>{children}</div>
  );

  const handlePwdSave = () => {
    setPwdError(''); setPwdSuccess(false);
    if (!currentPwd || !newPwd || !confirmPwd) { setPwdError('Fill in all fields.'); return; }
    if (newPwd.length < 6) { setPwdError('At least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setPwdSuccess(true); setTimeout(() => setPwdSuccess(false), 2500);
  };

  return (
    <div style={{ padding: '14px' }}>
      <Section title="Profile Picture">
        <Row noBorder>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar user={user} size={60} gradientBorder />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <button style={{ background: BRAND_GRADIENT, color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <i className="fa-solid fa-upload" style={{ marginRight: 6 }}></i>Upload Photo
              </button>
              <button style={{ background: 'none', border: '1px solid #dc3545', color: '#dc3545', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
                <i className="fa-solid fa-times" style={{ marginRight: 6 }}></i>Remove
              </button>
            </div>
          </div>
        </Row>
      </Section>

      <Section title="Display Name">
        <Row noBorder>
          <label style={{ fontSize: 12, color: theme.muted, display: 'block', marginBottom: 6 }}>Full Name</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: `1px solid ${theme.inputBorder}`, background: theme.inputBg, color: theme.text, fontSize: 14, outline: 'none' }} />
            <button onClick={() => onSave({ name })} disabled={!nameChanged}
              style={{ background: nameChanged ? BRAND_GRADIENT : '#ccc', color: 'white', border: 'none', borderRadius: 8, padding: '0 16px', cursor: nameChanged ? 'pointer' : 'default', fontWeight: 600, fontSize: 13 }}>
              Save
            </button>
          </div>
        </Row>
      </Section>

      <Section title="Email Address">
        <Row>
          <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{user.email}</div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className={`fa-solid ${user.isEmailVerified ? 'fa-circle-check' : 'fa-circle-exclamation'}`} style={{ color: user.isEmailVerified ? '#198754' : '#dc3545' }}></i>
            {user.isEmailVerified ? 'Verified' : 'Not verified'}
          </div>
        </Row>
        <Row>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>Email Privacy</div>
              <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>Show email on profile</div>
            </div>
            <div onClick={() => setEmailPublic(v => !v)} style={{ width: 44, height: 26, borderRadius: 13,
              background: isEmailPublic ? BRAND_GRADIENT : theme.border,
              position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: isEmailPublic ? 21 : 3, width: 20, height: 20,
                borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}></div>
            </div>
          </div>
        </Row>
        <Row noBorder>
          {emailFlow === 'idle' && (
            <button onClick={() => setEmailFlow('step1')} style={{ background:'none', border:`1px solid ${BRAND_START}`, color:BRAND_START, borderRadius:8, padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer', width:'100%' }}>
              <i className="fa-solid fa-envelope" style={{ marginRight:6 }}></i>Change Email
            </button>
          )}
          {emailFlow === 'step1' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:12, color:theme.muted }}>Code sent to <strong style={{ color:theme.text }}>{user.email}</strong></div>
              <input value={emailCode1} onChange={e=>setEmailCode1(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="6-digit code"
                style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', letterSpacing:4, textAlign:'center' }} />
              {emailError && <div style={{ color:'#dc3545', fontSize:11 }}>{emailError}</div>}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>{ setEmailFlow('idle'); setEmailCode1(''); setEmailError(''); }} style={{ flex:1, background:'none', border:`1px solid ${theme.border}`, color:theme.muted, borderRadius:8, padding:'9px', fontSize:13, cursor:'pointer' }}>Cancel</button>
                <button onClick={()=>{ if(emailCode1.length!==6){setEmailError('Enter 6-digit code.');return;} setEmailError(''); setEmailFlow('step2'); }} style={{ flex:2, background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'9px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Verify</button>
              </div>
            </div>
          )}
          {emailFlow === 'step2' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:12, color:theme.muted }}>Enter your new email address</div>
              <input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="new@email.com"
                style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none' }} />
              {emailError && <div style={{ color:'#dc3545', fontSize:11 }}>{emailError}</div>}
              <button onClick={()=>{ if(!newEmail.includes('@')){setEmailError('Enter valid email.');return;} if(newEmail===user.email){setEmailError('Must differ from current.');return;} setEmailError(''); setEmailFlow('step3'); }} style={{ background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'10px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Send Code to New Email</button>
            </div>
          )}
          {emailFlow === 'step3' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:12, color:theme.muted }}>Code sent to <strong style={{ color:theme.text }}>{newEmail}</strong></div>
              <input value={emailCode2} onChange={e=>setEmailCode2(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="6-digit code"
                style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', letterSpacing:4, textAlign:'center' }} />
              {emailError && <div style={{ color:'#dc3545', fontSize:11 }}>{emailError}</div>}
              <button onClick={()=>{ if(emailCode2.length!==6){setEmailError('Enter 6-digit code.');return;} setEmailFlow('done'); setTimeout(()=>setEmailFlow('idle'),3000); }} style={{ background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'10px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Verify & Save</button>
            </div>
          )}
          {emailFlow === 'done' && (
            <div style={{ textAlign:'center', color:'#198754', fontSize:13, fontWeight:600, padding:'8px 0' }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight:6 }}></i>Email updated!
            </div>
          )}
        </Row>
      </Section>

      <Section title="Password">
        <Row>
          <label style={{ fontSize:12, color:theme.muted, display:'block', marginBottom:6 }}>Current Password</label>
          <input type="password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} placeholder="Enter current password"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', boxSizing:'border-box' }} />
        </Row>
        <Row>
          <label style={{ fontSize:12, color:theme.muted, display:'block', marginBottom:6 }}>New Password</label>
          <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="At least 6 characters"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', boxSizing:'border-box' }} />
        </Row>
        <Row noBorder>
          <label style={{ fontSize:12, color:theme.muted, display:'block', marginBottom:6 }}>Confirm New Password</label>
          <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder="Re-enter new password"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', boxSizing:'border-box' }} />
          {pwdError && <div style={{ color:'#dc3545', fontSize:11, marginTop:6 }}>{pwdError}</div>}
          {pwdSuccess && <div style={{ color:'#198754', fontSize:11, marginTop:6 }}><i className="fa-solid fa-circle-check" style={{ marginRight:4 }}></i>Password updated!</div>}
          <button onClick={handlePwdSave} style={{ marginTop:12, width:'100%', background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'11px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
            <i className="fa-solid fa-key" style={{ marginRight:6 }}></i>Update Password
          </button>
        </Row>
      </Section>
      <div style={{ height:24 }}></div>
    </div>
  );
}

// ── ADMIN EDIT USER ───────────────────────────────────────────
function AdminEditUserScreen({ user, onBack, onSave, theme }) {
  const [name, setName]     = useState(user.name);
  const [email, setEmail]   = useState(user.email);
  const [newPwd, setNewPwd] = useState('');
  const [nameMsg, setNameMsg]   = useState(null);
  const [emailMsg, setEmailMsg] = useState(null);
  const [pwdMsg, setPwdMsg]     = useState(null);

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6, paddingLeft: 4 }}>{title}</div>
      <div style={{ background: theme.card, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>{children}</div>
    </div>
  );
  const Row = ({ children, noBorder }) => (
    <div style={{ padding: '13px 16px', borderBottom: noBorder ? 'none' : `1px solid ${theme.border}` }}>{children}</div>
  );
  const Msg = ({ msg }) => msg ? (
    <div style={{ fontSize:11, marginTop:5, color: msg.type==='success' ? '#198754' : '#dc3545' }}>
      <i className={`fa-solid ${msg.type==='success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`} style={{ marginRight:4 }}></i>{msg.text}
    </div>
  ) : null;

  return (
    <div style={{ padding:'14px' }}>
      {/* User header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, background:theme.card, borderRadius:14, padding:'16px', marginBottom:14, boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
        <Avatar user={user} size={52} gradientBorder />
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:theme.text }}>{user.name}</div>
          <div style={{ fontSize:12, color:theme.muted }}>{user.email}</div>
          {user.isAdmin && <span style={{ background:'#ffc107', color:'#212529', fontSize:10, fontWeight:700, borderRadius:50, padding:'2px 7px', marginTop:4, display:'inline-block' }}>Admin</span>}
        </div>
      </div>

      <Section title="Edit Name">
        <Row noBorder>
          <label style={{ fontSize:12, color:theme.muted, display:'block', marginBottom:6 }}>Full Name</label>
          <div style={{ display:'flex', gap:8 }}>
            <input value={name} onChange={e=>setName(e.target.value)}
              style={{ flex:1, padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none' }} />
            <button onClick={()=>{ if(!name.trim()){setNameMsg({type:'error',text:'Name cannot be empty.'});return;} onSave({ _id:user._id, name:name.trim() }); setNameMsg({type:'success',text:'Name updated!'}); setTimeout(()=>setNameMsg(null),2500); }}
              style={{ background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'0 14px', cursor:'pointer', fontWeight:600, fontSize:13, whiteSpace:'nowrap' }}>
              Update
            </button>
          </div>
          <Msg msg={nameMsg} />
        </Row>
      </Section>

      <Section title="Edit Email">
        <Row noBorder>
          <label style={{ fontSize:12, color:theme.muted, display:'block', marginBottom:6 }}>Email Address</label>
          <div style={{ display:'flex', gap:8 }}>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              style={{ flex:1, padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none' }} />
            <button onClick={()=>{ if(!email.includes('@')){setEmailMsg({type:'error',text:'Invalid email.'});return;} onSave({ _id:user._id, email }); setEmailMsg({type:'success',text:'Email updated. User must re-verify.'}); setTimeout(()=>setEmailMsg(null),3000); }}
              style={{ background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'0 14px', cursor:'pointer', fontWeight:600, fontSize:13, whiteSpace:'nowrap' }}>
              Update
            </button>
          </div>
          <Msg msg={emailMsg} />
        </Row>
      </Section>

      <Section title="Change Password">
        <Row noBorder>
          <label style={{ fontSize:12, color:theme.muted, display:'block', marginBottom:6 }}>New Password</label>
          <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="At least 6 characters"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:8 }} />
          <button onClick={()=>{ if(newPwd.length<6){setPwdMsg({type:'error',text:'At least 6 characters.'});return;} onSave({ _id:user._id, newPassword:newPwd }); setNewPwd(''); setPwdMsg({type:'success',text:'Password changed!'}); setTimeout(()=>setPwdMsg(null),2500); }}
            style={{ width:'100%', background:BRAND_GRADIENT, color:'white', border:'none', borderRadius:8, padding:'11px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
            <i className="fa-solid fa-key" style={{ marginRight:6 }}></i>Set Password
          </button>
          <Msg msg={pwdMsg} />
        </Row>
      </Section>
      <div style={{ height:24 }}></div>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────
function ProfileScreen({ profileUser, currentUser, posts, onViewPost, onBack, isOwnProfile, onViewUsers, onLogout, onEditProfile, onViewProfile, onShowPopup, theme, cardStyle }) {
  const postsLikes    = posts.reduce((a, p) => a + p.likes.length, 0);
  const commentsLikes = posts.reduce((a, p) => a + p.comments.reduce((b, c) => b + c.likes.length, 0), 0);

  return (
    <div>
      <div style={{ margin:'14px 14px 0' }}>
        <div style={{ background:theme.card, borderRadius:18, padding:'22px 20px 18px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', boxShadow:'0 2px 14px rgba(0,0,0,0.08)' }}>
          <Avatar user={profileUser} size={82} gradientBorder />
          <GradientText style={{ fontSize:22, fontWeight:800, marginTop:12, display:'block' }}>{profileUser.name}</GradientText>
          {isOwnProfile ? (
            <div style={{ fontSize:13, color:theme.muted, marginTop:3, display:'flex', alignItems:'center', gap:6 }}>
              {profileUser.email}
              <i className={`fa-solid ${profileUser.isEmailVerified ? 'fa-circle-check' : 'fa-circle-exclamation'}`}
                style={{ color: profileUser.isEmailVerified ? '#198754' : '#dc3545', fontSize:13 }}></i>
            </div>
          ) : profileUser.isEmailPublic && (
            <div style={{ fontSize:13, color:theme.muted, marginTop:3 }}>{profileUser.email}</div>
          )}
          <div style={{ display:'flex', gap:20, marginTop:18, paddingTop:16, borderTop:`1px solid ${theme.border}`, width:'100%', justifyContent:'center' }}>
            {[['Posts', posts.length], ['Post Likes', postsLikes], ['Comment Likes', commentsLikes]].map(([label, val]) => (
              <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <GradientText style={{ fontSize:20, fontWeight:800 }}>{val}</GradientText>
                <div style={{ fontSize:11, color:theme.muted, marginTop:2, whiteSpace:'nowrap' }}>{label}</div>
              </div>
            ))}
          </div>
          {isOwnProfile && (
            <button onClick={onEditProfile} style={{ marginTop:14, background:'none', border:`1px solid ${BRAND_START}`, borderRadius:50, padding:'7px 20px', color:BRAND_START, fontSize:13, cursor:'pointer', fontWeight:600 }}>
              <i className="fa-solid fa-pen" style={{ marginRight:6 }}></i>Edit Profile
            </button>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <div style={{ margin:'12px 14px 0' }}>
          <div style={{ background:theme.card, borderRadius:14, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
            {profileUser.isAdmin && (
              <button onClick={onViewUsers} style={{ width:'100%', background:'none', border:'none', padding:'13px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', color:theme.text, borderBottom:`1px solid ${theme.border}` }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'#ffc107', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <i className="fa-solid fa-users" style={{ color:'#212529', fontSize:13 }}></i>
                </div>
                <span style={{ fontWeight:500, fontSize:14, flex:1, textAlign:'left' }}>All Users</span>
                <i className="fa-solid fa-chevron-right" style={{ color:theme.muted, fontSize:11 }}></i>
              </button>
            )}
            <button onClick={onLogout} style={{ width:'100%', background:'none', border:'none', padding:'13px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', color:'#dc3545' }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'rgba(220,53,69,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className="fa-solid fa-right-from-bracket" style={{ color:'#dc3545', fontSize:13 }}></i>
              </div>
              <span style={{ fontWeight:500, fontSize:14, flex:1, textAlign:'left' }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ padding:'12px 14px' }}>
        <div style={{ fontWeight:700, fontSize:14, color:theme.text, marginBottom:10 }}>Posts</div>
        {posts.length === 0
          ? <div style={{ textAlign:'center', padding:'40px 0', color:theme.muted, fontSize:13 }}>No posts yet.</div>
          : posts.map(post => (
            <PostCard key={post._id} post={post} currentUser={currentUser}
              onViewPost={onViewPost} onViewProfile={onViewProfile}
              onShowPopup={onShowPopup} theme={theme} cardStyle={cardStyle} />
          ))}
      </div>
    </div>
  );
}

// ── USERS (admin) ─────────────────────────────────────────────
function UsersScreen({ users: initialUsers, currentUser, onViewProfile, onAdminEdit, theme }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [confirmUser, setConfirmUser] = useState(null); // user to delete

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const toggleAdmin = (user) => {
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdmin: !u.isAdmin } : u));
  };
  const deleteUser = (user) => setConfirmUser(user);
  const confirmDelete = () => {
    setUsers(prev => prev.filter(u => u._id !== confirmUser._id));
    setConfirmUser(null);
  };

  return (
    <div style={{ padding:'12px 14px', position:'relative' }}>
      <div style={{ position:'relative', marginBottom:14 }}>
        <i className="fa-solid fa-magnifying-glass" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:theme.muted, fontSize:13 }}></i>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users…"
          style={{ width:'100%', padding:'11px 14px 11px 36px', borderRadius:50, border:`1px solid ${theme.inputBorder}`, background:theme.inputBg, color:theme.text, fontSize:14, outline:'none', boxSizing:'border-box' }} />
      </div>

      {filtered.map(user => (
        <div key={user._id} style={{ background:theme.card, borderRadius:12, padding:'12px 14px', marginBottom:10, boxShadow:'0 1px 5px rgba(0,0,0,0.05)' }}>
          {/* Top row: avatar + info */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <Avatar user={user} size={44} onClick={() => onViewProfile(user)} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontWeight:700, fontSize:14, color:theme.text }}>{user.name}</span>
                {user.isAdmin && <span style={{ background:'#ffc107', color:'#212529', fontSize:10, fontWeight:700, borderRadius:50, padding:'2px 7px' }}>
                  {user._id === currentUser._id ? 'You' : 'Admin'}
                </span>}
              </div>
              <div style={{ fontSize:12, color:theme.muted, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
            </div>
          </div>
          {/* Action buttons — only for other users */}
          {user._id !== currentUser._id && (
            <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
              <button onClick={() => onViewProfile(user)} style={{ flex:1, background:'none', border:`1px solid ${BRAND_START}`, color:BRAND_START, borderRadius:8, padding:'7px 0', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
                View Profile
              </button>
              <button onClick={() => onAdminEdit(user)} style={{ flex:1, background:'none', border:`1px solid ${theme.muted}`, color:theme.muted, borderRadius:8, padding:'7px 0', fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
                Edit
              </button>
              <button onClick={() => toggleAdmin(user)} style={{
                flex:'1 1 100%', borderRadius:8, padding:'7px 0', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', border:'none',
                background: user.isAdmin ? '#ffc107' : '#198754', color: user.isAdmin ? '#212529' : 'white',
              }}>
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              <button onClick={() => deleteUser(user)} style={{ flex:'1 1 100%', background:'#dc3545', color:'white', border:'none', borderRadius:8, padding:'7px 0', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Delete User
              </button>
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 0', color:theme.muted, fontSize:13 }}>No users found.</div>
      )}

      {confirmUser && (
        <div style={{ position:'fixed', inset:0, zIndex:600 }}>
          <ConfirmSheet
            message={`Delete ${confirmUser.name}'s account? This cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setConfirmUser(null)}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  Avatar, GradientText, InputField, PrimaryBtn, LikesPopup, ConfirmSheet,
  CommentCard, PostCard,
  LoginScreen, RegisterScreen, FeedScreen, PostDetailScreen,
  CreatePostScreen, EditProfileScreen, AdminEditUserScreen,
  ProfileScreen, UsersScreen,
});
