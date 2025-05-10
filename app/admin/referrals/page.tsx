"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  ChevronDown,
  Gift,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Share2,
  SproutIcon as Seedling,
  TreesIcon as Plant,
  Sprout,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

// Referral tiers
const referralTiers = [
  { name: "Grower", min: 0, max: 24, reward: 50, color: "bg-emerald-500", icon: <Seedling className="h-4 w-4" /> },
  { name: "Harvester", min: 25, max: 99, reward: 75, color: "bg-amber-500", icon: <Plant className="h-4 w-4" /> },
  {
    name: "Legend",
    min: 100,
    max: Number.POSITIVE_INFINITY,
    reward: 100,
    color: "bg-purple-500",
    icon: <Sprout className="h-4 w-4" />,
  },
]

// Pie chart colors
const COLORS = ["#10b981", "#f59e0b", "#8b5cf6", "#dedddd"]

export default function ReferralsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([])
  const [viewReferral, setViewReferral] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [activeMainTab, setActiveMainTab] = useState("overview")
  const [editingCampaign, setEditingCampaign] = useState<any>(null)
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false)
  const [referrals, setReferrals] = useState<any[]>([])
  const [referralCampaigns, setReferralCampaigns] = useState<any[]>([])
  const [topReferrers, setTopReferrers] = useState<any[]>([])
  const [referralPerformanceData, setReferralPerformanceData] = useState<any[]>([])
  const [referralTiers, setReferralTiers] = useState<any[]>([])
  const [originalTiers, setOriginalTiers] = useState<any[]>([])
  const [showTierDialog, setShowTierDialog] = useState(false)
  const [editingTier, setEditingTier] = useState<any | null>(null)
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true)
  const [defaultNicknameFormat, setDefaultNicknameFormat] = useState("GreenOak###")
  const [leaderboardVisibility, setLeaderboardVisibility] = useState(true)
  const [isContest, setIsContest] = useState(false)
  const [prize1, setPrize1] = useState("")
  const [prize2, setPrize2] = useState("")
  const [prize3, setPrize3] = useState("")
  const [viewCampaign, setViewCampaign] = useState<any>(null)
  const [editCampaign, setEditCampaign] = useState<any>(null)
  const [newCampaignStatus, setNewCampaignStatus] = useState("draft")
  const { toast } = useToast()

  const filteredReferrals = referrals
    .filter(
      (ref) =>
        ref.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.referredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((ref) => {
      if (activeTab === "all") return true
      if (activeTab === "completed") return ref.status === "completed"
      if (activeTab === "pending") return ref.status === "pending"
      if (activeTab === "flagged") return ref.status === "flagged"
      return true
    })

  const toggleReferralSelection = (refId: string) => {
    setSelectedReferrals((prev) => (prev.includes(refId) ? prev.filter((id) => id !== refId) : [...prev, refId]))
  }

  const toggleAllReferrals = () => {
    if (selectedReferrals.length === filteredReferrals.length) {
      setSelectedReferrals([])
    } else {
      setSelectedReferrals(filteredReferrals.map((ref) => ref.id))
    }
  }

  // Calculate totals
  const totalReferrals = referrals.length
  const completedReferrals = referrals.filter((ref) => ref.status === "completed").length
  const pendingReferrals = referrals.filter((ref) => ref.status === "pending").length
  const flaggedReferrals = referrals.filter((ref) => ref.status === "flagged").length
  const totalRewardsGiven = referrals
    .filter((ref) => ref.status === "completed")
    .reduce((sum, ref) => sum + ref.reward, 0)

  // Tier distribution data for pie chart
  const tierDistributionData = [
    { name: "Grower", value: referrals.filter((ref) => ref.tier === "Grower").length },
    { name: "Harvester", value: referrals.filter((ref) => ref.tier === "Harvester").length },
    { name: "Legend", value: referrals.filter((ref) => ref.tier === "Legend").length },
  ]

  // Fetch tiers from Supabase on load
  useEffect(() => {
    async function fetchTiers() {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from("referral_tiers")
        .select("*")
        .order("min_referrals", { ascending: true })
      if (!error) {
        setReferralTiers(data || [])
        setOriginalTiers(data || [])
      }
    }
    fetchTiers()
  }, [])

  // Fetch leaderboard settings from Supabase on mount
  useEffect(() => {
    async function fetchLeaderboardSettings() {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from("referral_settings")
        .select("leaderboard_enabled, default_nickname_format, leaderboard_visibility")
        .single()
      if (data) {
        setLeaderboardEnabled(data.leaderboard_enabled ?? true)
        setDefaultNicknameFormat(data.default_nickname_format || "GreenOak###")
        setLeaderboardVisibility(data.leaderboard_visibility ?? true)
      }
    }
    fetchLeaderboardSettings()
  }, [])

  // Add/Edit Tier dialog handlers
  function handleAddTier() {
    setEditingTier({ name: "", min_referrals: 0, max_referrals: null, reward_amount: 0, color: "bg-emerald-500" })
    setShowTierDialog(true)
  }
  function handleEditTier(tier: any) {
    setEditingTier({ ...tier })
    setShowTierDialog(true)
  }
  function handleDeleteTier(id: string) {
    setReferralTiers((tiers) => tiers.filter((t) => t.id !== id))
  }
  function handleDialogSave() {
    if (!editingTier.name) return
    if (editingTier.id) {
      setReferralTiers((tiers) => tiers.map((t) => t.id === editingTier.id ? editingTier : t))
    } else {
      setReferralTiers((tiers) => [...tiers, { ...editingTier, id: crypto.randomUUID() }])
    }
    setShowTierDialog(false)
    setEditingTier(null)
  }
  function handleDialogCancel() {
    setShowTierDialog(false)
    setEditingTier(null)
  }
  // Save all tiers to Supabase
  async function handleSaveSettings() {
    const supabase = createClientComponentClient()
    // Upsert all tiers
    for (const tier of referralTiers) {
      await supabase.from("referral_tiers").upsert({ ...tier, updated_at: new Date().toISOString() }, { onConflict: "id" })
    }
    // Delete removed tiers
    const removed = originalTiers.filter((t) => !referralTiers.find((r) => r.id === t.id))
    for (const tier of removed) {
      await supabase.from("referral_tiers").delete().eq("id", tier.id)
    }
    setOriginalTiers([...referralTiers])
    toast({ title: "Referral tiers saved" })
    toast({ title: "Referral settings saved successfully." })
  }
  // Cancel changes
  function handleCancelSettings() {
    setReferralTiers([...originalTiers])
    toast({ title: "Changes reverted" })
  }

  // Save leaderboard settings
  async function handleSaveLeaderboardSettings() {
    const supabase = createClientComponentClient()
    await supabase.from("referral_settings").upsert({
      id: 1,
      leaderboard_enabled: leaderboardEnabled,
      default_nickname_format: defaultNicknameFormat,
      leaderboard_visibility: leaderboardVisibility,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" })
    toast({ title: "Leaderboard settings saved successfully." })
  }

  useEffect(() => {
    const supabase = createClientComponentClient()
    // Fetch all referrals
    async function fetchReferrals() {
      const { data, error } = await supabase
        .from("referrals")
        .select(`*, referrer:referrer_id (id, first_name, last_name), referred:referred_id (id, first_name, last_name), campaign:campaign_id (id, name, reward_amount)`)
        .order("created_at", { ascending: false })
      if (!error) setReferrals(data || [])
    }
    // Fetch all campaigns
    async function fetchCampaigns() {
      const { data, error } = await supabase
        .from("referral_campaigns")
        .select("*")
        .order("created_at", { ascending: false })
      if (!error) setReferralCampaigns(data || [])
    }
    // Fetch top referrers (aggregate)
    async function fetchTopReferrers() {
      const { data, error } = await supabase.rpc("get_top_referrers")
      if (!error) setTopReferrers(data || [])
    }
    // Fetch referral performance (aggregate by month)
    async function fetchPerformance() {
      const { data, error } = await supabase.rpc("get_referral_performance_by_month")
      if (!error) setReferralPerformanceData(data || [])
    }
    // Fetch referral tiers (if in DB, else keep static)
    // ...
    fetchReferrals()
    fetchCampaigns()
    fetchTopReferrers()
    fetchPerformance()
  }, [])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeMainTab} onValueChange={setActiveMainTab}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Referral Program Management</h1>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Referrals</CardDescription>
                <CardTitle className="text-3xl">{totalReferrals}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="mr-1 h-4 w-4 text-primary" />
                  <span>All-time referrals</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed Referrals</CardDescription>
                <CardTitle className="text-3xl">{completedReferrals}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                  <span>Successful conversions</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Referrals</CardDescription>
                <CardTitle className="text-3xl">{pendingReferrals}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Gift className="mr-1 h-4 w-4 text-primary" />
                  <span>Awaiting signup</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Rewards Given</CardDescription>
                <CardTitle className="text-3xl">${totalRewardsGiven}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Gift className="mr-1 h-4 w-4 text-green-500" />
                  <span>Paid to referrers</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Performance</CardTitle>
              <CardDescription>Monthly referrals and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="referrals" name="Total Referrals" fill="#10b981" />
                    <Bar dataKey="conversion" name="Successful Conversions" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referral Tier Distribution</CardTitle>
                <CardDescription>Distribution of referrals by tier level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tierDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {tierDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} referrals`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Referral link to signup conversion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 rounded-full bg-primary/10 p-2">
                        <Share2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Link Shares</p>
                        <p className="text-xs text-muted-foreground">Total referral links shared</p>
                      </div>
                    </div>
                    <p className="font-bold">1,245</p>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 rounded-full bg-primary/10 p-2">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sign Ups</p>
                        <p className="text-xs text-muted-foreground">Users who created an account</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">732</p>
                      <p className="text-xs text-muted-foreground">58.8% conversion</p>
                    </div>
                  </div>
                  <Progress value={58.8} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Referrers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Customers with the most successful referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-center">Tier</TableHead>
                      <TableHead className="text-center">Total Referrals</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead className="text-right">Total Rewards</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topReferrers.map((referrer) => (
                      <TableRow key={referrer.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{referrer.name}</span>
                            <span className="text-xs text-muted-foreground">{referrer.id}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`${
                              referrer.tier === "Grower"
                                ? "border-emerald-500 text-emerald-500"
                                : referrer.tier === "Harvester"
                                  ? "border-amber-500 text-amber-500"
                                  : "border-purple-500 text-purple-500"
                            }`}
                          >
                            {referrer.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{referrer.referrals}</TableCell>
                        <TableCell className="text-center">{referrer.completed}</TableCell>
                        <TableCell className="text-right font-medium">${referrer.reward}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Referral Campaigns</h2>
            <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Referral Campaign</DialogTitle>
                  <DialogDescription>
                    Set up a new referral campaign with custom rewards and conditions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign-name" className="text-right">
                      Name
                    </Label>
                    <Input id="campaign-name" placeholder="Campaign name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign-description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="campaign-description" placeholder="Campaign description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">
                      Start Date
                    </Label>
                    <Input id="start-date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-date" className="text-right">
                      End Date
                    </Label>
                    <Input id="end-date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="referrer-reward" className="text-right">
                      Referrer Reward ($)
                    </Label>
                    <Input id="referrer-reward" type="number" defaultValue="50" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="conditions" className="text-right">
                      Conditions
                    </Label>
                    <Textarea id="conditions" placeholder="Conditions for reward eligibility" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is-contest" className="text-right">
                      Contest Campaign
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch id="is-contest" checked={isContest} onCheckedChange={setIsContest} />
                      <span className="text-sm text-muted-foreground">Enable contest and prizes</span>
                    </div>
                  </div>
                  {isContest && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prize1" className="text-right">
                          1st Place Prize
                        </Label>
                        <Input id="prize1" placeholder="$500" className="col-span-3" value={prize1} onChange={e => setPrize1(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prize2" className="text-right">
                          2nd Place Prize
                        </Label>
                        <Input id="prize2" placeholder="$250" className="col-span-3" value={prize2} onChange={e => setPrize2(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prize3" className="text-right">
                          3rd Place Prize
                        </Label>
                        <Input id="prize3" placeholder="$100" className="col-span-3" value={prize3} onChange={e => setPrize3(e.target.value)} />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign-status" className="text-right">
                      Status
                    </Label>
                    <Select value={newCampaignStatus} onValueChange={setNewCampaignStatus}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewCampaignDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      // Gather form values
                      const name = (document.getElementById("campaign-name") as HTMLInputElement)?.value || ""
                      const description = (document.getElementById("campaign-description") as HTMLTextAreaElement)?.value || ""
                      const startDate = (document.getElementById("start-date") as HTMLInputElement)?.value || null
                      const endDate = (document.getElementById("end-date") as HTMLInputElement)?.value || null
                      const referrerReward = (document.getElementById("referrer-reward") as HTMLInputElement)?.value || ""
                      const rewardType = (document.getElementById("reward-type") as HTMLInputElement)?.value || "cash"
                      const conditions = (document.getElementById("conditions") as HTMLTextAreaElement)?.value || ""
                      // Use state for isContest, prize1, prize2, prize3, newCampaignStatus
                      const payload = {
                        name,
                        description,
                        reward_amount: Number(referrerReward),
                        reward_type: rewardType,
                        start_date: startDate,
                        end_date: endDate,
                        is_contest: isContest,
                        prize_1st: prize1 ? Number(prize1) : null,
                        prize_2nd: prize2 ? Number(prize2) : null,
                        prize_3rd: prize3 ? Number(prize3) : null,
                        status: newCampaignStatus,
                        conditions,
                      }
                      console.log("Insert payload:", payload)
                      // Validate required fields
                      if (!name || !referrerReward || !status || !startDate) {
                        toast({ title: "Missing required fields", description: "Name, reward, start date, and status are required.", variant: "destructive" })
                        return
                      }
                      if (isNaN(Number(referrerReward))) {
                        toast({ title: "Invalid reward amount", description: "Reward must be a number.", variant: "destructive" })
                        return
                      }
                      // Insert
                      const supabase = createClientComponentClient()
                      const { error } = await supabase.from("referral_campaigns").insert([payload])
                      if (!error) {
                        setShowNewCampaignDialog(false)
                        setIsContest(false)
                        setPrize1("")
                        setPrize2("")
                        setPrize3("")
                        setNewCampaignStatus("draft")
                        toast({ title: "Campaign created" })
                        // Refresh campaigns
                        const { data } = await supabase.from("referral_campaigns").select("*").order("created_at", { ascending: false })
                        setReferralCampaigns(data || [])
                      } else {
                        console.error("Supabase insert error:", error);
                        toast({ title: "Error", description: JSON.stringify(error, null, 2), variant: "destructive" })
                      }
                    }}
                  >
                    Create Campaign
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {referralCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{campaign.name}</CardTitle>
                    <Badge
                      variant={
                        campaign.status === "active" ? "default" : campaign.status === "ended" ? "secondary" : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{campaign.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{campaign.endDate || "Ongoing"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Referrer Reward</p>
                      <p className="font-medium">${campaign.referrerReward}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Conversion Rate</span>
                      <span>{campaign.conversionRate}%</span>
                    </div>
                    <Progress value={campaign.conversionRate} className="h-2" />
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Conditions</p>
                    <p className="text-sm">{campaign.conditions}</p>
                  </div>

                  {campaign.is_contest && (
                    <div className="rounded-lg border p-3 bg-gradient-to-r from-amber-50 to-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-amber-500" />
                        <span className="font-medium text-amber-700">Contest Campaign</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="block text-xs text-muted-foreground">1st Place</span>
                          <span className="font-bold text-lg text-yellow-600">{campaign.prize1 || "$—"}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">2nd Place</span>
                          <span className="font-bold text-lg text-gray-500">{campaign.prize2 || "$—"}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">3rd Place</span>
                          <span className="font-bold text-lg text-amber-600">{campaign.prize3 || "$—"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 px-4 py-3">
                  <p className="text-sm">{campaign.totalReferrals} referrals</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewCampaign(campaign)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditCampaign(campaign)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        {campaign.status === "active" && <DropdownMenuItem>Pause Campaign</DropdownMenuItem>}
                        {campaign.status !== "active" && <DropdownMenuItem>Activate Campaign</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete Campaign</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Campaign Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Comparison</CardTitle>
              <CardDescription>Compare the performance of different referral campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralCampaigns} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalReferrals" name="Total Referrals" fill="#10b981" />
                    <Bar yAxisId="right" dataKey="conversionRate" name="Conversion Rate (%)" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Insights</CardTitle>
              <CardDescription>Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Top Performing Campaign</h3>
                <p className="mt-1 text-sm">Legend Member Bonus has the highest conversion rate at 78%</p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Consider extending similar benefits to other member tiers</span>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Seasonal Impact</h3>
                <p className="mt-1 text-sm">Spring Promotion is outperforming the Standard Program by 4%</p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Plan for a similar Summer campaign starting in June</span>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Reward Optimization</h3>
                <p className="mt-1 text-sm">
                  Higher referrer rewards (New Year Kickoff) didn't significantly improve conversion
                </p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Consider balanced rewards for both parties instead</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          {/* All Referrals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Referrals</CardTitle>
              <CardDescription>Manage and monitor all referral activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search referrals..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Checkbox id="recent" className="mr-2" />
                        <Label htmlFor="recent">Last 30 Days</Label>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Checkbox id="tier-grower" className="mr-2" />
                        <Label htmlFor="tier-grower">Grower Tier</Label>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Checkbox id="tier-harvester" className="mr-2" />
                        <Label htmlFor="tier-harvester">Harvester Tier</Label>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Checkbox id="tier-legend" className="mr-2" />
                        <Label htmlFor="tier-legend">Legend Tier</Label>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-2">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="flagged">Flagged</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="mt-6 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={
                            selectedReferrals.length === filteredReferrals.length && filteredReferrals.length > 0
                          }
                          onCheckedChange={toggleAllReferrals}
                        />
                      </TableHead>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Referred</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Reward</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedReferrals.includes(ref.id)}
                            onCheckedChange={() => toggleReferralSelection(ref.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{ref.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{ref.referrerName}</span>
                            <span className="text-xs text-muted-foreground">{ref.referrerId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{ref.referredName}</span>
                            <span className="text-xs text-muted-foreground">{ref.referredId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{ref.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              ref.tier === "Grower"
                                ? "border-emerald-500 text-emerald-500"
                                : ref.tier === "Harvester"
                                  ? "border-amber-500 text-amber-500"
                                  : "border-purple-500 text-purple-500"
                            }`}
                          >
                            {ref.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ref.status === "completed"
                                ? "default"
                                : ref.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {ref.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${ref.reward}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setViewReferral(ref)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Referral Details</DialogTitle>
                                  <DialogDescription>Detailed information about the referral.</DialogDescription>
                                </DialogHeader>
                                {viewReferral && (
                                  <div className="grid gap-4 py-4">
                                    <div className="flex items-center gap-4">
                                      <div
                                        className={`rounded-full p-3 ${
                                          viewReferral.status === "completed"
                                            ? "bg-green-100 text-green-600"
                                            : viewReferral.status === "pending"
                                              ? "bg-amber-100 text-amber-600"
                                              : "bg-red-100 text-red-600"
                                        }`}
                                      >
                                        {viewReferral.status === "completed" && <CheckCircle className="h-6 w-6" />}
                                        {viewReferral.status === "pending" && <Gift className="h-6 w-6" />}
                                        {viewReferral.status === "flagged" && <AlertTriangle className="h-6 w-6" />}
                                      </div>
                                      <div>
                                        <h3 className="text-lg font-semibold">Referral {viewReferral.id}</h3>
                                        <p className="text-sm text-muted-foreground">{viewReferral.status} referral</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Referrer</Label>
                                        <p>
                                          {viewReferral.referrerName} ({viewReferral.referrerId})
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Referred</Label>
                                        <p>
                                          {viewReferral.referredName} ({viewReferral.referredId})
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Date</Label>
                                        <p>{viewReferral.date}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Status</Label>
                                        <p>
                                          <Badge
                                            variant={
                                              viewReferral.status === "completed"
                                                ? "default"
                                                : viewReferral.status === "pending"
                                                  ? "outline"
                                                  : "destructive"
                                            }
                                          >
                                            {viewReferral.status}
                                          </Badge>
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Tier</Label>
                                        <p>{viewReferral.tier}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Referrer Reward</Label>
                                        <p>${viewReferral.reward}</p>
                                      </div>
                                      {viewReferral.status === "flagged" && (
                                        <div className="col-span-2">
                                          <Label className="text-sm text-muted-foreground">Flag Reason</Label>
                                          <p className="text-red-600">{viewReferral.flagReason}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  {viewReferral?.status === "pending" && (
                                    <Button variant="outline">Mark as Completed</Button>
                                  )}
                                  {viewReferral?.status === "flagged" && <Button variant="outline">Review</Button>}
                                  <Button>View Customer Details</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {ref.status === "pending" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {ref.status !== "flagged" && (
                                  <DropdownMenuItem>
                                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" /> Flag as Suspicious
                                  </DropdownMenuItem>
                                )}
                                {ref.status === "flagged" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Clear Flag
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="mr-2 h-4 w-4" /> Reject Referral
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Fraud Detection */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
              <CardDescription>Potential suspicious referral activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 bg-amber-50">
                <div className="flex items-start">
                  <AlertTriangle className="mr-3 mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Multiple Referrals from Same IP</h3>
                    <p className="mt-1 text-sm">
                      User CUST-002 (Sarah Johnson) has 5 referrals from the same IP address in the last 24 hours.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                      <Button variant="outline" size="sm">
                        Flag All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Fraud Prevention Settings</h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-detection">IP Address Detection</Label>
                      <p className="text-xs text-muted-foreground">Flag multiple referrals from same IP</p>
                    </div>
                    <Switch id="ip-detection" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="time-threshold">Time-based Threshold</Label>
                      <p className="text-xs text-muted-foreground">Flag rapid succession of referrals</p>
                    </div>
                    <Switch id="time-threshold" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program Settings</CardTitle>
              <CardDescription>Configure your referral program parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reward Structure */}
              <div>
                <h3 className="text-lg font-medium">Reward Structure</h3>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="default-referrer-reward">Default Referrer Reward ($)</Label>
                      <Input id="default-referrer-reward" type="number" defaultValue="50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tiered Rewards</Label>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tier</TableHead>
                            <TableHead>Min Referrals</TableHead>
                            <TableHead>Max Referrals</TableHead>
                            <TableHead>Reward Amount ($)</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {referralTiers.map((tier, index) => (
                            <TableRow key={tier.name}>
                              <TableCell>
                                <div className="flex items-center">
                                  <div
                                    className={`mr-2 h-5 w-5 rounded-full ${tier.color} flex items-center justify-center text-white`}
                                  >
                                    {tier.icon}
                                  </div>
                                  {tier.name}
                                </div>
                              </TableCell>
                              <TableCell>{tier.min}</TableCell>
                              <TableCell>{tier.max === Number.POSITIVE_INFINITY ? "∞" : tier.max}</TableCell>
                              <TableCell>${tier.reward}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleEditTier(tier)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTier(tier.id)}>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleAddTier}>
                      <Plus className="mr-2 h-4 w-4" /> Add Tier
                    </Button>
                  </div>
                </div>
              </div>

              {/* Eligibility Rules */}
              <div>
                <h3 className="text-lg font-medium">Eligibility Rules</h3>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conversion-window">Conversion Window (days)</Label>
                    <Input id="conversion-window" type="number" defaultValue="30" />
                    <p className="text-xs text-muted-foreground">
                      Number of days a referred user has to create an account after clicking the referral link
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="self-referrals">Allow Self-Referrals</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow users to refer themselves using different accounts
                      </p>
                    </div>
                    <Switch id="self-referrals" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="employee-referrals">Allow Employee Referrals</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow employees to participate in the referral program
                      </p>
                    </div>
                    <Switch id="employee-referrals" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Program Display */}
              <div>
                <h3 className="text-lg font-medium">Program Display</h3>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="program-name">Program Name</Label>
                    <Input id="program-name" defaultValue="Seed Club Referral Program" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program-description">Program Description</Label>
                    <Textarea
                      id="program-description"
                      defaultValue="Invite your friends to Seed Club and earn rewards when they join. The more you refer, the more you earn!"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-message">Default Referral Message</Label>
                    <Textarea
                      id="default-message"
                      defaultValue="Join me on Seed Club and start growing your money! Use my referral link:"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-leaderboard">Show Leaderboard</Label>
                      <p className="text-xs text-muted-foreground">Display referral leaderboard to users</p>
                    </div>
                    <Switch id="show-leaderboard" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-tiers">Show Tier Progress</Label>
                      <p className="text-xs text-muted-foreground">Display tier progress and benefits to users</p>
                    </div>
                    <Switch id="show-tiers" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <Separator className="my-2" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="referrer-notifications">Referrer Notifications</Label>
                      <p className="text-xs text-muted-foreground">Notify users when their referral link is used</p>
                    </div>
                    <Switch id="referrer-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="conversion-notifications">Conversion Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify users when their referral completes registration
                      </p>
                    </div>
                    <Switch id="conversion-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="tier-notifications">Tier Upgrade Notifications</Label>
                      <p className="text-xs text-muted-foreground">Notify users when they reach a new referral tier</p>
                    </div>
                    <Switch id="tier-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="admin-notifications">Admin Notifications</Label>
                      <p className="text-xs text-muted-foreground">Notify admins of suspicious referral activity</p>
                    </div>
                    <Switch id="admin-notifications" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Leaderboard Settings */}
              <div className="space-y-6 border rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Leaderboard Settings</h3>
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="leaderboard-enabled">Enable Leaderboard</Label>
                  <Switch id="leaderboard-enabled" checked={leaderboardEnabled} onCheckedChange={setLeaderboardEnabled} />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="leaderboard-visibility">Show Nicknames on Leaderboard</Label>
                  <Switch id="leaderboard-visibility" checked={leaderboardVisibility} onCheckedChange={setLeaderboardVisibility} />
                </div>
                <div className="mb-4">
                  <Label htmlFor="default-nickname-format">Default Nickname Format</Label>
                  <Input id="default-nickname-format" value={defaultNicknameFormat} onChange={e => setDefaultNicknameFormat(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Use ### for random digits, e.g., GreenOak###</p>
                </div>
                <Button variant="outline" onClick={handleSaveLeaderboardSettings}>Save Leaderboard Settings</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t p-4">
              <Button variant="outline" onClick={handleCancelSettings}>Cancel Changes</Button>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={showTierDialog} onOpenChange={setShowTierDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingTier?.id ? "Edit Tier" : "Add Tier"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={editingTier?.name || ""} onChange={e => setEditingTier({ ...editingTier, name: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Min Referrals</Label>
                <Input type="number" value={editingTier?.min_referrals || 0} onChange={e => setEditingTier({ ...editingTier, min_referrals: Number(e.target.value) })} />
              </div>
              <div className="flex-1">
                <Label>Max Referrals</Label>
                <Input type="number" value={editingTier?.max_referrals ?? ""} onChange={e => setEditingTier({ ...editingTier, max_referrals: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Reward Amount ($)</Label>
              <Input type="number" value={editingTier?.reward_amount || 0} onChange={e => setEditingTier({ ...editingTier, reward_amount: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Color</Label>
              <Select value={editingTier?.color || "bg-emerald-500"} onValueChange={color => setEditingTier({ ...editingTier, color })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-emerald-500">Green</SelectItem>
                  <SelectItem value="bg-amber-500">Amber</SelectItem>
                  <SelectItem value="bg-purple-500">Purple</SelectItem>
                  <SelectItem value="bg-blue-500">Blue</SelectItem>
                  <SelectItem value="bg-pink-500">Pink</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>Cancel</Button>
            <Button onClick={handleDialogSave}>{editingTier?.id ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {viewCampaign && (
        <Dialog open={!!viewCampaign} onOpenChange={() => setViewCampaign(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>View Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div><b>Name:</b> {viewCampaign.name}</div>
              <div><b>Description:</b> {viewCampaign.description}</div>
              <div><b>Status:</b> {viewCampaign.status}</div>
              <div><b>Start Date:</b> {viewCampaign.start_date ? new Date(viewCampaign.start_date).toLocaleDateString() : "-"}</div>
              <div><b>End Date:</b> {viewCampaign.end_date ? new Date(viewCampaign.end_date).toLocaleDateString() : "-"}</div>
              <div><b>Reward Amount:</b> ${viewCampaign.reward_amount}</div>
              <div><b>Reward Type:</b> {viewCampaign.reward_type}</div>
              <div><b>Conditions:</b> {viewCampaign.conditions}</div>
              <div><b>Contest:</b> {viewCampaign.is_contest ? "Yes" : "No"}</div>
              {viewCampaign.is_contest && (
                <>
                  <div><b>1st Prize:</b> {viewCampaign.prize_1st}</div>
                  <div><b>2nd Prize:</b> {viewCampaign.prize_2nd}</div>
                  <div><b>3rd Prize:</b> {viewCampaign.prize_3rd}</div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setViewCampaign(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {editCampaign && (
        <Dialog open={!!editCampaign} onOpenChange={() => setEditCampaign(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-campaign-name" className="text-right">Name</Label>
                <Input id="edit-campaign-name" defaultValue={editCampaign.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-campaign-description" className="text-right">Description</Label>
                <Textarea id="edit-campaign-description" defaultValue={editCampaign.description} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-start-date" className="text-right">Start Date</Label>
                <Input id="edit-start-date" type="date" defaultValue={editCampaign.start_date ? editCampaign.start_date.split('T')[0] : ""} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-end-date" className="text-right">End Date</Label>
                <Input id="edit-end-date" type="date" defaultValue={editCampaign.end_date ? editCampaign.end_date.split('T')[0] : ""} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reward-amount" className="text-right">Reward Amount ($)</Label>
                <Input id="edit-reward-amount" type="number" defaultValue={editCampaign.reward_amount} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reward-type" className="text-right">Reward Type</Label>
                <Input id="edit-reward-type" defaultValue={editCampaign.reward_type || "cash"} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-conditions" className="text-right">Conditions</Label>
                <Textarea id="edit-conditions" defaultValue={editCampaign.conditions} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select value={editCampaign.status || "draft"} onValueChange={val => setEditCampaign((c: any) => ({ ...c, status: val }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-is-contest" className="text-right">Contest Campaign</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch id="edit-is-contest" defaultChecked={!!editCampaign.is_contest} />
                  <span className="text-sm text-muted-foreground">Enable contest and prizes</span>
                </div>
              </div>
              {editCampaign.is_contest && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-prize-1st" className="text-right">1st Place Prize</Label>
                    <Input id="edit-prize-1st" defaultValue={editCampaign.prize_1st} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-prize-2nd" className="text-right">2nd Place Prize</Label>
                    <Input id="edit-prize-2nd" defaultValue={editCampaign.prize_2nd} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-prize-3rd" className="text-right">3rd Place Prize</Label>
                    <Input id="edit-prize-3rd" defaultValue={editCampaign.prize_3rd} className="col-span-3" />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditCampaign(null)}>Cancel</Button>
              <Button
                onClick={async () => {
                  const name = (document.getElementById("edit-campaign-name") as HTMLInputElement)?.value || ""
                  const description = (document.getElementById("edit-campaign-description") as HTMLTextAreaElement)?.value || ""
                  const startDate = (document.getElementById("edit-start-date") as HTMLInputElement)?.value || null
                  const endDate = (document.getElementById("edit-end-date") as HTMLInputElement)?.value || null
                  const rewardAmount = (document.getElementById("edit-reward-amount") as HTMLInputElement)?.value || ""
                  const rewardType = (document.getElementById("edit-reward-type") as HTMLInputElement)?.value || "cash"
                  const conditions = (document.getElementById("edit-conditions") as HTMLTextAreaElement)?.value || ""
                  const status = document.querySelector('#edit-status [data-state="open"] [data-value]')?.getAttribute('data-value') || editCampaign.status || "draft"
                  const isContest = (document.getElementById("edit-is-contest") as HTMLInputElement)?.checked || false
                  const prize1 = (document.getElementById("edit-prize-1st") as HTMLInputElement)?.value || null
                  const prize2 = (document.getElementById("edit-prize-2nd") as HTMLInputElement)?.value || null
                  const prize3 = (document.getElementById("edit-prize-3rd") as HTMLInputElement)?.value || null
                  const supabase = createClientComponentClient()
                  const { error } = await supabase.from("referral_campaigns").update({
                    name,
                    description,
                    start_date: startDate ? new Date(startDate).toISOString() : null,
                    end_date: endDate ? new Date(endDate).toISOString() : null,
                    reward_amount: rewardAmount,
                    reward_type: rewardType,
                    conditions,
                    status,
                    is_contest: isContest,
                    prize_1st: isContest ? prize1 : null,
                    prize_2nd: isContest ? prize2 : null,
                    prize_3rd: isContest ? prize3 : null,
                  }).eq('id', editCampaign.id)
                  if (!error) {
                    setEditCampaign(null)
                    toast({ title: "Campaign updated" })
                    // Refresh campaigns
                    const { data } = await supabase.from("referral_campaigns").select("*").order("created_at", { ascending: false })
                    setReferralCampaigns(data || [])
                  } else {
                    toast({ title: "Error", description: error.message, variant: "destructive" })
                  }
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
