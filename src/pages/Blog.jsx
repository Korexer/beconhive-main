import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    // Fetch specifically published blogs, limited to 6, ordered purely by newest
    const { data, error } = await supabase
      .from('blogs')
      .select(`id, title, content, meta_description, slug, image_url, created_at, views, author_id, profiles(full_name)`)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6);

    if (data) setBlogs(data);
    setLoading(false);
  };

  const getExcerpt = (blog) => {
    if (blog.meta_description) return blog.meta_description;
    if (blog.content) {
       // Quickly strip internal HTML tags cleanly for brief preview excerpts
       const rawText = blog.content.replace(/<[^>]+>/g, '');
       return rawText.length > 140 ? rawText.substring(0, 140) + '...' : rawText;
    }
    return 'Read the full insights inside this post...';
  };

  return (
    <div>
      {/* Blog Page Header matching the rest of the site */}
      <section style={{ 
        padding: '160px 0 100px', 
        position: 'relative',
        background: 'url("/blog_cover.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white', 
        textAlign: 'center' 
      }}>
        {/* Dark Colored Overlay to enforce text visibility standards */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10, 88, 202, 0.95) 0%, rgba(10, 88, 202, 0.1) 100%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px' }}>BeconHive Insights</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
             Expert enterprise advice, company updates, and valuable industry tips.
          </p>
        </div>
      </section>

      <div style={{ padding: '80px 0', minHeight: 'calc(100vh - 80px)', background: '#F8FAFC' }}>
         <div className="container">
           {loading ? (
             <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-gray)' }}>
                <h2>Loading Latest Insights...</h2>
             </div>
           ) : blogs.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '16px' }}>No Published Articles Yet</h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '1.2rem' }}>Check back soon for the latest expert insights from the BeconHive team!</p>
             </div>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                {blogs.map(blog => (
                   <article key={blog.id} className="glass-card card-hover" style={{ display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                      {/* Featured Image */}
                      {blog.image_url ? (
                        <div style={{ width: '100%', height: '240px', overflow: 'hidden' }}>
                           <img 
                             src={blog.image_url} 
                             alt={blog.title} 
                             style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'Transform 0.3s' }} 
                           />
                        </div>
                      ) : (
                         <div style={{ width: '100%', height: '240px', background: 'var(--bg-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray)' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>No Cover Image</span>
                         </div>
                      )}

                      {/* Content Block */}
                      <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ display: 'flex', gap: '15px', marginBottom: '16px', color: 'var(--color-gray)', fontSize: '0.85rem', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14}/> {new Date(blog.created_at).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary-orange)' }}><User size={14}/> BeconHive</span>
                         </div>
                         
                         <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', lineHeight: 1.3, color: 'var(--primary-blue)' }}>
                            {blog.title}
                         </h2>
                         
                         <p style={{ color: 'var(--color-gray)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                            {getExcerpt(blog)}
                         </p>
                         
                         <button 
                            onClick={() => navigate(`/blog/${blog.slug || blog.id}`)} 
                            className="blog-read-more-btn" 
                            style={{ padding: '10px 0', border: 'none', borderTop: '1px solid var(--border-color)', borderRadius: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--primary-orange)', fontWeight: 700, width: '100%', cursor: 'pointer', background: 'transparent' }}
                         >
                            Read more <ArrowRight size={16} />
                         </button>
                      </div>
                   </article>
                ))}
             </div>
           )}
         </div>
      </div>
      <style>{`
        .blog-read-more-btn:hover {
          color: var(--primary-blue) !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

const blogStyles = `
  .blog-read-more-btn:hover {
    color: var(--primary-blue) !important;
  }
`;

export default Blog;
