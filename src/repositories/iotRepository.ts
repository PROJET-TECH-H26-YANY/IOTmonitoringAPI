import { db } from '../db';
import { students, sessions, issues } from '../db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';

export class IotRepository {


  async findStudentByNfc(nfcUid: string) {
    return await db.query.students.findFirst({
      where: eq(students.nfcUid, nfcUid),
    });
  }

  async findActiveSessionByMac(macAddress: string) {
    return await db.query.sessions.findFirst({
      where: and(
        eq(sessions.macAddress, macAddress),
        eq(sessions.status, 'Active')
      ),
    });
  }

  async createSession(studentId: number, macAddress: string) {
    const result = await db.insert(sessions).values({
      studentId: studentId,
      macAddress: macAddress,
      status: 'Active',
      startTime: new Date(),
      timeWorked: 0
    }).$returningId();

    return result[0].id;
  }


  // IA pour aider à calculer le temps de travail en prenant en compte les pauses (issues)
  async closeSession(sessionId: number) {
    await this.closeIssue(sessionId);

    const pauseResult = await db.select({
      totalPause: sql<string>`COALESCE(SUM(${issues.durationSecond}), 0)`
    })
    .from(issues)
    .where(eq(issues.sessionId, sessionId));


    const totalPause = parseInt(pauseResult[0].totalPause || '0', 10);

    await db.update(sessions)
      .set({
        endTime: new Date(),
        status: 'Terminée',
        timeWorked: sql`TIMESTAMPDIFF(SECOND, ${sessions.startTime}, NOW()) - ${totalPause}`
      })
      .where(eq(sessions.id, sessionId));
  }


  async createIssue(sessionId: number) {
    const existing = await db.query.issues.findFirst({
      where: and(
        eq(issues.sessionId, sessionId),
        isNull(issues.endAbsence)
      )
    });

    if (!existing) {
      await db.insert(issues).values({
        sessionId: sessionId,
        startAbsence: new Date(),
        durationSecond: 0
      });
    }
  }


  async closeIssue(sessionId: number) {
    await db.update(issues)
      .set({
        endAbsence: new Date(),
        durationSecond: sql`TIMESTAMPDIFF(SECOND, ${issues.startAbsence}, NOW())`
      })
      .where(and(
        eq(issues.sessionId, sessionId),
        isNull(issues.endAbsence) 
      ));
  }
}