"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { WaveLogo } from "@/components/ui/WaveLogo";
import "./landing.css";

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.18 }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lp" ref={rootRef}>
      <div className="lp__bg" aria-hidden />
      <div className="lp__grain" aria-hidden />

      <nav className="lp__nav" aria-label="Primary">
        <Link href="/" className="lp__nav-brand">
          <span className="lp__nav-logo" aria-hidden>
            <WaveLogo size={32} />
          </span>
          Wavecord
        </Link>
        <ul className="lp__nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Communities</a></li>
          <li><a href="#cta">Pricing</a></li>
        </ul>
        <Link href="/register" className="lp__btn lp__btn--neon">
          Get started
        </Link>
      </nav>

      <section className="lp__hero">
        <div className="lp__container">
          <div className="lp__hero-grid">
            <div className="lp__hero-copy">
              <h1>
                Where your <span className="lp__neon-text">community</span><br />
                actually lives.
              </h1>
              <p className="lp__hero-sub">
                Wavecord gives your crew low-latency voice rooms, organized
                channels, and lightning-quick chat — wrapped in an interface
                that doesn&apos;t feel like enterprise software.
              </p>
              <div className="lp__hero-ctas">
                <Link href="/register" className="lp__btn lp__btn--neon lp__btn--lg">
                  Create your server →
                </Link>
                <Link href="/login" className="lp__btn lp__btn--ghost lp__btn--lg">
                  Sign in
                </Link>
              </div>
              <div className="lp__hero-meta">
                <div className="lp__hero-meta-dots" aria-hidden>
                  <span /><span /><span /><span />
                </div>

                <span>Trusted by 40,000+ communities worldwide</span>
              </div>
            </div>

            <div className="lp__mockup-wrap">
              <div className="lp__mockup-glow" aria-hidden />
              <div className="lp__mockup" aria-hidden>
                <div className="lp__mock-rail">
                  <div className="lp__mock-rail-pill" />
                  <div className="lp__mock-server lp__mock-server--logo">
                    <WaveLogo size={26} />
                  </div>
                  <div className="lp__mock-server lp__mock-server--alt">D</div>
                  <div className="lp__mock-server lp__mock-server--alt2">R</div>
                  <div className="lp__mock-server lp__mock-server--ghost">+</div>
                </div>

                <div className="lp__mock-channels">
                  <div className="lp__mock-server-name">
                    Wavecord HQ
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>▾</span>
                  </div>
                  <div className="lp__mock-cat">Text Channels</div>
                  <div className="lp__mock-ch lp__mock-ch--active">
                    <span className="lp__mock-ch-icon">#</span> general
                  </div>
                  <div className="lp__mock-ch">
                    <span className="lp__mock-ch-icon">#</span> announcements
                  </div>
                  <div className="lp__mock-ch">
                    <span className="lp__mock-ch-icon">#</span> design-crit
                  </div>
                  <div className="lp__mock-cat">Voice Channels</div>
                  <div className="lp__mock-ch lp__mock-ch--voice">
                    <span className="lp__mock-ch-icon">◎</span> Lounge · 4
                  </div>
                  <div className="lp__mock-ch">
                    <span className="lp__mock-ch-icon">◎</span> Focus Room
                  </div>
                </div>

                <div className="lp__mock-chat">
                  <div className="lp__mock-chat-head">
                    <div>
                      <span className="lp__hash">#</span>general
                    </div>
                    <div className="lp__mock-chat-head-meta">
                      <span className="lp__mock-pulse" />
                      12 online
                    </div>
                  </div>

                  <div className="lp__mock-msgs">
                    <div className="lp__mock-msg">
                      <div className="lp__mock-avatar lp__mock-avatar--p" />
                      <div className="lp__mock-msg-body">
                        <div className="lp__mock-name">
                          ada <span>11:42</span>
                        </div>
                        <div className="lp__mock-text">
                          shipped the new voice rooms — try the{" "}
                          <em>#lounge</em> channel
                        </div>
                        <div className="lp__mock-reactions">
                          <span className="lp__mock-reaction">⚡ 8</span>
                          <span className="lp__mock-reaction lp__mock-reaction--purple">🔥 5</span>
                        </div>
                      </div>
                    </div>

                    <div className="lp__mock-msg">
                      <div className="lp__mock-avatar lp__mock-avatar--g" />
                      <div className="lp__mock-msg-body">
                        <div className="lp__mock-name">
                          rae <span>11:43</span>
                        </div>
                        <div className="lp__mock-text">
                          screen-share is buttery smooth, no joke
                        </div>
                      </div>
                    </div>

                    <div className="lp__mock-msg">
                      <div className="lp__mock-avatar lp__mock-avatar--r" />
                      <div className="lp__mock-msg-body">
                        <div className="lp__mock-name">
                          milo <span>11:44</span>
                        </div>
                        <div className="lp__mock-text">
                          jumping in now ✦
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lp__mock-input">
                    <span>Message #general</span>
                    <span className="lp__mock-input-cursor" />
                    <span style={{ fontSize: 14 }}>＋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp__section" id="features">
        <div className="lp__container">
          <div className="lp__section-eyebrow">What&apos;s inside</div>
          <h2 className="lp__section-title">
            Everything a community needs.<br />Nothing it doesn&apos;t.
          </h2>
          <p className="lp__section-sub">
            Built on a custom realtime stack — Socket.io for chat, LiveKit for
            voice and video. No third-party tabs, no plugin sprawl.
          </p>

          <div className="lp__features">
            <article className="lp__feature lp__feature--purple" data-reveal data-delay="0">
              <div className="lp__feature-icon" aria-hidden>◎</div>
              <h3>Voice &amp; Video</h3>
              <p>
                Drop into low-latency voice channels powered by LiveKit. Mute,
                deafen, and screen-share in a click — presence syncs instantly.
              </p>
            </article>

            <article className="lp__feature" data-reveal data-delay="120">
              <div className="lp__feature-icon" aria-hidden>#</div>
              <h3>Organized Channels</h3>
              <p>
                Group text and voice channels into categories. Set role
                permissions per channel. Pin notifications, mute the noise.
              </p>
            </article>

            <article className="lp__feature lp__feature--green" data-reveal data-delay="240">
              <div className="lp__feature-icon" aria-hidden>⚡</div>
              <h3>Real-time Messaging</h3>
              <p>
                Messages, reactions, replies and DMs land instantly over a
                custom Socket.io server — with file uploads, edits and threads.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="lp__proof">
        <div className="lp__container">
          <div className="lp__proof-row">

            <div className="lp__proof-label">Trusted by 40,000+ communities</div>
            <div className="lp__proof-logos" aria-hidden>
              <div className="lp__proof-logo">NORTHWAVE</div>
              <div className="lp__proof-logo lp__proof-logo--script">prismatic</div>
              <div className="lp__proof-logo">HALCYON</div>
              <div className="lp__proof-logo lp__proof-logo--script">obsidian</div>
              <div className="lp__proof-logo">LATTICE/9</div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp__section" id="testimonials" style={{ paddingTop: 80 }}>
        <div className="lp__container">
          <div className="lp__section-eyebrow">From the rooms</div>
          <h2 className="lp__section-title">Built for the way you actually hang out.</h2>

          <div className="lp__testimonials">
            <article className="lp__quote lp__quote--up" data-reveal data-delay="0">
              <div className="lp__quote-mark">&ldquo;</div>
              <p className="lp__quote-text">
                Switched our 200-person dev guild over in a weekend. Voice
                rooms feel a generation ahead of what we were on.
              </p>
              <div className="lp__quote-author">
                <div className="lp__quote-avatar" />
                <div>
                  <div className="lp__quote-name">Mira Okafor</div>
                  <div className="lp__quote-role">Community lead, Northwave</div>
                </div>
              </div>
            </article>

            <article className="lp__quote" data-reveal data-delay="140">
              <div className="lp__quote-mark">&ldquo;</div>
              <p className="lp__quote-text">
                The channel setup actually fits how my team thinks. Categories,
                roles, muted channels — all where you&apos;d expect.
              </p>
              <div className="lp__quote-author">
                <div className="lp__quote-avatar lp__quote-avatar--g" />
                <div>
                  <div className="lp__quote-name">Jules Park</div>
                  <div className="lp__quote-role">Founder, Lattice/9</div>
                </div>
              </div>
            </article>

            <article className="lp__quote lp__quote--down" data-reveal data-delay="280">
              <div className="lp__quote-mark">&ldquo;</div>
              <p className="lp__quote-text">
                DMs are instant. Screen share doesn&apos;t crash. The interface
                doesn&apos;t fight me. I have nothing else to say.
              </p>
              <div className="lp__quote-author">
                <div className="lp__quote-avatar lp__quote-avatar--r" />
                <div>
                  <div className="lp__quote-name">Sasha Bell</div>
                  <div className="lp__quote-role">Mod, Prismatic</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="lp__section lp__section--cta" id="cta">
        <div className="lp__container">
          <div className="lp__cta-wrap">
            <div className="lp__cta-blob lp__cta-blob--a" aria-hidden />
            <div className="lp__cta-blob lp__cta-blob--b" aria-hidden />

            <div className="lp__cta-body">
              <div className="lp__cta-left">
                <div className="lp__cta-eyebrow">Free to start</div>
                <h2>
                  Your community is one{" "}
                  <span className="lp__neon-text">click</span> away.
                </h2>
                <p>
                  Spin up a server in under a minute. Invite your people. Talk,
                  type, share — the way it should feel.
                </p>
                <Link href="/register" className="lp__btn lp__btn--neon lp__btn--lg">
                  Create your free server
                </Link>
              </div>

              <div className="lp__cta-right" aria-hidden>
                <div className="lp__cta-card lp__cta-card--server">
                  <div className="lp__cta-server-icon">🎮</div>
                  <div className="lp__cta-server-info">
                    <span className="lp__cta-server-name">Late Night Crew</span>
                    <span className="lp__cta-server-meta">12 online · 3 in voice</span>
                  </div>
                  <div className="lp__cta-live-dot" />
                </div>

                <div className="lp__cta-card lp__cta-card--msg">
                  <div className="lp__cta-avatar lp__cta-avatar--g">A</div>
                  <div className="lp__cta-bubble">
                    <span className="lp__cta-bubble-name">alex</span>
                    yo who's on tonight?
                  </div>
                </div>

                <div className="lp__cta-card lp__cta-card--msg lp__cta-card--msg-reply">
                  <div className="lp__cta-avatar lp__cta-avatar--p">J</div>
                  <div className="lp__cta-bubble">
                    <span className="lp__cta-bubble-name">jess</span>
                    me!! give me 5 mins 🙏
                  </div>
                </div>

                <div className="lp__cta-joinbadge">
                  <div className="lp__cta-avatar-stack">
                    <span className="lp__cta-avatar lp__cta-avatar--r">M</span>
                    <span className="lp__cta-avatar lp__cta-avatar--g">K</span>
                    <span className="lp__cta-avatar lp__cta-avatar--p">T</span>
                  </div>
                  <span>+3 joined today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp__footer">
        <div className="lp__container">
          <div className="lp__footer-grid">
            <div className="lp__footer-brand">
              <div className="lp__footer-brand-row">
                <span className="lp__nav-logo" aria-hidden>
                  <WaveLogo size={32} />
                </span>
                Wavecord
              </div>
              <div className="lp__footer-tag">
                Chat, voice, and video for your communities.
              </div>
            </div>
            <div className="lp__footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#testimonials">Communities</a></li>
                <li><Link href="/register">Get started</Link></li>
              </ul>
            </div>
            <div className="lp__footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="lp__footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="lp__footer-bottom">
            <span>© {new Date().getFullYear()} Wavecord. All rights reserved.</span>
            <span>Built for the people who actually show up.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
