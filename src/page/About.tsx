import { IoFlash, IoRocket, IoBulb, IoTrendingUp } from "react-icons/io5";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
interface SocialLink 
{
  link: string,
  icon: any
  label: string,
}

const socials:SocialLink[] = [
  {
    link: "https://www.linkedin.com/in/emediong-jonah-68a093329",
    icon: <FaLinkedin className="w-5 h-5" />,
    label: "Linkedin"
  },

   {
    link: "https://github.com/Emediong-Jonah03",
    icon: <FaGithub className="w-5 h-5" />,
    label: "Github"
  },
   {
    link: "https://x.com/EmediongJ15081",
    icon: <FaTwitter className="w-5 h-5" />,
    label: "Twitter"
  },

]

function About() {
  return (
    <div className="min-h-screen bg-bg sm:ml-72 md:ml-80 lg:ml-[20%] p-6 pt-20 sm:pt-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-2xl mb-6">
            <IoFlash className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            AI Interviewer
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Revolutionizing technical hiring through intelligent automation and AI-powered interview experiences
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-surface border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-3">
            <IoRocket className="text-accent" />
            Our Mission
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            AI Interviewer is built to streamline company hiring processes by leveraging cutting-edge artificial intelligence. We're transforming the way organizations conduct technical interviews, making them more efficient, consistent, and insightful.
          </p>
          <p className="text-text-muted leading-relaxed">
            By automating initial screening rounds and providing detailed candidate assessments, we help companies save time, reduce bias, and make better hiring decisions faster.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent transition">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <IoBulb className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">AI-Powered</h3>
            <p className="text-sm text-text-muted">
              Advanced natural language processing for dynamic, contextual interview conversations
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent transition">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <IoTrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Scalable</h3>
            <p className="text-sm text-text-muted">
              Interview unlimited candidates simultaneously without sacrificing quality or consistency
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent transition">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <IoFlash className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Efficient</h3>
            <p className="text-sm text-text-muted">
              Reduce time-to-hire by 60% with automated screening and instant feedback
            </p>
          </div>
        </div>

        {/* Creator Section */}
        <div className="bg-linear-to-r from-accent/5 to-transparent border border-accent/20 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-3xl font-bold text-white shrink-0">
              EJ
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-text mb-2">Emediong Jonah</h2>
              <p className="text-accent font-semibold mb-3">Software Engineer & AI Engineer</p>
              <p className="text-text-muted leading-relaxed mb-4">
                As a Software developer I'm passionate about leveraging technology to solve real-world hiring challenges. This platform represents my vision of a future where companies can scale their hiring processes without compromising on quality or candidate experience.
              </p>
              <p className="text-text-muted leading-relaxed mb-6">
                Built with modern technologies including React, TypeScript, Node.js, RAG and advanced AI models, AI Interviewer is designed to be the technical hiring solution of tomorrow, available today.
              </p>

              {/* Social Links */}
              
                <div className="flex gap-4 justify-center md:justify-start">
                  {socials.map(el => (
                <a
                  href={el.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:border-accent hover:text-accent transition"
                  aria-label={el.label}
                >
                  {el.icon}
                </a>  
                ))} 
              </div>
              
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-text mb-6">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "React",
              "TypeScript",
              "Tailwind CSS",
              "AI/ML",
              "Node.js",
              "REST APIs",
              "MongoDB",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-bg border border-border rounded-lg px-4 py-3 text-center text-sm font-medium text-text-muted hover:border-accent hover:text-accent transition"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}

export default About;