import { useEffect, useMemo, useState } from 'react'

const warmups = [
  ['Palming', 'A quiet, two-minute reset'],
  ['Acupressure', 'Gentle touch around the eyes'],
  ['Eye movements', 'Guided directional tracking'],
  ['Infinity symbol', 'A smooth figure-eight practice'],
  ['Eye gym', 'A short movement sequence'],
  ['Near / far focus', 'Alternate viewing distances'],
]

const exercises = [
  ['Floating spiral', 'Divergence', 'Easy'], ['Quiet horizon', 'Convergence', 'Easy'],
  ['Hidden star', 'Divergence', 'Easy'], ['Soft geometry', 'Convergence', 'Easy'],
  ['Garden depth', 'Divergence', 'Moderate'], ['Open sky', 'Convergence', 'Moderate'],
  ['Calm current', 'Divergence', 'Moderate'], ['Balanced circles', 'Convergence', 'Moderate'],
  ['Woven focus', 'Divergence', 'Difficult'], ['Distant form', 'Convergence', 'Difficult'],
  ['Layered light', 'Divergence', 'Difficult'], ['Still center', 'Convergence', 'Difficult'],
].map(([name, method, level], index) => ({ id: index + 1, name, method, level, pattern: ['a', 'b', 'c'][index % 3] }))

const cues = [
  'Soften your gaze and imagine looking beyond the image.',
  'Keep breathing slowly. Let the image come to you.',
  'Blink whenever you need to—there is no need to strain.',
]

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initial
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

function Modal({ children, onClose, wide = false }) {
  return <div className="react-backdrop" role="presentation" onMouseDown={onClose}>
    <section className={`modal react-modal ${wide ? 'session-modal' : ''}`} role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
      {children}
    </section>
  </div>
}

function WarmupList({ compact = false }) {
  return <div className={`warmup-list ${compact ? 'compact' : ''}`}>
    {warmups.map(([name, description], index) => <article className="warmup-item" key={name}>
      <span>0{index + 1}</span><div><strong>{name}</strong><small>{description}</small></div><button aria-label={`Open ${name}`}>→</button>
    </article>)}
  </div>
}

function TrialBadge({ trialDays }) {
  return <div className="trial-status"><span>Free trial</span><strong>{trialDays} days remaining</strong></div>
}

