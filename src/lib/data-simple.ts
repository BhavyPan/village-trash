// Temporary fallback data store for deployment
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

// In-memory storage for now
let reports: TrashReport[] = []

export const dataStore = {
  // Get all reports
  async getReports(): Promise<TrashReport[]> {
    return [...reports]
  },

  // Add a new report
  async addReport(report: Omit<TrashReport, 'id' | 'createdAt'>): Promise<TrashReport> {
    const newReport: TrashReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    reports.unshift(newReport)
    return newReport
  },

  // Update report status
  async updateReportStatus(id: string, status: TrashReport['status']): Promise<TrashReport | null> {
    const reportIndex = reports.findIndex(r => r.id === id)
    if (reportIndex !== -1) {
      reports[reportIndex].status = status
      return reports[reportIndex]
    }
    return null
  },

  // Add cleaning information
  async addCleaning(reportId: string, afterImageUrl: string): Promise<TrashReport | null> {
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
  async getReportsByStatus(status: TrashReport['status']): Promise<TrashReport[]> {
    return reports.filter(r => r.status === status)
  },

  // Get reports by user
  async getReportsByUser(userEmail: string): Promise<TrashReport[]> {
    return reports.filter(r => r.user.email === userEmail)
  }
}
