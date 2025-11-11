// lib/api/comment.ts
import api from "@/lib/axios";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string | null;
  };
  _count?: { replies: number };
};

export const commentApi = {
  getChapterComments: (chapterId: string) =>
    api.get<Comment[]>(`/chapters/${chapterId}/comments`),

  createComment: (chapterId: string, content: string) =>
    api.post<Comment>(`/chapters/${chapterId}/comments`, { content }),

  deleteComment: (chapterId: string, commentId: string) =>
    api.delete(`/chapters/${chapterId}/comments/${commentId}`),

  getReplies: (chapterId: string, parentId: string) =>
    api.get<Comment[]>(`/chapters/${chapterId}/comments/${parentId}/replies`),

  createReply: (chapterId: string, parentId: string, content: string) =>
    api.post<Comment>(`/chapters/${chapterId}/comments/${parentId}/replies`, {
      content,
    }),
};