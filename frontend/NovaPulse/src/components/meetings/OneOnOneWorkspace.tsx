/**
 * 1-on-1 Workspace — Manager/Employee meeting collaboration.
 *
 * Includes agendas, notes, action items, discussion history, and a stateful HTML5 hardware webcam call simulator.
 * Persists state across tabs and supports native screen sharing and hardware camera/mic controls.
 */

import * as React from "react";
import {
  CalendarDays,
  CheckSquare,
  MessageSquare,
  FileText,
  Clock,
  Plus,
  Video,
  Check,
  Trash2,
  AlertCircle,
  History,
  X,
  ChevronDown,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AgendaItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  checked: boolean;
}

interface PastMeeting {
  id: string;
  date: string;
  label: string;
}

interface TeamMember {
  id: string;
  name: string;
  roleLabel: string;
  avatar: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "u1", name: "Alex Rivera", roleLabel: "Product Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", initials: "AR" },
  { id: "u4", name: "Jordan Smith", roleLabel: "Software Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", initials: "JS" },
  { id: "u5", name: "Mila Chen", roleLabel: "UX Researcher", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila", initials: "MC" },
  { id: "u6", name: "Oscar Wilde", roleLabel: "Sales Executive", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar", initials: "OW" },
];

export function OneOnOneWorkspace() {
  const { user, effectiveRole } = useAuth();
  const isEmployee = effectiveRole === "employee";

  // Determine target employee database profile context
  const currentTeammateProfile = React.useMemo(() => {
    if (isEmployee && user) {
      const match = TEAM_MEMBERS.find(m => m.id === user.id);
      if (match) return match;
    }
    return TEAM_MEMBERS[0];
  }, [user, isEmployee]);

  const [selectedMember, setSelectedMember] = React.useState<TeamMember>(currentTeammateProfile);
  const [showMemberDropdown, setShowMemberDropdown] = React.useState(false);

  // Sync selectedMember hook when logged-in employee loads
  React.useEffect(() => {
    setSelectedMember(currentTeammateProfile);
  }, [currentTeammateProfile]);

  // Stateful workspace database for isolated direct reports tracking (synced via localStorage)
  const [workspaceDb, setWorkspaceDb] = React.useState<Record<string, {
    agenda: AgendaItem[];
    actionItems: ActionItem[];
    notes: string;
    pastMeetings: PastMeeting[];
  }>>(() => {
    const saved = localStorage.getItem("novapulse_1on1_db");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      u1: {
        agenda: [
          { id: "a1", text: "Review Q2 Goal Progress", checked: false },
          { id: "a2", text: "Discuss design system blockers", checked: false },
          { id: "a3", text: "Feedback on recent Figma prototypes", checked: false },
          { id: "a4", text: "Career growth: Senior Designer track", checked: false },
        ],
        actionItems: [
          { id: "ac1", text: "Follow up with Marketing on brand guidelines", assignee: "Sarah (Manager)", checked: false },
          { id: "ac2", text: "Draft updated component spec", assignee: "Alex", checked: false },
        ],
        notes: "Alex mentioned the design system is currently blocked by the new brand guidelines approval.",
        pastMeetings: [
          { id: "pm1", date: "May 10, 2026", label: "Weekly Sync" },
          { id: "pm2", date: "May 3, 2026", label: "Weekly Sync" },
          { id: "pm3", date: "April 26, 2026", label: "Q1 Review & Q2 Planning" }
        ]
      },
      u4: {
        agenda: [
          { id: "a1", text: "API Response Time Audit", checked: false },
          { id: "a2", text: "Latency bottlenecks in production endpoints", checked: false },
          { id: "a3", text: "Review Q2 security alignment goals status", checked: false },
        ],
        actionItems: [
          { id: "ac1", text: "Run latency benchmark tests on core gateways", assignee: "Jordan", checked: false },
          { id: "ac2", text: "Deploy security patches to sandbox cluster", assignee: "Sarah (Manager)", checked: false },
        ],
        notes: "Jordan reported p95 latency is down to 220ms, targeting sub-200ms optimization by end of week.",
        pastMeetings: [
          { id: "pm1", date: "May 9, 2026", label: "Weekly Sync" },
          { id: "pm2", date: "May 2, 2026", label: "Weekly Sync" }
        ]
      },
      u5: {
        agenda: [
          { id: "a1", text: "UX Research Roadmap Q3 Preview", checked: false },
          { id: "a2", text: "User testing interviews scheduling issues", checked: false },
        ],
        actionItems: [
          { id: "ac1", text: "Schedule 5 more enterprise customer interviews", assignee: "Mila", checked: false },
        ],
        notes: "Mila has completed 8 interviews out of the target 20. Recruiting enterprise tier users has been slow.",
        pastMeetings: [
          { id: "pm1", date: "May 8, 2026", label: "Bi-Weekly Sync" }
        ]
      },
      u6: {
        agenda: [
          { id: "a1", text: "Q2 Enterprise ARR Expansion Targets", checked: false },
          { id: "a2", text: "Sales pipeline & executive demo logs feedback", checked: false },
        ],
        actionItems: [
          { id: "ac1", text: "Finalize corporate SLA contracts for Acme Corp", assignee: "Sarah (Manager)", checked: false },
        ],
        notes: "Oscar is highly confident in closing the $400k expansion deal by next Tuesday.",
        pastMeetings: [
          { id: "pm1", date: "May 7, 2026", label: "Weekly Sync" }
        ]
      }
    };
  });

  // Save to localStorage when database changes
  React.useEffect(() => {
    localStorage.setItem("novapulse_1on1_db", JSON.stringify(workspaceDb));
  }, [workspaceDb]);

  // Sync state in real-time across tabs using StorageEvent listener!
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "novapulse_1on1_db" && e.newValue) {
        try {
          setWorkspaceDb(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Extract variables for current selected user context
  const activeData = workspaceDb[selectedMember.id] || {
    agenda: [],
    actionItems: [],
    notes: "",
    pastMeetings: []
  };

  const setAgenda = (updater: AgendaItem[] | ((prev: AgendaItem[]) => AgendaItem[])) => {
    setWorkspaceDb(prev => {
      const current = prev[selectedMember.id] || { agenda: [], actionItems: [], notes: "", pastMeetings: [] };
      const nextAgenda = typeof updater === 'function' ? updater(current.agenda) : updater;
      return {
        ...prev,
        [selectedMember.id]: { ...current, agenda: nextAgenda }
      };
    });
  };

  const setActionItems = (updater: ActionItem[] | ((prev: ActionItem[]) => ActionItem[])) => {
    setWorkspaceDb(prev => {
      const current = prev[selectedMember.id] || { agenda: [], actionItems: [], notes: "", pastMeetings: [] };
      const nextActions = typeof updater === 'function' ? updater(current.actionItems) : updater;
      return {
        ...prev,
        [selectedMember.id]: { ...current, actionItems: nextActions }
      };
    });
  };

  const setNotes = (newNotes: string) => {
    setWorkspaceDb(prev => {
      const current = prev[selectedMember.id] || { agenda: [], actionItems: [], notes: "", pastMeetings: [] };
      return {
        ...prev,
        [selectedMember.id]: { ...current, notes: newNotes }
      };
    });
  };

  const setPastMeetings = (updater: PastMeeting[] | ((prev: PastMeeting[]) => PastMeeting[])) => {
    setWorkspaceDb(prev => {
      const current = prev[selectedMember.id] || { agenda: [], actionItems: [], notes: "", pastMeetings: [] };
      const nextMeetings = typeof updater === 'function' ? updater(current.pastMeetings) : updater;
      return {
        ...prev,
        [selectedMember.id]: { ...current, pastMeetings: nextMeetings }
      };
    });
  };

  // Inline forms
  const [newAgendaText, setNewAgendaText] = React.useState("");
  const [showAddAgenda, setShowAddAgenda] = React.useState(false);

  const [newActionText, setNewActionText] = React.useState("");
  const [newActionAssignee, setNewActionAssignee] = React.useState<string>("");
  const [showAddAction, setShowAddAction] = React.useState(false);

  // Stateful Live Video Sync Room states
  const [isCallActive, setIsCallActive] = React.useState(false);
  const [isLocalMuted, setIsLocalMuted] = React.useState(false);
  const [isLocalCameraOn, setIsLocalCameraOn] = React.useState(true);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);

  // Sync call active state from storage for real-time manager/employee call lightups!
  React.useEffect(() => {
    const key = `novapulse_call_active_${selectedMember.id}`;
    const saved = localStorage.getItem(key) === "true";
    setIsCallActive(saved);
  }, [selectedMember]);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const key = `novapulse_call_active_${selectedMember.id}`;
      if (e.key === key && e.newValue) {
        setIsCallActive(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedMember]);

  // HTML5 MediaStream hook properties for active local webcam feed
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = React.useState<MediaStream | null>(null);
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

  // Remote participant stream animation helper states
  const [isRemoteMuted] = React.useState(false);
  const [isRemoteCameraOn] = React.useState(true);

  // 1. Capture hardware camera stream via standard MediaDevices getUserMedia API
  React.useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isCallActive) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true })
        .then(stream => {
          activeStream = stream;
          setLocalStream(stream);

          // Apply initial microphone and camera state values
          stream.getVideoTracks().forEach(track => { track.enabled = isLocalCameraOn; });
          stream.getAudioTracks().forEach(track => { track.enabled = !isLocalMuted; });

          // Bind standard camera feed if screen sharing is not active
          if (!isScreenSharing && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Webcam/microphone hardware blocked or unavailable:", err);
          toast.error("Webcam hardware blocked. Restoring standard mock avatars.");
        });
    } else {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCallActive]);

  // 2. Manage dynamic camera track toggles (Mute / Pause webcam)
  React.useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isLocalCameraOn;
      });
    }
  }, [isLocalCameraOn, localStream]);

  // 3. Manage dynamic audio microphone track toggles
  React.useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isLocalMuted;
      });
    }
  }, [isLocalMuted, localStream]);

  // 4. Capture browser display sharing stream via standard getDisplayMedia WebRTC API
  React.useEffect(() => {
    let activeScreenStream: MediaStream | null = null;

    if (isCallActive && isScreenSharing) {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
          activeScreenStream = stream;
          setScreenStream(stream);

          // Render direct shared screen capture inside local video tile!
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Automatically handle when user clicks default browser-provided "Stop sharing" pop-up
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        })
        .catch(err => {
          console.warn("Display capture declined by user:", err);
          setIsScreenSharing(false);
          toast.error("Screen sharing declined.");
        });
    } else {
      // Re-initialize webcam video feed if screen sharing is closed
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
      }
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    }

    return () => {
      if (activeScreenStream) {
        activeScreenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScreenSharing, isCallActive, localStream]);

  // Initialize correct assignee
  React.useEffect(() => {
    setNewActionAssignee(selectedMember.name.split(" ")[0]);
  }, [selectedMember]);

  // ── Handlers ─────────────────────────────────────────────────────
  const toggleAgenda = (id: string) => {
    setAgenda(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaText.trim()) return;
    setAgenda(prev => [...prev, { id: `a-${Date.now()}`, text: newAgendaText.trim(), checked: false }]);
    setNewAgendaText("");
    setShowAddAgenda(false);
    toast.success("Agenda item added!");
  };

  const deleteAgendaItem = (id: string) => {
    setAgenda(prev => prev.filter(item => item.id !== id));
    toast.success("Agenda item removed.");
  };

  const toggleActionItem = (id: string) => {
    setActionItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    setActionItems(prev => [...prev, { id: `ac-${Date.now()}`, text: newActionText.trim(), assignee: newActionAssignee, checked: false }]);
    setNewActionText("");
    setShowAddAction(false);
    toast.success("Action item assigned!");
  };

  const deleteActionItem = (id: string) => {
    setActionItems(prev => prev.filter(item => item.id !== id));
    toast.success("Action item deleted.");
  };

  const handleJoinCall = () => {
    const key = `novapulse_call_active_${selectedMember.id}`;
    if (isCallActive) {
      setIsCallActive(false);
      localStorage.setItem(key, "false");
      toast.info("Call disconnected.");
    } else {
      setIsCallActive(true);
      localStorage.setItem(key, "true");
      const recipientName = isEmployee ? "Sarah Chen" : selectedMember.name;
      toast.success("Connecting to secure video session...", {
        description: `Connected! Video and audio stream active with ${recipientName}.`,
      });
    }
  };

  const handleWrapUp = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    setPastMeetings(prev => [
      { id: `pm-${Date.now()}`, date: today, label: "Weekly Sync" },
      ...prev
    ]);

    toast.success("Meeting wrapped up successfully!", {
      description: `Meeting summary, agenda decisions, and action items archived for ${selectedMember.name}.`,
    });

    setAgenda(prev => prev.map(a => ({ ...a, checked: false })));
  };

  const handlePastMeetingClick = (m: PastMeeting) => {
    toast.loading(`Retrieving archived minutes for ${m.date}...`, { id: 'pm-load' });
    setTimeout(() => {
      toast.success(`Loaded notes & agenda for meeting of ${m.date}!`, { id: 'pm-load' });
    }, 800);
  };

  // Header display details config
  const displayAvatar = isEmployee ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" : selectedMember.avatar;
  const displayInitials = isEmployee ? "SC" : selectedMember.initials;
  const displayTitle = isEmployee ? "Sarah Chen" : selectedMember.name;
  const displayRole = isEmployee ? "Engineering Manager" : selectedMember.roleLabel;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Dynamic Selector Header */}
        <div className="relative">
          <div 
            onClick={() => {
              if (!isEmployee) {
                setShowMemberDropdown(!showMemberDropdown);
              }
            }}
            className={cn(
              "flex items-center gap-4 p-2 rounded-xl border border-transparent select-none transition-all duration-300",
              !isEmployee ? "cursor-pointer hover:bg-white/5 hover:border-white/5 group" : ""
            )}
          >
            <Avatar className="size-12 border-2 border-white/10">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback>{displayInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-immersive-text">
                  1-on-1 with {displayTitle}
                </h2>
                {!isEmployee && (
                  <ChevronDown className="size-4 text-immersive-muted group-hover:text-indigo-400 transition-colors" />
                )}
              </div>
              <p className="text-immersive-muted font-medium text-xs">
                {displayRole} · Next meeting: Today, 2:00 PM
              </p>
            </div>
          </div>

          {!isEmployee && showMemberDropdown && (
            <div className="absolute top-16 left-0 w-64 bg-slate-950 border border-white/10 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[9px] font-black uppercase tracking-wider text-immersive-muted p-2">Select Direct Report</p>
              {TEAM_MEMBERS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMember(m);
                    setShowMemberDropdown(false);
                    setIsCallActive(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-sm font-bold",
                    selectedMember.id === m.id 
                      ? "bg-indigo-600/20 text-indigo-400" 
                      : "text-immersive-text hover:bg-white/5"
                  )}
                >
                  <Avatar className="size-7 border border-white/5">
                    <AvatarImage src={m.avatar} />
                    <AvatarFallback>{m.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{m.name}</span>
                    <span className="text-[9px] text-immersive-muted font-medium">{m.roleLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="outline" 
            className={cn(
              "border-white/10 font-bold transition-all duration-300", 
              isCallActive ? "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30" : "text-immersive-text hover:bg-white/5"
            )}
            onClick={handleJoinCall}
          >
            <Video className="mr-2 size-4 animate-pulse" /> 
            {isCallActive ? "Leave Call" : "Join Call"}
          </Button>
          {!isEmployee && (
            <Button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20"
              onClick={handleWrapUp}
            >
              <CheckSquare className="mr-2 size-4" /> Wrap Up
            </Button>
          )}
        </div>
      </div>

      {/* Stateful WebRTC Video Session Overlay with real captured HTML5 Camera stream */}
      {isCallActive && (
        <Card className="glass-effect border-indigo-500/20 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none" />
          <CardHeader className="border-b border-white/5 py-3 bg-indigo-600/10 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Live Secure Connection</span>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase bg-emerald-500/5">
              1080p WebRTC Active
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Remote Participant stream */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-white/10 overflow-hidden group">
                {isRemoteCameraOn ? (
                  <video 
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80">
                    <Avatar className="size-16 border border-white/10 mx-auto">
                      <AvatarImage src={displayAvatar} />
                      <AvatarFallback>{displayInitials}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-immersive-muted font-bold">Webcam Off</p>
                  </div>
                )}
                {!isRemoteMuted && (
                  <div className="absolute bottom-4 left-4 z-20 flex items-end gap-0.5 h-4">
                    <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-950/70 border border-white/5 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white z-20">
                  {displayTitle} (Remote)
                </span>
              </div>

              {/* Local Participant stream - Capturing client hardware webcam or shared screen stream */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                {isLocalCameraOn || isScreenSharing ? (
                  <video 
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn(
                      "w-full h-full object-cover",
                      !isScreenSharing && "scale-x-[-1]" // Mirrored only for webcam, not screen sharing
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80">
                    <Avatar className="size-16 border border-white/10 mx-auto">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-immersive-muted font-bold mt-2">Your Video Paused</p>
                  </div>
                )}
                
                {!isLocalMuted && (
                  <div className="absolute bottom-4 left-4 z-20 flex items-end gap-0.5 h-4">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-950/70 border border-white/5 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white z-20">
                  {user?.name || "You"} (You)
                </span>
              </div>
            </div>

            {/* Simulated conference control layout */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-white/5">
              <Button 
                variant={isLocalMuted ? "destructive" : "outline"} 
                size="icon" 
                className={cn("size-10 rounded-full transition-all border-white/10", !isLocalMuted ? "text-white hover:bg-white/5" : "")}
                onClick={() => {
                  setIsLocalMuted(!isLocalMuted);
                  toast.info(isLocalMuted ? "Microphone enabled (Hardware Unmuted)." : "Microphone disabled (Hardware Muted).");
                }}
              >
                {isLocalMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </Button>
              <Button 
                variant={!isLocalCameraOn ? "destructive" : "outline"} 
                size="icon" 
                className={cn("size-10 rounded-full transition-all border-white/10", isLocalCameraOn ? "text-white hover:bg-white/5" : "")}
                onClick={() => {
                  setIsLocalCameraOn(!isLocalCameraOn);
                  toast.info(isLocalCameraOn ? "Webcam closed (Hardware Off)." : "Webcam opened (Hardware On).");
                }}
              >
                {!isLocalCameraOn ? <VideoOff className="size-4" /> : <Video className="size-4" />}
              </Button>
              <Button 
                variant={isScreenSharing ? "default" : "outline"} 
                size="icon" 
                className={cn("size-10 rounded-full transition-all border-white/10", isScreenSharing ? "bg-indigo-600 hover:bg-indigo-500" : "text-white hover:bg-white/5")}
                onClick={() => {
                  setIsScreenSharing(!isScreenSharing);
                  toast.success(isScreenSharing ? "Terminating active screen sharing session..." : "Activating standard system screen capture...");
                }}
              >
                <Monitor className="size-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="rounded-full px-5 font-bold shadow-lg shadow-rose-500/20"
                onClick={() => {
                  setIsCallActive(false);
                  toast.info("1-on-1 video call closed.");
                }}
              >
                <PhoneOff className="mr-2 size-3.5" /> End Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect border-white/5 shadow-2xl">
            <CardHeader className="border-b border-white/5 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                  <FileText className="size-4 text-indigo-400" />
                  Meeting Agenda
                </CardTitle>
                {!showAddAgenda && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-[10px] text-indigo-400 font-black"
                    onClick={() => setShowAddAgenda(true)}
                  >
                    <Plus className="size-3 mr-1" /> Add Item
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {showAddAgenda && (
                <form onSubmit={handleAddAgenda} className="flex gap-2 mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Input 
                    type="text" 
                    placeholder="Enter agenda topic..."
                    value={newAgendaText}
                    onChange={(e) => setNewAgendaText(e.target.value)}
                    className="bg-slate-900 border-white/10 text-white placeholder:text-immersive-muted/50 h-9"
                    autoFocus
                  />
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 h-9 font-bold text-white px-4">
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-rose-400 hover:bg-rose-500/10"
                    onClick={() => { setShowAddAgenda(false); setNewAgendaText(""); }}
                  >
                    <X className="size-4" />
                  </Button>
                </form>
              )}

              {activeData.agenda.length === 0 ? (
                <p className="text-xs text-immersive-muted py-4 font-bold text-center">Agenda is currently empty. Add topics to discuss!</p>
              ) : (
                activeData.agenda.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all duration-300 group",
                      item.checked 
                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleAgenda(item.id)}>
                      <div className={cn(
                        "size-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200",
                        item.checked 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-white/20 hover:border-white/40"
                      )}>
                        {item.checked && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <p className={cn(
                        "text-sm font-semibold transition-all duration-300",
                        item.checked ? "text-emerald-400/80 line-through" : "text-immersive-text"
                      )}>
                        {item.text}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                      onClick={() => deleteAgendaItem(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/5 shadow-2xl">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                <MessageSquare className="size-4 text-indigo-400" />
                Shared Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <textarea 
                className="w-full h-40 bg-transparent border-none resize-none p-4 text-sm text-immersive-text placeholder:text-immersive-muted/50 focus:ring-0 focus:outline-none leading-relaxed"
                placeholder={isEmployee ? `Start typing meeting notes here to sync with Sarah...` : `Start typing shared meeting notes with ${selectedMember.name}. Both of you can see this...`}
                value={activeData.notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect border-white/5 shadow-2xl">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                <CheckSquare className="size-4 text-emerald-400" />
                Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {showAddAction && (
                <form onSubmit={handleAddAction} className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/10 mb-2">
                  <Input 
                    type="text" 
                    placeholder="Enter action task..."
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="bg-slate-900 border-white/10 text-white placeholder:text-immersive-muted/50 h-9"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase text-immersive-muted">Assignee:</span>
                    <div className="flex gap-1.5">
                      <Button 
                        type="button" 
                        size="sm"
                        variant={newActionAssignee === selectedMember.name.split(" ")[0] ? 'default' : 'outline'}
                        className={cn("h-7 px-2.5 text-[9px] font-black uppercase tracking-wider", newActionAssignee === selectedMember.name.split(" ")[0] ? "bg-indigo-600 text-white" : "border-white/10 text-immersive-muted")}
                        onClick={() => setNewActionAssignee(selectedMember.name.split(" ")[0])}
                      >
                        {selectedMember.name.split(" ")[0]}
                      </Button>
                      <Button 
                        type="button" 
                        size="sm"
                        variant={newActionAssignee === 'Sarah (Manager)' ? 'default' : 'outline'}
                        className={cn("h-7 px-2.5 text-[9px] font-black uppercase tracking-wider", newActionAssignee === 'Sarah (Manager)' ? "bg-indigo-600 text-white" : "border-white/10 text-immersive-muted")}
                        onClick={() => setNewActionAssignee('Sarah (Manager)')}
                      >
                        Sarah
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 h-8 font-bold text-white flex-1 text-xs">
                      Assign
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-rose-400 hover:bg-rose-500/10 text-xs px-3"
                      onClick={() => { setShowAddAction(false); setNewActionText(""); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {activeData.actionItems.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-start justify-between gap-3 p-2 rounded-md transition-all duration-300 group",
                    item.checked ? "bg-emerald-500/5 opacity-60" : ""
                  )}
                >
                  <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={() => toggleActionItem(item.id)}>
                    <div className={cn(
                      "mt-1 size-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all duration-200",
                      item.checked 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-emerald-500/50 hover:border-emerald-500"
                    )}>
                      {item.checked && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-semibold leading-snug",
                        item.checked ? "text-emerald-400/80 line-through" : "text-immersive-text"
                      )}>
                        {item.text}
                      </p>
                      <p className="text-[9px] text-immersive-muted mt-0.5 font-bold uppercase tracking-wider">
                        {item.assignee}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-7 text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 flex-shrink-0"
                    onClick={() => deleteActionItem(item.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}

              {!showAddAction && (
                <Button 
                  variant="ghost" 
                  className="w-full text-[10px] font-black uppercase text-indigo-400 mt-2 h-8 hover:bg-indigo-500/5 hover:text-indigo-300"
                  onClick={() => setShowAddAction(true)}
                >
                  <Plus className="mr-2 size-3" /> Add Action Item
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/5 shadow-2xl">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                <History className="size-4 text-indigo-400" />
                Past Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {activeData.pastMeetings.map((m) => (
                <div 
                  key={m.id} 
                  className="flex items-center justify-between cursor-pointer group hover:bg-white/[0.02] p-1.5 rounded-lg transition-all"
                  onClick={() => handlePastMeetingClick(m)}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3 text-immersive-muted group-hover:text-indigo-400 transition-colors" />
                    <span className="text-xs font-bold text-immersive-text group-hover:text-indigo-400 transition-colors">{m.date}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-white/10 text-immersive-muted group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all">{m.label}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
