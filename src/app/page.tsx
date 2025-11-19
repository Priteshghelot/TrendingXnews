'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  timestamp: number;
  sourceUrl?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts?status=approved');
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

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent modal opening
    try {
      await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'archived' }),
      });
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to archive post', error);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.05em' }}>
          What's <span style={{ color: 'var(--primary)' }}>Trending</span>
        </h1>
        <p style={{ color: '#888', fontSize: '1.2rem' }}>Curated viral news from India, instantly.</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading trends...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <p>No trending news right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }}
              onClick={() => setSelectedPost(post)}
            >
              {post.imageUrl && (
                <div style={{ height: '250px', overflow: 'hidden' }}>
                  <img
                    src={post.imageUrl}
                    alt="Trend"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="post-image"
                  />
                </div>
              )}
              <div style={{ padding: '2rem' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', fontSize: '0.9rem' }}>
                  <span>{new Date(post.timestamp).toLocaleTimeString()}</span>
                  <button
                    onClick={(e) => handleArchive(e, post.id)}
                    style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Mark as Old
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)}>×</button>

            {selectedPost.imageUrl && (
              <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                <img
                  src={selectedPost.imageUrl}
                  alt="Trend"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
                {selectedPost.content}
              </h2>

              <div style={{ display: 'flex', gap: '2rem', color: '#888', marginBottom: '2rem' }}>
                <span>{new Date(selectedPost.timestamp).toLocaleString()}</span>
                {selectedPost.sourceUrl && (
                  <a
                    href={selectedPost.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Read Full Story →
                  </a>
                )}
              </div>

              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc' }}>
                {/* Since we only have the title/snippet from RSS, we display it here. 
                    In a real app, we might fetch the full body content. */}
                {selectedPost.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
