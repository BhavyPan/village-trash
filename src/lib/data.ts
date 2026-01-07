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

export const dataStore = {
  // Get all reports
  async getReports() {
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
      status: report.status,
      createdAt: report.createdAt.toISOString(),
      user: {
        name: report.user.name,
        email: report.user.email
      },
      cleaning: report.cleaning ? {
        id: report.cleaning.id,
        afterImageUrl: report.cleaning.afterImageUrl,
        cleanedAt: report.cleaning.cleanedAt.toISOString()
      } : undefined
    }))
  },

  // Add a new report
  async addReport(report: Omit<TrashReport, 'id' | 'createdAt'>) {
    // Create or get user
    let user = await prisma.user.findFirst({
      where: { email: report.user.email }
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
        user: true
      }
    })
    
    return {
      id: newReport.id,
      description: newReport.description,
      latitude: newReport.latitude,
      longitude: newReport.longitude,
      imageUrl: newReport.imageUrl,
      status: newReport.status,
      createdAt: newReport.createdAt.toISOString(),
      user: {
        name: newReport.user.name,
        email: newReport.user.email
      }
    }
  },

  // Update report status
  async updateReportStatus(id: string, status: TrashReport['status']) {
    const updatedReport = await prisma.trashReport.update({
      where: { id },
      data: { status },
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
      status: updatedReport.status,
      createdAt: updatedReport.createdAt.toISOString(),
      user: {
        name: updatedReport.user.name,
        email: updatedReport.user.email
      },
      cleaning: updatedReport.cleaning ? {
        id: updatedReport.cleaning.id,
        afterImageUrl: updatedReport.cleaning.afterImageUrl,
        cleanedAt: updatedReport.cleaning.cleanedAt.toISOString()
      } : undefined
    }
  },

  // Add cleaning information
  async addCleaning(reportId: string, afterImageUrl: string) {
    // Get the report first
    const report = await prisma.trashReport.findUnique({
      where: { id: reportId },
      include: { user: true }
    })
    
    if (!report) return null
    
    // Create or get volunteer user (using a default volunteer for now)
    let volunteer = await prisma.user.findFirst({
      where: { role: 'VOLUNTEER' }
    })
    
    if (!volunteer) {
      volunteer = await prisma.user.create({
        data: {
          name: 'Default Volunteer',
          email: 'volunteer@village.com',
          role: 'VOLUNTEER'
        }
      })
    }
    
    // Create cleaning record
    const cleaning = await prisma.cleaning.create({
      data: {
        reportId,
        volunteerId: volunteer.id,
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
      status: updatedReport.status,
      createdAt: updatedReport.createdAt.toISOString(),
      user: {
        name: updatedReport.user.name,
        email: updatedReport.user.email
      },
      cleaning: updatedReport.cleaning ? {
        id: updatedReport.cleaning.id,
        afterImageUrl: updatedReport.cleaning.afterImageUrl,
        cleanedAt: updatedReport.cleaning.cleanedAt.toISOString()
      } : undefined
    }
  },

  // Get reports by status
  async getReportsByStatus(status: TrashReport['status']) {
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
      status: report.status,
      createdAt: report.createdAt.toISOString(),
      user: {
        name: report.user.name,
        email: report.user.email
      },
      cleaning: report.cleaning ? {
        id: report.cleaning.id,
        afterImageUrl: report.cleaning.afterImageUrl,
        cleanedAt: report.cleaning.cleanedAt.toISOString()
      } : undefined
    }))
  },

  // Get reports by user
  async getReportsByUser(userEmail: string) {
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
      status: report.status,
      createdAt: report.createdAt.toISOString(),
      user: {
        name: report.user.name,
        email: report.user.email
      },
      cleaning: report.cleaning ? {
        id: report.cleaning.id,
        afterImageUrl: report.cleaning.afterImageUrl,
        cleanedAt: report.cleaning.cleanedAt.toISOString()
      } : undefined
    }))
  }
}
