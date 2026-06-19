export type Submission = {
  _id: string;
  studentName: string;
  score?: number;
  totalCorrect?: number;
  status: "pending" | "success" | "error";
  createdAt: string;
  studentAnswers?: string[];
  answers?: string[] | null;
}
