import { NextResponse } from 'next/server';
import { addPost, getPosts } from '@/lib/store';
import Parser from 'rss-parser';

const parser = new Parser();
const RSS_URL = 'https://feeds.feedburner.com/ndtvnews-top-stories';

export async function POST() {
    try {
        const feed = await parser.parseURL(RSS_URL);
        const existingPosts = getPosts();
        const newPosts = [];

        for (const item of feed.items) {
            // Simple check to avoid duplicates based on title
            const isDuplicate = existingPosts.some(p => p.content === item.title);

            if (!isDuplicate && item.title) {
                // Extract image from content if available, or use a placeholder/fallback
                // NDTV often puts image in contentSnippet or content
                let imageUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60'; // Fallback news image

                // Try to find an image in the content
                const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                    imageUrl = imgMatch[1];
                }

                const newPost = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    content: item.title,
                    imageUrl: imageUrl,
                    status: 'pending' as const,
                    timestamp: Date.now(),
                    sourceUrl: item.link
                };

                addPost(newPost);
                newPosts.push(newPost);
            }
        }

        return NextResponse.json({ success: true, count: newPosts.length, posts: newPosts });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }
}
