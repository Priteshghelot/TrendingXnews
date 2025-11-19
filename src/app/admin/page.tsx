'use client';

import { useState, useEffect } from 'react';

interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
}

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts?status=pending');
            const data = await res.json();
            setPosts(data.posts);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNewTrends = async () => {
        try {
            await fetch('/api/fetch-trends', { method: 'POST' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to fetch new trends', error);
        }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            // Remove from local state
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to update post', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={fetchNewTrends} className="btn btn-primary">
                    Fetch New Trends (Simulate X)
                </button>
            </div>

            {loading ? (
                <p>Loading pending posts...</p>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    <p>No pending posts. Fetch some trends!</p>
                </div>
            ) : (
                <div className="grid">
                    {posts.map((post) => (
                        <div key={post.id} className="card animate-fade-in">
                            {post.imageUrl && (
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={post.imageUrl}
                                        alt="Trend"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{post.content}</p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => handleAction(post.id, 'approved')}
                                        className="btn btn-success"
                                        style={{ flex: 1 }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(post.id, 'rejected')}
                                        className="btn btn-danger"
                                        style={{ flex: 1 }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
