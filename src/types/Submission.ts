export type Submission = {
  _id: string;
  studentName: string;
  score?: number;
  status: "pending" | "graded" | "error";
  createdAt: string;
  studentAnswers?: string[];
  answers?: string[] | null;
}
