import { db } from '../db';
import { sessions, students } from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export class DashboardRepository {


  async getLiveSessions(superviseurId: number) {
    return await db.select({
      sessionId: sessions.id,
      studentName: students.name,
      startTime: sessions.startTime,
      macAddress: sessions.macAddress,
      status: sessions.status
    })
    .from(sessions)
    .innerJoin(students, eq(sessions.studentId, students.id))
    .where(and(
      eq(sessions.status, 'Active'),
      eq(students.superviseurId, superviseurId)
    ));
  }

  async getHistory(superviseurId: number) {
    return await db.select({
      sessionId: sessions.id,
      studentName: students.name,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      timeWorked: sessions.timeWorked,
      status: sessions.status
    })
    .from(sessions)
    .innerJoin(students, eq(sessions.studentId, students.id))
    .where(eq(students.superviseurId, superviseurId))
    .orderBy(desc(sessions.startTime))
    .limit(50);
  }


  async forceCloseSession(sessionId: number) {
    await db.update(sessions)
      .set({
        endTime: new Date(),
        status: 'Terminée',
        timeWorked: sql`TIMESTAMPDIFF(SECOND, ${sessions.startTime}, NOW())`
      })
      .where(and(
        eq(sessions.id, sessionId),
        eq(sessions.status, 'Active')
      ));
  }
}