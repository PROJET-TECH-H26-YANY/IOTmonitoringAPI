
export interface Superviseur {
  id: number;
  email: string;
  password: string; 
  name: string;
}

export interface Student {
  id: number;
  superviseurId: number;
  name: string;
  nfcUid?: string | null;
}

export interface Session {
  id: number;
  studentId: number;
  startTime: Date;
  endTime?: Date | null;
  status: string; 
  macAddress: string;
  timeWorked: number;
}

export interface Issue {
  id: number;
  sessionId: number;
  startAbsence: Date;
  endAbsence?: Date | null;
  durationSecond: number;
}