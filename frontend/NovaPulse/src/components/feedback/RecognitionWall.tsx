import * as React from "react";
import { motion } from "motion/react";
import { Heart, Star, Zap, Award, ThumbsUp, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Recognition {
  id: string;
  from: { name: string; avatar: string };
  to: { name: string; avatar: string };
  badge: "star" | "zap" | "heart" | "award" | "thumbsup";
  message: string;
  timestamp: string;
  likes: number;
}

const BADGE_CONFIG = {
  star: { icon: Star, label: "Outstanding", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  zap: { icon: Zap, label: "Lightning Fast", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  heart: { icon: Heart, label: "Team Player", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  award: { icon: Award, label: "Excellence", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  thumbsup: { icon: ThumbsUp, label: "Great Job", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

const MOCK_RECOGNITIONS: Recognition[] = [
  {
    id: "r1",
    from: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    to: { name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    badge: "star",
    message: "Outstanding work on the design system migration — shipped 2 weeks ahead of schedule!",
    timestamp: "2 hours ago",
    likes: 8,
  },
  {
    id: "r2",
    from: { name: "Jordan Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
    to: { name: "Mila Kunis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila" },
    badge: "heart",
    message: "Thank you for the amazing UX research insights — they completely reshaped our approach!",
    timestamp: "5 hours ago",
    likes: 12,
  },
  {
    id: "r3",
    from: { name: "Oscar Wilde", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar" },
    to: { name: "Jordan Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
    badge: "zap",
    message: "Fastest API integration I've ever seen — the APAC pipeline is now fully automated.",
    timestamp: "Yesterday",
    likes: 6,
  },
  {
    id: "r4",
    from: { name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    to: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    badge: "award",
    message: "Best manager I've worked with — your feedback on my Q2 goals was incredibly actionable.",
    timestamp: "2 days ago",
    likes: 15,
  },
];

export function RecognitionWall() {
  const [kudosInput, setKudosInput] = React.useState("");

  return (
    <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
          <Sparkles className="size-4 text-purple-400" />
          Recognition Wall
        </CardTitle>
        <div className="flex items-center gap-1">
          {Object.entries(BADGE_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className={`size-6 rounded-md ${config.bg} flex items-center justify-center`} title={config.label}>
                <Icon className={`size-3 ${config.color}`} />
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Quick kudos input */}
        <div className="flex gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <Input
            value={kudosInput}
            onChange={(e) => setKudosInput(e.target.value)}
            placeholder="Give a shoutout to a teammate..."
            className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 h-9 text-sm p-0"
          />
          <Button
            size="sm"
            disabled={!kudosInput.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg h-9 px-4 text-xs font-bold disabled:opacity-30"
          >
            <Send className="size-3 mr-1.5" />
            Send
          </Button>
        </div>

        {/* Recognition feed */}
        {MOCK_RECOGNITIONS.map((rec, idx) => {
          const badge = BADGE_CONFIG[rec.badge];
          const BadgeIcon = badge.icon;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* From avatar */}
                <div className="relative shrink-0">
                  <Avatar className="size-9 border border-white/10">
                    <AvatarImage src={rec.from.avatar} />
                    <AvatarFallback>{rec.from.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-xs font-bold text-white">{rec.from.name}</span>
                    <span className="text-[10px] text-slate-500">gave</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${badge.bg} border ${badge.border}`}>
                      <BadgeIcon className={`size-2.5 ${badge.color}`} />
                      <span className={`text-[9px] font-bold ${badge.color} uppercase tracking-wider`}>{badge.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">to</span>
                    <span className="text-xs font-bold text-white">{rec.to.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{rec.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors group">
                      <Heart className="size-3 group-hover:fill-rose-400" />
                      <span className="text-[10px] font-bold">{rec.likes}</span>
                    </button>
                    <span className="text-[10px] text-slate-600 font-medium">{rec.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
