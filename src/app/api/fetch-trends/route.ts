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
