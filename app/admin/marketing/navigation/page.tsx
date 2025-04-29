import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function NavigationManagement() {
  // This would typically come from a database
  const navigationItems = [
    { id: 1, name: "Features", path: "/features", location: "Header", order: 1, status: "Active" },
    { id: 2, name: "How It Works", path: "/how-it-works", location: "Header", order: 2, status: "Active" },
    { id: 3, name: "Calculator", path: "/calculator", location: "Header", order: 3, status: "Active" },
    { id: 4, name: "FAQ", path: "/faq", location: "Header", order: 4, status: "Active" },
    { id: 5, name: "About Us", path: "/about", location: "Footer", order: 1, status: "Active" },
    { id: 6, name: "Careers", path: "/careers", location: "Footer", order: 2, status: "Active" },
    { id: 7, name: "Contact", path: "/contact", location: "Footer", order: 3, status: "Active" },
    { id: 8, name: "Blog", path: "/blog", location: "Footer", order: 4, status: "Active" },
    { id: 9, name: "Terms of Service", path: "/terms", location: "Footer", order: 5, status: "Active" },
    { id: 10, name: "Privacy Policy", path: "/privacy", location: "Footer", order: 6, status: "Active" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Navigation Management</h1>
        <Button>Add Navigation Item</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {navigationItems
                .filter((item) => item.location === "Header")
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.path}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Active" ? "success" : "outline"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Move Up
                        </Button>
                        <Button variant="outline" size="sm">
                          Move Down
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {navigationItems
                .filter((item) => item.location === "Footer")
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.path}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Active" ? "success" : "outline"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Move Up
                        </Button>
                        <Button variant="outline" size="sm">
                          Move Down
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
