import { db } from '../db';
import { students } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { Student } from '../types/models';

export class StudentRepository {


  async create(superviseurId: number, name: string, nfcUid?: string): Promise<number> {
    const result = await db.insert(students).values({
      superviseurId: superviseurId,
      name: name,    
      nfcUid: nfcUid || null
    }).$returningId();
    return result[0].id;
  }


  async findAllBySuperviseurId(superviseurId: number): Promise<Student[]> {
    const rows = await db.query.students.findMany({
      where: eq(students.superviseurId, superviseurId)
    });
    return rows as Student[];
  }


  async update(id: number, superviseurId: number, data: { name?: string; nfcUid?: string }) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.nfcUid) updateData.nfcUid = data.nfcUid;

    if (Object.keys(updateData).length === 0) return;

    await db.update(students)
      .set(updateData)
      .where(and(
        eq(students.id, id),
        eq(students.superviseurId, superviseurId) 
      ));
  }

  async delete(id: number, superviseurId: number) {
    await db.delete(students)
      .where(and(
        eq(students.id, id),
        eq(students.superviseurId, superviseurId) 
      ));
  }
}