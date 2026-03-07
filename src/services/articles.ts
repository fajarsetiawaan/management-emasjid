/**
 * src/services/articles.ts
 *
 * Service layer untuk fitur Artikel.
 * UI harus memanggil fungsi dari file ini, BUKAN mengimpor JSON langsung.
 */

import ARTICLES_MOCK from '@/mocks/articles.json';

const USE_MOCK = true;

export interface Article {
    id: string;
    mosque_slug: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    flyer_url: string;
    author_name: string;
    category: 'PENGUMUMAN' | 'KAJIAN' | 'KEGIATAN' | 'EDUKASI' | 'INFAQ';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    published_at: string | null;
    views?: number;
    likes?: number;
    shares?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Ambil semua artikel.
 */
export async function getArticles(): Promise<Article[]> {
    if (USE_MOCK) {
        return ARTICLES_MOCK.articles as Article[];
    }
    // TODO: Integrasi Supabase
    return [];
}

/**
 * Ambil artikel berdasarkan slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
    if (USE_MOCK) {
        const article = ARTICLES_MOCK.articles.find(a => a.slug === slug);
        return (article as Article) || null;
    }
    // TODO: Integrasi Supabase
    return null;
}

/**
 * Ambil artikel berdasarkan kategori.
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
    if (USE_MOCK) {
        if (category === 'ALL') return ARTICLES_MOCK.articles as Article[];
        return ARTICLES_MOCK.articles.filter(a => a.category === category) as Article[];
    }
    // TODO: Integrasi Supabase
    return [];
}

/**
 * Ambil hanya artikel yang sudah dipublikasikan (untuk halaman publik).
 */
export async function getPublishedArticles(): Promise<Article[]> {
    if (USE_MOCK) {
        return ARTICLES_MOCK.articles.filter(a => a.status === 'PUBLISHED') as Article[];
    }
    // TODO: Integrasi Supabase
    return [];
}
