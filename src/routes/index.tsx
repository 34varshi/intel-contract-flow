import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  Hexagon,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Loader2,
  LockKeyhole,
  Menu,
  MessageCircle,
  Paperclip,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkle,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ContractLens — AI Contract Intelligence" },
      {
        name: "description",
        content:
          "Understand contracts, detect risks, and track obligations with the ContractLens AI agent.",
      },
      {
        property: "og:title",
        content: "ContractLens — AI Contract Intelligence",
      },
      {
        property: "og:description",
        content:
          "An AI agent for business contract review, risk detection, and obligation tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContractLens,
});

type WorkflowStatus = "complete" | "active" | "pending";

type WorkflowStep = {
  label: string;
  detail: string;
  icon: typeof Upload;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const workflowSteps: WorkflowStep[] = [
  { label: "Upload", detail: "Contract uploaded", icon: Upload },
  { label: "Analysis", detail: "Document analyzed", icon: FileCheck2 },
  { label: "Clauses", detail: "Important clauses identified", icon: FileText },
  { label: "Risk", detail: "Risks detected", icon: ShieldAlert },
  { label: "Obligations", detail: "Obligations extracted", icon: ListChecks },
  { label: "Deadlines", detail: "Deadlines identified", icon: CalendarDays },
  { label: "Summary", detail: "Final analysis completed", icon: Sparkle },
];

const clauses = [
  ["Payment terms", "Monthly invoicing; Net 30 payment window. 1.5% monthly interest applies to late balances.", "Finance"],
  ["Termination", "Either party may terminate with 60 days written notice. Immediate termination applies for uncured material breach.", "Clause 9.2"],
  ["Renewal", "The agreement renews automatically for 12-month periods unless notice is delivered 30 days before expiry.", "Clause 3.4"],
  ["Confidentiality", "Confidential information must be protected during the term and for three years after termination.", "Clause 8"],
  ["Liability", "Fees are not capped for data breach damages, creating a material exposure for the service recipient.", "Clause 11"],
  ["Service obligations", "XYZ provides monthly reporting, uptime monitoring, and a quarterly security review.", "Schedule A"],
  ["Penalties", "Late payment interest is set at 1.5% per month on overdue balances.", "Clause 5.3"],
  ["Governing law", "The agreement is governed by the laws of Delaware, USA.", "Clause 14"],
];

const risks = [
  {
    level: "HIGH",
    title: "Automatic renewal trap",
    body: "Renews unless notice is provided 30 days before expiry.",
    action: "Set a reminder 45 days before expiration.",
    tone: "risk-high",
  },
  {
    level: "HIGH",
    title: "Uncapped data-breach liability",
    body: "No monetary cap is stated for security incident damages.",
    action: "Negotiate a cap at 12 months of fees.",
    tone: "risk-high",
  },
  {
    level: "MEDIUM",
    title: "Above-market late interest",
    body: "Overdue balances accrue interest at 1.5% per month.",
    action: "Request a reduction to 0.8% per month.",
    tone: "risk-medium",
  },
  {
    level: "LOW",
    title: "Standard confidentiality survival",
    body: "Three-year survival period is within a typical commercial range.",
    action: "Monitor; no immediate change required.",
    tone: "risk-low",
  },
];

const obligations = [
  ["Submit monthly service report", "Client", "15 Nov 2026", "Pending", "High"],
  ["Issue renewal or termination notice", "ABC Tech", "30 Jan 2027", "Scheduled", "High"],
  ["Quarterly invoice reconciliation", "XYZ Services", "05 Dec 2026", "On track", "Medium"],
  ["Complete data-security audit", "XYZ Services", "20 Dec 2026", "Pending", "Medium"],
];

const dates = [
  ["01 Mar 2026", "Contract effective", "start"],
  ["15 Nov 2026", "Monthly service report", "deadline"],
  ["05 Dec 2026", "Quarterly invoice reconciliation", "payment"],
  ["20 Dec 2026", "Data-security audit", "review"],
  ["30 Jan 2027", "Renewal notice deadline", "alert"],
  ["28 Feb 2027", "Contract expiration", "end"],
];

const navItems = [
  ["Dashboard", LayoutDashboard],
  ["Contracts", FileText],
  ["Obligations", ListChecks],
  ["Risks", ShieldAlert],
  ["Important Dates", CalendarDays],
  ["AI Assistant", MessageCircle],
  ["Reports", ClipboardCheck],
] as const;

const answerFor = (question: string) => {
  const normalized = question.toLowerCase();
  if (normalized.includes("expire") || normalized.includes("expiration")) {
    return "The agreement expires on **28 February 2027**. It renews automatically for another 12 months unless either party gives notice by **30 January 2027**.";
  }
  if (normalized.includes("payment") || normalized.includes("invoice")) {
    return "ABC pays monthly under **Net 30** terms. Late balances accrue **1.5% interest per month**. XYZ handles quarterly invoice reconciliation by 5 December 2026.";
  }
  if (normalized.includes("renew")) {
    return "Yes. The agreement auto-renews for 12-month periods. Notice must be delivered at least **30 days before expiry**. I recommend setting a reminder for 45 days out.";
  }
  if (normalized.includes("obligation") || normalized.includes("client")) {
    return "The client must submit a monthly service report, pay invoices within Net 30, complete quarterly reconciliation, and issue a renewal or termination notice by 30 January 2027.";
  }
  if (normalized.includes("risk")) {
    return "I found **2 high risks**: the automatic renewal window and uncapped data-breach liability. I also flagged above-market late interest as medium risk.";
  }
  return "The contract is a one-year services agreement between ABC Technologies and XYZ Services, valued at $240,000 annually. I can answer questions about its clauses, risks, obligations, or deadlines.";
};

function ContractLens() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [workflowIndex, setWorkflowIndex] = useState(workflowSteps.length);
  const [selectedFile, setSelectedFile] = useState("ABC Technologies — XYZ Services Agreement");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showRisksOnly, setShowRisksOnly] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "I’ve finished the first pass. Ask me about terms, risks, obligations, or important dates in this agreement.",
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const workflowStatus = useMemo(() => {
    return workflowSteps.map((_, index) => {
      if (index < workflowIndex) return "complete" as WorkflowStatus;
      if (index === workflowIndex && isAnalyzing) return "active" as WorkflowStatus;
      return "pending" as WorkflowStatus;
    });
  }, [workflowIndex, isAnalyzing]);

  const startAnalysis = (fileName?: string) => {
    if (fileName) setSelectedFile(fileName.replace(/\.(pdf|docx)$/i, ""));
    setIsAnalyzing(true);
    setWorkflowIndex(0);
    setShowUpload(false);
  };

  useEffect(() => {
    if (!isAnalyzing) return;
    if (workflowIndex >= workflowSteps.length) {
      setIsAnalyzing(false);
      return;
    }
    const timer = window.setTimeout(() => setWorkflowIndex((current) => current + 1), 680);
    return () => window.clearTimeout(timer);
  }, [isAnalyzing, workflowIndex]);

  const askQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setChatMessages((messages) => [
      ...messages,
      { id: `${Date.now()}-user`, role: "user", text: trimmed },
      { id: `${Date.now()}-assistant`, role: "assistant", text: answerFor(trimmed) },
    ]);
    setChatInput("");
  };

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askQuestion(chatInput);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const extension = file.name.toLowerCase().split(".").pop();
    if (extension !== "pdf" && extension !== "docx") return;
    startAnalysis(file.name);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[248px] shrink-0 -translate-x-full flex-col bg-ink p-5 text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
            mobileNavOpen && "translate-x-0",
          )}
        >
          <div className="mb-8 flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-brand/80 text-sm font-semibold text-primary-foreground ring-1 ring-primary-foreground/15">
              CL
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-sidebar-foreground">ContractLens</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/45">AI Agent</p>
            </div>
            <Button
              aria-label="Close navigation"
              className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
              onClick={() => setMobileNavOpen(false)}
              size="icon"
              variant="ghost"
            >
              <X />
            </Button>
          </div>
          <nav className="space-y-1 text-sm" aria-label="Main navigation">
            {navItems.map(([label, Icon]) => (
              <Button
                className={cn(
                  "w-full justify-start gap-2.5 text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  activeNav === label && "bg-sidebar-accent text-sidebar-foreground shadow-none",
                )}
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setMobileNavOpen(false);
                }}
                variant="ghost"
              >
                <Icon className="size-4" />
                {label}
                {label === "Risks" && <span className="ml-auto size-1.5 rounded-full bg-risk-high" />}
              </Button>
            ))}
          </nav>
          <div className="mt-auto rounded-xl bg-sidebar-accent p-3 ring-1 ring-sidebar-border">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/45">Demo mode</p>
            <p className="text-xs leading-relaxed text-sidebar-foreground/70">Sample contract loaded for review. Upload a PDF or DOCX to replay the agent workflow.</p>
          </div>
        </aside>

        {mobileNavOpen && (
          <Button
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-30 h-full w-full rounded-none bg-ink/30 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            variant="ghost"
          />
        )}

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-workspace-glow" />
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border/60 bg-background/65 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button aria-label="Open navigation" className="lg:hidden" onClick={() => setMobileNavOpen(true)} size="icon" variant="ghost">
                <Menu />
              </Button>
              <Badge className="hidden border-brand/20 bg-brand/10 text-brand sm:inline-flex" variant="outline">
                <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-brand" />
                Sample / Demo Data
              </Badge>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold sm:text-base">{selectedFile}</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">Understand contracts. Detect risks. Track obligations.</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Button aria-label="Search" className="hidden text-muted-foreground sm:inline-flex" size="icon" variant="ghost"><Search /></Button>
              <Button aria-label="Notifications" className="text-muted-foreground" size="icon" variant="ghost"><Bell /></Button>
              <Button className="hidden gap-2 sm:inline-flex" onClick={() => setShowUpload(true)} size="sm" variant="default"><Upload /> Analyze Contract</Button>
              <div className="grid size-8 place-items-center rounded-full bg-ink text-xs font-medium text-primary-foreground ring-1 ring-border">RM</div>
            </div>
          </header>

          <main className="relative max-h-[calc(100vh-4rem)] overflow-y-auto px-4 pb-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1480px]">
              <section className="mt-3 rounded-2xl border border-border/70 bg-card/65 p-4 shadow-soft backdrop-blur-xl" aria-label="Agent workflow">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Agent workflow</p>
                  <p className="text-xs text-muted-foreground">{isAnalyzing ? `${Math.min(workflowIndex + 1, workflowSteps.length)} of ${workflowSteps.length} active` : `${workflowSteps.length} of ${workflowSteps.length} complete`}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-start lg:gap-2">
                  {workflowSteps.map((step, index) => {
                    const Icon = step.icon;
                    const status = workflowStatus[index];
                    return (
                      <div className="flex min-w-0 flex-1 items-center gap-2 lg:contents" key={step.label}>
                        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-col lg:gap-1.5">
                          <div className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs transition-all", status === "complete" && "bg-brand text-primary-foreground", status === "active" && "bg-accent text-accent-foreground ring-4 ring-accent/15", status === "pending" && "bg-muted text-muted-foreground")}>
                            {status === "complete" ? <Check className="size-3.5" /> : status === "active" ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
                          </div>
                          <span className={cn("truncate text-[10px] text-muted-foreground", status === "active" && "font-medium text-accent")}>{step.label}</span>
                        </div>
                        {index < workflowSteps.length - 1 && <div className={cn("hidden h-0.5 flex-1 lg:block", index < workflowIndex ? "bg-brand/45" : "bg-border")} />}
                      </div>
                    );
                  })}
                </div>
                {isAnalyzing && <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand/5 px-3 py-2 text-xs text-brand"><Loader2 className="size-3.5 animate-spin" /> <Shimmer>{workflowSteps[Math.min(workflowIndex, workflowSteps.length - 1)]?.detail ?? "Finishing analysis"}…</Shimmer></div>}
              </section>

              <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Analysis statistics">
                <StatCard label="Clauses found" value="18" helper="Across 14 sections" icon={FileText} />
                <StatCard label="Obligations" value="9" helper="4 require attention" icon={ListChecks} />
                <StatCard label="Risks detected" value="4" helper="2 high · 1 medium · 1 low" icon={ShieldAlert} tone="accent" />
                <StatCard label="Confidence" value="97%" helper="Evidence-linked analysis" icon={Gauge} />
              </section>

              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div className="space-y-5 xl:col-span-8">
                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
                    <SectionHeading eyebrow="Contract overview" title="The agreement at a glance" action={<Badge className="border-brand/20 bg-brand/10 text-brand" variant="outline">Active</Badge>} />
                    <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
                      <OverviewRow label="Contract type" value="Services Agreement" />
                      <OverviewRow label="Parties" value="ABC Technologies · XYZ Services" />
                      <OverviewRow label="Effective date" value="01 Mar 2026" mono />
                      <OverviewRow label="Expiration date" value="28 Feb 2027" mono />
                      <OverviewRow label="Annual value" value="$240,000" />
                      <OverviewRow label="Renewal terms" value="Auto-renew · 30-day notice" tone="accent" />
                      <OverviewRow label="Payment terms" value="Monthly · Net 30" />
                      <OverviewRow label="Governing law" value="Delaware, USA" />
                    </div>
                  </Card>

                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
                    <SectionHeading eyebrow="Key clauses" title="What the agent found" action={<Button className="gap-1.5 text-xs" size="sm" variant="ghost">View all <ChevronRight /></Button>} />
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {clauses.map(([title, description, source]) => <ClauseCard description={description} key={title} source={source} title={title} />)}
                    </div>
                  </Card>

                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
                    <SectionHeading eyebrow="Risk detection" title="Prioritized for action" action={<Button className="gap-1.5 text-xs" onClick={() => setShowRisksOnly((value) => !value)} size="sm" variant="ghost">{showRisksOnly ? "Show all" : "Focus high risk"} <ShieldAlert /></Button>} />
                    <div className="mt-4 space-y-3">
                      {risks.filter((risk) => !showRisksOnly || risk.level === "HIGH").map((risk) => <RiskCard key={risk.title} {...risk} />)}
                    </div>
                  </Card>

                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
                    <SectionHeading eyebrow="Obligations & deadlines" title="Keep the agreement moving" action={<Button className="gap-1.5 text-xs" onClick={() => setActiveNav("Obligations")} size="sm" variant="ghost">Open tracker <ChevronRight /></Button>} />
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[650px] text-left text-xs">
                        <thead><tr className="border-b border-border text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="pb-3 pr-4 font-medium">Obligation</th><th className="pb-3 pr-4 font-medium">Responsible</th><th className="pb-3 pr-4 font-medium">Due date</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 font-medium">Priority</th></tr></thead>
                        <tbody className="divide-y divide-border/70">{obligations.map(([obligation, party, due, status, priority]) => <tr className="transition-colors hover:bg-muted/35" key={obligation}><td className="py-3 pr-4 font-medium text-foreground">{obligation}</td><td className="py-3 pr-4 text-muted-foreground">{party}</td><td className="py-3 pr-4 font-mono text-[11px] text-muted-foreground">{due}</td><td className="py-3 pr-4"><span className={cn("font-medium", status === "Pending" ? "text-risk-medium" : status === "Scheduled" ? "text-accent" : "text-success")}>{status}</span></td><td className={cn("py-3 font-medium", priority === "High" ? "text-risk-high" : "text-risk-medium")}>{priority}</td></tr>)}</tbody>
                      </table>
                    </div>
                  </Card>

                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
                    <SectionHeading eyebrow="Important dates" title="A timeline the team can act on" action={<Button className="gap-1.5 text-xs" onClick={() => setActiveNav("Important Dates")} size="sm" variant="ghost">Open calendar <ChevronRight /></Button>} />
                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                      {dates.map(([date, label, tone], index) => <div className="relative flex gap-3" key={date}>{index < dates.length - 1 && <div className="absolute left-[7px] top-5 hidden h-[calc(100%+1.5rem)] w-px bg-border sm:block" />}<div className={cn("relative z-10 mt-1 size-3 shrink-0 rounded-full ring-4", tone === "alert" || tone === "end" ? "bg-risk-high ring-risk-high/10" : tone === "deadline" ? "bg-risk-medium ring-risk-medium/10" : "bg-brand ring-brand/10")} /><div><p className="font-mono text-[11px] text-muted-foreground">{date}</p><p className="mt-1 text-xs font-medium">{label}</p></div></div>)}
                    </div>
                  </Card>
                </div>

                <div className="space-y-5 xl:col-span-4">
                  <Card className="flex min-h-[480px] flex-col border-ink bg-ink p-5 text-ink-foreground shadow-deep sm:p-6 xl:sticky xl:top-20">
                    <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="size-2 animate-pulse rounded-full bg-accent" /><h2 className="text-sm font-semibold text-primary-foreground">Ask ContractLens</h2></div><p className="mt-1 text-xs text-ink-foreground/55">Grounded answers from this contract.</p></div><Button aria-label="Chat help" className="text-ink-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground" size="icon" variant="ghost"><CircleHelp /></Button></div>
                    <Conversation className="mt-4 min-h-0 flex-1"><ConversationContent className="gap-4 p-0">{chatMessages.map((message) => <Message from={message.role} key={message.id}><MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : "text-ink-foreground/80"}><MessageResponse>{message.text}</MessageResponse></MessageContent></Message>)}{isAnalyzing && <Message from="assistant"><MessageContent className="text-ink-foreground/55"><Shimmer>Reviewing the evidence…</Shimmer></MessageContent></Message>}</ConversationContent><ConversationScrollButton className="bg-ink text-primary-foreground" /></Conversation>
                    <div className="mt-4 flex flex-wrap gap-1.5"><Suggestion text="What are the payment terms?" onClick={askQuestion} /><Suggestion text="Any automatic renewal clauses?" onClick={askQuestion} /><Suggestion text="What are the major risks?" onClick={askQuestion} /></div>
                    <PromptInput className="mt-3 border-ink-foreground/15 bg-primary-foreground/5 text-primary-foreground" onSubmit={handleChatSubmit}><PromptInputTextarea className="min-h-12 text-xs text-primary-foreground placeholder:text-ink-foreground/40" onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about this contract…" value={chatInput} /><PromptInputFooter className="justify-end border-0"><PromptInputSubmit className="bg-accent text-accent-foreground hover:bg-accent/90" /></PromptInputFooter></PromptInput>
                  </Card>

                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
                    <SectionHeading eyebrow="AI actions" title="Turn insight into action" />
                    <div className="mt-4 grid gap-2"><Button className="justify-start gap-2" onClick={() => setShowReminder(true)} variant="default"><Clock3 /> Create deadline reminder <ChevronRight className="ml-auto" /></Button><Button className="justify-start gap-2" onClick={() => setShowRisksOnly(true)} variant="outline"><ShieldAlert /> Show high-risk clauses <ChevronRight className="ml-auto" /></Button><Button className="justify-start gap-2" onClick={() => setShowSummary(true)} variant="outline"><PenLine /> Generate executive summary <ChevronRight className="ml-auto" /></Button><Button className="justify-start gap-2" onClick={() => askQuestion("Explain the liability clause in simple language.")} variant="outline"><Lightbulb /> Explain this clause <ChevronRight className="ml-auto" /></Button></div>
                  </Card>

                  <Card className="border-border/60 bg-card/65 p-5 shadow-soft backdrop-blur-xl sm:p-6"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand"><LockKeyhole className="size-4" /></div><div><p className="text-sm font-semibold">Evidence-linked review</p><p className="mt-0.5 text-xs text-muted-foreground">Every insight is tied back to a clause or deadline.</p></div></div><div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs"><span className="text-muted-foreground">Analysis confidence</span><span className="font-semibold text-success">97%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[97%] rounded-full bg-success" /></div></Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showUpload && <Modal onClose={() => setShowUpload(false)} title="Upload a business contract"><div className="space-y-4"><button className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-brand/35 bg-brand/5 px-5 py-10 text-center transition-colors hover:bg-brand/10" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files[0]); }} type="button"><div className="mb-3 grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand transition-transform group-hover:-translate-y-0.5"><Upload /></div><p className="text-sm font-semibold">Drop your PDF or DOCX here</p><p className="mt-1 text-xs text-muted-foreground">or click to browse from your device</p><span className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">PDF · DOCX · up to 20 MB</span></button><input accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} ref={fileInputRef} type="file" /><div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs"><span className="text-muted-foreground">Need a quick demo?</span><Button className="h-7 text-xs" onClick={() => startAnalysis("ABC Technologies — XYZ Services Agreement")} size="sm" variant="ghost">Load sample</Button></div></div></Modal>}
      {showSummary && <Modal onClose={() => setShowSummary(false)} title="Executive summary"><div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><p><strong className="text-foreground">Purpose.</strong> ABC Technologies has engaged XYZ Services for ongoing technology operations, monitoring, and reporting.</p><p><strong className="text-foreground">Commercial terms.</strong> The one-year agreement runs from 1 March 2026 through 28 February 2027 at $240,000 annually, billed monthly on Net 30 terms.</p><p><strong className="text-foreground">Key obligations.</strong> The client must submit monthly reports and manage payments. XYZ must provide service reporting, monitoring, and a quarterly security review.</p><p><strong className="text-foreground">Major risks.</strong> Automatic renewal requires notice 30 days before expiry, and data-breach liability is uncapped. Late-payment interest is also above a typical benchmark.</p><div className="rounded-lg bg-brand/5 p-3 text-xs text-brand"><strong>Recommended next step:</strong> schedule a renewal decision 45 days before expiry and negotiate a liability cap before signing the next term.</div></div></Modal>}
      {showReminder && <Modal onClose={() => setShowReminder(false)} title="Deadline reminder created"><div className="space-y-4"><div className="flex items-center gap-3 rounded-xl bg-success/10 p-4 text-success"><div className="grid size-9 place-items-center rounded-full bg-success/15"><Check className="size-4" /></div><div><p className="text-sm font-semibold">Reminder scheduled</p><p className="text-xs">Renewal notice deadline · 30 Jan 2027</p></div></div><p className="text-sm leading-relaxed text-muted-foreground">ContractLens will surface a reminder 45 days before the renewal notice deadline so the team has time to review the next term.</p><Button className="w-full" onClick={() => setShowReminder(false)}>Done</Button></div></Modal>}
    </div>
  );
}

