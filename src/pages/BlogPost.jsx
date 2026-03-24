import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { ArrowLeft, Clock, User, Calendar, Share2 } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    // Fetch specifically by slug or fallback to ID
    const { data, error } = await supabase
      .from('blogs')
      .select(`*, profiles(full_name)`)
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      // If not found, maybe it's an ID
    }

    if (data) {
      setBlog(data);
      // Increment views
      await supabase
        .from('blogs')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center', minHeight: '80vh' }}>
        <div className="container">
          <h2>Opening Article...</h2>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center', minHeight: '80vh' }}>
        <div className="container">
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px' }}>Article Not Found</h2>
          <p style={{ color: 'var(--color-gray)', marginBottom: '30px' }}>The article you're looking for might have been moved or deleted.</p>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Blog Detail Header */}
      <section style={{ 
        padding: '160px 0 100px', 
        position: 'relative',
        background: blog.image_url ? `url("${blog.image_url}")` : 'url("/blog_cover.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white', 
        textAlign: 'center' 
      }}>
        {/* Dark Colored Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(10, 88, 202, 0.9) 0%, rgba(10, 88, 202, 0.7) 100%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <button 
            onClick={() => navigate('/blog')} 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(10px)',
              border: 'none',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '30px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '30px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Blog
          </button>
          
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '24px', lineHeight: 1.2 }}>
            {blog.title}
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', fontSize: '1rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> BeconHive</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> {blog.views || 0} Views</span>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        <div className="glass-card" style={{ padding: '60px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Main Content Area */}
          <div 
            className="blog-content" 
            dangerouslySetInnerHTML={{ __html: blog.content }} 
            style={{ 
              fontSize: '1.25rem', 
              lineHeight: 1.8, 
              color: '#334155',
            }}
          />
          
          <hr style={{ margin: '60px 0 40px', border: 'none', borderTop: '1px solid var(--border-color)' }} />
          
          {/* Footer of the blog post */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary-orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>BH</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>BeconHive Editorial Team</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-gray)' }}>Empowering businesses worldwide.</div>
              </div>
            </div>
            
            <button 
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }}
            >
              <Share2 size={18} /> Share Article
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .blog-content h2 { font-size: 2.2rem; color: var(--color-navy); margin: 40px 0 20px; }
        .blog-content h3 { font-size: 1.8rem; color: var(--color-navy); margin: 30px 0 15px; }
        .blog-content p { margin-bottom: 24px; }
        .blog-content img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 16px; 
          margin: 30px 0; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .blog-content ul, .blog-content ol { margin-bottom: 24px; padding-left: 20px; }
        .blog-content li { margin-bottom: 12px; }
        .blog-content blockquote { 
          border-left: 6px solid var(--primary-orange); 
          padding: 20px 30px; 
          background: #FFF7F3; 
          margin: 40px 0; 
          font-style: italic; 
          border-radius: 0 12px 12px 0;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
