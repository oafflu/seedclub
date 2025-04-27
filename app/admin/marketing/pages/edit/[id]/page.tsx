"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Save,
  ArrowLeft,
  Laptop,
  Smartphone,
  Tablet,
  Plus,
  Trash2,
  Eye,
  MoveUp,
  MoveDown,
  Layers,
  Settings,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Page sections data (sample)
const pageSections = [
  {
    id: 1,
    type: "hero",
    title: "Hero Section",
    content: {
      heading: "Grow Your Wealth with Seed Club",
      subheading: "Invest in time-bound jars with guaranteed returns. Start your financial growth journey today.",
      ctaText: "Get Started",
      ctaLink: "/auth/register",
      secondaryCtaText: "Learn More",
      secondaryCtaLink: "#how-it-works",
      backgroundImage: "/images/marketing-home-banner.jpg",
    },
  },
  {
    id: 2,
    type: "features",
    title: "Features Section",
    content: {
      heading: "Why Choose Seed Club?",
      features: [
        {
          title: "Guaranteed Returns",
          description: "Enjoy fixed APY rates of 10%, 12%, or 15% based on your chosen term length.",
          icon: "TrendingUp",
        },
        {
          title: "Secure Investment",
          description: "Your principal is fully secured, and your returns are guaranteed at the stated APY rate.",
          icon: "Shield",
        },
        {
          title: "Flexible Terms",
          description: "Choose from 12, 24, or 36-month terms to match your financial goals.",
          icon: "Clock",
        },
        {
          title: "Mobile Access",
          description: "Track and manage your investments anytime, anywhere with our easy-to-use mobile app.",
          icon: "Smartphone",
        },
      ],
    },
  },
  {
    id: 3,
    type: "appShowcase",
    title: "App Showcase Section",
    content: {
      heading: "Manage Your Investments On The Go",
      description:
        "The Seed Club mobile app gives you full control of your investments anytime, anywhere. Track your growth, manage your jars, and make deposits with just a few taps.",
      appStoreLink: "https://apps.apple.com",
      playStoreLink: "https://play.google.com",
      screenshot: "/placeholder.svg?height=600&width=300",
    },
  },
]

// Page metadata (sample)
const pageMetadata = {
  id: 1,
  title: "Home Page",
  slug: "marketing",
  description: "Grow your wealth with Seed Club's investment jars",
  status: "published",
  lastEdited: "2023-12-10",
  featuredImage: "/images/marketing-home-banner.jpg",
  metaTitle: "Seed Club | Grow Your Wealth with Guaranteed Returns",
  metaDescription:
    "Invest in time-bound jars with guaranteed returns. Start your financial growth journey today with Seed Club.",
}

