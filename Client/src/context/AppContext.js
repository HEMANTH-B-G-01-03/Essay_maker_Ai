import { createContext, useContext, useMemo, useState } from "react";
const AppContext = createContext(null);
export function AppProvider({ children }) {
const [essay, setEssay] = useState("");
const [history, setHistory] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const value = useMemo(
() => ({ essay, setEssay, history, setHistory, loading, setLoading, error, setError }),
[essay, history, loading, error]
);
return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }