import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const About = lazy(() => import("./page/About"));
const Login = lazy(() => import("./auth/Login"));
const SignUp = lazy(() => import("./auth/Signup"));
const Navigation = lazy(() => import("./components/navigation/navigation"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const ChatInput = lazy(() => import("./components/chatInput"));
const UserMessage = lazy(() => import("./components/user"));
const AIMessage = lazy(() => import("./components/ai"));
import { useState } from "react";

export interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
}

export interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// Create a wrapper component for the main app
function MainApp() {
  const { isAuthenticated } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [nextSessionId, setNextSessionId] = useState(1);
  const [nextMessageId, setNextMessageId] = useState(1);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const currentMessages = chatSessions.find(
    session => session.id === currentSessionId
  )?.messages || [];

  const handleSendMessage = (text: string) => {
    if (!currentSessionId) return;

    const newUserMessage: Message = {
      id: nextMessageId,
      type: "user",
      text,
    };

    setChatSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, newUserMessage] }
          : session
      )
    );

    const currentMessageId = nextMessageId;
    setNextMessageId(prev => prev + 1);

    setTimeout(() => {
      const aiResponse: Message = {
        id: currentMessageId + 1,
        type: "ai",
        text: "This is a simulated AI response. Replace this with your actual API call.",
      };

      setChatSessions(prev =>
        prev.map(session =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, aiResponse] }
            : session
        )
      );
      setNextMessageId(prev => prev + 1);
    }, 1000);
  };

  const startInterview = () => {
    const newSession: ChatSession = {
      id: nextSessionId,
      title: `Interview ${nextSessionId}`,
      messages: [
        {
          id: nextMessageId,
          type: "ai",
          text: "To get us started, I'd love to walk through your journey. Could you introduce yourself by giving us a brief overview of what you're working on now, the key experiences that led you here, and what specifically drew you to this role at our company?",
        },
      ],
      createdAt: new Date(),
    };

    setChatSessions(prev => [...prev, newSession]);
    setCurrentSessionId(nextSessionId);
    setNextSessionId(prev => prev + 1);
    setNextMessageId(prev => prev + 1);
    setInterviewStarted(true);
  };

  const handleNewChat = () => {
    setInterviewStarted(false);
    setCurrentSessionId(null);
  };

  const handleSelectChat = (sessionId: number) => {
    setCurrentSessionId(sessionId);
    setInterviewStarted(true);
  };

  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/about"
        element={
          <About />
        }
      />

      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Root redirect */}
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
              <Navigation
                chatSessions={chatSessions}
                currentSessionId={currentSessionId}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
              />
              <section className="sm:ml-72 md:ml-80 lg:ml-[20%] p-6 pt-20 sm:pt-6 pb-32">
                <Dashboard startInterview={startInterview} isVisible={!interviewStarted} />
                <div className="max-w-4xl mx-auto space-y-4">
                  {currentMessages.map((msg) =>
                    msg.type === "user" ? (
                      <UserMessage key={msg.id} text={msg.text} />
                    ) : (
                      <AIMessage key={msg.id} text={msg.text} />
                    )
                  )}
                </div>
              </section>
              <ChatInput onSendMessage={handleSendMessage} isVisible={interviewStarted} />
            </main>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect based on auth status */}
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