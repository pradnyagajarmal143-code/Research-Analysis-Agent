import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ChatContainer from "@/components/ChatContainer";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
  };

  return { path, navigate };
}

function AppRoutes() {
  const { session } = useAuth();
  const { path, navigate } = usePathname();

  if (session) {
    return <ChatContainer />;
  }

  return path === "/register" ? (
    <RegisterPage onNavigate={navigate} />
  ) : (
    <LoginPage onNavigate={navigate} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
