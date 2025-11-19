'use client';

import { useState, useEffect } from 'react';

interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
}

export default function ArchivePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts?status=archived');
                const data = await res.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container">
            <header style={{ textAlign: 'center', margin: '4rem 0' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Archive</h1>
                <p style={{ color: '#888' }}>Yesterday's news.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading archive...</div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    <p>The archive is empty.</p>
                </div>
            ) : (
                <div className="grid">
                    {posts.map((post) => (
                        <article key={post.id} className="card" style={{ opacity: 0.7 }}>
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ marginBottom: '1rem' }}>{post.content}</p>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {new Date(post.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