function App() {
  const [modal, setModal] = useState(null)
  const [view, setView] = useState('today')
  const [filter, setFilter] = useState('All')
  const [trialStarted, setTrialStarted] = useStoredState('vision-trial-started', false)
  const [profile, setProfile] = useStoredState('vision-profile', null)
  const [completed, setCompleted] = useStoredState('vision-completed', 3)
  const [favorites, setFavorites] = useStoredState('vision-favorites', [1, 2])
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])
  const [selfTestStep, setSelfTestStep] = useState(1)
  const [recommendation, setRecommendation] = useState('Easy divergence')
  const trialDays = trialStarted ? 7 : 7

  const openSession = exercise => { setSelectedExercise(exercise || exercises[0]); setModal('session') }
  const filteredExercises = useMemo(() => filter === 'All' ? exercises : exercises.filter(item => item.level === filter), [filter])
  const finishTest = method => {
    const result = method === 'balanced' ? 'Easy mixed practice' : `Easy ${method}`
    setRecommendation(result)
    setProfile({ level: 'Easy', method, joinedAt: new Date().toISOString() })
    setSelfTestStep(3)
  }

  return <>
    <header className="site-header">
      <a className="brand" href="#top">Vision Exercise</a>
      <nav aria-label="Primary navigation"><a href="#practice">Practice</a><a href="#how">How it works</a><a href="#warmups">Warm-ups</a></nav>
      <button className="button button-small button-outline" onClick={() => setModal('account')}>{profile ? 'My account' : 'Sign in'}</button>
    </header>
    <main id="top">
      <div className="prototype-note">Day 2 React preview · Exercise imagery and pricing remain provisional</div>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A calmer way to look</span>
          <h1>Give your eyes a moment to <em>reset.</em></h1>
          <p className="hero-lede">Short, guided visual exercises designed to bring more variety and intention to your screen routine.</p>
          <div className="hero-actions"><button className="button button-primary" onClick={() => setModal('trial')}>Start your free week <span>→</span></button><a className="text-link" href="#how">See how it works <span>↓</span></a></div>
          <p className="microcopy">One week free · No payment connected in this preview</p>
        </div>
        <div className="hero-art" aria-label="Abstract visual focus illustration"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="focus-card"><div className="focus-dots"><span></span><span></span><span></span></div><p>Take a breath</p><strong>Look beyond the screen</strong><div className="breath-line"><i></i></div><small>01:42 remaining</small></div><span className="float-note note-one">Breathe slowly</span><span className="float-note note-two">Soften your focus</span></div>
      </section>
      <section className="trust-strip" aria-label="Program highlights"><div><strong>5–10</strong><span>minute sessions</span></div><div><strong>12</strong><span>guided visuals</span></div><div><strong>3</strong><span>progressive levels</span></div><p>Designed for desktop and mobile browsers</p></section>

      <section className="practice-section" id="practice">
        <div className="section-heading split-heading"><div><span className="eyebrow">Your daily practice</span><h2>Progress at a comfortable pace.</h2></div><p>The first 12 exercises are organized into Easy, Moderate, and Difficult levels. Users can build consistency before moving forward.</p></div>
        <div className="app-shell">
          <aside className="app-sidebar"><div className="sidebar-brand">Vision Exercise</div>{[['today','◌','Today'],['library','□','Exercise library'],['warmups','↗','Warm-ups'],['progress','⌁','Progress'],['membership','◇','Membership']].map(([id,icon,label]) => <button key={id} className={`side-link ${view === id ? 'active' : ''}`} onClick={() => setView(id)}><span>{icon}</span>{label}</button>)}<div className="sidebar-bottom"><span>{trialStarted ? 'Free trial active' : 'Free trial available'}</span><div className="trial-meter"><i></i></div><small>{trialStarted ? `${trialDays} days remaining` : 'Start when ready'}</small></div></aside>
          <div className="app-main"><div className="app-topline"><div><span className="eyebrow">Thursday, October 29</span><h3>{profile ? 'Welcome back.' : 'Good afternoon.'}</h3></div><button className="avatar" onClick={() => setModal('account')} aria-label="Open account menu">VE</button></div>

            {view === 'today' && <div className="dashboard-view active"><article className="recommended-card"><div><span className="chip chip-light">Recommended starting point</span><h3>{recommendation}</h3><p>A gentle two-minute practice selected from the onboarding self-test.</p><button className="button button-dark" onClick={() => openSession(exercises[0])}>Begin practice <span>→</span></button></div><div className="mini-stereogram"><div className="pattern pattern-a"></div><span>Licensed image placeholder</span></div></article><div className="level-path"><div className="level-node current"><strong>Easy</strong><span>4 exercises · Start here</span></div><div className="level-connector"></div><div className="level-node"><strong>Moderate</strong><span>Unlock after Easy</span></div><div className="level-connector"></div><div className="level-node"><strong>Difficult</strong><span>Advanced practice</span></div></div></div>}

            {view === 'library' && <div className="dashboard-view active"><div className="panel-title"><div><span className="eyebrow">Explore</span><h3>Exercise library</h3></div><span className="chip">12 exercises</span></div><div className="filter-row">{['All','Easy','Moderate','Difficult'].map(level => <button key={level} className={`filter ${filter === level ? 'active' : ''}`} onClick={() => setFilter(level)}>{level}</button>)}</div><div className="library-grid">{filteredExercises.map(exercise => <article className="library-card" key={exercise.id} onClick={() => openSession(exercise)}><div className={`pattern pattern-${exercise.pattern}`}></div><div><strong>{exercise.name}</strong><span>{exercise.method} · {exercise.level}</span></div></article>)}</div></div>}
            {view === 'warmups' && <div className="dashboard-view active"><span className="eyebrow">Prepare gently</span><h3>Warm-up exercises</h3><WarmupList compact /></div>}
            {view === 'progress' && <div className="dashboard-view active"><span className="eyebrow">Your activity</span><h3>Progress</h3><div className="progress-stats"><div><strong>{completed}</strong><span>sessions</span></div><div><strong>7 min</strong><span>practice time</span></div><div><strong>{favorites.length}</strong><span>favorites</span></div></div><div className="progress-callout"><strong>Current level: Easy</strong><p>Level advancement will use completed sessions and minimum practice timing. The exact graduation rules remain configurable.</p></div></div>}
            {view === 'membership' && <div className="dashboard-view active"><span className="eyebrow">Access options</span><h3>Membership structure</h3><div className="membership-grid"><article><span className="chip">7-day trial</span><h4>Try the program</h4><strong>Free</strong><p>Selected Easy exercises and the guided onboarding flow.</p></article><article><span className="chip">Proposed</span><h4>Basic program</h4><strong>$10 once</strong><p>Core 12-image program after the free trial.</p></article><article className="featured"><span className="chip">Proposed</span><h4>Ongoing membership</h4><strong>$10 / month</strong><p>New images, added features, and referral rewards.</p></article></div><p className="muted">Prices are placeholders pending client confirmation. No payment is collected in this preview.</p></div>}
          </div>
        </div>
      </section>

      <section className="how-section" id="how"><div className="section-heading centered"><span className="eyebrow">Simple by design</span><h2>From first visit to steady practice.</h2><p>A structured path helps each user begin comfortably and understand what comes next.</p></div><div className="steps"><article><span>01</span><div className="step-icon target-icon"></div><h3>Create an account</h3><p>Start a seven-day trial and save onboarding preferences.</p></article><article><span>02</span><div className="step-icon breathe-icon"></div><h3>Find a starting level</h3><p>The self-test recommends a viewing method and Easy starting point.</p></article><article><span>03</span><div className="step-icon grow-icon"></div><h3>Graduate over time</h3><p>Move through Moderate and Difficult exercises as practice develops.</p></article></div></section>
      <section className="warmups-section" id="warmups"><div className="section-heading split-heading"><div><span className="eyebrow">Before you begin</span><h2>Warm up, then look deeper.</h2></div><p>Gentle preparatory activities from the original program, presented in a calmer and more accessible format.</p></div><WarmupList /></section>
      <section className="trial-section"><span className="eyebrow">Seven days, on us</span><h2>Start with the Easy collection.</h2><p>Create an account, take the self-test, and explore the introductory exercises during the free week.</p><button className="button button-light" onClick={() => setModal('trial')}>Begin your free week <span>→</span></button><small>Wellness education only. Not a substitute for professional eye care.</small></section>
    </main>
    <footer><a className="brand" href="#top">Vision Exercise</a><p>Visual wellness for modern screen life.</p><span>Day 2 React preview · Not final</span></footer>

    {modal === 'trial' && <Modal onClose={() => setModal(null)}><span className="eyebrow">Start your free week</span><h2>Create your preview account.</h2><p>This React preview stores progress only in this browser. Secure authentication will be connected after backend approval.</p><label className="field-label">Name<input value={profile?.name || ''} onChange={() => {}} placeholder="Your name" /></label><label className="field-label">Email<input type="email" placeholder="you@example.com" /></label><button className="button button-primary full" onClick={() => { setTrialStarted(true); setModal('self-test'); setSelfTestStep(1) }}>Continue to self-test</button></Modal>}
    {modal === 'account' && <Modal onClose={() => setModal(null)}><span className="eyebrow">Account preview</span><h2>{profile ? 'Your practice profile' : 'Sign in or start a trial'}</h2>{profile ? <><TrialBadge trialDays={trialDays} /><div className="account-row"><span>Starting level</span><strong>{profile.level}</strong></div><div className="account-row"><span>Recommended practice</span><strong>{recommendation}</strong></div></> : <p>No account has been created in this browser yet.</p>}<button className="button button-primary full" onClick={() => setModal(profile ? null : 'trial')}>{profile ? 'Close' : 'Start free week'}</button></Modal>}
    {modal === 'self-test' && <Modal onClose={() => setModal(null)}><span className="eyebrow">Your starting point</span><div className="test-progress"><i style={{ width: `${selfTestStep * 33.33}%` }}></i></div>{selfTestStep === 1 && <><h2>How comfortable are you with 3D stereogram images?</h2><p>There are no right or wrong answers.</p><div className="answer-list">{['I’m completely new','I’ve seen them a few times','I can usually see them easily'].map(answer => <button key={answer} onClick={() => setSelfTestStep(2)}>{answer}</button>)}</div></>}{selfTestStep === 2 && <><h2>Which viewing method feels more challenging?</h2><div className="answer-list"><button onClick={() => finishTest('divergence')}>Looking beyond an image</button><button onClick={() => finishTest('convergence')}>Slightly crossing my eyes</button><button onClick={() => finishTest('balanced')}>I’m not sure yet</button></div></>}{selfTestStep === 3 && <><span className="result-mark">✓</span><h2>Your starting practice is ready.</h2><p>We recommend beginning with {recommendation}.</p><button className="button button-primary full" onClick={() => openSession(exercises[0])}>Start two-minute practice</button></>}</Modal>}
    {modal === 'session' && <SessionModal exercise={selectedExercise} favorite={favorites.includes(selectedExercise.id)} onFavorite={() => setFavorites(current => current.includes(selectedExercise.id) ? current.filter(id => id !== selectedExercise.id) : [...current, selectedExercise.id])} onComplete={() => { setCompleted(count => count + 1); setModal(null) }} onClose={() => setModal(null)} />}
  </>
}

