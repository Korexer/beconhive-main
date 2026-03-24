import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../utils/AuthContext';
import { 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Save, 
  ArrowLeft, 
  LayoutTemplate, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Minus,
  Eraser,
  Search,
  X,
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';

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
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState('content'); // 'content' or 'featured'
  const [storageError, setStorageError] = useState(null);

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
          if (editorRef.current) {
            editorRef.current.innerHTML = data.content || '';
          }
        } else {
          alert('Blog post not found!');
          navigate('/dashboard');
        }
      };
      
      fetchPost();
    }
    fetchMedia();
  }, [id, navigate]);

  const fetchMedia = async () => {
    setStorageError(null);
    try {
      const { data, error } = await supabase.storage.from('blog_media').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.error('Storage Error:', error);
        setStorageError(error.message);
        return;
      }

      if (data) {
        const mediaUrls = await Promise.all(data.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage.from('blog_media').getPublicUrl(file.name);
          return { name: file.name, url: publicUrl, created_at: file.created_at };
        }));
        setMediaLibrary(mediaUrls.filter(m => !m.name.includes('.emptyKeep')));
      }
    } catch (err) {
      console.error('System Error:', err);
      setStorageError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const sanitizeSlug = (raw) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
       setFormData({ ...formData, slug: sanitizeSlug(formData.title) });
    }
  };

  const uploadToStorage = async (file) => {
    setIsUploading(true);
    // Create a safe filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage.from('blog_media').upload(fileName, file);
    
    if (error) {
      alert(`Upload Failed: ${error.message}. TIP: Ensure a 'blog_media' bucket exists in Supabase Storage with public access.`);
      setIsUploading(false);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('blog_media').getPublicUrl(fileName);
    setIsUploading(false);
    fetchMedia(); // Refresh library
    return publicUrl;
  };

  const handleImageSelect = (url) => {
    if (activeMediaTarget === 'featured') {
      setFormData({ ...formData, image_url: url });
    } else {
      // Create specialized HTML for nice blog images
      const imgHtml = `<div class="content-img-wrapper"><img src="${url}" alt="Blog content image" class="blog-body-image" /></div><p><br></p>`;
      execCmd('insertHTML', imgHtml);
    }
    setShowMediaLibrary(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToStorage(file);
    if (url) handleImageSelect(url);
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

  const insertLink = () => {
    const url = prompt('Enter the full link URL:');
    if (url) execCmd('createLink', url);
  };

  const insertManualImage = () => {
    const url = prompt('Enter the direct image URL:');
    if (url) {
      const imgHtml = `<div class="content-img-wrapper"><img src="${url}" alt="External image" class="blog-body-image" /></div><p><br></p>`;
      execCmd('insertHTML', imgHtml);
    }
  };

  if (loading || !user) return <div className="section-padding text-center">Loading Content Editor...</div>;

  return (
    <div style={{ background: '#F1F5F9', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
       <div className="container" style={{ maxWidth: '1200px' }}>
         
         {/* Top Header Actions */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white' }}>
               <ArrowLeft size={16} /> Exit Editor
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={() => savePost('draft')} disabled={isSaving || isUploading} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
               </button>
               <button onClick={() => savePost('published')} disabled={isSaving || isUploading} className="btn btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', fontWeight: 700 }}>
                  <LayoutTemplate size={18} /> {isSaving ? 'Publishing...' : 'Publish Article'}
               </button>
            </div>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
            
            {/* Main Content Area */}
            <div className="editor-main-lane" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  
                  {/* Advanced WP-style Toolbar */}
                  <div className="wp-toolbar" style={{ display: 'flex', gap: '8px', padding: '15px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', alignItems: 'center', flexWrap: 'wrap', position: 'sticky', top: '0', zIndex: 10 }}>
                    <div className="toolbar-group">
                      <button onClick={() => execCmd('bold')} title="Bold" className="tb-btn"><Bold size={18} /></button>
                      <button onClick={() => execCmd('italic')} title="Italic" className="tb-btn"><Italic size={18} /></button>
                    </div>

                    <div className="tb-divider"></div>

                    <select onChange={(e) => execCmd('formatBlock', e.target.value)} className="tb-select">
                      <option value="P">Paragraph</option>
                      <option value="H2">Heading 2</option>
                      <option value="H3">Heading 3</option>
                      <option value="H4">Heading 4</option>
                      <option value="H5">Heading 5</option>
                    </select>

                    <div className="tb-divider"></div>

                    <div className="toolbar-group">
                      <button onClick={() => execCmd('insertUnorderedList')} title="Bullets" className="tb-btn"><List size={18} /></button>
                      <button onClick={() => execCmd('insertOrderedList')} title="Numbers" className="tb-btn"><ListOrdered size={18} /></button>
                      <button onClick={() => execCmd('formatBlock', 'BLOCKQUOTE')} title="Quote" className="tb-btn"><Quote size={18} /></button>
                    </div>

                    <div className="tb-divider"></div>

                    <div className="toolbar-group">
                      <button onClick={() => execCmd('justifyLeft')} title="Align Left" className="tb-btn"><AlignLeft size={18} /></button>
                      <button onClick={() => execCmd('justifyCenter')} title="Align Center" className="tb-btn"><AlignCenter size={18} /></button>
                      <button onClick={() => execCmd('justifyRight')} title="Align Right" className="tb-btn"><AlignRight size={18} /></button>
                    </div>

                    <div className="tb-divider"></div>

                    <div className="toolbar-group">
                      <button onClick={insertLink} title="Insert Link" className="tb-btn"><LinkIcon size={18} /></button>
                      <button onClick={() => { setActiveMediaTarget('content'); setShowMediaLibrary(true); fetchMedia(); }} title="Media Library" className="tb-btn media-btn"><ImageIcon size={18} style={{marginRight: '5px'}}/> Media</button>
                      <button onClick={() => execCmd('insertHorizontalRule')} title="Horizontal Rule" className="tb-btn"><Minus size={18} /></button>
                      <button onClick={() => execCmd('removeFormat')} title="Clear Formatting" className="tb-btn"><Eraser size={18} /></button>
                    </div>
                  </div>

                  <div style={{ padding: '60px' }}>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      onBlur={handleTitleBlur}
                      placeholder="Title of your masterpiece..." 
                      className="editor-title-input"
                    />
                    
                    <div 
                      ref={editorRef}
                      contentEditable 
                      suppressContentEditableWarning
                      style={{ 
                        minHeight: '600px',
                        outline: 'none', 
                        fontSize: '1.25rem', 
                        lineHeight: 1.8, 
                        color: '#334155' 
                      }}
                      data-placeholder="Start writing here... Press the Media button to insert images."
                    ></div>
                  </div>
               </div>
            </div>

            {/* Sidebar Lane */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               
               <div className="glass-card sidebar-box" style={{ padding: '24px' }}>
                  <h3 className="sidebar-title">Featured Image</h3>
                  <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '15px'}}>This image appears at the top of the post and in the blog list.</p>
                  
                  {formData.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img src={formData.image_url} alt="Cover" style={{ width: '100%', borderRadius: '12px', height: '200px', objectFit: 'cover' }} />
                      <button onClick={() => setFormData({...formData, image_url: ''})} className="remove-img-btn">Remove</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setActiveMediaTarget('featured'); setShowMediaLibrary(true); fetchMedia(); }}
                      className="set-featured-btn"
                    >
                      <Plus size={32} color="var(--primary-blue)" />
                      <span>Select Cover Image</span>
                    </button>
                  )}
               </div>

               <div className="glass-card sidebar-box" style={{ padding: '24px' }}>
                  <h3 className="sidebar-title">SEO Settings</h3>
                  <div style={{ marginBottom: '16px' }}>
                     <label className="sidebar-label">URL Slug</label>
                     <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="your-post-url" className="sidebar-input" />
                  </div>
                  <div>
                     <label className="sidebar-label">Meta Description</label>
                     <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows="4" placeholder="Short summary for Google..." className="sidebar-input scrollbar-hidden" style={{ resize: 'none' }}></textarea>
                  </div>
               </div>

            </div>

         </div>
       </div>

       {/* Media Library Modal */}
       {showMediaLibrary && (
         <div className="modal-overlay">
           <div className="modal-content" style={{ maxWidth: '960px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '24px', overflow: 'hidden' }}>
             <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
               <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>Media Library</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Choose an image or upload a new one.</p>
               </div>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <button onClick={fetchMedia} title="Refresh Library" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><RefreshCw size={20} /></button>
                 <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}>
                   <Plus size={18} /> Upload New
                   <input type="file" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                 </label>
                 <button onClick={() => setShowMediaLibrary(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}><X size={20} /></button>
               </div>
             </div>
             
             <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#fff' }}>
               {storageError ? (
                 <div style={{ padding: '30px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, marginBottom: '10px' }}>Storage Connection Issue</p>
                    <p style={{ fontSize: '0.9rem' }}>{storageError}</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '15px', color: '#ef4444' }}>Please ensure you have created a bucket named "blog_media" in your Supabase Storage and set it to BROADCAST or PUBLIC access.</p>
                    <button onClick={fetchMedia} className="btn" style={{ marginTop: '15px', background: '#b91c1c', color: 'white', border: 'none' }}>Try Again</button>
                 </div>
               ) : (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                   {isUploading && (
                      <div className="media-item-placeholder" style={{ background: 'var(--bg-light-blue)' }}>
                        <RefreshCw size={24} className="spin" />
                        <span style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--primary-blue)', fontWeight: 700 }}>Uploading...</span>
                      </div>
                   )}
                   {mediaLibrary.map((item, idx) => (
                     <div key={idx} className="media-item-card" onClick={() => handleImageSelect(item.url)}>
                       <div className="media-thumb-wrapper">
                          <img src={item.url} alt={item.name} />
                          <div className="media-overlay-check"><CheckCircle2 size={32} color="white" /></div>
                       </div>
                       <div className="media-details">
                         <span className="media-name">{item.name.replace(/^\d+_/, '')}</span>
                       </div>
                     </div>
                   ))}
                   {mediaLibrary.length === 0 && !isUploading && (
                     <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', border: '2px dashed #f1f5f9', borderRadius: '16px' }}>
                        <ImageIcon size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>Your media library is empty.</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Upload some images to start building your collection.</p>
                     </div>
                   )}
                 </div>
               )}
             </div>

             <div style={{ padding: '16px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Supported formats: JPG, PNG, WEBP, GIF</span>
                <button onClick={insertManualImage} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>Insert from external URL</button>
             </div>
           </div>
         </div>
       )}

       <style>{`
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center; z-index: 10000;
            padding: 20px;
          }
          
          .tb-btn { border: none; background: transparent; padding: 10px; border-radius: 8px; cursor: pointer; display: flex; color: #64748b; transition: 0.2s; }
          .tb-btn:hover { background: #e2e8f0; color: #0f172a; }
          .media-btn { background: #0f172a !important; color: white !important; font-weight: 700; padding: 8px 16px !important; }
          .tb-divider { width: 1px; background: #e2e8f0; height: 28px; margin: 0 8px; }
          .tb-select { border: 1px solid #e2e8f0; background: white; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.85rem; color: #334155; }
          
          .editor-title-input { border: none; outline: none; font-size: 3.2rem; font-weight: 900; margin-bottom: 30px; width: 100%; background: transparent; color: #0f172a; letter-spacing: -0.02em; }
          .editor-title-input::placeholder { color: #cbd5e1; }

          .sidebar-box { background: white; border: 1px solid #e2e8f0; border-radius: 16px; transition: 0.3s; }
          .sidebar-box:hover { border-color: var(--primary-blue); box-shadow: 0 10px 20px rgba(10, 88, 202, 0.05); }
          .sidebar-title { fontSize: 1.1rem; margin-bottom: 20px; font-weight: 800; color: #0f172a; border-left: 4px solid var(--primary-blue); padding-left: 12px; }
          .sidebar-label { display: block; font-weight: 700; margin-bottom: 8px; fontSize: 0.85rem; color: #475569; }
          .sidebar-input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-size: 0.95rem; background: #f8fafc; transition: 0.2s; }
          .sidebar-input:focus { border-color: var(--primary-blue); background: white; }
          
          .set-featured-btn { width: 100%; height: 200px; border: 2px dashed #cbd5e1; border-radius: 16px; background: #f8fafc; cursor: pointer; display: flex; flexDirection: column; alignItems: center; justifyContent: center; gap: 12px; transition: 0.2s; }
          .set-featured-btn:hover { background: #f1f5f9; border-color: var(--primary-blue); }
          .set-featured-btn span { font-weight: 700; color: #475569; }
          .remove-img-btn { position: absolute; top: 12px; right: 12px; background: rgba(239, 68, 68, 0.95); color: white; border: none; padding: 8px 16px; borderRadius: 8px; cursor: pointer; fontWeight: 700; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }

          .media-item-card { cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: 0.2s; }
          .media-thumb-wrapper { position: relative; width: 100%; height: 160px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
          .media-thumb-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
          .media-overlay-check { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 88, 202, 0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; }
          .media-item-card:hover .media-overlay-check { opacity: 1; }
          .media-item-card:hover img { transform: scale(1.1); }
          .media-name { font-size: 0.75rem; color: #64748b; font-weight: 600; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }

          .media-item-placeholder { width: 100%; height: 160px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #e2e8f0; }

          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

          [contentEditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
          [contentEditable] .content-img-wrapper { margin: 40px 0; text-align: center; }
          [contentEditable] .blog-body-image { 
            max-width: 100%; width: 100%; height: auto; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.12); border: 1px solid #f1f5f9;
          }
          [contentEditable] blockquote { border-left: 6px solid var(--primary-orange); padding: 5px 0 5px 30px; font-style: italic; color: #475569; margin: 40px 0; font-size: 1.5rem; line-height: 1.6; }
          [contentEditable] h2 { font-size: 2.5rem; margin-top: 60px; color: #0f172a; font-weight: 800; }
          [contentEditable] h3 { font-size: 2rem; margin-top: 50px; color: #0f172a; font-weight: 700; }
          [contentEditable] hr { border: none; border-top: 2px solid #f1f5f9; margin: 50px 0; }
          .scrollbar-hidden::-webkit-scrollbar { display: none; }
       `}</style>
    </div>
  );
};

export default AgentBlogEditor;
