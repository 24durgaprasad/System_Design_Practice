import { ArrowRight, CheckCircle2, Sparkles, Star, Users, Clock3, ShieldCheck, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LightPillar from '../../components/LightPillar/LightPillar';

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 100; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-30 flex justify-center px-6 pt-6">
        <div className="w-full max-w-7xl rounded-full border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-soft backdrop-blur-xl transition-colors duration-300">
          <div className="flex items-center justify-between px-5 py-3.5 md:px-7">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black dark:bg-emerald-500 text-mint-500 dark:text-black transition-colors duration-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                SysDesign Hub
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('success-stories')}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Success Stories
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <button
                className="hidden md:inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-emerald-500/20"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-2xl bg-black dark:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white dark:text-black shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 dark:hover:bg-emerald-400 hover:shadow-xl hover:shadow-black/30 dark:hover:shadow-emerald-500/50 glow-button"
                onClick={() => navigate('/register')}
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-24 z-20 mx-6 rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl lg:hidden">
          <nav className="flex flex-col p-6 space-y-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('success-stories')}
              className="text-left text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
            >
              Success Stories
            </button>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            <button
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
            >
              Sign In
            </button>
          </nav>
        </div>
      )}

      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-gray-50 dark:bg-slate-950 text-white transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
            <div className="relative flex flex-col gap-10 rounded-[70px] bg-white dark:bg-black px-7 py-12 shadow-soft md:px-10 md:py-14 lg:flex-row lg:items-center lg:gap-16 overflow-hidden transition-colors duration-300">
              {/* LightPillar Background */}
              <div className="absolute inset-0 rounded-[70px] overflow-hidden opacity-50 dark:opacity-40">
                <LightPillar
                  topColor="#10B981"
                  bottomColor="#6366F1"
                  intensity={1.2}
                  rotationSpeed={0.2}
                  glowAmount={0.003}
                  pillarWidth={2.5}
                  pillarHeight={0.3}
                  noiseIntensity={0.3}
                  pillarRotation={15}
                  interactive={false}
                  mixBlendMode="screen"
                  quality="high"
                />
              </div>
              {/* Hero copy */}
              <div className="relative z-10 flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-1.5 text-xs md:text-sm text-slate-800 dark:text-slate-200 animate-pulse">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <span>AI-powered system design mock interviews</span>
                </div>
                <div className="space-y-6">
                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-slate-950 via-slate-800 to-emerald-700 dark:from-white dark:via-slate-100 dark:to-emerald-200 bg-clip-text text-transparent">
                    Dead Simple Tool to Practice System Design Interviews
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-lg font-medium">
                    Practice with realistic prompts, instant feedback, and brutal FAANG-style critiques.
                    No fluff. No theory dumps. Just the reps you need to stop failing system design.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 dark:bg-mint-500 px-6 py-3 text-sm md:text-base font-semibold text-white dark:text-black shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:shadow-xl glow-button"
                    onClick={() => navigate('/register')}
                  >
                    Start Free Practice
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-black px-6 py-3 text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 transition-all duration-200 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-900 hover:shadow-lg"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-8 text-xs sm:grid-cols-3 md:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">5,000+</div>
                    <div className="text-slate-600 dark:text-slate-400">Engineers Practicing</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">89%</div>
                    <div className="text-slate-600 dark:text-slate-400">Pass Rate Improvement</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">24/7</div>
                    <div className="text-slate-600 dark:text-slate-400">AI Feedback</div>
                  </div>
                </div>
              </div>

              {/* Hero mock card */}
              <div className="relative z-10 flex-1">
                <div className="relative mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/60 p-7 shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-2.5 w-16 rounded-full bg-slate-700" />
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-6 rounded-full bg-slate-700" />
                      <span className="h-1.5 w-4 rounded-full bg-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Current Prompt</span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          FAANG-Level
                        </span>
                      </div>
                      <p className="rounded-2xl bg-slate-900/80 p-3 text-xs leading-relaxed text-slate-100">
                        Design a highly available, globally distributed rate limiter for a social media
                        platform handling 50M QPS.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-[10px] text-slate-300">
                      <div className="rounded-2xl bg-slate-900/70 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-100">
                          <Users className="h-3 w-3 text-emerald-400" />
                          Volume
                        </div>
                        <p>Estimate traffic, data size, and peak QPS across regions.</p>
                      </div>
                      <div className="rounded-2xl bg-slate-900/70 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-100">
                          <ShieldCheck className="h-3 w-3 text-emerald-400" />
                          Reliability
                        </div>
                        <p>Discuss SLAs, redundancy, and failure scenarios.</p>
                      </div>
                      <div className="rounded-2xl bg-slate-900/70 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-100">
                          <Clock3 className="h-3 w-3 text-emerald-400" />
                          Tradeoffs
                        </div>
                        <p>Walk through consistency & latency tradeoffs.</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-xs text-emerald-100">
                      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Instant Feedback
                      </div>
                      <p>
                        &ldquo;You didn&apos;t cover regional failover strategy. Dive deeper into how you
                        handle cascading failures.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-gray-50 dark:bg-slate-950 py-20 md:py-24 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Why Your Career Is Stuck (And How We Fix It)
              </h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 md:text-lg">
                Everything you actually need to stop failing interviews. No more guessing what went
                wrong.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'AI That Thinks Like Your Interviewer',
                  description:
                    'Stop guessing what they want. Our AI drills into tradeoffs, bottlenecks, and real interviewer heuristics.',
                },
                {
                  title: 'Real Problems That Break Careers',
                  description:
                    'Practice the exact questions that separate L4 from L5+ engineers at FAANG and top startups.',
                },
                {
                  title: 'See Your Weaknesses Get Destroyed',
                  description:
                    'Every session ends with a prioritized breakdown of gaps and a simple plan to fix them.',
                },
                {
                  title: 'Master the 45-Minute Death Match',
                  description:
                    'Time-boxed rounds that train you to structure, explore, and summarize like a real onsite.',
                },
                {
                  title: 'FAANG-Level Brutality',
                  description:
                    'Polished feedback on comms, diagrams, depth, and tradeoffs—so real interviews feel easy.',
                },
                {
                  title: 'Build Unbreakable Confidence',
                  description:
                    'Show up calm because you’ve already taken the beating here. Interviews become a formality.',
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/50 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-500/5"
                >
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
                    <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white md:text-base">
                    <span className="mr-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {index < 3 ? 'Core' : 'Advanced'}
                    </span>
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 md:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-white dark:bg-slate-900 py-20 md:py-24 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                  How We Transform Career Failures Into Success Stories
                </h2>
                <p className="mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-400 md:text-lg">
                  A tight, three-step loop that replaces random LeetCode grinding with focused,
                  brutal practice.
                </p>
              </div>
              <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                These steps were battle-tested with engineers from FAANG, high-growth startups, and
                career switchers.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: 'Step 1',
                  title: 'Pick Your Career Killer',
                  description:
                    'Choose from a library of FAANG-grade prompts that target exactly where you keep stumbling: scaling, storage, consistency, or vague answers.',
                },
                {
                  step: 'Step 2',
                  title: 'Design Like Your Career Depends On It',
                  description:
                    'Walk through a realistic 45-minute round with structured guidance, whiteboard-style space, and reminders to hit tradeoffs and edge cases.',
                },
                {
                  step: 'Step 3',
                  title: 'Get Feedback That Actually Matters',
                  description:
                    'Receive a prioritized breakdown of your approach, with examples of stronger answers, diagrams, and what a hiring manager actually hears.',
                },
              ].map((step) => (
                <div
                  key={step.step}
                  className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/50 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-500/5"
                >
                  <span className="mb-3 inline-flex w-fit rounded-full bg-slate-900 dark:bg-emerald-500 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-100 dark:text-black">
                    {step.step}
                  </span>
                  <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 md:text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="success-stories" className="bg-gray-50 dark:bg-slate-950 py-20 md:py-24 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Real Engineers Who Stopped Getting Rejected
              </h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 md:text-lg">
                These aren&apos;t theory nerds. They were getting rejected at FAANG and tier-1
                startups before they fixed their system design game.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Senior Backend Engineer, Google',
                  quote:
                    'I failed 12 system design interviews in a row. Twelve. This tool was the first time I saw exactly why my answers were vague.',
                },
                {
                  name: 'Marcus Rodriguez',
                  role: 'Staff Engineer, Fintech Unicorn',
                  quote:
                    "My manager kept 'postponing' my promotion because I was too hand-wavy. After 6 weeks here, I ran my promo packet with full confidence.",
                },
                {
                  name: 'Emma Thompson',
                  role: 'Principal Engineer, FAANG',
                  quote:
                    'I was great at coding rounds but my system design interviews were chaos. The brutal feedback here forced me into clarity.',
                },
              ].map((t) => (
                <article
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/50 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-500/5"
                >
                  <div className="mb-3 flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 dark:bg-emerald-500 text-sm font-semibold text-white dark:text-black">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-gray-50 dark:bg-slate-950 py-20 text-white md:py-24 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative flex flex-col gap-12 rounded-[70px] bg-white dark:bg-black px-8 py-16 shadow-soft md:px-12 md:py-20 lg:flex-row lg:items-center overflow-hidden transition-colors duration-300">
              {/* LightPillar Background */}
              <div className="absolute inset-0 rounded-[70px] overflow-hidden opacity-40 dark:opacity-30">
                <LightPillar
                  topColor="#10B981"
                  bottomColor="#8B5CF6"
                  intensity={1}
                  rotationSpeed={0.15}
                  glowAmount={0.002}
                  pillarWidth={3}
                  pillarHeight={0.4}
                  noiseIntensity={0.4}
                  pillarRotation={20}
                  interactive={false}
                  mixBlendMode="screen"
                  quality="medium"
                />
              </div>
              {/* Footer copy */}
              <div className="relative z-10 flex-1 space-y-5">
                <div className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
                  Ready to Practice?
                </div>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white md:text-4xl">
                  Start Your Interview Journey Today
                </h2>
                <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300 md:text-lg">
                  Join thousands of engineers who went from &quot;I freeze on system design&quot; to
                  &quot;I can drive any design conversation&quot;. Your next promo or FAANG offer might
                  be one practice session away.
                </p>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint-500 px-6 py-3 text-sm md:text-base font-semibold text-black shadow-soft transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-xl"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Footer mock card */}
              <div className="relative z-10 flex-1">
                <div className="relative mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-soft transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Live Session · Rate Limiter
                    </span>
                    <span>00:23 / 45:00</span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-950/70 p-3">
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-200">
                        <span>Interview Score Preview</span>
                        <span className="text-emerald-400">74%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                        <span>Depth: Strong</span>
                        <span>Tradeoffs: Medium</span>
                        <span>Edge Cases: Weak</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-[10px] text-slate-300">
                      <div className="rounded-2xl bg-slate-950/70 p-3">
                        <div className="mb-1 text-[11px] font-medium text-slate-100">Open Gaps</div>
                        <p>Multi-region failover, back-pressure, abuse scenarios.</p>
                      </div>
                      <div className="rounded-2xl bg-slate-950/70 p-3">
                        <div className="mb-1 text-[11px] font-medium text-slate-100">Next Rep</div>
                        <p>Design global notifications service with SLAs.</p>
                      </div>
                      <div className="rounded-2xl bg-slate-950/70 p-3">
                        <div className="mb-1 text-[11px] font-medium text-slate-100">Confidence</div>
                        <p>Interview-ready in 3 more focused sessions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500 md:flex-row">
              <span>&copy; {new Date().getFullYear()} SysDesign Hub. All rights reserved.</span>
              <div className="flex gap-4">
                <button
                  className="transition-colors hover:text-slate-300"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Features
                </button>
                <button
                  className="transition-colors hover:text-slate-300"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  How It Works
                </button>
                <button
                  className="transition-colors hover:text-slate-300"
                  onClick={() => document.getElementById('success-stories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Success Stories
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