function StatCard({ label, value, helper, icon: Icon, tone }: { label: string; value: string; helper: string; icon: typeof FileText; tone?: "accent" }) {
  return <Card className="border-border/60 bg-card/65 p-4 shadow-soft backdrop-blur-xl"><div className="flex items-start justify-between gap-2"><div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className={cn("mt-1 text-2xl font-semibold", tone === "accent" && "text-accent")}>{value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{helper}</p></div><Icon className={cn("size-4 text-muted-foreground", tone === "accent" && "text-accent")} /></div></Card>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p><h2 className="mt-1 text-base font-semibold">{title}</h2></div>{action}</div>;
}

function OverviewRow({ label, value, mono, tone }: { label: string; value: string; mono?: boolean; tone?: "accent" }) {
  return <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-2"><span className="text-muted-foreground">{label}</span><span className={cn("text-right font-medium", mono && "font-mono text-[11px]", tone === "accent" && "text-accent")}>{value}</span></div>;
}

function ClauseCard({ title, description, source }: { title: string; description: string; source: string }) {
  return <div className="rounded-xl border border-border/70 bg-background/35 p-3 transition-colors hover:border-brand/30 hover:bg-brand/5"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold">{title}</p><span className="font-mono text-[10px] text-muted-foreground">{source}</span></div><p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{description}</p></div>;
}

function RiskCard({ level, title, body, action, tone }: { level: string; title: string; body: string; action: string; tone: string }) {
  return <div className={cn("rounded-xl border p-4", tone === "risk-high" && "border-risk-high/25 bg-risk-high/5", tone === "risk-medium" && "border-risk-medium/25 bg-risk-medium/5", tone === "risk-low" && "border-success/25 bg-success/5")}><div className="flex flex-wrap items-center gap-2"><Badge className={cn("border-0 text-[10px] uppercase tracking-[0.14em]", tone === "risk-high" && "bg-risk-high text-risk-high-foreground", tone === "risk-medium" && "bg-risk-medium text-risk-medium-foreground", tone === "risk-low" && "bg-success text-success-foreground")} variant="outline">{level}</Badge><p className="text-sm font-medium">{title}</p></div><p className="mt-1.5 text-xs text-muted-foreground">{body}</p><p className={cn("mt-1.5 text-xs font-medium", tone === "risk-high" ? "text-risk-high" : tone === "risk-medium" ? "text-risk-medium" : "text-success")}>Recommended: {action}</p></div>;
}

function Suggestion({ text, onClick }: { text: string; onClick: (text: string) => void }) {
  return <Button className="h-auto rounded-full border-ink-foreground/15 bg-primary-foreground/5 px-2.5 py-1.5 text-[10px] text-ink-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => onClick(text)} size="sm" variant="outline">{text}</Button>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-deep sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-base font-semibold">{title}</h2><Button aria-label="Close dialog" onClick={onClose} size="icon" variant="ghost"><X /></Button></div><div className="mt-5">{children}</div></div></div>;
}