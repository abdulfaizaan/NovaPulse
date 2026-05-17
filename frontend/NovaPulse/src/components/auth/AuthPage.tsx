import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { API_URL } from "@/src/constants";

interface AuthPageProps {
  onAuth: (email: string, role: string) => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("employee");
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth(email || "alex.rivera@novapulse.io", selectedRole);
    }, 1200);
  };

  const handleDemoLogin = (role: string) => {
    setLoading(true);
    const emails: Record<string, string> = {
      employee: "alex.rivera@novapulse.io",
      manager: "sarah.chen@novapulse.io",
      admin: "james.mitchell@novapulse.io",
    };
    setTimeout(() => {
      setLoading(false);
      onAuth(emails[role] || emails.employee, role);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#030711]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      </div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Nova<span className="text-gradient">Pulse</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            {mode === "login"
              ? "Welcome back. Sign in to continue."
              : "Create your account to get started."}
          </p>
        </motion.div>

        {/* Form card */}
        <div className="auth-glass-card rounded-2xl p-8 relative overflow-hidden text-center">
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Enterprise Single Sign-On</h3>
          <p className="text-slate-400 text-sm mb-8">Authenticate with your corporate identity provider to access the NovaPulse portal securely.</p>

          {/* Social buttons */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button 
              type="button"
              onClick={() => window.location.href = `${API_URL}/auth/google`}
              className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-medium hover:bg-white/[0.08] hover:border-white/[0.12] transition-all group"
            >
              <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            <button 
              type="button"
              onClick={() => window.location.href = `${API_URL}/auth/microsoft`}
              className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-medium hover:bg-white/[0.08] hover:border-white/[0.12] transition-all group"
            >
              <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              Continue with Microsoft Entra ID
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          By continuing, you agree to our{" "}
          <span className="text-indigo-400 cursor-pointer hover:underline">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-indigo-400 cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>
      </motion.div>
    </div>
  );
}