function SessionModal({ exercise, favorite, onFavorite, onComplete, onClose }) {
  const [remaining, setRemaining] = useState(120)
  const [running, setRunning] = useState(true)
  const [cueIndex, setCueIndex] = useState(0)
  useEffect(() => {
    if (!running || remaining <= 0) return undefined
    const timer = setInterval(() => setRemaining(value => value - 1), 1000)
    return () => clearInterval(timer)
  }, [running, remaining])
  const formatted = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
  return <Modal onClose={onClose} wide><div className="session-header"><div><span className="eyebrow">{exercise.level} · {exercise.method}</span><h2>{exercise.name}</h2></div><button className={`favorite ${favorite ? 'saved' : ''}`} onClick={onFavorite}>{favorite ? '♥' : '♡'}</button></div><div className="viewing-marks"><span></span><span></span></div><div className={`session-image pattern pattern-${exercise.pattern}`}><span>Licensed stereogram will appear here</span></div><p className="session-cue">{remaining === 0 ? 'Session complete. Blink gently and let your focus return naturally.' : cues[cueIndex]}</p><div className="timer"><button onClick={() => setRunning(value => !value)}>{running ? 'Ⅱ' : '▶'}</button><strong>{formatted}</strong><button>♪</button></div><div className="timer-track"><i style={{ width: `${remaining / 120 * 100}%` }}></i></div><div className="session-actions"><button onClick={onClose}>End session</button><button onClick={() => remaining === 0 ? onComplete() : setCueIndex(index => (index + 1) % cues.length)}>{remaining === 0 ? 'Save session' : 'Next cue →'}</button></div></Modal>
}

export default App
