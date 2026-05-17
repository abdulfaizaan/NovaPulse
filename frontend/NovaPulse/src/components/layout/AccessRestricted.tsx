import { motion } from "motion/react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccessRestrictedProps {
  requiredRole?: string;
  onGoBack: () => void;
}

export function AccessRestricted({ requiredRole, onGoBack }: AccessRestrictedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="size-24 mx-auto rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 flex items-center justify-center"
        >
          <ShieldAlert className="size-12 text-rose-400" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Access Restricted
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed font-medium">
            You don't have the required permissions to access this section.
            {requiredRole && (
              <>
                {" "}
                This area requires{" "}
                <span className="text-rose-400 font-bold uppercase">{requiredRole}</span>{" "}
                privileges.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={onGoBack}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold rounded-xl px-6"
          >
            <ArrowLeft className="size-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>

        <p className="text-xs text-slate-600 font-medium">
          Contact your organization administrator for access requests.
        </p>
      </motion.div>
    </div>
  );
}
