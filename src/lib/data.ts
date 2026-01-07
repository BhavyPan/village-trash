import { prisma } from './prisma'

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

// Fallback in-memory storage if database fails
let fallbackReports: TrashReport[] = []

export const dataStore = {
  // Get all reports
  async getReports(): Promise<TrashReport[]> {
    try {
      const reports = await prisma.trashReport.findMany({
        include: {
          user: true,
          cleaning: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return reports.map(report => ({
        id: report.id,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
        imageUrl: report.imageUrl,
        status: report.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        createdAt: report.createdAt.toISOString(),
        user: {
          name: report.user.name || undefined,
          email: report.user.email || undefined
        },
        cleaning: report.cleaning ? {
          id: report.cleaning.id,
          afterImageUrl: report.cleaning.afterImageUrl || undefined,
          cleanedAt: report.cleaning.cleanedAt.toISOString()
        } : undefined
      }))
    } catch (error) {
      console.warn('Database not available, using fallback storage:', error)
      return [...fallbackReports]
    }
  },

  // Add a new report
  async addReport(report: Omit<TrashReport, 'id' | 'createdAt'>): Promise<TrashReport> {
    try {
      // First, find or create the user
      let user = await prisma.user.findFirst({
        where: {
          email: report.user.email
        }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: report.user.name,
            email: report.user.email,
            role: 'VILLAGER'
          }
        })
      }

      // Create the trash report
      const newReport = await prisma.trashReport.create({
        data: {
          description: report.description,
          latitude: report.latitude,
          longitude: report.longitude,
          imageUrl: report.imageUrl,
          status: report.status,
          userId: user.id
        },
        include: {
          user: true,
          cleaning: true
        }
      })

      return {
        id: newReport.id,
        description: newReport.description,
        latitude: newReport.latitude,
        longitude: newReport.longitude,
        imageUrl: newReport.imageUrl,
        status: newReport.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        createdAt: newReport.createdAt.toISOString(),
        user: {
          name: newReport.user.name || undefined,
          email: newReport.user.email || undefined
        },
        cleaning: newReport.cleaning ? {
          id: newReport.cleaning.id,
          afterImageUrl: newReport.cleaning.afterImageUrl || undefined,
          cleanedAt: newReport.cleaning.cleanedAt.toISOString()
        } : undefined
      }
    } catch (error) {
      console.warn('Database not available, using fallback storage:', error)
      
      // Fallback to in-memory storage
      const newReport: TrashReport = {
        ...report,
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      }
      fallbackReports.unshift(newReport)
      return newReport
    }
  },

  // Update report status
  async updateReportStatus(id: string, status: TrashReport['status']): Promise<TrashReport | null> {
    try {
      const report = await prisma.trashReport.update({
        where: { id },
        data: { status },
        include: {
          user: true,
          cleaning: true
        }
      }).catch(() => null)

      if (!report) return null

      return {
        id: report.id,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
        imageUrl: report.imageUrl,
        status: report.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        createdAt: report.createdAt.toISOString(),
        user: {
          name: report.user.name || undefined,
          email: report.user.email || undefined
        },
        cleaning: report.cleaning ? {
          id: report.cleaning.id,
          afterImageUrl: report.cleaning.afterImageUrl || undefined,
          cleanedAt: report.cleaning.cleanedAt.toISOString()
        } : undefined
      }
    } catch (error) {
      console.warn('Database not available, using fallback storage:', error)
      
      // Fallback to in-memory storage
      const reportIndex = fallbackReports.findIndex(r => r.id === id)
      if (reportIndex !== -1) {
        fallbackReports[reportIndex].status = status
        return fallbackReports[reportIndex]
      }
      return null
    }
  },

  // Add cleaning information
  async addCleaning(reportId: string, afterImageUrl: string): Promise<TrashReport | null> {
    try {
      // Find the report first
      const report = await prisma.trashReport.findUnique({
        where: { id: reportId }
      })

      if (!report) return null

      // Create or update cleaning record
      const cleaning = await prisma.cleaning.upsert({
        where: { reportId },
        update: {
          afterImageUrl,
          cleanedAt: new Date()
        },
        create: {
          reportId,
          volunteerId: report.userId, // Using the reporter as volunteer for now
          afterImageUrl
        }
      })

      // Update report status
      const updatedReport = await prisma.trashReport.update({
        where: { id: reportId },
        data: { status: 'COMPLETED' },
        include: {
          user: true,
          cleaning: true
        }
      })

      return {
        id: updatedReport.id,
        description: updatedReport.description,
        latitude: updatedReport.latitude,
        longitude: updatedReport.longitude,
        imageUrl: updatedReport.imageUrl,
        status: updatedReport.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        createdAt: updatedReport.createdAt.toISOString(),
        user: {
          name: updatedReport.user.name || undefined,
          email: updatedReport.user.email || undefined
        },
        cleaning: updatedReport.cleaning ? {
          id: updatedReport.cleaning.id,
          afterImageUrl: updatedReport.cleaning.afterImageUrl || undefined,
          cleanedAt: updatedReport.cleaning.cleanedAt.toISOString()
        } : undefined
      }
    } catch (error) {
      console.warn('Database not available, using fallback storage:', error)
      
      // Fallback to in-memory storage
      const report = fallbackReports.find(r => r.id === reportId)
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
    }
  },

  // Get reports by status
  async getReportsByStatus(status: TrashReport['status']): Promise<TrashReport[]> {
    try {
      const reports = await prisma.trashReport.findMany({
        where: { status },
        include: {
          user: true,
          cleaning: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return reports.map(report => ({
        id: report.id,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
        imageUrl: report.imageUrl,
        status: report.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        createdAt: report.createdAt.toISOString(),
        user: {
          name: report.user.name || undefined,
          email: report.user.email || undefined
        },
        cleaning: report.cleaning ? {
          id: report.cleaning.id,
          afterImageUrl: report.cleaning.afterImageUrl || undefined,
          cleanedAt: report.cleaning.cleanedAt.toISOString()
        } : undefined
      }))
    } catch (error) {
      console.warn('Database not available, using fallback storage:', error)
      return fallbackReports.filter(r => r.status === status)
    }
  },

  // Get reports by user
  async getReportsByUser(userEmail: string): Promise<TrashReport[]> {
    try {
      const reports = await prisma.trashReport.findMany({
        where: {
          user: {
            email: userEmail
          }
        },
        include: {
          user: true,
          cleaning: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return reports.map(report => ({
        id: report.id,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
        imageUrl: report.imageUrl,
        status: report.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        createdAt: report.createdAt.toISOString(),
        user: {
          name: report.user.name || undefined,
          email: report.user.email || undefined
        },
        cleaning: report.cleaning ? {
          id: report.cleaning.id,
          afterImageUrl: report.cleaning.afterImageUrl || undefined,
          cleanedAt: report.cleaning.cleanedAt.toISOString()
        } : undefined
      }))
    } catch (error) {
      console.warn('Database not available, using fallback storage:', error)
      return fallbackReports.filter(r => r.user.email === userEmail)
    }
  }
}
