"use client"

import { useState } from "react"
import Link from "next/link"
import { Layout, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  // This would typically come from a database
  const components = [
    { id: 1, name: "Hero Banner", location: "Home Page", lastUpdated: "2023-04-15", status: "Active" },
    { id: 2, name: "Features Section", location: "Features Page", lastUpdated: "2023-04-10", status: "Active" },
    { id: 3, name: "How It Works Steps", location: "How It Works Page", lastUpdated: "2023-04-12", status: "Active" },
    { id: 4, name: "Profit Calculator", location: "Calculator Page", lastUpdated: "2023-04-14", status: "Active" },
    { id: 5, name: "FAQ Accordion", location: "FAQ Page", lastUpdated: "2023-04-08", status: "Active" },
    { id: 6, name: "Call to Action", location: "Multiple Pages", lastUpdated: "2023-04-05", status: "Active" },
    { id: 7, name: "Contact Form", location: "Contact Page", lastUpdated: "2023-04-03", status: "Active" },
  ]

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Components</h1>
        <Button>Create New Component</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Components</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>{component.location}</TableCell>
                  <TableCell>{component.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge variant={component.status === "Active" ? "success" : "outline"}>{component.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/marketing/components/edit/${component.id}`}>Edit</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
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
  )
}
