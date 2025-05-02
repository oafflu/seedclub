import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AdminUser } from '@/types/database'

export const exportToPDF = (users: AdminUser[]) => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(15)
  doc.text('Admin Users Report', 14, 15)

  // Add the table
  autoTable(doc, {
    head: [['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login']],
    body: users.map(user => [
      user.id.split('-')[0],
      `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A',
      user.email,
      user.role,
      user.is_active ? 'Active' : 'Inactive',
      user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'
    ]),
    startY: 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    didDrawPage: (data) => {
      // Add footer
      const pageSize = doc.internal.pageSize
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
      doc.setFontSize(8)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, pageHeight - 10)
    }
  })

  doc.save('admin_users.pdf')
} 