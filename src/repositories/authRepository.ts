import { db } from '../db';
import { superviseurs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Superviseur } from '../types/models'; 

export class AuthRepository {

 
  async createSuperviseur(name: string, email: string, passwordHash: string): Promise<number> {
    const result = await db.insert(superviseurs).values({
      name: name,
      email: email,
      password: passwordHash, 
    }).$returningId();
    return result[0].id;
  }


  async findSuperviseurByEmail(email: string): Promise<Superviseur | undefined> {
    const user = await db.query.superviseurs.findFirst({
      where: eq(superviseurs.email, email),
    });
    
    return user as Superviseur | undefined;
  }


   async findSuperviseurById(id: number): Promise<Superviseur | undefined> {
    const user = await db.query.superviseurs.findFirst({
      where: eq(superviseurs.id, id),
    });
    
    return user as Superviseur | undefined;
  }
}