export default function EditMarketingPage() {
  const params = useParams()
  const router = useRouter()
  const [activeView, setActiveView] = useState("desktop")
  const [pageData, setPageData] = useState(pageMetadata)
  const [sections, setSections] = useState(pageSections)
  const [editingSection, setEditingSection] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("content")

  const handleSave = () => {
    // Save logic would be implemented here
    console.log("Saving page data:", pageData)
    console.log("Saving sections:", sections)
    // Mock success
    router.push("/admin/marketing")
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index - 1]
    newSections[index - 1] = temp
    setSections(newSections)
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index + 1]
    newSections[index + 1] = temp
    setSections(newSections)
  }

  const duplicateSection = (index: number) => {
    const sectionToDuplicate = sections[index]
    const newSection = {
      ...sectionToDuplicate,
      id: Date.now(), // Generate a unique id
    }
    const newSections = [...sections]
    newSections.splice(index + 1, 0, newSection)
    setSections(newSections)
  }

  const deleteSection = (index: number) => {
    const newSections = [...sections]
    newSections.splice(index, 1)
    setSections(newSections)
    setEditingSection(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/marketing">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Page: {pageData.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild size="sm">
            <Link href={`/${pageData.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Page
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-2/3">
          <Card className="mb-6">
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <CardTitle>Page Settings</CardTitle>
                <div className="flex items-center gap-2">
                  <Toggle pressed={activeView === "desktop"} onClick={() => setActiveView("desktop")}>
                    <Laptop className="h-4 w-4" />
                  </Toggle>
                  <Toggle pressed={activeView === "tablet"} onClick={() => setActiveView("tablet")}>
                    <Tablet className="h-4 w-4" />
                  </Toggle>
                  <Toggle pressed={activeView === "mobile"} onClick={() => setActiveView("mobile")}>
                    <Smartphone className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title</Label>
                      <Input
                        id="title"
                        value={pageData.title}
                        onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Page Slug</Label>
                      <Input
                        id="slug"
                        value={pageData.slug}
                        onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Page Description</Label>
                    <Textarea
                      id="description"
                      value={pageData.description}
                      onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={pageData.status === "published"}
                      onCheckedChange={(checked) =>
                        setPageData({ ...pageData, status: checked ? "published" : "draft" })
                      }
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={pageData.metaTitle}
                      onChange={(e) => setPageData({ ...pageData, metaTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={pageData.metaDescription}
                      onChange={(e) => setPageData({ ...pageData, metaDescription: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-20 w-32 bg-muted rounded-md overflow-hidden relative">
                        {pageData.featuredImage && (
                          <img
                            src={pageData.featuredImage || "/placeholder.svg"}
                            alt="Featured"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Change Image
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">Page Template</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                        <SelectItem value="fullwidth">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="indexable" defaultChecked />
                    <Label htmlFor="indexable">Allow search engine indexing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="caching" defaultChecked />
                    <Label htmlFor="caching">Enable page caching</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Page Sections</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            </div>

            <div
              className={`border rounded-lg p-3 ${activeView === "mobile" ? "max-w-[375px]" : activeView === "tablet" ? "max-w-[768px]" : "w-full"} mx-auto transition-all duration-300 bg-white`}
            >
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`border rounded-lg mb-4 ${editingSection === index ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
                >
                  <div className="bg-muted/40 p-3 flex items-center justify-between border-b">
                    <div className="flex items-center">
                      <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingSection(editingSection === index ? null : index)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveSectionUp(index)} disabled={index === 0}>
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSectionDown(index)}
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => duplicateSection(index)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteSection(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {section.type === "hero" && (
                    <div className="p-4 flex flex-col items-center text-center space-y-4 bg-gray-100 min-h-[200px]">
                      <div className="text-2xl font-bold">{section.content.heading}</div>
                      <div className="text-sm text-muted-foreground">{section.content.subheading}</div>
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-4 py-2 rounded">{section.content.ctaText}</button>
                        <button className="bg-transparent border border-primary text-primary px-4 py-2 rounded">
                          {section.content.secondaryCtaText}
                        </button>
                      </div>
                    </div>
                  )}
                  {section.type === "features" && (
                    <div className="p-4 space-y-4 min-h-[150px]">
                      <div className="text-xl font-bold text-center">{section.content.heading}</div>
                      <div className="grid grid-cols-2 gap-4">
                        {section.content.features.slice(0, 2).map((feature, i) => (
                          <div key={i} className="border p-3 rounded">
                            <div className="font-medium">{feature.title}</div>
                            <div className="text-sm text-muted-foreground">{feature.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.type === "appShowcase" && (
                    <div className="p-4 flex flex-col md:flex-row gap-4 min-h-[150px]">
                      <div className="flex-1">
                        <div className="text-xl font-bold">{section.content.heading}</div>
                        <div className="text-sm text-muted-foreground mt-2">{section.content.description}</div>
                        <div className="flex gap-2 mt-4">
                          <button className="bg-black text-white text-xs px-3 py-1 rounded">App Store</button>
                          <button className="bg-black text-white text-xs px-3 py-1 rounded">Google Play</button>
                        </div>
                      </div>
                      <div className="w-[120px] h-[200px] bg-gray-200 rounded relative shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                          App Screen
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/3">
          {editingSection !== null ? (
            <Card>
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Edit Section</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    {sections[editingSection]?.type === "hero" && (
                      <>
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            value={sections[editingSection].content.heading}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[editingSection].content.heading = e.target.value
                              setSections(newSections)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subheading</Label>
                          <Textarea
                            value={sections[editingSection].content.subheading}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[editingSection].content.subheading = e.target.value
                              setSections(newSections)
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Primary CTA Text</Label>
                            <Input
                              value={sections[editingSection].content.ctaText}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[editingSection].content.ctaText = e.target.value
                                setSections(newSections)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Primary CTA Link</Label>
                            <Input
                              value={sections[editingSection].content.ctaLink}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[editingSection].content.ctaLink = e.target.value
                                setSections(newSections)
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Secondary CTA Text</Label>
                            <Input
                              value={sections[editingSection].content.secondaryCtaText}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[editingSection].content.secondaryCtaText = e.target.value
                                setSections(newSections)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Secondary CTA Link</Label>
                            <Input
                              value={sections[editingSection].content.secondaryCtaLink}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[editingSection].content.secondaryCtaLink = e.target.value
                                setSections(newSections)
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Background Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="h-16 w-24 bg-muted rounded-md overflow-hidden relative">
                              {sections[editingSection].content.backgroundImage && (
                                <img
                                  src={sections[editingSection].content.backgroundImage || "/placeholder.svg"}
                                  alt="Background"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              Change Image
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {sections[editingSection]?.type === "features" && (
                      <>
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            value={sections[editingSection].content.heading}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[editingSection].content.heading = e.target.value
                              setSections(newSections)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Features</Label>
                          {sections[editingSection].content.features.map((feature, i) => (
                            <div key={i} className="border p-3 rounded-md mb-2">
                              <div className="space-y-2 mb-2">
                                <Label>Feature {i + 1} Title</Label>
                                <Input
                                  value={feature.title}
                                  onChange={(e) => {
                                    const newSections = [...sections]
                                    newSections[editingSection].content.features[i].title = e.target.value
                                    setSections(newSections)
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Feature {i + 1} Description</Label>
                                <Textarea
                                  value={feature.description}
                                  onChange={(e) => {
                                    const newSections = [...sections]
                                    newSections[editingSection].content.features[i].description = e.target.value
                                    setSections(newSections)
                                  }}
                                />
                              </div>
                              <div className="space-y-2 mt-2">
                                <Label>Feature {i + 1} Icon</Label>
                                <Select
                                  value={feature.icon}
                                  onValueChange={(value) => {
                                    const newSections = [...sections]
                                    newSections[editingSection].content.features[i].icon = value
                                    setSections(newSections)
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="TrendingUp">Trending Up</SelectItem>
                                    <SelectItem value="Shield">Shield</SelectItem>
                                    <SelectItem value="Clock">Clock</SelectItem>
                                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newSections = [...sections]
                              newSections[editingSection].content.features.push({
                                title: "New Feature",
                                description: "Feature description",
                                icon: "TrendingUp",
                              })
                              setSections(newSections)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Feature
                          </Button>
                        </div>
                      </>
                    )}

                    {sections[editingSection]?.type === "appShowcase" && (
                      <>
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            value={sections[editingSection].content.heading}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[editingSection].content.heading = e.target.value
                              setSections(newSections)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={sections[editingSection].content.description}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[editingSection].content.description = e.target.value
                              setSections(newSections)
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>App Store Link</Label>
                            <Input
                              value={sections[editingSection].content.appStoreLink}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[editingSection].content.appStoreLink = e.target.value
                                setSections(newSections)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Google Play Link</Label>
                            <Input
                              value={sections[editingSection].content.playStoreLink}
                              onChange={(e) => {
                                const newSections = [...sections]
                                newSections[editingSection].content.playStoreLink = e.target.value
                                setSections(newSections)
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>App Screenshot</Label>
                          <div className="flex items-center gap-2">
                            <div className="h-20 w-12 bg-muted rounded-md overflow-hidden relative">
                              {sections[editingSection].content.screenshot && (
                                <img
                                  src={sections[editingSection].content.screenshot || "/placeholder.svg"}
                                  alt="Screenshot"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              Change Image
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 border cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-primary/10 border cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-muted border cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-800 border cursor-pointer"></div>
                        <Input type="color" className="w-8 h-8 p-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Padding</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <span className="text-xs">Top</span>
                          <Input type="number" min="0" defaultValue="4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs">Right</span>
                          <Input type="number" min="0" defaultValue="4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs">Bottom</span>
                          <Input type="number" min="0" defaultValue="4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs">Left</span>
                          <Input type="number" min="0" defaultValue="4" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Alignment</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Left
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Center
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Right
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="fullWidth" />
                      <Label htmlFor="fullWidth">Full Width</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="showOnMobile" defaultChecked />
                      <Label htmlFor="showOnMobile">Show on Mobile</Label>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Available Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Hero Section</span>
                      <span className="text-xs text-muted-foreground">Full-width banner with heading and CTA</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Features Grid</span>
                      <span className="text-xs text-muted-foreground">Display product features in a grid layout</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">App Showcase</span>
                      <span className="text-xs text-muted-foreground">Highlight mobile app with screenshots</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Testimonials</span>
                      <span className="text-xs text-muted-foreground">Customer reviews and quotes</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Pricing Table</span>
                      <span className="text-xs text-muted-foreground">Display subscription tiers and pricing</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Call to Action</span>
                      <span className="text-xs text-muted-foreground">Prompt users to take action</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
