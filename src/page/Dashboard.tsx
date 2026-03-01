import { useState } from "react";
import { IoSparkles } from "react-icons/io5";

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Mobile Engineer",
  "Product Manager",
];

interface DashboardProps {
  isVisible: boolean;
  startInterview: (role: string) => void;
  isLoading?: boolean;
}

function Dashboard({ isVisible, startInterview, isLoading = false }: DashboardProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");

  if (!isVisible) return null;

  const handleStart = () => {
    if (selectedRole) startInterview(selectedRole);
  };

  return (
    <main className="flex items-center justify-center p-4 mb-8">
      <div className="max-w-lg w-full bg-surface rounded-2xl shadow-2xl p-8 text-center">

        {/* Avatar */}
        <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg">
          <IoSparkles className="w-9 h-9 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-text mb-2">
          Technical Interview Simulator
        </h1>
        <p className="text-text-muted leading-relaxed mb-8 text-sm">
          Choose your target role below and start a realistic AI-powered interview.
          Take your time and explain your thinking clearly.
        </p>

        {/* Role picker */}
        <div className="mb-6 text-left">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
            Select a role
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${selectedRole === role
                    ? "bg-accent text-white border-accent shadow"
                    : "bg-transparent text-text-muted border-border hover:border-accent hover:text-text"
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedRole || isLoading}
          className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface flex items-center justify-center gap-2"
          aria-label="Begin technical interview"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Starting…
            </>
          ) : (
            "Begin Interview"
          )}
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
