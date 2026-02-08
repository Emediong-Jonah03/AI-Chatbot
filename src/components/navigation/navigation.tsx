import { useEffect, useState } from "react";
import { IoFlash, IoChatbox, IoMoon, IoClose } from "react-icons/io5";
import { GoSignOut } from "react-icons/go";
import { GiHamburgerMenu, GiSun } from "react-icons/gi";
import type { ChatSession } from "../../App";
import { Link } from "react-router-dom";

interface NavigationProps {
  chatSessions: ChatSession[]; 
  currentSessionId: number | null; 
  onNewChat: () => void; 
  onSelectChat: (sessionId: number) => void; 
}

export default function Navigation({
  chatSessions = [],  
  currentSessionId = null,  
  onNewChat = () => {},  // Default no-op function
  onSelectChat = () => {},  // Default no-op function
}: NavigationProps) {
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNewChatClick = () => {
    setIsOpen(false);
    onNewChat();
  };

  const handleChatClick = (sessionId: number) => {
    setIsOpen(false);
    onSelectChat(sessionId);
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50  text-text p-2 rounded-lg shadow-lg hover:bg-accent/90 transition"
      >
        {isOpen ? (
          <IoClose className="w-8 h-8" />
        ) : (
          <GiHamburgerMenu className="w-8 h-8" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={`
          flex flex-col bg-surface fixed left-0 top-0 h-screen border-r border-border z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
          w-4/5 sm:w-72 md:w-80 lg:w-1/5
          px-5 py-5
        `}
      >
        {/* Header */}
        <section className="flex flex-col mb-7">
          <div className="flex justify-between items-center ml-9 sm:ml-1 mb-7 gap-3">
            <div className="flex items-end gap-4 pl-10 sm:pl-3">
              <p className="text-xl font-bold truncate">AI Interviewer</p>
              <IoFlash className="w-9 h-9 bg-accent text-white p-2 rounded-lg shrink-0" />
            </div>
          </div>

          <Link to="/"
            onClick={handleNewChatClick}
            className="bg-accent text-white px-4 py-2.5 w-full  rounded-lg hover:bg-accent/90 transition font-medium"
          >
            + New Chat
          </Link>
        </section>

        {/* Recent Chats - scrollable */}
        <section className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          <p className="text-text-muted text-xs font-semibold mb-3 tracking-wide uppercase">
            Recent Chats
          </p>

          <div className="space-y-1.5">
            {!chatSessions || chatSessions.length === 0 ? (
              <p className="text-sm text-text-muted/60 px-3 py-2">
                No conversations yet
              </p>
            ) : (
              chatSessions
                .slice()
                .reverse()
                .map((session) => {
                  // Get the first user message as preview, or use title
                  const preview =
                    session.messages.find((msg) => msg.type === "user")?.text ||
                    session.title;

                  return (
                    <div
                      key={session.id}
                      onClick={() => handleChatClick(session.id)}
                      className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg hover:bg-hover cursor-pointer transition group ${
                        currentSessionId === session.id
                          ? "bg-hover border-l-2 border-accent"
                          : ""
                      }`}
                    >
                      <IoChatbox
                        className={`w-4 h-4 shrink-0 transition ${
                          currentSessionId === session.id
                            ? "text-accent"
                            : "text-secondary group-hover:text-text-muted"
                        }`}
                      />
                      <p
                        className={`text-sm truncate transition ${
                          currentSessionId === session.id
                            ? "text-text font-medium"
                            : "text-text-muted group-hover:text-text"
                        }`}
                      >
                        {preview}
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        </section>

        {/* Footer - always at bottom */}
        <section className="border-t border-border pt-4 mt-3 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-text">
                EJ
              </div>
              <p className="font-medium truncate text-sm">Emediong Jonah</p>
            </div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hover:bg-hover p-2 rounded-lg transition shrink-0"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <IoMoon className="w-7 h-7 text-text hover:text-text-muted transition cursor-pointer" />
              ) : (
                <GiSun className="w-7 h-7 text-text hover:text-text-muted transition cursor-pointer" />
              )}
            </button>
          </div>

          <button className="cursor-pointer flex items-center justify-center space-x-2 text-error font-medium hover:bg-error/10 w-full py-2 rounded-lg transition">
            <GoSignOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </section>
      </nav>
    </>
  );
}