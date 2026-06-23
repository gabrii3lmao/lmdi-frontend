export type SubmissionDetail = {
  question: number;
  marked: string | null;
  correct: string;
  status: "correct" | "incorrect" | "invalid";
};

export type Submission = {
  _id: string;
  studentName: string;
  score?: number;
  totalCorrect?: number;
  status: "pending" | "success" | "error";
  imageUrl?: string;
  createdAt: string;
  details?: SubmissionDetail[];
  studentAnswers?: string[];
  answers?: string[] | null;
};
