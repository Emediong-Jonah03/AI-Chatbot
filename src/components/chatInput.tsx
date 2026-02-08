import { useState } from "react";
import { IoSend } from "react-icons/io5";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isVisible: boolean; // Changed Boolean to boolean
}

function ChatInput({ onSendMessage, isVisible }: ChatInputProps) {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  if (!isVisible) return null; // FIXED: Changed from isVisible to !isVisible

  return (
    <div className="fixed sm:bottom-2 bottom-3 left-0 right-0 bg-bg border-t border-border sm:ml-72 md:ml-80 lg:ml-[20%]">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          {/* Input Container */}
          <div className="flex items-end bg-input border border-border rounded-lg focus-within:border-accent transition">
            
             
            {/* Attach Button */}
            {/* 
            <button
              type="button"
              className="p-3 text-secondary hover:text-text-muted transition shrink-0"
              title="Attach file"
            >
              <IoAttach className="w-5 h-5" />
            </button>
              */}
            {/* Text Area */}
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Your Interviewer"
              rows={1}
              className="flex-1 bg-transparent text-text placeholder:text-text-muted px-2 py-3 resize-none outline-none max-h-32 overflow-y-auto"
              style={{
                minHeight: "44px",
                maxHeight: "128px", 
              }}
            />

            {/* Voice Input Button */}
            {/* 
            <button
              type="button"
              className="p-3 text-secondary hover:text-text-muted transition shrink-0"
              title="Voice input"
            >
              <IoMic className="w-5 h-5" />
            </button>
              */}

            {/* Send Button */}
            <button
              type="submit"
              disabled={messageText.trim().length < 1}
              className="p-3 text-accent hover:text-accent/80 transition shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send message"
            >
              <IoSend className="w-5 h-5" />
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs hidden sm:block text-text-muted text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;