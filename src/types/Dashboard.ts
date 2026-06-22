export interface DashboardStats {
  totalClasses: number;
  totalExams: number;
  totalSubmissions: number;
  submissionsByStatus: {
    pending: number;
    success: number;
    error: number;
  };
  averageScore: number;
}

export interface RecentClass {
  _id: string;
  name: string;
  examCount: number;
  submissionCount: number;
}

export interface RecentActivity {
  studentName: string;
  examTitle: string;
  className: string;
  score: number | null;
  status: "pending" | "success" | "error";
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentClasses: RecentClass[];
  recentActivity: RecentActivity[];
}
