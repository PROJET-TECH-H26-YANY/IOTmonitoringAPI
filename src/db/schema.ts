import { mysqlTable, int, varchar, datetime } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

export const superviseurs = mysqlTable('Superviseurs', {
  id: int('Id_superviseur').primaryKey().autoincrement(),
  email: varchar('email', { length: 40 }).notNull().unique(),
  password: varchar('pass_word', { length: 100 }).notNull(), 
  name: varchar('name', { length: 20 }).notNull(),
});

export const students = mysqlTable('Students', {
  id: int('Id_student').primaryKey().autoincrement(),
  superviseurId: int('Id_superviseur').notNull(), 
  name: varchar('name', { length: 20 }).notNull(),
  nfcUid: varchar('nfc_uid', { length: 40 }).unique(),
});

export const sessions = mysqlTable('Sessions', {
  id: int('Id_session').primaryKey().autoincrement(),
  studentId: int('Id_student').notNull(), 
  
  startTime: datetime('start_time').default(sql`CURRENT_TIMESTAMP`),
  endTime: datetime('end_time'),
  
  status: varchar('status', { length: 20 }).default('Active'),
  macAddress: varchar('mac_adresse', { length: 50 }).notNull(), 
  timeWorked: int('time_worked').default(0),
});

export const issues = mysqlTable('issues', {
  id: int('Id_issue').primaryKey().autoincrement(),
  sessionId: int('Id_session').notNull(), 
  
  startAbsence: datetime('start_absence').default(sql`CURRENT_TIMESTAMP`),
  endAbsence: datetime('end_absence'),
  durationSecond: int('duration_second').default(0),
});

// --- Sugerer par L'IA : RELATIONS (Pour faciliter les requêtes "Join" plus tard) ---

export const superviseursRelations = relations(superviseurs, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  superviseur: one(superviseurs, {
    fields: [students.superviseurId],
    references: [superviseurs.id],
  }),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  student: one(students, {
    fields: [sessions.studentId],
    references: [students.id],
  }),
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  session: one(sessions, {
    fields: [issues.sessionId],
    references: [sessions.id],
  }),
}));