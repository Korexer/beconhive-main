import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../utils/AuthContext';
import { Image as ImageIcon, Video, Mic, Bold, Italic, Link as LinkIcon, Save, ArrowLeft, LayoutTemplate } from 'lucide-react';

const AgentBlogEditor = () => {
  const { id } = useParams();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  const editorRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_description: '',
    image_url: '' // Featured Image
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'agent')) {
       navigate('/dashboard');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (id !== 'new') {
      const fetchPost = async () => {
        const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
        if (data) {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            meta_description: data.meta_description || '',
            image_url: data.image_url || ''
          });
          setHtmlContent(data.content || '');
          if (editorRef.current) editorRef.current.innerHTML = data.content || '';
        } else {
          alert('Blog post not found!');
          navigate('/dashboard');
        }
      };
      
      fetchPost();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Format execution for the WYSIWYG
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const sanitizeSlug = (raw) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
       setFormData({ ...formData, slug: sanitizeSlug(formData.title) });
    }
  };

  // Upload utility for Supabase Storage
  const uploadToStorage = async (file, bucket = 'blog_media') => {
    setIsUploading(true);
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    
    if (error) {
      alert(`Media Upload Failed. Please manually ensure you create an open Supabase bucket named: '${bucket}'. Error: ` + error.message);
      setIsUploading(false);
      return null;
    }
    
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    setIsUploading(false);
    return publicData.publicUrl;
  };

  const handleFeaturedImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToStorage(file);
    if (url) setFormData({ ...formData, image_url: url });
  };
  
  const insertImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToStorage(file);
    if (url) execCmd('insertImage', url);
  };

  const insertLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) execCmd('createLink', url);
  };

  const savePost = async (publishStatus = 'draft') => {
    if (!formData.title) return alert("Please provide a Title.");
    
    setIsSaving(true);
    const content = editorRef.current.innerHTML;
    const safeSlug = formData.slug ? sanitizeSlug(formData.slug) : sanitizeSlug(formData.title);

    const payload = {
       author_id: user.id,
       title: formData.title,
       slug: safeSlug,
       meta_description: formData.meta_description,
       image_url: formData.image_url,
       content: content,
       status: publishStatus
    };
    
    let dbError;
    if (id === 'new') {
      const { error } = await supabase.from('blogs').insert([payload]);
      dbError = error;
    } else {
      payload.updated_at = new Date().toISOString();
      const { error } = await supabase.from('blogs').update(payload).eq('id', id);
      dbError = error;
    }

    setIsSaving(false);
    
      if (dbError) {
       alert("Error saving blog post: " + dbError.message);
    } else {
       alert(publishStatus === 'published' ? "Blog post published successfully!" : "Draft saved successfully!");
       navigate('/dashboard');
    }
  };

  if (loading || !user) return <div className="section-padding text-center">Loading Content Editor...</div>;

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
       <div className="container" style={{ maxWidth: '1000px' }}>
         
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
               <ArrowLeft size={16} /> Dashboard
            </button>
            <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary-blue)' }}>{id === 'new' ? 'Craft a New Post' : 'Edit Post'}</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={() => savePost('draft')} disabled={isSaving || isUploading} className="btn btn-outline" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white' }}>
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
               </button>
               <button onClick={() => savePost('published')} disabled={isSaving || isUploading} className="btn btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutTemplate size={18} /> {isSaving ? 'Publishing...' : 'Publish Instantly'}
               </button>
            </div>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
            
            {/* Rich Editor Main Lane */}
            <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: 'auto', minHeight: '70vh' }}>
               <input 
                 type="text" 
                 name="title" 
                 value={formData.title} 
                 onChange={handleChange} 
                 onBlur={handleTitleBlur}
                 placeholder="Enter an engaging, SEO-optimized title..." 
                 style={{ border: 'none', borderBottom: '2px solid var(--border-color)', outline: 'none', fontSize: '2.5rem', fontWeight: 800, padding: '16px 0', marginBottom: '20px', width: '100%', background: 'transparent' }} 
               />
               
               {/* Native HTML5 Formatting Toolbar */}
               <div style={{ display: 'flex', gap: '10px', padding: '12px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => execCmd('bold')} title="Bold" style={{ border: 'none', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><Bold size={18} /></button>
                  <button onClick={() => execCmd('italic')} title="Italic" style={{ border: 'none', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><Italic size={18} /></button>
                  <div style={{ width: '1px', background: 'var(--color-gray)', height: '24px', margin: '0 8px' }}></div>
                  <button onClick={() => execCmd('formatBlock', 'H2')} title="Heading 2" style={{ border: 'none', background: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>H2</button>
                  <button onClick={() => execCmd('formatBlock', 'H3')} title="Heading 3" style={{ border: 'none', background: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>H3</button>
                  <div style={{ width: '1px', background: 'var(--color-gray)', height: '24px', margin: '0 8px' }}></div>
                  
                  <button onClick={insertLink} title="Insert Link" style={{ border: 'none', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><LinkIcon size={18} /></button>
                  
                  <label title="Insert Image" style={{ border: 'none', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ImageIcon size={18} color="var(--primary-blue)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Media</span>
                    <input type="file" accept="image/*,video/*" onChange={insertImage} style={{ display: 'none' }} />
                  </label>
                  
                  {isUploading && <span style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', fontWeight: 600 }}>Uploading Media...</span>}
               </div>

               {/* Render Frame */}
               <div 
                 ref={editorRef}
                 contentEditable 
                 suppressContentEditableWarning
                 style={{ 
                   flex: 1, 
                   outline: 'none', 
                   fontSize: '1.15rem', 
                   lineHeight: 1.8, 
                   color: '#334155' 
                 }}
                 data-placeholder="Start writing the content of your masterpiece here... Highlight text to use the controls above!"
               ></div>
            </div>

            {/* Config & SEO Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="glass-card" style={{ padding: '24px' }}>
                 <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LayoutTemplate size={18} /> SEO Properties
                 </h3>
                 <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-gray)' }}>URL Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="your-searchable-link" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                 </div>
                 <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-gray)' }}>Meta Description (150-160 max characters)</label>
                    <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows="4" placeholder="This exact text will appear under your blue link on Google Search." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
                 </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                 <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Featured Image</h3>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '16px' }}>High quality banner image displayed as the thumbnail across the website.</p>
                 
                 {formData.image_url ? (
                   <div style={{ position: 'relative' }}>
                     <img src={formData.image_url} alt="Cover" style={{ width: '100%', borderRadius: '8px', height: '180px', objectFit: 'cover' }} />
                     <button onClick={() => setFormData({...formData, image_url: ''})} style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                   </div>
                 ) : (
                   <label style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.02)' }}>
                     <ImageIcon size={32} color="var(--primary-blue)" style={{ marginBottom: '10px' }} />
                     <span style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>Upload Cover Media</span>
                     <input type="file" accept="image/*" onChange={handleFeaturedImage} style={{ display: 'none' }} />
                   </label>
                 )}
              </div>

            </div>

         </div>
       </div>

       <style>{`
          [contentEditable]:empty:before {
             content: attr(data-placeholder);
             color: #94a3b8;
             pointer-events: none;
             display: block; // For Firefox
          }
          [contentEditable] img, [contentEditable] video {
             max-width: 100%;
             border-radius: 8px;
             margin: 20px 0;
             box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
       `}</style>
    </div>
  );
};

export default AgentBlogEditor;
