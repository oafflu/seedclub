"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Layout, ImageIcon, Menu, PlusCircle, ChevronRight, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for marketing pages
const marketingPages = [
  {
    id: 1,
    title: "Home Page",
    path: "/marketing",
    lastEdited: "2023-12-10",
    status: "published",
    sections: 8,
  },
  {
    id: 2,
    title: "About Us",
    path: "/about",
    lastEdited: "2023-11-15",
    status: "published",
    sections: 4,
  },
  {
    id: 3,
    title: "Careers",
    path: "/careers",
    lastEdited: "2023-10-20",
    status: "published",
    sections: 3,
  },
  {
    id: 4,
    title: "Contact Us",
    path: "/contact",
    lastEdited: "2023-09-05",
    status: "published",
    sections: 2,
  },
  {
    id: 5,
    title: "FAQ",
    path: "/faq",
    lastEdited: "2023-08-12",
    status: "published",
    sections: 5,
  },
  {
    id: 6,
    title: "Blog",
    path: "/blog",
    lastEdited: "2023-07-22",
    status: "published",
    sections: 6,
  },
  {
    id: 7,
    title: "Terms of Service",
    path: "/terms",
    lastEdited: "2023-06-30",
    status: "published",
    sections: 1,
  },
]

// Sample data for marketing components
const marketingComponents = [
  {
    id: 1,
    name: "Header",
    type: "global",
    pages: "All Pages",
    lastEdited: "2023-11-28",
  },
  {
    id: 2,
    name: "Footer",
    type: "global",
    pages: "All Pages",
    lastEdited: "2023-11-28",
  },
  {
    id: 3,
    name: "Hero Section",
    type: "reusable",
    pages: "Home, About",
    lastEdited: "2023-12-01",
  },
  {
    id: 4,
    name: "Features Grid",
    type: "reusable",
    pages: "Home, Features",
    lastEdited: "2023-12-03",
  },
  {
    id: 5,
    name: "Testimonials Carousel",
    type: "reusable",
    pages: "Home, About",
    lastEdited: "2023-12-05",
  },
  {
    id: 6,
    name: "Call to Action",
    type: "reusable",
    pages: "Multiple",
    lastEdited: "2023-12-02",
  },
]

// Sample data for marketing assets
const marketingAssets = [
  {
    id: 1,
    name: "marketing-home-banner.jpg",
    type: "image/jpeg",
    size: "1.2 MB",
    dimensions: "1920x1080",
    uploaded: "2023-12-01",
    usedIn: "Home Page",
  },
  {
    id: 2,
    name: "about-team.jpg",
    type: "image/jpeg",
    size: "0.8 MB",
    dimensions: "1200x800",
    uploaded: "2023-11-15",
    usedIn: "About Page",
  },
  {
    id: 3,
    name: "feature-icon-1.svg",
    type: "image/svg+xml",
    size: "5 KB",
    dimensions: "64x64",
    uploaded: "2023-10-20",
    usedIn: "Features Section",
  },
  {
    id: 4,
    name: "testimonial-avatar-1.png",
    type: "image/png",
    size: "0.2 MB",
    dimensions: "200x200",
    uploaded: "2023-09-15",
    usedIn: "Testimonials",
  },
  {
    id: 5,
    name: "product-showcase.png",
    type: "image/png",
    size: "1.5 MB",
    dimensions: "2400x1600",
    uploaded: "2023-08-10",
    usedIn: "Product Section",
  },
]

export default function MarketingManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marketing Management</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/marketing" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Link>
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Pages Tab Content */}
        <TabsContent value="pages">
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pages..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle>Marketing Pages</CardTitle>
                <Button variant="default" size="sm" asChild>
                  <Link href="/admin/marketing/pages">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Page
                  </Link>
                </Button>
              </div>
              <CardDescription>Manage your website's marketing pages</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Last Edited</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-muted-foreground">{page.path}</TableCell>
                      <TableCell>{page.lastEdited}</TableCell>
                      <TableCell>
                        <Badge variant={page.status === "published" ? "default" : "outline"}>{page.status}</Badge>
                      </TableCell>
                      <TableCell>{page.sections}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/marketing/pages/edit/${page.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={page.path} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab Content */}
        <TabsContent value="components">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Marketing Components</CardTitle>
                  <Button variant="default" size="sm" asChild>
                    <Link href="/admin/marketing/components">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Component
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Manage reusable components like headers, footers, and section templates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Used In</TableHead>
                      <TableHead>Last Edited</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketingComponents.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell className="font-medium">{component.name}</TableCell>
                        <TableCell>
                          <Badge variant={component.type === "global" ? "default" : "outline"}>{component.type}</Badge>
                        </TableCell>
                        <TableCell>{component.pages}</TableCell>
                        <TableCell>{component.lastEdited}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/marketing/components/edit/${component.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle>Global Components</CardTitle>
                <CardDescription>Edit components used across the entire site</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Menu className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <h3 className="font-medium">Header Navigation</h3>
                          <p className="text-sm text-muted-foreground">Main site navigation</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/marketing/components/edit/header">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Menu className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <h3 className="font-medium">Footer</h3>
                          <p className="text-sm text-muted-foreground">Site footer with links</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/marketing/components/edit/footer">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Layout className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <h3 className="font-medium">CTAs</h3>
                          <p className="text-sm text-muted-foreground">Global call-to-action buttons</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/marketing/components/edit/ctas">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assets Tab Content */}
        <TabsContent value="assets">
          <div className="grid gap-6 grid-cols-1">
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Marketing Assets</CardTitle>
                  <Button variant="default" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Upload Assets
                  </Button>
                </div>
                <CardDescription>Manage images, videos, and other assets used in your marketing pages</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Used In</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketingAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="h-10 w-10 rounded-md bg-muted relative overflow-hidden">
                            {asset.type.includes("image") && (
                              <ImageIcon className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.size}</TableCell>
                        <TableCell>{asset.dimensions}</TableCell>
                        <TableCell>{asset.uploaded}</TableCell>
                        <TableCell>{asset.usedIn}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="settings">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Manage global SEO settings for marketing pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Meta Title</label>
                    <Input defaultValue="Seed Club | Grow Your Wealth" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Meta Description</label>
                    <Input defaultValue="Invest in time-bound jars with guaranteed returns. Start your financial growth journey today with Seed Club." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OG Image</label>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-16 bg-muted rounded-md relative overflow-hidden">
                        <ImageIcon className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save SEO Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Manage social media profiles linked from the website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facebook</label>
                    <Input defaultValue="https://facebook.com/seedclub" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter</label>
                    <Input defaultValue="https://twitter.com/seedclub" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    <Input defaultValue="https://instagram.com/seedclub" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input defaultValue="https://linkedin.com/company/seedclub" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Social Links</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
