/**
 * AuthContext — Central authentication and RBAC provider.
 * 
 * Stores the authenticated user, their role, and exposes
 * permission-checking utilities consumed by the entire app.
 */
import * as React from "react";
import { UserRole } from "../types";

/* ------------------------------------------------------------------ */
/*  Permission definitions                                             */
/* ------------------------------------------------------------------ */
export type Permission =
  | "goals:create"
  | "goals:edit"
  | "goals:delete"
  | "goals:submit"
  | "goals:approve"
  | "goals:reject"
  | "goals:rework"
  | "goals:unlock"
  | "goals:view_team"
  | "checkins:submit"
  | "checkins:review"
  | "analytics:view"
  | "analytics:export"
  | "admin:users"
  | "admin:cycles"
  | "admin:audit"
  | "admin:escalations"
  | "admin:settings"
  | "admin:impersonate"
  | "ai:assistant"
  | "notifications:manage"
  | "search:global";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  employee: [
    "goals:create",
    "goals:edit",
    "goals:delete",
    "goals:submit",
    "checkins:submit",
    "analytics:view",
    "ai:assistant",
    "search:global",
    "notifications:manage",
  ],
  manager: [
    "goals:create",
    "goals:edit",
    "goals:delete",
    "goals:submit",
    "goals:approve",
    "goals:reject",
    "goals:rework",
    "goals:view_team",
    "checkins:submit",
    "checkins:review",
    "analytics:view",
    "analytics:export",
    "ai:assistant",
    "search:global",
    "notifications:manage",
  ],
  admin: [
    "goals:create",
    "goals:edit",
    "goals:delete",
    "goals:submit",
    "goals:approve",
    "goals:reject",
    "goals:rework",
    "goals:unlock",
    "goals:view_team",
    "checkins:submit",
    "checkins:review",
    "analytics:view",
    "analytics:export",
    "admin:users",
    "admin:cycles",
    "admin:audit",
    "admin:escalations",
    "admin:settings",
    "admin:impersonate",
    "ai:assistant",
    "search:global",
    "notifications:manage",
  ],
};

/* ------------------------------------------------------------------ */
/*  Authenticated user type                                            */
/* ------------------------------------------------------------------ */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  /** When admin impersonates another user */
  impersonating?: { id: string; name: string; role: UserRole } | null;
}

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** The effective role (may differ during impersonation) */
  effectiveRole: UserRole;
  login: (email: string, password: string, role?: UserRole) => void;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (...permissions: Permission[]) => boolean;
  /** Admin-only: impersonate another user */
  impersonate: (target: { id: string; name: string; role: UserRole }) => void;
  stopImpersonation: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

/* ------------------------------------------------------------------ */
/*  Demo users                                                         */
/* ------------------------------------------------------------------ */
const DEMO_USERS: Record<UserRole, AuthUser> = {
  employee: {
    id: "u1",
    name: "Alex Rivera",
    email: "alex.rivera@novapulse.io",
    role: "employee",
    department: "Product Design",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  manager: {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah.chen@novapulse.io",
    role: "manager",
    department: "Product Management",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  admin: {
    id: "u3",
    name: "James Mitchell",
    email: "james.mitchell@novapulse.io",
    role: "admin",
    department: "Engineering",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
};

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem("novapulse_user");
    return stored ? JSON.parse(stored) : null;
  });

  const effectiveRole = user?.impersonating?.role ?? user?.role ?? "employee";

  const login = React.useCallback(
    (email: string, _password: string) => {
      // In a real app, this would be an API call to POST /api/auth/login
      // Here we simulate the backend assigning the correct role based on the user's email
      let role: UserRole = "employee";
      if (email === "sarah.chen@novapulse.io") role = "manager";
      if (email === "james.mitchell@novapulse.io") role = "admin";
      
      const demoUser = DEMO_USERS[role];
      const authedUser: AuthUser = { ...demoUser, email };
      setUser(authedUser);
      sessionStorage.setItem("novapulse_user", JSON.stringify(authedUser));
      sessionStorage.setItem("novapulse_auth", "true");
    },
    []
  );

  const loginWithToken = React.useCallback(async (token: string) => {
    sessionStorage.setItem("novapulse_token", token);
    try {
      // Decode JWT payload without verifying signature (backend did that)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      
      const role = (payload.role || 'employee').toLowerCase() as UserRole;
      const email = payload.email || DEMO_USERS[role].email;
      
      const authedUser: AuthUser = { 
        ...DEMO_USERS[role], 
        id: payload.sub || DEMO_USERS[role].id,
        email, 
        name: payload.name || DEMO_USERS[role].name 
      };
      setUser(authedUser);
      sessionStorage.setItem("novapulse_user", JSON.stringify(authedUser));
      sessionStorage.setItem("novapulse_auth", "true");
    } catch (e) {
      // Fallback
      const demoUser = DEMO_USERS.employee;
      setUser(demoUser);
      sessionStorage.setItem("novapulse_user", JSON.stringify(demoUser));
      sessionStorage.setItem("novapulse_auth", "true");
    }
    return Promise.resolve();
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("novapulse_user");
    sessionStorage.removeItem("novapulse_auth");
    sessionStorage.removeItem("novapulse_token");
  }, []);

  const hasPermission = React.useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return ROLE_PERMISSIONS[effectiveRole]?.includes(permission) ?? false;
    },
    [user, effectiveRole]
  );

  const hasAnyPermission = React.useCallback(
    (...permissions: Permission[]) => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const impersonate = React.useCallback(
    (target: { id: string; name: string; role: UserRole }) => {
      if (!user || user.role !== "admin") return;
      const updated = { ...user, impersonating: target };
      setUser(updated);
      sessionStorage.setItem("novapulse_user", JSON.stringify(updated));
    },
    [user]
  );

  const stopImpersonation = React.useCallback(() => {
    if (!user) return;
    const updated = { ...user, impersonating: null };
    setUser(updated);
    sessionStorage.setItem("novapulse_user", JSON.stringify(updated));
  }, [user]);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      effectiveRole,
      login,
      loginWithToken,
      logout,
      hasPermission,
      hasAnyPermission,
      impersonate,
      stopImpersonation,
    }),
    [user, effectiveRole, login, loginWithToken, logout, hasPermission, hasAnyPermission, impersonate, stopImpersonation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Guard component                                                    */
/* ------------------------------------------------------------------ */
export function RequirePermission({
  permission,
  fallback,
  children,
}: {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) return fallback ?? null;
  return <>{children}</>;
}
