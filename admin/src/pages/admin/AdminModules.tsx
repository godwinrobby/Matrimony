import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, MessageSquare, Send, Check, X, Eye, Star, Shield, TrendingUp, IndianRupee, BarChart3, Settings as SettingsIcon } from "lucide-react";

// --- Interests Management ---
export const InterestsPage = () => {
  const interests = [
    { id: "I001", from: "Rahul Gupta", to: "Priya Sharma", status: "pending", time: "2 hrs ago" },
    { id: "I002", from: "Amit Verma", to: "Anjali Patel", status: "accepted", time: "5 hrs ago" },
    { id: "I003", from: "Karan Malhotra", to: "Kavya Reddy", status: "pending", time: "1 day ago" },
    { id: "I004", from: "Vikram Singh", to: "Sneha Gupta", status: "declined", time: "2 days ago" },
    { id: "I005", from: "Rohan Iyer", to: "Meera Joshi", status: "accepted", time: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Interest Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and moderate interests exchanged between members.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Interests", value: "12,847", icon: Heart },
          { label: "Pending", value: "234", icon: Heart },
          { label: "Accepted Today", value: "89", icon: Check },
          { label: "Success Rate", value: "34%", icon: TrendingUp },
        ].map((s) => (
          <Card key={s.label} className="shadow-soft">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
              <s.icon className="h-8 w-8 text-primary opacity-70" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-soft">
        <CardHeader><CardTitle>Recent Interests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interests.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell>{i.from}</TableCell>
                  <TableCell>{i.to}</TableCell>
                  <TableCell>
                    <Badge variant={i.status === "accepted" ? "default" : i.status === "declined" ? "destructive" : "secondary"}>
                      {i.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{i.time}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Messages ---
export const MessagesPage = () => {
  const threads = [
    { id: 1, name: "Priya Sharma", last: "Namaste, thank you for your interest 🙏", time: "2m", unread: 3 },
    { id: 2, name: "Anjali Patel", last: "Can we schedule a call this weekend?", time: "1h", unread: 0 },
    { id: 3, name: "Kavya Reddy", last: "My parents would like to talk with yours.", time: "3h", unread: 1 },
    { id: 4, name: "Meera Joshi", last: "Thank you, I'll get back to you soon.", time: "1d", unread: 0 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Messages</h1>
        <p className="text-muted-foreground mt-1">Monitor member conversations and flagged content.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader><CardTitle>Conversations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {threads.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                <Avatar><AvatarFallback className="bg-gradient-soft text-primary">{t.name.charAt(0)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm truncate">{t.name}</p>
                    <span className="text-xs text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.last}</p>
                </div>
                {t.unread > 0 && <Badge className="bg-primary">{t.unread}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar><AvatarFallback className="bg-gradient-soft text-primary">P</AvatarFallback></Avatar>
            <div>
              <CardTitle className="text-base">Priya Sharma</CardTitle>
              <p className="text-xs text-muted-foreground">Online now</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 max-h-96 overflow-auto p-2">
              <div className="flex justify-start"><div className="bg-muted rounded-lg p-3 text-sm max-w-xs">Namaste! I saw your profile and would love to know more.</div></div>
              <div className="flex justify-end"><div className="bg-gradient-romantic text-primary-foreground rounded-lg p-3 text-sm max-w-xs">Namaste 🙏 Thank you for reaching out.</div></div>
              <div className="flex justify-start"><div className="bg-muted rounded-lg p-3 text-sm max-w-xs">Would you like to connect our families over a call?</div></div>
            </div>
            <div className="flex gap-2 border-t pt-3">
              <Input placeholder="Type a message..." />
              <Button variant="romantic"><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Verification Queue ---
export const VerificationPage = () => {
  const items = [
    { id: "V001", name: "Priya Sharma", type: "Photo", docs: 3, submitted: "2 hrs ago" },
    { id: "V002", name: "Rahul Gupta", type: "Aadhaar ID", docs: 1, submitted: "5 hrs ago" },
    { id: "V003", name: "Anjali Patel", type: "Horoscope", docs: 2, submitted: "1 day ago" },
    { id: "V004", name: "Kavya Reddy", type: "Income Proof", docs: 1, submitted: "2 days ago" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Profile Verification</h1>
        <p className="text-muted-foreground mt-1">Review and approve identity, photo, and horoscope verifications.</p>
      </div>
      <Card className="shadow-soft">
        <CardHeader><CardTitle>Pending Verifications (23)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-xs">{v.id}</TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell><Badge variant="outline">{v.type}</Badge></TableCell>
                  <TableCell>{v.docs} file(s)</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.submitted}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="success" size="sm"><Check className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm"><X className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Success Stories ---
export const SuccessStoriesPage = () => {
  const stories = [
    { couple: "Anjali & Rohit", location: "Mumbai", married: "Jan 2026", status: "published" },
    { couple: "Priya & Karan", location: "Delhi", married: "Dec 2025", status: "pending" },
    { couple: "Meera & Arjun", location: "Pune", married: "Nov 2025", status: "published" },
    { couple: "Divya & Suresh", location: "Chennai", married: "Oct 2025", status: "published" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Success Stories</h1>
          <p className="text-muted-foreground mt-1">Approve and showcase married couples on the platform.</p>
        </div>
        <Button variant="romantic">Add Story</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((s) => (
          <Card key={s.couple} className="shadow-soft hover:shadow-romantic transition-shadow">
            <div className="h-40 bg-gradient-sunset flex items-center justify-center">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{s.couple}</h3>
                  <p className="text-xs text-muted-foreground">{s.location} • Married {s.married}</p>
                </div>
                <Badge variant={s.status === "published" ? "default" : "secondary"}>{s.status}</Badge>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="soft" size="sm" className="flex-1">View</Button>
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Reports & Analytics ---
export const ReportsPage = () => {
  const kpis = [
    { label: "Monthly Revenue", value: "₹18,45,600", change: "+22%", icon: IndianRupee },
    { label: "New Signups", value: "1,247", change: "+15%", icon: TrendingUp },
    { label: "Match Success", value: "342", change: "+8%", icon: Heart },
    { label: "Conversion Rate", value: "18.4%", change: "+3%", icon: BarChart3 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide insights on revenue, engagement, and matches.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <k.icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-success font-medium">{k.change}</span>
              </div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Registrations by Region</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { region: "Maharashtra", pct: 82 },
              { region: "Delhi NCR", pct: 68 },
              { region: "Karnataka", pct: 61 },
              { region: "Tamil Nadu", pct: 54 },
              { region: "Gujarat", pct: 47 },
              { region: "West Bengal", pct: 39 },
            ].map((r) => (
              <div key={r.region}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{r.region}</span><span className="text-muted-foreground">{r.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-gradient-romantic rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Revenue by Plan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { plan: "Platinum (6 months)", revenue: "₹9,42,300", pct: 51 },
              { plan: "Premium (3 months)", revenue: "₹6,12,500", pct: 33 },
              { plan: "Basic (Monthly)", revenue: "₹2,90,800", pct: 16 },
            ].map((p) => (
              <div key={p.plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{p.plan}</span><span className="text-muted-foreground">{p.revenue}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-gradient-sunset rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Complaints ---
export const ComplaintsPage = () => {
  const complaints = [
    { id: "C001", from: "User #12345", against: "M10087", reason: "Fake profile", priority: "high", status: "open" },
    { id: "C002", from: "User #12401", against: "M10132", reason: "Inappropriate message", priority: "high", status: "investigating" },
    { id: "C003", from: "User #12455", against: "M10201", reason: "Wrong information", priority: "medium", status: "open" },
    { id: "C004", from: "User #12501", against: "M10245", reason: "Photo mismatch", priority: "low", status: "resolved" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Complaints</h1>
        <p className="text-muted-foreground mt-1">Handle member-reported issues and safety complaints.</p>
      </div>
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Filed By</TableHead>
                <TableHead>Against</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell>{c.from}</TableCell>
                  <TableCell className="font-mono text-xs">{c.against}</TableCell>
                  <TableCell>{c.reason}</TableCell>
                  <TableCell>
                    <Badge variant={c.priority === "high" ? "destructive" : c.priority === "medium" ? "default" : "secondary"}>{c.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.status === "resolved" ? "default" : "outline"}>{c.status}</Badge>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="sm"><Shield className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Settings ---
export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform-wide preferences and matrimony rules.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Platform Name</label>
              <Input defaultValue="SoulMate Matrimony" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <Input defaultValue="support@soulmate.in" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Support Phone</label>
              <Input defaultValue="+91 1800-123-4567" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">About</label>
              <Textarea defaultValue="India's most trusted Hindu matrimony platform, connecting families since 2010." className="mt-1" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Matrimony Rules</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Minimum Age (Bride)</label>
              <Input type="number" defaultValue={18} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Minimum Age (Groom)</label>
              <Input type="number" defaultValue={21} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Free Interests per Day</label>
              <Input type="number" defaultValue={5} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Auto-Verify Aadhaar</label>
              <Input defaultValue="Enabled" className="mt-1" />
            </div>
            <Button variant="romantic" className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
