import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

export interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
    sourceUrl?: string;
}

// In-memory fallback for Vercel/Serverless environments where FS is read-only
let globalPosts: Post[] = [];
let isFsAvailable = true;

// Initialize by trying to read from file once
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        globalPosts = JSON.parse(data);
    }
} catch (error) {
    console.warn('File system not available or readable, using in-memory store:', error);
    isFsAvailable = false;
}

export function getPosts(): Post[] {
    if (isFsAvailable) {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn('Error reading posts file, returning in-memory:', error);
        }
    }
    return globalPosts;
}

export function savePosts(posts: Post[]) {
    // Always update in-memory
    globalPosts = posts;

    if (isFsAvailable) {
        try {
            // Ensure directory exists
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
        } catch (error) {
            console.warn('Error saving posts to file (likely read-only FS), data will be lost on restart:', error);
            // Disable FS for future writes to avoid error log spam
            isFsAvailable = false;
        }
    }
}

export function addPost(post: Post) {
    const posts = getPosts();
    // Check for duplicates
    if (!posts.some(p => p.id === post.id)) {
        posts.unshift(post);
        savePosts(posts);
    }
}

export function updatePostStatus(id: string, status: Post['status']) {
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);
    if (post) {
        post.status = status;
        savePosts(posts);
    }
}
