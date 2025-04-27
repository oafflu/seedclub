"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Save, ArrowLeft, Laptop, Smartphone, Tablet, Eye, Code, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Sample header data
const headerData = {
  id: "header",
  title: "Header Navigation",
  type: "global",
  content: {
    logo: "/images/seedclub-logo.svg",
    links: [
      { label: "Home", url: "/" },
      { label: "About", url: "/about" },
      { label: "Features", url: "/features" },
      { label: "Pricing", url: "/pricing" },
      { label: "Contact", url: "/contact" },
    ],
    primaryCTA: {
      label: "Sign In",
      url: "/auth/login",
    },
    secondaryCTA: {
      label: "Get Started",
      url: "/auth/register",
    },
  },
  styles: {
    background: "white",
    textColor: "black",
    sticky: true,
    transparent: false,
    height: "64px",
  },
}

export default function EditMarketingComponentPage() {
  const params = useParams()
  const router = useRouter()
  const [component, setComponent] = useState(headerData)
  const [activeView, setActiveView] = useState("desktop")
  const [showCode, setShowCode] = useState(false)

  const handleSave = () => {
    // Save logic would be implemented here
    console.log("Saving component:", component)
    // Mock success
    router.push("/admin/marketing")
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
          <h1 className="text-2xl font-bold">Edit Component: {component.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
            <Code className="mr-2 h-4 w-4" />
            {showCode ? "Hide Code" : "View Code"}
          </Button>
          <Button variant="outline" asChild size="sm">
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Component
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-2/3">
          <Card className="mb-6">
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <CardTitle>Component Settings</CardTitle>
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
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-32 bg-muted rounded-md overflow-hidden relative">
                        {component.content.logo && (
                          <img
                            src={component.content.logo || "/placeholder.svg"}
                            alt="Logo"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Change Logo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Navigation Links</Label>
                    {component.content.links.map((link, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          value={link.label}
                          placeholder="Link Text"
                          className="flex-1"
                          onChange={(e) => {
                            const newLinks = [...component.content.links]
                            newLinks[i].label = e.target.value
                            setComponent({
                              ...component,
                              content: {
                                ...component.content,
                                links: newLinks,
                              },
                            })
                          }}
                        />
                        <Input
                          value={link.url}
                          placeholder="URL"
                          className="flex-1"
                          onChange={(e) => {
                            const newLinks = [...component.content.links]
                            newLinks[i].url = e.target.value
                            setComponent({
                              ...component,
                              content: {
                                ...component.content,
                                links: newLinks,
                              },
                            })
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newLinks = [...component.content.links]
                            newLinks.splice(i, 1)
                            setComponent({
                              ...component,
                              content: {
                                ...component.content,
                                links: newLinks,
                              },
                            })
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setComponent({
                          ...component,
                          content: {
                            ...component.content,
                            links: [...component.content.links, { label: "New Link", url: "/" }],
                          },
                        })
                      }}
                    >
                      Add Link
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary CTA</Label>
                      <Input
                        value={component.content.primaryCTA.label}
                        placeholder="Button Text"
                        onChange={(e) => {
                          setComponent({
                            ...component,
                            content: {
                              ...component.content,
                              primaryCTA: {
                                ...component.content.primaryCTA,
                                label: e.target.value,
                              },
                            },
                          })
                        }}
                      />
                      <Input
                        value={component.content.primaryCTA.url}
                        placeholder="URL"
                        onChange={(e) => {
                          setComponent({
                            ...component,
                            content: {
                              ...component.content,
                              primaryCTA: {
                                ...component.content.primaryCTA,
                                url: e.target.value,
                              },
                            },
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary CTA</Label>
                      <Input
                        value={component.content.secondaryCTA.label}
                        placeholder="Button Text"
                        onChange={(e) => {
                          setComponent({
                            ...component,
                            content: {
                              ...component.content,
                              secondaryCTA: {
                                ...component.content.secondaryCTA,
                                label: e.target.value,
                              },
                            },
                          })
                        }}
                      />
                      <Input
                        value={component.content.secondaryCTA.url}
                        placeholder="URL"
                        onChange={(e) => {
                          setComponent({
                            ...component,
                            content: {
                              ...component.content,
                              secondaryCTA: {
                                ...component.content.secondaryCTA,
                                url: e.target.value,
                              },
                            },
                          })
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <div
                        className={`w-8 h-8 rounded-full bg-white border cursor-pointer ${component.styles.background === "white" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, background: "white" } })
                        }
                      ></div>
                      <div
                        className={`w-8 h-8 rounded-full bg-gray-100 border cursor-pointer ${component.styles.background === "gray-100" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, background: "gray-100" } })
                        }
                      ></div>
                      <div
                        className={`w-8 h-8 rounded-full bg-primary/10 border cursor-pointer ${component.styles.background === "primary/10" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, background: "primary/10" } })
                        }
                      ></div>
                      <div
                        className={`w-8 h-8 rounded-full bg-black border cursor-pointer ${component.styles.background === "black" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, background: "black" } })
                        }
                      ></div>
                      <Input type="color" className="w-8 h-8 p-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <div
                        className={`w-8 h-8 rounded-full bg-black border cursor-pointer ${component.styles.textColor === "black" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, textColor: "black" } })
                        }
                      ></div>
                      <div
                        className={`w-8 h-8 rounded-full bg-white border cursor-pointer ${component.styles.textColor === "white" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, textColor: "white" } })
                        }
                      ></div>
                      <div
                        className={`w-8 h-8 rounded-full bg-gray-600 border cursor-pointer ${component.styles.textColor === "gray-600" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, textColor: "gray-600" } })
                        }
                      ></div>
                      <div
                        className={`w-8 h-8 rounded-full bg-primary border cursor-pointer ${component.styles.textColor === "primary" ? "ring-2 ring-primary" : ""}`}
                        onClick={() =>
                          setComponent({ ...component, styles: { ...component.styles, textColor: "primary" } })
                        }
                      ></div>
                      <Input type="color" className="w-8 h-8 p-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={component.styles.height}
                      onChange={(e) =>
                        setComponent({ ...component, styles: { ...component.styles, height: e.target.value } })
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sticky"
                      checked={component.styles.sticky}
                      onCheckedChange={(checked) =>
                        setComponent({ ...component, styles: { ...component.styles, sticky: checked } })
                      }
                    />
                    <Label htmlFor="sticky">Sticky Header</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="transparent"
                      checked={component.styles.transparent}
                      onCheckedChange={(checked) =>
                        setComponent({ ...component, styles: { ...component.styles, transparent: checked } })
                      }
                    />
                    <Label htmlFor="transparent">Transparent Background</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="showOnMobile" defaultChecked />
                    <Label htmlFor="showOnMobile">Show on Mobile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="showOnDesktop" defaultChecked />
                    <Label htmlFor="showOnDesktop">Show on Desktop</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className={`${activeView === "mobile" ? "max-w-[375px]" : activeView === "tablet" ? "max-w-[768px]" : "w-full"} mx-auto transition-all duration-300`}
              >
                <div
                  className={`h-16 border-b flex items-center justify-between px-4 ${component.styles.background === "white" ? "bg-white" : component.styles.background === "black" ? "bg-black" : component.styles.background === "gray-100" ? "bg-gray-100" : component.styles.background === "primary/10" ? "bg-primary/10" : "bg-white"}`}
                >
                  <div className="relative h-8 w-32">
                    <img
                      src={component.content.logo || "/placeholder.svg"}
                      alt="Logo"
                      className="object-contain object-left h-full"
                    />
                  </div>

                  {activeView !== "mobile" && (
                    <div className="hidden md:flex items-center space-x-6">
                      {component.content.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          className={`text-sm ${component.styles.textColor === "white" ? "text-white" : component.styles.textColor === "black" ? "text-black" : component.styles.textColor === "primary" ? "text-primary" : "text-black"}`}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      className={`hidden sm:block ${component.styles.textColor === "white" ? "text-white" : "text-black"}`}
                    >
                      {component.content.primaryCTA.label}
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-md text-sm">
                      {component.content.secondaryCTA.label}
                    </button>
                    {activeView === "mobile" && (
                      <button className={`${component.styles.textColor === "white" ? "text-white" : "text-black"}`}>
                        ☰
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/3">
          {showCode ? (
            <Card>
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Component Code</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowCode(false)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{`
<header
  className="${component.styles.background === "white" ? "bg-white" : component.styles.background === "black" ? "bg-black" : component.styles.background === "gray-100" ? "bg-gray-100" : component.styles.background === "primary/10" ? "bg-primary/10" : "bg-white"} 
    ${component.styles.sticky ? "sticky top-0 z-40" : ""} 
    ${component.styles.transparent ? "bg-transparent" : ""} 
    border-b">
  <div className="container flex h-${component.styles.height.replace("px", "")} items-center justify-between px-4">
    <div className="flex items-center gap-2">
      <Link href="/" className="relative h-8 w-32">
        <Image
          src="${component.content.logo}"
          alt="Logo"
          fill
          className="object-contain object-left"
          priority
        />
      </Link>
    </div>

    <div className="hidden md:flex items-center space-x-6">
      ${component.content.links.map((link) => `<Link href="${link.url}" className="${component.styles.textColor === "white" ? "text-white" : component.styles.textColor === "black" ? "text-black" : component.styles.textColor === "primary" ? "text-primary" : "text-black"}">${link.label}</Link>`).join("\n      ")}
    </div>

    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <Link href="${component.content.primaryCTA.url}">${component.content.primaryCTA.label}</Link>
      </Button>
      <Button asChild>
        <Link href="${component.content.secondaryCTA.url}">${component.content.secondaryCTA.label}</Link>
      </Button>
    </div>
  </div>
</header>
                  `}</pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Component Info</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="componentTitle">Component Title</Label>
                  <Input
                    id="componentTitle"
                    value={component.title}
                    onChange={(e) => setComponent({ ...component, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="componentDescription">Description</Label>
                  <Textarea
                    id="componentDescription"
                    placeholder="Component description"
                    defaultValue="The main navigation header that appears on all marketing pages."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="componentType">Component Type</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                      <Layers className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{component.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Global components appear on all pages and can only be edited from here.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Pages Using This Component</Label>
                  <div className="space-y-1">
                    <div className="text-sm">All Marketing Pages</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last edited</Label>
                  <div className="text-sm">April 9, 2025, 2:25 AM</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
