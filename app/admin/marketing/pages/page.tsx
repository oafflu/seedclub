"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, PlusCircle, ChevronRight, Search, Eye, ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for marketing pages
const marketingPages = [
  {
    id: 1,
    title: "Home Page",
    path: "/marketing",
    lastEdited: "2023-12-10",
    status: "published",
    sections: 8,
    template: "Landing Page",
  },
  {
    id: 2,
    title: "About Us",
    path: "/about",
    lastEdited: "2023-11-15",
    status: "published",
    sections: 4,
    template: "Standard",
  },
  {
    id: 3,
    title: "Careers",
    path: "/careers",
    lastEdited: "2023-10-20",
    status: "published",
    sections: 3,
    template: "Standard",
  },
  {
    id: 4,
    title: "Contact Us",
    path: "/contact",
    lastEdited: "2023-09-05",
    status: "published",
    sections: 2,
    template: "Form",
  },
  {
    id: 5,
    title: "FAQ",
    path: "/faq",
    lastEdited: "2023-08-12",
    status: "published",
    sections: 5,
    template: "Accordion",
  },
  {
    id: 6,
    title: "Blog",
    path: "/blog",
    lastEdited: "2023-07-22",
    status: "published",
    sections: 6,
    template: "Blog List",
  },
  {
    id: 7,
    title: "Terms of Service",
    path: "/terms",
    lastEdited: "2023-06-30",
    status: "published",
    sections: 1,
    template: "Legal",
  },
  {
    id: 8,
    title: "Privacy Policy",
    path: "/privacy",
    lastEdited: "2023-06-30",
    status: "published",
    sections: 1,
    template: "Legal",
  },
]

export default function MarketingPagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [templateFilter, setTemplateFilter] = useState("all")

  // Filter pages based on search query and filters
  const filteredPages = marketingPages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || page.status === statusFilter
    const matchesTemplate = templateFilter === "all" || page.template.toLowerCase() === templateFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesTemplate
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
          <h1 className="text-2xl font-bold">Marketing Pages</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/marketing" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/marketing/pages/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle>All Pages</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search pages..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <CardDescription>Manage your website's marketing pages</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Last Edited</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No pages found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-muted-foreground">{page.path}</TableCell>
                        <TableCell>{page.template}</TableCell>
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
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select value={templateFilter} onValueChange={setTemplateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="landing page">Landing Page</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="accordion">Accordion</SelectItem>
                    <SelectItem value="blog list">Blog List</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
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
                <Link href="/admin/marketing/pages/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Page
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/marketing/pages/templates">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Templates
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
    </div>
  )
}
