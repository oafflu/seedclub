"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, PlusCircle, ChevronRight, Search, Eye, ArrowLeft, Layout, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Sample data for marketing components
const marketingComponents = [
  {
    id: 1,
    name: "Header",
    type: "global",
    pages: "All Pages",
    lastEdited: "2023-11-28",
    category: "Navigation",
  },
  {
    id: 2,
    name: "Footer",
    type: "global",
    pages: "All Pages",
    lastEdited: "2023-11-28",
    category: "Navigation",
  },
  {
    id: 3,
    name: "Hero Section",
    type: "reusable",
    pages: "Home, About",
    lastEdited: "2023-12-01",
    category: "Content",
  },
  {
    id: 4,
    name: "Features Grid",
    type: "reusable",
    pages: "Home, Features",
    lastEdited: "2023-12-03",
    category: "Content",
  },
  {
    id: 5,
    name: "Testimonials Carousel",
    type: "reusable",
    pages: "Home, About",
    lastEdited: "2023-12-05",
    category: "Content",
  },
  {
    id: 6,
    name: "Call to Action",
    type: "reusable",
    pages: "Multiple",
    lastEdited: "2023-12-02",
    category: "Conversion",
  },
  {
    id: 7,
    name: "Newsletter Signup",
    type: "reusable",
    pages: "Home, Blog",
    lastEdited: "2023-11-20",
    category: "Conversion",
  },
  {
    id: 8,
    name: "Product Showcase",
    type: "reusable",
    pages: "Home, Products",
    lastEdited: "2023-11-15",
    category: "Content",
  },
]

// Sample data for global components
const globalComponents = [
  {
    id: 1,
    name: "Header Navigation",
    description: "Main site navigation",
    icon: Menu,
    editLink: "/admin/marketing/components/edit/header",
  },
  {
    id: 2,
    name: "Footer",
    description: "Site footer with links",
    icon: Menu,
    editLink: "/admin/marketing/components/edit/footer",
  },
  {
    id: 3,
    name: "CTAs",
    description: "Global call-to-action buttons",
    icon: Layout,
    editLink: "/admin/marketing/components/edit/ctas",
  },
  {
    id: 4,
    name: "Mobile Menu",
    description: "Mobile navigation menu",
    icon: Menu,
    editLink: "/admin/marketing/components/edit/mobile-menu",
  },
]

export default function MarketingComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter components based on search query and filters
  const filteredComponents = marketingComponents.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || component.type === typeFilter
    const matchesCategory = categoryFilter === "all" || component.category === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/marketing">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Marketing Components</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/marketing" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/marketing/components/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Component
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Components</TabsTrigger>
          <TabsTrigger value="global">Global Components</TabsTrigger>
          <TabsTrigger value="reusable">Reusable Components</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>All Components</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search components..."
                          className="w-full pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
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
                        <TableHead>Category</TableHead>
                        <TableHead>Used In</TableHead>
                        <TableHead>Last Edited</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComponents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No components found matching your search criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredComponents.map((component) => (
                          <TableRow key={component.id}>
                            <TableCell className="font-medium">{component.name}</TableCell>
                            <TableCell>
                              <Badge variant={component.type === "global" ? "default" : "outline"}>
                                {component.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{component.category}</TableCell>
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="reusable">Reusable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Navigation">Navigation</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/marketing/components/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Component
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/marketing/components/library">
                      <Layout className="mr-2 h-4 w-4" />
                      Component Library
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/marketing">
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Back to Marketing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="global">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalComponents.map((component) => (
              <Card key={component.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <component.icon className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={component.editLink}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>{component.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-32 bg-muted/30 flex items-center justify-center border-t">
                    <span className="text-sm text-muted-foreground">Component Preview</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reusable">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Reusable Components</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search components..."
                          className="w-full pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <CardDescription>Components that can be used across multiple pages</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Used In</TableHead>
                        <TableHead>Last Edited</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComponents
                        .filter((component) => component.type === "reusable")
                        .map((component) => (
                          <TableRow key={component.id}>
                            <TableCell className="font-medium">{component.name}</TableCell>
                            <TableCell>{component.category}</TableCell>
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
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Component Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Navigation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Conversion
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Media
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
