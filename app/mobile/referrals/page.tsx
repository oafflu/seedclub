"use client"

import { useState } from "react"
import {
  Share2,
  Copy,
  Check,
  Users,
  Gift,
  Trophy,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Award,
  Instagram,
  MessageCircle,
  Send,
  Smartphone,
  SproutIcon as Seedling,
  TreesIcon as Plant,
  Sprout,
  Leaf,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock data for demonstration
const mockReferrals = [
  {
    id: "ref1",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "completed",
    date: "2023-12-15",
    reward: 50,
    level: 1,
  },
  {
    id: "ref2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "pending",
    date: "2024-01-10",
    reward: 50,
    level: 1,
  },
  {
    id: "ref3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    status: "completed",
    date: "2023-11-20",
    reward: 50,
    level: 1,
  },
  {
    id: "ref4",
    name: "Alice Williams",
    email: "alice@example.com",
    status: "completed",
    date: "2023-10-15",
    reward: 50,
    level: 1,
  },
]

// Mock data for leaderboard
const mockLeaderboard = [
  { id: "user1", name: "Sarah Johnson", nickname: "InvestorPro", referrals: 124, rank: 1 },
  { id: "user2", name: "Michael Chen", nickname: "GrowthMaster", referrals: 87, rank: 2 },
  { id: "user3", name: "David Wilson", nickname: "SeedKing", referrals: 56, rank: 3 },
  { id: "user4", name: "Emma Davis", nickname: "WealthBuilder", referrals: 32, rank: 4 },
  { id: "user5", name: "Current User", nickname: "YourNickname", referrals: 3, rank: 42, isCurrentUser: true },
]

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

// FAQ items for referral program
const faqItems = [
  {
    question: "How does the referral program work?",
    answer:
      "When you refer a friend to Seed Club, you'll receive a reward once they sign up and create a jar with at least $100. Your reward amount depends on your referral tier level, which increases as you make more successful referrals.",
  },
  {
    question: "How much can I earn from referrals?",
    answer:
      "You can earn $50 per referral as a Grower (0-24 referrals), $75 per referral as a Harvester (25-99 referrals), and $100 per referral as a Legend (100+ referrals). There's no limit to how many people you can refer!",
  },
  {
    question: "When do I receive my referral rewards?",
    answer:
      "Referral rewards are credited to your wallet once your referred friend successfully creates and funds their first jar with at least $100. This typically happens within 24-48 hours after they complete their first investment.",
  },
  {
    question: "Can I withdraw my referral earnings?",
    answer:
      "Yes! Your referral earnings are added to your wallet balance and can be withdrawn at any time or used to fund your own investment jars.",
  },
  {
    question: "What happens if someone signs up but doesn't create a jar?",
    answer:
      "You'll only receive the referral reward when your friend completes the full process of creating and funding a jar. If they sign up but don't create a jar, the referral will remain in 'pending' status until they complete this step.",
  },
  {
    question: "How do I track my referrals?",
    answer:
      "You can track all your referrals in the 'My Referrals' tab. This shows both completed referrals (where you've earned rewards) and pending referrals (where your friend has signed up but not yet created a jar).",
  },
  {
    question: "Can I participate in the monthly referral contest?",
    answer:
      "Yes! Every month we run a referral contest where the top referrers can win additional cash prizes. The contest resets at the beginning of each month, giving everyone a fresh chance to win.",
  },
]

// MOCK CUSTOMER DATA FOR DEVELOPMENT/DEMO PURPOSES
const mockCustomer = {
  id: 'mock-customer-id',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
}

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [customMessage, setCustomMessage] = useState(
    "Join me on Seed Club and start growing your money! Use my referral link:",
  )
  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [nickname, setNickname] = useState("YourNickname")

  const referralCode = "SEED123456"
  const referralLink = `https://seedclub.com/ref/${referralCode}`

  const totalEarned = mockReferrals
    .filter((ref) => ref.status === "completed")
    .reduce((sum, ref) => sum + ref.reward, 0)

  const pendingReferrals = mockReferrals.filter((ref) => ref.status === "pending").length
  const completedReferrals = mockReferrals.filter((ref) => ref.status === "completed").length
  const totalReferrals = completedReferrals + pendingReferrals

  // Calculate current tier
  const currentTier =
    referralTiers.find((tier) => totalReferrals >= tier.min && totalReferrals <= tier.max) || referralTiers[0]

  // Calculate next tier
  const nextTierIndex = referralTiers.indexOf(currentTier) + 1
  const nextTier = nextTierIndex < referralTiers.length ? referralTiers[nextTierIndex] : null

  // Calculate progress to next tier
  const progressToNextTier = nextTier
    ? Math.min(100, ((totalReferrals - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyCustomMessage = () => {
    navigator.clipboard.writeText(`${customMessage} ${referralLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToSocial = (platform) => {
    let shareUrl = ""
    const message = encodeURIComponent(`${customMessage} ${referralLink}`)

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${message}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(customMessage)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
        break
      case "instagram":
        // Instagram doesn't have a direct share URL, but we can copy to clipboard
        navigator.clipboard.writeText(`${customMessage} ${referralLink}`)
        alert("Caption and link copied! Open Instagram and paste in your story or post.")
        return
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${message}`
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(customMessage)}`
        break
      case "sms":
        shareUrl = `sms:?body=${message}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent("Join me on Seed Club")}&body=${message}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank")
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Referrals</h1>

      <Tabs defaultValue="share" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="share">Share & Earn</TabsTrigger>
          <TabsTrigger value="status">My Referrals</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="share" className="space-y-4 pt-4">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 text-white">
              <h2 className="text-xl font-bold">Invite Friends/Family to create an account</h2>
              <p className="text-sm opacity-90">
                You earn up to ${referralTiers[referralTiers.length - 1].reward.toLocaleString()} (depending on your
                level), once they open a jar with more than $100
              </p>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-emerald-100 p-3">
                  <Gift className="h-6 w-6 text-emerald-600" />
                </div>

                <div className="relative w-full">
                  <Input value={referralLink} readOnly className="pr-24" />
                  <Button size="sm" onClick={copyToClipboard} className="absolute right-1 top-1/2 -translate-y-1/2">
                    {copied ? (
                      <>
                        <Check className="mr-1 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-4 w-4" /> Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCustomization(!showCustomization)}>
                    {showCustomization ? "Hide Options" : "Customize Message"}
                  </Button>
                </div>

                {showCustomization && (
                  <div className="w-full space-y-4">
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter your custom referral message"
                      className="min-h-[100px]"
                    />
                    <Button onClick={copyCustomMessage} className="w-full">
                      <Copy className="mr-1 h-4 w-4" /> Copy Custom Message
                    </Button>
                  </div>
                )}

                <div className="w-full">
                  <h3 className="mb-2 text-sm font-medium">Share via</h3>
                  <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("twitter")}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Twitter className="h-4 w-4 text-blue-500" />
                      <span className="sr-only">Share on Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("facebook")}
                      className="hover:bg-blue-50 hover:text-blue-800"
                    >
                      <Facebook className="h-4 w-4 text-blue-700" />
                      <span className="sr-only">Share on Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("linkedin")}
                      className="hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span className="sr-only">Share on LinkedIn</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("instagram")}
                      className="hover:bg-pink-50 hover:text-pink-700"
                    >
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span className="sr-only">Share on Instagram</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("whatsapp")}
                      className="hover:bg-green-50 hover:text-green-700"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="sr-only">Share on WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("telegram")}
                      className="hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Send className="h-4 w-4 text-blue-400" />
                      <span className="sr-only">Share on Telegram</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("sms")}
                      className="hover:bg-gray-50 hover:text-gray-700"
                    >
                      <Smartphone className="h-4 w-4 text-gray-600" />
                      <span className="sr-only">Share via SMS</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => shareToSocial("email")}
                      className="hover:bg-red-50 hover:text-red-700"
                    >
                      <Mail className="h-4 w-4 text-red-600" />
                      <span className="sr-only">Share via Email</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Tier Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                Your Referral Status
              </CardTitle>
              <CardDescription>
                Current Tier: <span className="font-medium">{currentTier.name}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`mr-2 h-8 w-8 rounded-full ${currentTier.color} flex items-center justify-center text-white`}
                  >
                    {currentTier.icon}
                  </div>
                  <div>
                    <p className="font-medium">{currentTier.name} Tier</p>
                    <p className="text-xs text-muted-foreground">${currentTier.reward.toLocaleString()} per referral</p>
                  </div>
                </div>
                {nextTier && (
                  <div className="text-right">
                    <p className="text-sm">Next: {nextTier.name}</p>
                    <p className="text-xs text-muted-foreground">{nextTier.min - totalReferrals} more to unlock</p>
                  </div>
                )}
              </div>

              {nextTier && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{totalReferrals} referrals</span>
                    <span>{nextTier.min} referrals</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-2" />
                </div>
              )}

              <div className="rounded-lg border p-3">
                <h4 className="font-medium flex items-center">
                  <Leaf className="mr-2 h-4 w-4 text-emerald-500" />
                  Tier Benefits
                </h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {referralTiers.map((tier) => (
                    <li key={tier.name} className="flex items-center">
                      <div
                        className={`mr-2 h-5 w-5 rounded-full ${tier.color} flex items-center justify-center text-white`}
                      >
                        {tier.icon}
                      </div>
                      <span className="font-medium">{tier.name}:</span>
                      <span className="ml-1">${tier.reward.toLocaleString()} per referral</span>
                      {tier.name === currentTier.name && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Current
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-emerald-700">Total Earned</p>
                  <p className="text-2xl font-bold text-emerald-600">${totalEarned.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-amber-700">Referrals</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {completedReferrals}/{completedReferrals + pendingReferrals}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Your Referrals
              </CardTitle>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {mockReferrals.length > 0 ? (
                <ul className="divide-y">
                  {mockReferrals
                    .filter((ref) => {
                      if (activeTab === "all") return true
                      return ref.status === activeTab
                    })
                    .map((ref) => (
                      <li key={ref.id} className="flex items-center justify-between p-4">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{ref.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{ref.email}</p>
                          <p className="text-xs text-muted-foreground">Referred on {ref.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${ref.status === "completed" ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {ref.status === "completed" ? `+${ref.reward.toLocaleString()}` : "Pending"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ref.status === "completed" ? "Completed" : "Awaiting signup"}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Users className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No referrals yet</h3>
                  <p className="text-sm text-muted-foreground">Share your referral link to start earning rewards</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Referral Analytics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-amber-500" />
                Referral Analytics
              </CardTitle>
              <CardDescription>Track your referral performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <p className="text-sm text-blue-700">Conversion Rate</p>
                  <p className="text-xl font-bold text-blue-600">
                    {totalReferrals > 0 ? Math.round((completedReferrals / totalReferrals) * 100) : 0}%
                  </p>
                </div>
                <div className="rounded-lg border p-3 text-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <p className="text-sm text-purple-700">Avg. Time to Convert</p>
                  <p className="text-xl font-bold text-purple-600">3.2 days</p>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-medium flex items-center">
                  <Trophy className="mr-2 h-4 w-4 text-amber-500" />
                  Referral Milestones
                </h4>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-emerald-500" />
                      <span>First Referral</span>
                    </div>
                    <Badge variant={totalReferrals >= 1 ? "default" : "outline"}>
                      {totalReferrals >= 1 ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-amber-500" />
                      <span>5 Referrals</span>
                    </div>
                    <Badge variant={totalReferrals >= 5 ? "default" : "outline"}>
                      {totalReferrals >= 5 ? "Completed" : `${totalReferrals}/5`}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-purple-500" />
                      <span>10 Referrals</span>
                    </div>
                    <Badge variant={totalReferrals >= 10 ? "default" : "outline"}>
                      {totalReferrals >= 10 ? "Completed" : `${totalReferrals}/10`}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                Referral Leaderboard
              </CardTitle>
              <CardDescription>See how you rank against other members</CardDescription>
              <p className="text-xs text-muted-foreground mt-1">
                For privacy, only nicknames are displayed on the leaderboard
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md">
                <div className="grid grid-cols-12 border-b p-3 font-medium">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-7">User</div>
                  <div className="col-span-4 text-right">Referrals</div>
                </div>
                <div className="divide-y">
                  {mockLeaderboard.map((user) => (
                    <div key={user.id} className={`grid grid-cols-12 p-3 ${user.isCurrentUser ? "bg-primary/5" : ""}`}>
                      <div className="col-span-1">
                        {user.rank <= 3 ? (
                          <Trophy
                            className={`h-5 w-5 ${
                              user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : "text-amber-600"
                            }`}
                          />
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="col-span-7 flex items-center">
                        {user.nickname}
                        {user.isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
                        {user.referrals >= 100 && (
                          <Badge className="ml-2 bg-purple-500 hover:bg-purple-600">Legend</Badge>
                        )}
                        {user.referrals >= 25 && user.referrals < 100 && (
                          <Badge className="ml-2 bg-amber-500 hover:bg-amber-600">Harvester</Badge>
                        )}
                        {user.referrals < 25 && (
                          <Badge className="ml-2 bg-emerald-500 hover:bg-emerald-600">Grower</Badge>
                        )}
                      </div>
                      <div className="col-span-4 text-right font-medium">{user.referrals.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button variant="outline" className="w-full">
                View Full Leaderboard
              </Button>
            </CardFooter>
          </Card>

          {/* Monthly Contest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-amber-500" />
                Monthly Referral Contest
              </CardTitle>
              <CardDescription>Ends in 12 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 bg-gradient-to-br from-amber-50 to-yellow-50">
                <h3 className="text-lg font-bold">April Contest: Spring Referrals</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Refer the most friends this month to win exclusive prizes!
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5 text-yellow-500">🥇</div>
                    <div>
                      <p className="font-medium">1st Place</p>
                      <p className="text-sm text-muted-foreground">$500 bonus</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5 text-gray-400">🥈</div>
                    <div>
                      <p className="font-medium">2nd Place</p>
                      <p className="text-sm text-muted-foreground">$250 bonus</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5 text-amber-600">🥉</div>
                    <div>
                      <p className="font-medium">3rd Place</p>
                      <p className="text-sm text-muted-foreground">$100 bonus</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium">
                    Your current position: <span className="text-primary">14th</span>
                  </p>
                  <p className="text-xs text-muted-foreground">You need 4 more referrals to reach the top 10</p>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                <Share2 className="mr-2 h-4 w-4" /> Share Now to Climb the Ranks
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Referral Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            Referral Settings
          </CardTitle>
          <CardDescription>Customize your referral experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="referral-notifications">Referral Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone uses your referral link</p>
            </div>
            <Switch id="referral-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="leaderboard-visibility">Leaderboard Visibility</Label>
              <p className="text-sm text-muted-foreground">Show your nickname on the referral leaderboard</p>
            </div>
            <Switch id="leaderboard-visibility" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="referral-nickname">Nickname</Label>
              <p className="text-sm text-muted-foreground">This name will be shown on the referral leaderboard</p>
            </div>
            <div className="w-[180px]">
              <Input
                id="referral-nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-message">Default Referral Message</Label>
            <Textarea
              id="default-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Common questions about our referral program</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ol className="list-inside list-decimal space-y-4 mt-4">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <div>
                <p className="font-medium">Share your referral link</p>
                <p className="text-sm text-muted-foreground">Send your unique referral link to friends and family</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <div>
                <p className="font-medium">Friends create an account</p>
                <p className="text-sm text-muted-foreground">They sign up using your referral link</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <div>
                <p className="font-medium">You earn rewards</p>
                <p className="text-sm text-muted-foreground">
                  Earn up to ${referralTiers[referralTiers.length - 1].reward.toLocaleString()} for each friend who
                  joins
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
