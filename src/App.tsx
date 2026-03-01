import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, useState, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContextComponent";
import {
  createSession,
  startSession,
  sendAnswer,
  finishSessionEarly,
  deleteSession,
  type FinishResponse,
} from "./api/ai";
import { IoTrophy, IoClose } from "react-icons/io5";

const About = lazy(() => import("./page/About"));
const Login = lazy(() => import("./auth/Login"));
const SignUp = lazy(() => import("./auth/Signup"));
const Navigation = lazy(() => import("./components/navigation/navigation"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const ChatInput = lazy(() => import("./components/chatInput"));
const UserMessage = lazy(() => import("./components/user"));
const AIMessage = lazy(() => import("./components/ai"));

// ─── Types ────────────────────────────────────────────────────
export interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
}

export interface ChatSession {
  id: string;        // now the real DB id (cuid string)
  title: string;
  role: string;
  messages: Message[];
  createdAt: Date;
}

// ─── Result card ──────────────────────────────────────────────
function ResultCard({
  result,
  onClose,
}: {
  result: FinishResponse["result"];
  onClose: () => void;
}) {
  const scoreColor =
    result.score >= 75
      ? "text-green-500"
      : result.score >= 50
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-border animate-in fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text transition"
        >
          <IoClose className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <IoTrophy className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-text mb-1">Interview Complete!</h2>
          <p className="text-text-muted text-sm">Here's how you performed</p>
        </div>

        {/* Score */}
        <div className="bg-bg rounded-xl p-4 mb-4 text-center">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Score</p>
          <p className={`text-5xl font-black ${scoreColor}`}>{result.score}</p>
          <p className="text-text-muted text-xs mt-1">out of 100</p>
        </div>

        {/* Feedback */}
        <div className="bg-bg rounded-xl p-4">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-2">Feedback</p>
          <p className="text-text text-sm leading-relaxed">{result.feedback}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-primary hover:bg-primary/80 text-white font-semibold py-2.5 rounded-xl transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
function MainApp() {
  const { isAuthenticated } = useAuth();

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [result, setResult] = useState<FinishResponse["result"] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [msgCounter, setMsgCounter] = useState(0);

  const makeId = () => {
    const id = msgCounter;
    setMsgCounter((p) => p + 1);
    return String(id);
  };

  const currentSession = chatSessions.find((s) => s.id === currentSessionId);
  const currentMessages = currentSession?.messages ?? [];

  // ── Start interview ───────────────────────────────────────
  const startInterview = async (role: string) => {
    setIsStarting(true);
    try {
      const session = await createSession(`${role} Interview`);
      const { question } = await startSession(session.id, role);

      const firstMsg: Message = { id: makeId(), type: "ai", text: question };

      const newChat: ChatSession = {
        id: session.id,
        title: `${role} Interview`,
        role,
        messages: [firstMsg],
        createdAt: new Date(),
      };

      setChatSessions((prev) => [...prev, newChat]);
      setCurrentSessionId(session.id);
      setInterviewStarted(true);
    } catch (err) {
      console.error("Failed to start interview:", err);
    } finally {
      setIsStarting(false);
    }
  };

  // ── Send answer ───────────────────────────────────────────
  const handleSendMessage = async (text: string) => {
    if (!currentSessionId || isAiTyping) return;

    const userMsg: Message = { id: makeId(), type: "user", text };
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, userMsg] }
          : s
      )
    );

    setIsAiTyping(true);
    try {
      const response = await sendAnswer(currentSessionId, text);

      if (response.done) {
        setResult(response.result);
        setShowResult(true);
        setInterviewStarted(false);
      } else {
        const aiMsg: Message = {
          id: makeId(),
          type: "ai",
          text: response.question,
        };
        setChatSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, aiMsg] }
              : s
          )
        );
      }
    } catch (err) {
      console.error("Failed to send answer:", err);
    } finally {
      setIsAiTyping(false);
    }
  };

  // ── End interview early ───────────────────────────────────
  const handleEndInterview = async () => {
    if (!currentSessionId) return;
    setIsAiTyping(true);
    try {
      const response = await finishSessionEarly(currentSessionId);
      setResult(response.result);
      setShowResult(true);
      setInterviewStarted(false);
    } catch (err) {
      console.error("Failed to end interview:", err);
    } finally {
      setIsAiTyping(false);
    }
  };

  // ── Delete session ────────────────────────────────────────
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setInterviewStarted(false);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  // ── Navigation helpers ────────────────────────────────────
  const handleNewChat = () => {
    setInterviewStarted(false);
    setCurrentSessionId(null);
  };

  const handleSelectChat = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setInterviewStarted(true);
  };

  return (
    <>
      {showResult && result && (
        <ResultCard result={result} onClose={() => setShowResult(false)} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/about" element={<About />} />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/about" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <main className="min-h-screen bg-bg">
                <Suspense>
                  <Navigation
                    chatSessions={chatSessions}
                    currentSessionId={currentSessionId}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    onDeleteSession={handleDeleteSession}
                  />
                </Suspense>
                <section className="sm:ml-72 md:ml-80 lg:ml-[20%] p-6 pt-20 sm:pt-6 pb-32">
                  <Suspense>
                    <Dashboard
                      startInterview={startInterview}
                      isVisible={!interviewStarted}
                      isLoading={isStarting}
                    />
                  </Suspense>
                  <div className="max-w-4xl mx-auto space-y-4">
                    {currentMessages.map((msg) =>
                      msg.type === "user" ? (
                        <Suspense key={msg.id}>
                          <UserMessage text={msg.text} />
                        </Suspense>
                      ) : (
                        <Suspense key={msg.id}>
                          <AIMessage text={msg.text} />
                        </Suspense>
                      )
                    )}
                    {isAiTyping && (
                      <div className="flex items-center gap-2 text-text-muted text-sm mt-4 pl-1">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:300ms]" />
                        </span>
                        AI is thinking…
                      </div>
                    )}
                  </div>
                </section>

                {/* Chat input + End Interview btn */}
                {interviewStarted && (
                  <div className="fixed sm:bottom-2 bottom-3 left-0 right-0 sm:ml-72 md:ml-80 lg:ml-[20%]">
                    <div className="max-w-4xl mx-auto px-4 flex items-center gap-2">
                      <div className="flex-1">
                        <Suspense>
                          <ChatInput
                            onSendMessage={handleSendMessage}
                            isVisible={true}
                            disabled={isAiTyping}
                          />
                        </Suspense>
                      </div>
                      <button
                        onClick={handleEndInterview}
                        disabled={isAiTyping}
                        className="shrink-0 bg-error/10 hover:bg-error/20 text-error text-xs font-semibold px-3 py-2 rounded-lg border border-error/30 transition disabled:opacity-40"
                      >
                        End Interview
                      </button>
                    </div>
                  </div>
                )}
              </main>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;