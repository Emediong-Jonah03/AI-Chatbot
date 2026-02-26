import { useState, useEffect } from "react";
import { IoLogoLinkedin, IoLogoGithub, IoLogoTwitter, IoLogoNodejs, IoLogoReact } from "react-icons/io5";
import LandingNav from "../components/navigation/LandingNav";
import { RiTailwindCssFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Emediong from "../assets/Emediong.jpeg"


interface SocialLink {
  link: string;
  icon: React.ReactNode;
  label: string;
}

const socials: SocialLink[] = [
  {
    link: "https://www.linkedin.com/in/emediong-jonah-68a093329",
    icon: <IoLogoLinkedin className="text-2xl text-primary" />,
    label: "LinkedIn"
  },
  {
    link: "https://github.com/Emediong-Jonah03",
    icon: <IoLogoGithub className="text-2xl text-primary" />,
    label: "GitHub"
  },
  {
    link: "https://x.com/EmediongJ15081",
    icon: <IoLogoTwitter className="text-2xl text-primary" />,
    label: "Twitter"
  },
];

function About() {

  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (

    <div className="min-h-screen bg-bg w-full">
      <LandingNav />
      <div className="relative overflow-hidden bg-accent/10">
        <div className="absolute inset-0 bg-linear-r from-primary/10 via-transparent to-transparent"></div>

        {/* Animated background circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div
          className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 sm:pt-24 sm:pb-20 "
          data-animate
          id="hero"
        >
          <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary hover:bg-primary/20 transition-all cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Free to use
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">
              Practice interviews.<br />
              <span className="text-primary bg-linear-r from-primary to-blue-500 bg-clip-text">
                Get hired faster.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-text max-w-2xl mx-auto animate-fade-in-up delay-200">
              Stop bombing interviews. Start acing them. Practice with an AI that asks real technical questions and gives you instant feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up delay-300">
              <Link
                to="/login"
                className="group relative px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-primary/25 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Practicing Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-linear-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-500 animate-fade-in-up delay-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600  animate-float"></div>
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600  animate-float delay-200"></div>
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-pink-600  animate-float delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div
        className="max-w-4xl mx-auto px-6 py-16"
        data-animate
        id="problems"
      >
        <div className={`space-y-12 transition-all duration-1000 ${isVisible('problems') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-text">We've all been there</h2>
            <p className="text-text max-w-2xl mx-auto">
              You spend hours grinding LeetCode. You know your stuff. But when the interviewer asks
              "tell me about yourself" or "walk me through your thinking" — you freeze.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "😰",
                title: "Interview anxiety",
                desc: "Knowing the answer but fumbling to explain it clearly under pressure",
                delay: "delay-100"
              },
              {
                emoji: "🤷‍♂️",
                title: "No one to practice with",
                desc: "Friends are busy. Mock interview services are expensive. You're on your own",
                delay: "delay-200"
              },
              {
                emoji: "⏰",
                title: "Time pressure",
                desc: "Interviews are coming up fast and you need practice NOW, not next week",
                delay: "delay-300"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-surface/50 border border-slate-700/50 rounded-xl p-6 space-y-3 hover:border-primary hover:bg-surface transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 cursor-default transform ${isVisible('problems') ? `opacity-100 translate-y-0 ${item.delay}` : 'opacity-0 translate-y-10'
                  }`}
              >
                <div className="text-3xl animate-bounce-slow">{item.emoji}</div>
                <h3 className="font-semibold text-text">{item.title}</h3>
                <p className="text-sm text-text">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div
        className="max-w-4xl mx-auto px-6 py-16"
        data-animate
        id="how-it-works"
      >
        <h2 className={`text-3xl font-bold text-text text-center mb-12 transition-all duration-1000 ${isVisible('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          How it works
        </h2>

        <div className="space-y-8">
          {[
            {
              num: "1",
              title: "Click Start Interview",
              desc: "No account needed. No credit card. Just click and start.",
              delay: "delay-100"
            },
            {
              num: "2",
              title: "Answer real interview questions",
              desc: "The AI asks questions just like a real interviewer would. Technical, behavioral, the works.",
              delay: "delay-200"
            },
            {
              num: "3",
              title: "Get better with every session",
              desc: "Practice until you're confident. Come back anytime, as many times as you need.",
              delay: "delay-300"
            }
          ].map((step, idx) => (
            <div
              key={idx}
              className={`flex gap-6 items-start transition-all duration-1000 ${isVisible('how-it-works') ? `opacity-100 translate-x-0 ${step.delay}` : 'opacity-0 -translate-x-10'
                }`}
            >
              <div className="shrink-0 w-12 h-12 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 cursor-default">
                {step.num}
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold text-text mb-2">{step.title}</h3>
                <p className="text-text">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Works */}
      <div
        className="max-w-4xl mx-auto px-6 py-16"
        data-animate
        id="why-works"
      >
        <div className={`bg-accent/10 border border-primary/20 rounded-2xl p-8 sm:p-12 hover:border-primary/40 transition-all duration-500 ${isVisible('why-works') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6">Why this actually works</h2>
          <div className="space-y-4 text-slate-400">
            <p className="leading-relaxed hover:text-text transition-colors">
              Look, I built this because I was terrible at interviews. Not because I didn't know the tech —
              I did. But I'd get in that Zoom room and my mind would go blank.
            </p>
            <p className="leading-relaxed hover:text-text transition-colors">
              After bombing a few interviews at companies I really wanted to work for, I realized:
              <span className="text-primary font-semibold"> I needed reps</span>. Just like you don't get good at basketball
              by reading about it, you don't get good at interviews by just studying.
            </p>
            <p className="leading-relaxed hover:text-text transition-colors">
              So I built this. A judgment-free zone where you can practice as much as you want,
              mess up without consequences, and build the muscle memory you need to crush the real thing.
            </p>
          </div>
        </div>
      </div>

      {/* Creator Section */}
      <div
        className="max-w-4xl mx-auto px-6 py-16"
        data-animate
        id="creator"
      >
        <div className={`bg-surface border border-slate-700 rounded-2xl p-8 sm:p-12 hover:border-primary/50 transition-all duration-500 ${isVisible('creator') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="shrink-0 group">
              <div className="w-24 h-24 bg-linear-r from-primary to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-145 group-hover:rotate-3 transition-all duration-300">
                <img src={Emediong} alt="Emediong" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <h3 className="text-2xl font-bold text-text">Built by Emediong Jonah</h3>
                <p className="text-primary">Software Developer</p>
              </div>

              <p className="leading-relaxed text-text">
                Hey! I'm a developer who knows what it's like to struggle with interviews.
                I built this app using React, TypeScript, and Tailwind on the frontend.
              </p>

              <p className="text-text text-sm">
                This project is constantly improving. If you have ideas or find bugs,
                hit me up on any of the socials below.
              </p>

              <div className="flex gap-4 justify-center sm:justify-start pt-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-10 h-10 bg-bg border border-slate-700 rounded-lg flex items-center justify-center hover:border-primary transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/25">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div
        className="max-w-4xl mx-auto px-6 py-16"
        data-animate
        id="tech-stack"
      >
        <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible('tech-stack') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div>
            <h2 className="text-2xl font-bold text-text mb-3">Built with modern tools</h2>
            <p className="text-text">Because good tech makes for good products</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "React", icon: <IoLogoReact className="text-2xl text-primary w-10 h-10" /> },
              { name: "TypeScript", icon: <IoLogoNodejs className="text-2xl text-primary w-10 h-10" /> },
              { name: "Tailwind CSS", icon: <RiTailwindCssFill className="text-2xl text-primary w-10 h-10" /> },
              { name: "Node.js", icon: <IoLogoNodejs className="text-2xl text-primary w-10 h-10" /> },
              { name: "PostgreSQL", icon: <IoLogoNodejs className="text-2xl text-primary w-10 h-10" /> },
            ].map((tech, idx) => (
              <div
                key={tech.name}
                className={`px-5 py-2 text-text flex items-center gap-2 rounded-lg font-medium text-sm shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-primary/10 animate-fade-in-up`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {tech.icon}
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="max-w-4xl mx-auto px-6 py-16 pb-24"
        data-animate
        id="final-cta"
      >
        <div className={`bg-linear-r from-primary/10 via-primary/5 to-transparent border border-primary/30 rounded-2xl p-12 text-center space-y-6 hover:border-primary/50 transition-all duration-500 ${isVisible('final-cta') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            Ready to stop stressing about interviews?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join hundreds of developers who are practicing smarter and landing better jobs.
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-primary/25 text-lg group"
          >
            <span className="flex items-center gap-2">
              Start Your First Practice Session
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
          <p className="text-sm text-text mt-9">No payment • No BS</p>
        </div>
      </div>
    </div>
  );
}

export default About;