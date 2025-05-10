import { NextResponse } from 'next/server'

// TODO: Replace with real system metrics and service status fetching logic
export async function GET() {
  // Mock metrics
  const metrics = {
    cpu: { usage: 65, cores: 8, speed: '3.5 GHz' },
    memory: { usage: 42, total: 16, used: 8.5 },
    disk: { usage: 65.8, total: 500, used: 329 },
    network: { up: 12, down: 20, total: 32, unit: 'Mbps' },
  }

  // Mock services
  const services = [
    { id: 'service-001', name: 'Web Server', status: 'running', uptime: '45 days, 12 hours', lastRestart: '2023-12-05T08:30:00Z', type: 'nginx', version: '1.20.2' },
    { id: 'service-002', name: 'Application Server', status: 'running', uptime: '30 days, 5 hours', lastRestart: '2023-12-20T15:45:00Z', type: 'node.js', version: '18.12.1' },
    { id: 'service-003', name: 'Database Server', status: 'running', uptime: '45 days, 12 hours', lastRestart: '2023-12-05T08:30:00Z', type: 'postgresql', version: '14.5' },
    { id: 'service-004', name: 'Redis Cache', status: 'running', uptime: '45 days, 12 hours', lastRestart: '2023-12-05T08:30:00Z', type: 'redis', version: '6.2.6' },
    { id: 'service-005', name: 'Background Worker', status: 'running', uptime: '15 days, 8 hours', lastRestart: '2024-01-05T10:15:00Z', type: 'node.js', version: '18.12.1' },
    { id: 'service-006', name: 'Scheduled Tasks', status: 'warning', uptime: '5 days, 3 hours', lastRestart: '2024-01-15T09:45:00Z', type: 'cron', version: '3.0.1', issue: 'High resource usage detected' },
    { id: 'service-007', name: 'Email Service', status: 'running', uptime: '45 days, 12 hours', lastRestart: '2023-12-05T08:30:00Z', type: 'sendgrid', version: '1.0.0' },
    { id: 'service-008', name: 'Payment Processor', status: 'running', uptime: '25 days, 18 hours', lastRestart: '2023-12-25T06:00:00Z', type: 'stripe', version: '2.0.0' },
  ]

  // Mock alerts
  const alerts = [
    { id: 'alert-001', severity: 'warning', message: 'High CPU usage detected (85%)', timestamp: '2024-01-20T15:30:00Z', service: 'Application Server', status: 'active' },
    { id: 'alert-002', severity: 'info', message: 'Database backup completed successfully', timestamp: '2024-01-20T12:00:00Z', service: 'Database Server', status: 'resolved' },
    { id: 'alert-003', severity: 'error', message: 'Failed login attempts exceeded threshold', timestamp: '2024-01-19T22:15:00Z', service: 'Authentication Service', status: 'resolved' },
    { id: 'alert-004', severity: 'warning', message: 'Scheduled task taking longer than expected', timestamp: '2024-01-19T18:45:00Z', service: 'Scheduled Tasks', status: 'active' },
    { id: 'alert-005', severity: 'info', message: 'System update available', timestamp: '2024-01-18T09:30:00Z', service: 'System', status: 'active' },
  ]

  return NextResponse.json({ metrics, services, alerts })
} 