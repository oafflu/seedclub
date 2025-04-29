"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketing Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
            <CardDescription>Manage website pages like Home, Features, How It Works, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/marketing/pages">Manage Pages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>Manage reusable components like Hero Banners, Feature Sections, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/marketing/components">Manage Components</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Configure website navigation menus and links</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/marketing/navigation">Manage Navigation</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>Manage SEO settings for all marketing pages</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/marketing/seo">Manage SEO</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
