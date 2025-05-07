"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  PiggyBank,
  Sprout,
  Leaf,
  TreePine as Trees,
  Palmtree as Palm,
  TreeDeciduous as Oak,
  Flower,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { toast } from "@/components/ui/use-toast"
import { supabaseAdmin } from "@/lib/supabase/client"
import { logAuditEvent } from "@/lib/services/audit-logger"

// Types
interface Jar {
  id: string
  name: string
  description: string
  term_months: number
  interest_rate: number
  minimum_investment: number
  maximum_investment: number | null
  early_withdrawal_penalty: number | null
  is_active: boolean
  icon_name: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export default function JarsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJars, setSelectedJars] = useState<string[]>([])
  const [viewJar, setViewJar] = useState<Jar | null>(null)
  const [jars, setJars] = useState<Jar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch jars from API
  useEffect(() => {
    async function fetchJars() {
      try {
        const response = await fetch('/api/admin/jars')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch jars')
        }

        setJars(data.jars || [])
      } catch (error) {
        console.error('Error fetching jars:', error)
        toast({
          title: "Error fetching jars",
          description: "There was a problem loading the jars.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJars()
  }, [])

  const filteredJars = jars.filter(
    (jar) =>
      jar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jar.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleJarSelection = (jarId: string) => {
    setSelectedJars((prev) => (prev.includes(jarId) ? prev.filter((id) => id !== jarId) : [...prev, jarId]))
  }

  const toggleAllJars = () => {
    if (selectedJars.length === filteredJars.length) {
      setSelectedJars([])
    } else {
      setSelectedJars(filteredJars.map((j) => j.id))
    }
  }

  // Delete jar handler
  const handleDeleteJar = async (jarId: string) => {
    try {
      const response = await fetch('/api/admin/jars', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jarId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete jar')
      }

      // Remove jar from local state
      setJars(jars.filter(jar => jar.id !== jarId))
      
      toast({
        title: "Jar deleted",
        description: "The jar has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting jar:', error)
      toast({
        title: "Error deleting jar",
        description: "There was a problem deleting the jar.",
        variant: "destructive",
      })
    }
  }

  // Toggle jar status handler
  const handleToggleStatus = async (jarId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/jars', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jarId,
          is_active: !currentStatus
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update jar status')
      }

      // Update jar in local state
      setJars(jars.map(jar => 
        jar.id === jarId ? { ...jar, is_active: !currentStatus, updated_at: new Date().toISOString() } : jar
      ))

      toast({
        title: "Jar status updated",
        description: `Jar is now ${!currentStatus ? 'active' : 'inactive'}.`,
      })
    } catch (error) {
      console.error('Error updating jar status:', error)
      toast({
        title: "Error updating status",
        description: "There was a problem updating the jar status.",
        variant: "destructive",
      })
    }
  }

  // Helper function to get the icon component
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return <PiggyBank className="h-5 w-5" />;
    // If iconName looks like a URL, render an image
    if (
      iconName.startsWith('http') ||
      iconName.startsWith('/storage/') ||
      iconName.startsWith('https://') ||
      iconName.startsWith('data:image')
    ) {
      return (
        <img
          src={iconName}
          alt="Jar Icon"
          className="h-5 w-5 object-contain"
          style={{ maxWidth: 24, maxHeight: 24 }}
        />
      );
    }
    // Map default icon names to components (case-insensitive)
    const icons: Record<string, React.ReactNode> = {
      PiggyBank: <PiggyBank className="h-5 w-5" />,
      Sprout: <Sprout className="h-5 w-5" />,
      Leaf: <Leaf className="h-5 w-5" />,
      Trees: <Trees className="h-5 w-5" />,
      Palm: <Palm className="h-5 w-5" />,
      Oak: <Oak className="h-5 w-5" />,
      Flower: <Flower className="h-5 w-5" />,
      'piggy-bank': <PiggyBank className="h-5 w-5" />,
      'sprout': <Sprout className="h-5 w-5" />,
      'leaf': <Leaf className="h-5 w-5" />,
      'trees': <Trees className="h-5 w-5" />,
      'palm': <Palm className="h-5 w-5" />,
      'oak': <Oak className="h-5 w-5" />,
      'flower': <Flower className="h-5 w-5" />,
    };
    return icons[iconName] || icons[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || <PiggyBank className="h-5 w-5" />;
  };

  // Export function
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      // Prepare data for export
      const data = jars.map((jar: Jar) => ({
        Name: jar.name,
        Description: jar.description,
        'Term (months)': jar.term_months,
        'Interest Rate (%)': jar.interest_rate,
        'Minimum Investment ($)': jar.minimum_investment,
        'Maximum Investment ($)': jar.maximum_investment || 'No limit',
        'Early Withdrawal Penalty (%)': jar.early_withdrawal_penalty || 'N/A',
        Status: jar.is_active ? 'Active' : 'Inactive',
        'Created At': new Date(jar.created_at).toLocaleDateString(),
        'Last Updated': new Date(jar.updated_at).toLocaleDateString(),
      }));

      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'csv':
          // Convert data to CSV
          const csvContent = [
            Object.keys(data[0]).join(','),
            ...data.map((row: Record<string, string | number | null>) => Object.values(row).join(','))
          ].join('\n');
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          filename = `jars_export_${format}_${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'excel':
          // Use a library like xlsx to create Excel file
          const XLSX = await import('xlsx');
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Jars');
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          filename = `jars_export_${format}_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;

        case 'pdf':
          // Use a library like jspdf and jspdf-autotable to create PDF
          const { jsPDF } = await import('jspdf');
          const { default: autoTable } = await import('jspdf-autotable');
          
          const doc = new jsPDF();
          autoTable(doc, {
            head: [Object.keys(data[0])],
            body: data.map(row => Object.values(row)),
          });
          
          blob = doc.output('blob');
          filename = `jars_export_${format}_${new Date().toISOString().split('T')[0]}.pdf`;
          break;

        default:
          throw new Error('Unsupported export format');
      }

      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: `Jars have been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting the data",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jar Management</h1>
        <Button onClick={() => router.push("/admin/jars/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Jar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jars</CardDescription>
            <CardTitle className="text-3xl">{jars.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <PiggyBank className="mr-1 h-4 w-4 text-primary" />
              <span>Available to customers</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>12-Month Jars</CardDescription>
            <CardTitle className="text-3xl">{jars.filter((j) => j.term_months === 12).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <PiggyBank className="mr-1 h-4 w-4 text-primary" />
              <span>Short-term options</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>24-36 Month Jars</CardDescription>
            <CardTitle className="text-3xl">
              {jars.filter((j) => j.term_months === 24 || j.term_months === 36).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <PiggyBank className="mr-1 h-4 w-4 text-green-500" />
              <span>Long-term growth options</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Investment Jars</CardTitle>
          <CardDescription>Manage the investment jars available to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 py-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search jars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                  <DropdownMenuItem>Term Length</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Choose format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedJars.length === filteredJars.length}
                      onCheckedChange={toggleAllJars}
                    />
                  </TableHead>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Min. Investment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJars.map((jar) => (
                  <TableRow key={jar.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedJars.includes(jar.id)}
                        onCheckedChange={() => toggleJarSelection(jar.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {jar.icon_name ? (
                        <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                          {getIconComponent(jar.icon_name)}
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-lg">
                          <PiggyBank className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{jar.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{jar.description}</TableCell>
                    <TableCell>{jar.term_months} months</TableCell>
                    <TableCell>{jar.interest_rate}%</TableCell>
                    <TableCell>${jar.minimum_investment.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={jar.is_active ? "default" : "secondary"}>
                        {jar.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewJar(jar)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/jars/edit/${jar.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(jar.id, jar.is_active)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {jar.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteJar(jar.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredJars.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <PiggyBank className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No jars found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Jar Dialog */}
      <Dialog open={!!viewJar} onOpenChange={() => setViewJar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jar Details</DialogTitle>
            <DialogDescription>View detailed information about this jar</DialogDescription>
          </DialogHeader>
          {viewJar && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm">{viewJar.name}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm">{viewJar.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Term</Label>
                  <p className="text-sm">{viewJar.term_months} months</p>
                </div>
                <div>
                  <Label>Interest Rate</Label>
                  <p className="text-sm">{viewJar.interest_rate}%</p>
                </div>
                <div>
                  <Label>Minimum Investment</Label>
                  <p className="text-sm">${viewJar.minimum_investment.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Maximum Investment</Label>
                  <p className="text-sm">
                    {viewJar.maximum_investment
                      ? `$${viewJar.maximum_investment.toLocaleString()}`
                      : "No limit"}
                  </p>
                </div>
                <div>
                  <Label>Early Withdrawal Penalty</Label>
                  <p className="text-sm">
                    {viewJar.early_withdrawal_penalty
                      ? `${viewJar.early_withdrawal_penalty}%`
                      : "None"}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm">
                    <Badge variant={viewJar.is_active ? "default" : "secondary"}>
                      {viewJar.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <Label>Created</Label>
                <p className="text-sm">
                  {new Date(viewJar.created_at).toLocaleDateString()} by{" "}
                  {viewJar.created_by || "System"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewJar(null)}>
              Close
            </Button>
            <Button onClick={() => router.push(`/admin/jars/edit/${viewJar?.id}`)}>
              Edit Jar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
