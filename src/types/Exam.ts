export type Exam = {
    id: string;
    title: string;
    classId: string;
    questionsCount: number;
    choicesCount: number;
    answerKey: string[];
    createdAt: string;
    updatedAt: string;
}