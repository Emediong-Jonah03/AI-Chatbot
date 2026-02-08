import { useState, useEffect } from "react";

interface HomeProps {
  start: () => void;
  isVisible: boolean;
}

function Home({ start, isVisible }: HomeProps) {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchUserName = async () => {
    try {
      const res = await fetch("https://randomuser.me/api/");
      
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      
      const data = await res.json();
      setUserName(data.results[0].name.first);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
      setUserName("Candidate"); 
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  if (!isVisible) return null; // FIXED: Changed from isVisible to !isVisible

  return (
    <main className="flex items-center justify-center p-4 mb-8">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-2xl p-8 text-center">
        
        {/* Profile Avatar Placeholder */}
        <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white uppercase">
          {userName ? userName[0] : "?"}
        </div>

        {loading ? (
          <div className="animate-pulse" role="status" aria-label="Loading user information">
            <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-text mb-4">
              Hello, <span className="text-primary">{userName}</span>
            </h1>
            
            {error && (
              <p className="text-error text-sm mb-2">
                (Couldn't load name)
              </p>
            )}
            
            <p className="mb-8 leading-relaxed text-text">
              I am your technical interviewer
            </p>
            
            <button 
              className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              onClick={start}
              aria-label="Begin technical interview"
            >
              Begin Interview
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default Home;