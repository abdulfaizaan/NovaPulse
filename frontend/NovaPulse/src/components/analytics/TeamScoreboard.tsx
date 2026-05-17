import { motion } from "motion/react";
import { Trophy, TrendingUp, Medal, Crown, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface TeamScore {
  department: string;
  score: number;
  trend: number;
  members: number;
  goals: number;
}

const TEAM_SCORES: TeamScore[] = [
  { department: "Sales", score: 91, trend: 5, members: 6, goals: 22 },
  { department: "Engineering", score: 84, trend: 3, members: 12, goals: 48 },
  { department: "Product Design", score: 78, trend: -2, members: 8, goals: 34 },
  { department: "Marketing", score: 74, trend: 8, members: 5, goals: 18 },
  { department: "Customer Success", score: 69, trend: 1, members: 7, goals: 28 },
];

interface TopPerformer {
  name: string;
  score: number;
  avatar: string;
  department: string;
}

const TOP_PERFORMERS: TopPerformer[] = [
  { name: "Oscar Wilde", score: 96, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar", department: "Sales" },
  { name: "Jordan Smith", score: 92, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", department: "Engineering" },
  { name: "Alex Rivera", score: 88, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", department: "Product Design" },
];

const RANK_COLORS = [
  { bg: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/20", icon: Crown, color: "text-amber-400" },
  { bg: "from-slate-400/20 to-zinc-400/20", border: "border-slate-400/20", icon: Medal, color: "text-slate-300" },
  { bg: "from-orange-600/20 to-amber-700/20", border: "border-orange-600/20", icon: Medal, color: "text-orange-400" },
];

export function TeamScoreboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Department Rankings */}
      <Card className="lg:col-span-2 glass-effect border-white/5 shadow-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <Trophy className="size-4 text-amber-400" />
            Department Scoreboards
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {TEAM_SCORES.map((team, idx) => {
            const barColor =
              team.score >= 85 ? "bg-emerald-500" :
              team.score >= 70 ? "bg-indigo-500" :
              team.score >= 55 ? "bg-amber-500" : "bg-rose-500";

            return (
              <motion.div
                key={team.department}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-600 w-5">#{idx + 1}</span>
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {team.department}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {team.members} members · {team.goals} goals
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`size-3 ${team.trend >= 0 ? "text-emerald-400" : "text-rose-400"}`} />
                      <span className={`text-[10px] font-bold ${team.trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {team.trend > 0 && "+"}{team.trend}%
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-white w-10 text-right">{team.score}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${barColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${team.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <Star className="size-4 text-amber-400" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {TOP_PERFORMERS.map((performer, idx) => {
            const rank = RANK_COLORS[idx];
            const RankIcon = rank.icon;
            return (
              <motion.div
                key={performer.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${rank.bg} border ${rank.border}`}
              >
                <div className="relative">
                  <Avatar className="size-10 border-2 border-white/20">
                    <AvatarImage src={performer.avatar} />
                    <AvatarFallback>{performer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -top-1 -right-1 size-5 rounded-full bg-black/50 flex items-center justify-center`}>
                    <RankIcon className={`size-3 ${rank.color}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{performer.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{performer.department}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-extrabold ${rank.color}`}>{performer.score}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Score</p>
                </div>
              </motion.div>
            );
          })}

          {/* Recognition prompt */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center">
            <p className="text-[10px] text-indigo-400 font-semibold">
              🎉 Top performers are auto-nominated for quarterly awards
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
