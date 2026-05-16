import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getCompletionRates() {
    const totalGoals = await this.prisma.goal.count();
    const completedGoals = await this.prisma.goal.count({
      where: { status: 'COMPLETED' }
    });
    
    return {
      totalGoals,
      completedGoals,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
    };
  }

  async getDepartmentAnalytics() {
    return this.prisma.department.findMany({
      include: {
        users: {
          include: {
            goals: true
          }
        }
      }
    }).then(deps => {
      return deps.map(dep => {
        let totalGoals = 0;
        let completedGoals = 0;
        dep.users.forEach(u => {
          totalGoals += u.goals.length;
          completedGoals += u.goals.filter(g => g.status === 'COMPLETED').length;
        });
        return {
          departmentId: dep.id,
          departmentName: dep.name,
          totalGoals,
          completedGoals,
          completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
        };
      });
    });
  }
}
