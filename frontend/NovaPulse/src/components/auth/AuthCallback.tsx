import * as React from "react";
import { useAuth } from "@/src/context/AuthContext";
import { motion } from "motion/react";
import { Zap } from "lucide-react";

export function AuthCallback({ onComplete }: { onComplete: () => void }) {
  const { loginWithToken } = useAuth();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      loginWithToken(token).then(() => {
        // Clear the URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        onComplete();
      });
    }
  }, [loginWithToken, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030711]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="size-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto animate-pulse">
          <Zap className="size-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Authenticating with SSO...</h2>
        <p className="text-slate-400 text-sm">Finishing the sign-in process.</p>
      </motion.div>
    </div>
  );
}
