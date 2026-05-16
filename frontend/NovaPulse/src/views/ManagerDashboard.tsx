/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, CheckCircle2, AlertCircle, BarChart3, ChevronRight, UserMinus, UserPlus, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { StatWidget } from "@/src/components/dashboard/StatWidget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const teamMembers = [
  { name: "Alex Rivera", role: "Product Designer", progress: 68, status: "on-track", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  { name: "Jordan Smith", role: "Frontend Engineer", progress: 85, status: "ahead", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
  { name: "Mila Kunis", role: "UX Researcher", progress: 40, status: "delayed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila" },
  { name: "Oscar Wilde", role: "Product Manager", progress: 92, status: "on-track", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar" },
];

export function ManagerDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Team Performance</h1>
          <p className="text-immersive-muted font-medium">Monitoring 8 direct reports and 34 active goals for Q2.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 glass-effect font-bold text-immersive-text hover:bg-white/5 h-11 px-6">
             <BarChart3 className="mr-2 size-4" /> Export Analytics
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget 
          title="Team Progress" 
          value="72%" 
          description="Avg objective completion" 
          icon={BarChart3}
          trend={{ value: 5, isPositive: true }}
          color="indigo"
        />
        <StatWidget 
          title="Pending Approvals" 
          value="5" 
          description="3 goal drafts, 2 updates" 
          icon={CheckCircle2}
          color="amber"
        />
        <StatWidget 
          title="Delayed Goals" 
          value="2" 
          description="Requires immediate check-in" 
          icon={AlertCircle}
          color="rose"
        />
        <StatWidget 
          title="Total Team" 
          value="8" 
          description="All members active" 
          icon={Users}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-effect border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4 bg-white/5">
            <div className="space-y-0.5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Employee Goal Status</CardTitle>
              <CardDescription className="text-xs font-medium text-immersive-muted opacity-70">Direct reports and their overall goal health</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-immersive-muted" />
                  <Input placeholder="Search team..." className="pl-9 h-9 w-[180px] bg-white/5 border-white/10 text-immersive-text" />
               </div>
               <Button variant="outline" size="icon" className="size-9 border-white/10 hover:bg-white/5 text-immersive-text"><Filter className="size-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted py-4 pl-6">Employee</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Progress</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted pr-6 font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.name} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-10 border-2 border-white/10 shadow-lg">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-slate-800 text-white font-black">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-immersive-text">{member.name}</span>
                          <span className="text-[10px] text-immersive-muted font-bold uppercase tracking-wider">{member.role}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black text-immersive-muted uppercase tracking-tighter">
                           <span>{member.progress}% Complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${member.progress}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border-none shadow-lg",
                        member.status === 'on-track' ? "bg-blue-500/10 text-blue-400" :
                        member.status === 'ahead' ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-rose-500/10 text-rose-400"
                      )}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-indigo-400 hover:bg-transparent hover:text-indigo-300">
                        View Details <ChevronRight className="ml-1 size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 py-4 bg-white/5">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Resource Outlook</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 flex-1">
             <div className="space-y-5">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                         <UserPlus className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-immersive-text">Capacity Available</p>
                         <p className="text-[10px] text-immersive-muted font-bold uppercase tracking-tight">Jordan, Oscar</p>
                      </div>
                   </div>
                   <Badge className="bg-emerald-500/10 text-emerald-400 font-black text-[9px] uppercase tracking-widest border-none">Low Risk</Badge>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                         <UserMinus className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-immersive-text">Limited Capacity</p>
                         <p className="text-[10px] text-immersive-muted font-bold uppercase tracking-tight">Mila (3 active + Audit)</p>
                      </div>
                   </div>
                   <Badge className="bg-rose-500/10 text-rose-400 font-black text-[9px] uppercase tracking-widest border-none">High Risk</Badge>
                </div>
             </div>
             
             <Separator className="bg-white/5" />

             <div className="space-y-4 glass-effect bg-indigo-500/10 rounded-2xl p-6 text-white relative overflow-hidden border border-indigo-500/20 shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <BarChart3 className="size-24" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Quarterly Recap</h4>
                <div className="space-y-1">
                   <p className="text-3xl font-black text-gradient">20/34</p>
                   <p className="text-[10px] text-immersive-muted font-black uppercase tracking-widest">Goals items completed</p>
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black text-[10px] uppercase tracking-[0.15em] h-12 relative z-10 transition-transform active:scale-95 shadow-xl shadow-indigo-500/10 mt-2">
                  Launch Team Sync
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
