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
  CheckCircle2
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
          if (editorRef.current) editorRef.current.innerHTML = data.content || '';
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
    try {
      const { data, error } = await supabase.storage.from('blog_media').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (data) {
        const mediaUrls = await Promise.all(data.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage.from('blog_media').getPublicUrl(file.name);
          return { name: file.name, url: publicUrl, created_at: file.created_at };
        }));
        setMediaLibrary(mediaUrls);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
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
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { data, error } = await supabase.storage.from('blog_media').upload(fileName, file);
    
    if (error) {
      alert(`Upload Failed: ` + error.message);
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
      // Insert into content with professional styling wrapper
      const imgHtml = `<img src="${url}" alt="Blog Image" class="blog-body-image" />`;
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

  if (loading || !user) return <div className="section-padding text-center">Loading Content Editor...</div>;

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
       <div className="container" style={{ maxWidth: '1200px' }}>
         
         {/* Top Header Actions */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
               <ArrowLeft size={16} /> Dashboard
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={() => savePost('draft')} disabled={isSaving || isUploading} className="btn-save-draft" style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
               </button>
               <button onClick={() => savePost('published')} disabled={isSaving || isUploading} className="btn btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutTemplate size={18} /> {isSaving ? 'Publishing...' : 'Publish Post'}
               </button>
            </div>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
            
            {/* Main Content Area */}
            <div className="editor-main-lane" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Advanced WP-style Toolbar */}
                  <div className="wp-toolbar" style={{ display: 'flex', gap: '8px', padding: '12px 20px', background: '#f1f5f9', borderBottom: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="toolbar-group" style={{ display: 'flex', gap: '4px' }}>
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

                    <div className="toolbar-group" style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => execCmd('insertUnorderedList')} title="Bullets" className="tb-btn"><List size={18} /></button>
                      <button onClick={() => execCmd('insertOrderedList')} title="Numbers" className="tb-btn"><ListOrdered size={18} /></button>
                      <button onClick={() => execCmd('formatBlock', 'BLOCKQUOTE')} title="Quote" className="tb-btn"><Quote size={18} /></button>
                    </div>

                    <div className="tb-divider"></div>

                    <div className="toolbar-group" style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => execCmd('justifyLeft')} title="Align Left" className="tb-btn"><AlignLeft size={18} /></button>
                      <button onClick={() => execCmd('justifyCenter')} title="Align Center" className="tb-btn"><AlignCenter size={18} /></button>
                      <button onClick={() => execCmd('justifyRight')} title="Align Right" className="tb-btn"><AlignRight size={18} /></button>
                    </div>

                    <div className="tb-divider"></div>

                    <div className="toolbar-group" style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => { const url = prompt('URL:'); if(url) execCmd('createLink', url); }} title="Link" className="tb-btn"><LinkIcon size={18} /></button>
                      <button onClick={() => { setActiveMediaTarget('content'); setShowMediaLibrary(true); }} title="Media Library" className="tb-btn" style={{ background: 'var(--primary-blue)', color: 'white' }}><ImageIcon size={18} /></button>
                      <button onClick={() => execCmd('insertHorizontalRule')} title="Horizontal Rule" className="tb-btn"><Minus size={18} /></button>
                      <button onClick={() => execCmd('removeFormat')} title="Clear Formatting" className="tb-btn"><Eraser size={18} /></button>
                    </div>
                  </div>

                  <div style={{ padding: '40px' }}>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      onBlur={handleTitleBlur}
                      placeholder="Title of your post..." 
                      style={{ border: 'none', borderBottom: '1px solid #eee', outline: 'none', fontSize: '2.8rem', fontWeight: 900, marginBottom: '30px', width: '100%', background: 'transparent', color: 'var(--color-navy)' }} 
                    />
                    
                    <div 
                      ref={editorRef}
                      contentEditable 
                      suppressContentEditableWarning
                      style={{ 
                        minHeight: '600px',
                        outline: 'none', 
                        fontSize: '1.2rem', 
                        lineHeight: 1.8, 
                        color: '#1e293b' 
                      }}
                      data-placeholder="Write your article content here... Use the toolbar above for formatting and media."
                    ></div>
                  </div>
               </div>
            </div>

            {/* SidebarLane */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               
               <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>Featured Image</h3>
                  {formData.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img src={formData.image_url} alt="Cover" style={{ width: '100%', borderRadius: '12px', height: '200px', objectFit: 'cover' }} />
                      <button onClick={() => setFormData({...formData, image_url: ''})} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Replace</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setActiveMediaTarget('featured'); setShowMediaLibrary(true); }}
                      style={{ width: '100%', height: '200px', border: '2px dashed var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                      <ImageIcon size={32} color="var(--primary-blue)" />
                      <span style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>Set Featured Image</span>
                    </button>
                  )}
               </div>

               <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>SEO Settings</h3>
                  <div style={{ marginBottom: '16px' }}>
                     <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.85rem' }}>Slug</label>
                     <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="post-url-slug" className="sidebar-input" />
                  </div>
                  <div>
                     <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.85rem' }}>Meta Description</label>
                     <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows="4" placeholder="Brief summary for Google..." className="sidebar-input" style={{ resize: 'none' }}></textarea>
                  </div>
               </div>

            </div>

         </div>
       </div>

       {/* Media Library Modal */}
       {showMediaLibrary && (
         <div className="modal-overlay">
           <div className="modal-content glass-card" style={{ maxWidth: '900px', width: '90%', height: '80vh', display: 'flex', flexDirection: 'column' }}>
             <div style={{ padding: '20px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Media Library</h2>
               <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                 <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <ImageIcon size={18} /> Upload New
                   <input type="file" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                 </label>
                 <X onClick={() => setShowMediaLibrary(false)} style={{ cursor: 'pointer' }} />
               </div>
             </div>
             
             <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
               {isUploading && (
                  <div style={{ gridColumn: '1/-1', padding: '20px', background: 'var(--bg-light-blue)', borderRadius: '12px', textAlign: 'center', color: 'var(--primary-blue)', fontWeight: 700 }}>
                    Uploading file... please wait.
                  </div>
               )}
               {mediaLibrary.map((item, idx) => (
                 <div key={idx} className="media-item" onClick={() => handleImageSelect(item.url)}>
                   <img src={item.url} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                   <div className="media-item-info">
                     <span className="media-item-name">{item.name.split('_').pop()}</span>
                   </div>
                 </div>
               ))}
               {mediaLibrary.length === 0 && !isUploading && (
                 <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: 'var(--color-gray)' }}>Your media library is empty. Upload your first picture!</p>
               )}
             </div>
           </div>
         </div>
       )}

       <style>{`
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
            display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .modal-content { background: white; border-radius: 16px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
          .tb-btn { border: none; background: white; padding: 8px; border-radius: 6px; cursor: pointer; display: flex; color: #475569; transition: all 0.2s; }
          .tb-btn:hover { background: #e2e8f0; color: var(--primary-blue); }
          .tb-divider { width: 1px; background: #cbd5e1; height: 24px; margin: 0 4px; }
          .tb-select { border: 1px solid #cbd5e1; background: white; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #475569; }
          .sidebar-input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); outline: none; font-size: 0.9rem; }
          
          .media-item { cursor: pointer; position: relative; border-radius: 10px; overflow: hidden; transition: 0.2s; }
          .media-item:hover img { transform: scale(1.05); filter: brightness(0.8); }
          .media-item-info { position: absolute; bottom: 0; left: 0; width: 100%; padding: 8px; background: rgba(0,0,0,0.6); color: white; transform: translateY(100%); transition: 0.2s; }
          .media-item:hover .media-item-info { transform: translateY(0); }
          .media-item-name { font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

          [contentEditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
          [contentEditable] .blog-body-image { 
            max-width: 100%; width: 100%; height: auto; border-radius: 16px; margin: 40px 0; box-shadow: 0 15px 35px rgba(0,0,0,0.1); 
          }
          [contentEditable] blockquote { border-left: 5px solid var(--primary-orange); padding-left: 25px; font-style: italic; color: #64748b; margin: 30px 0; font-size: 1.3rem; }
          [contentEditable] h2 { font-size: 2.222rem; margin-top: 50px; color: var(--color-navy); }
          [contentEditable] h3 { font-size: 1.8rem; margin-top: 40px; color: var(--color-navy); }
          [contentEditable] hr { border: none; border-top: 1px solid #e2e8f0; margin: 40px 0; }
       `}</style>
    </div>
  );
};

export default AgentBlogEditor;
