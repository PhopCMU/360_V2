import React from "react";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
};

export default App;
