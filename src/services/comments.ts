/**
 * src/services/comments.ts
 * 
 * Service layer untuk manajemen komentar.
 * Memisahkan logika pengambilan data dari UI sesuai standar proyek.
 */

import COMMENTS_MOCK from '@/mocks/comments.json';

const USE_MOCK = true;

export interface Comment {
    id: string;
    article_id: string;
    article_title: string;
    username: string;
    avatar: string;
    content: string;
    created_at: string;
}

/**
 * Ambil semua komentar untuk moderasi admin.
 */
export async function getAllComments(): Promise<Comment[]> {
    if (USE_MOCK) {
        // Simulasi network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(COMMENTS_MOCK.comments as Comment[]);
            }, 500);
        });
    }
    // Integrasi Supabase di masa depan
    return [];
}

/**
 * Hapus komentar berdasarkan ID.
 * Di mode mock, ini hanya simulasi sukses.
 */
export async function deleteComment(id: string): Promise<boolean> {
    if (USE_MOCK) {
        console.log(`[Mock] Menghapus komentar dengan ID: ${id}`);
        return true;
    }
    // Integrasi Supabase di masa depan
    return false;
}

/**
 * Ambil komentar spesifik untuk satu artikel (Public Side).
 */
export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
    if (USE_MOCK) {
        return COMMENTS_MOCK.comments.filter(c => c.article_id === articleId) as Comment[];
    }
    return [];
}
