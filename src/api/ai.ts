// api/ai.ts
import api from "./axios";

export interface StartSessionResponse {
    question: string;
}

export interface ChatResponse {
    done: false;
    question: string;
}

export interface FinishResponse {
    done: true;
    result: {
        id: string;
        sessionId: string;
        score: number;
        feedback: string;
        createdAt: string;
    };
}

export type ChatOrFinishResponse = ChatResponse | FinishResponse;

// Create a new interview session in the DB
export const createSession = async (title: string): Promise<{ id: string; title: string }> => {
    const res = await api.post("/v1/interviews", { title });
    return res.data;
};

// Start the session: save role and get the first AI question
export const startSession = async (
    sessionId: string,
    role: string
): Promise<StartSessionResponse> => {
    const res = await api.post(`/v1/ai/${sessionId}/start`, { role });
    return res.data;
};

// Send an answer and get the next question (or finish)
export const sendAnswer = async (
    sessionId: string,
    answer: string
): Promise<ChatOrFinishResponse> => {
    const res = await api.post(`/v1/ai/${sessionId}/chat`, { answer });
    return res.data;
};

// Manually end the interview and get the result
export const finishSessionEarly = async (sessionId: string): Promise<FinishResponse> => {
    const res = await api.post(`/v1/ai/${sessionId}/finish`);
    return res.data;
};

// Delete a session from history
export const deleteSession = async (sessionId: string): Promise<void> => {
    await api.delete(`/v1/interviews/${sessionId}`);
};

// Get all sessions for the current user
export const getSessions = async (): Promise<{ id: string; title: string; status: string; role?: string; createdAt: string }[]> => {
    const res = await api.get("/v1/interviews");
    return res.data;
};
