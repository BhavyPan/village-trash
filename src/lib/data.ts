// Global data store for sharing reports between pages
export interface TrashReport {
  id: string
  description?: string
  latitude: number
  longitude: number
  imageUrl?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  user: {
    name?: string
    email?: string
  }
  cleaning?: {
    id: string
    afterImageUrl?: string
    cleanedAt: string
  }
}

// In-memory storage (in production, this would be a database)
let reports: TrashReport[] = []

export const dataStore = {
  // Get all reports
  getReports(): TrashReport[] {
    return [...reports]
  },

  // Add a new report
  addReport(report: Omit<TrashReport, 'id' | 'createdAt'>): TrashReport {
    const newReport: TrashReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    reports.unshift(newReport) // Add to beginning
    return newReport
  },

  // Update report status
  updateReportStatus(id: string, status: TrashReport['status']): TrashReport | null {
    const reportIndex = reports.findIndex(r => r.id === id)
    if (reportIndex !== -1) {
      reports[reportIndex].status = status
      return reports[reportIndex]
    }
    return null
  },

  // Add cleaning information
  addCleaning(reportId: string, afterImageUrl: string): TrashReport | null {
    const report = reports.find(r => r.id === reportId)
    if (report) {
      report.status = 'COMPLETED'
      report.cleaning = {
        id: `cleaning_${Date.now()}`,
        afterImageUrl,
        cleanedAt: new Date().toISOString()
      }
      return report
    }
    return null
  },

  // Get reports by status
  getReportsByStatus(status: TrashReport['status']): TrashReport[] {
    return reports.filter(r => r.status === status)
  },

  // Get reports by user
  getReportsByUser(userEmail: string): TrashReport[] {
    return reports.filter(r => r.user.email === userEmail)
  }
}
