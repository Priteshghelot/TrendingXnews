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

export function getPosts(): Post[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export function savePosts(posts: Post[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
}

export function addPost(post: Post) {
  const posts = getPosts();
  posts.unshift(post);
  savePosts(posts);
}

export function updatePostStatus(id: string, status: Post['status']) {
  const posts = getPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.status = status;
    savePosts(posts);
  }
}
