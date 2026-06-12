import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../utils/useAuth';
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
  Plus,
  Type
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
  const [activeMediaTarget, setActiveMediaTarget] = useState('content');
  const [storageError, setStorageError] = useState(null);
  const [lastSelection, setLastSelection] = useState(null);

  async function fetchMedia() {
    setStorageError(null);
    try {
      const { data, error } = await supabase.storage.from('blog_media').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
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
      setStorageError(err.message);
    }
  }

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'agent')) {
       navigate('/dashboard');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (id !== 'new') {
      const fetchPost = async () => {
        const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
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
    const mediaRefreshFrame = window.requestAnimationFrame(() => {
      fetchMedia();
    });

    return () => {
      window.cancelAnimationFrame(mediaRefreshFrame);
    };
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const execCmd = (command, value = null) => {
    // Ensure the editor has focus before executing
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Restore selection if we have one (useful for modals)
    if (lastSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(lastSelection);
    }

    document.execCommand(command, false, value);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setLastSelection(selection.getRangeAt(0).cloneRange());
    }
  };

  const sanitizeSlug = (raw) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
       setFormData({ ...formData, slug: sanitizeSlug(formData.title) });
    }
  };

  const uploadToStorage = async (file) => {
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage.from('blog_media').upload(fileName, file);
    
    if (error) {
      alert(`Upload Failed: ${error.message}`);
      setIsUploading(false);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('blog_media').getPublicUrl(fileName);
    setIsUploading(false);
    fetchMedia();
    return publicUrl;
  };

  const handleImageSelect = (url) => {
    if (activeMediaTarget === 'featured') {
      setFormData({ ...formData, image_url: url });
    } else {
      // Small delay to ensure focus is restored to the editor
      setTimeout(() => {
        execCmd('insertHTML', `<div class="content-img-wrapper"><img src="${url}" alt="Blog Image" class="blog-body-image" /></div><p><br></p>`);
      }, 50);
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

  const openLibrary = (target) => {
    saveSelection(); // Save where the cursor was
    setActiveMediaTarget(target);
    setShowMediaLibrary(true);
    fetchMedia();
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '30px 0' }}>
       <div className="container" style={{ maxWidth: '1200px' }}>
         
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'white' }}>
               <ArrowLeft size={16} /> Dashboard
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={() => savePost('draft')} disabled={isSaving || isUploading} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
               </button>
               <button onClick={() => savePost('published')} disabled={isSaving || isUploading} className="btn btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', fontWeight: 700 }}>
                  <LayoutTemplate size={18} /> {isSaving ? 'Publishing...' : 'Publish Post'}
               </button>
            </div>
         </div>

         <div className="editor-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
            
            <div className="main-editor-pane">
               <div className="glass-card" style={{ padding: '0', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* FIXED TOOLBAR LAYOUT */}
                  <div className="wp-toolbar" onMouseDown={(e) => e.preventDefault()} style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    <div className="tb-section">
                       <button onClick={() => execCmd('bold')} className="tb-btn" title="Bold"><Bold size={18} /></button>
                       <button onClick={() => execCmd('italic')} className="tb-btn" title="Italic"><Italic size={18} /></button>
                    </div>

                    <div className="tb-v-divider"></div>

                    <div className="tb-section">
                       <select onChange={(e) => execCmd('formatBlock', e.target.value)} className="tb-select">
                          <option value="P">Paragraph</option>
                          <option value="H2">Heading 2</option>
                          <option value="H3">Heading 3</option>
                          <option value="H4">Heading 4</option>
                       </select>
                    </div>

                    <div className="tb-v-divider"></div>

                    <div className="tb-section">
                       <button onClick={() => execCmd('insertUnorderedList')} className="tb-btn" title="Bullets"><List size={18} /></button>
                       <button onClick={() => execCmd('insertOrderedList')} className="tb-btn" title="Numbers"><ListOrdered size={18} /></button>
                       <button onClick={() => execCmd('formatBlock', 'BLOCKQUOTE')} className="tb-btn" title="Quote"><Quote size={18} /></button>
                    </div>

                    <div className="tb-v-divider"></div>

                    <div className="tb-section">
                       <button onClick={() => execCmd('justifyLeft')} className="tb-btn"><AlignLeft size={18} /></button>
                       <button onClick={() => execCmd('justifyCenter')} className="tb-btn"><AlignCenter size={18} /></button>
                       <button onClick={() => execCmd('justifyRight')} className="tb-btn"><AlignRight size={18} /></button>
                    </div>

                    <div className="tb-v-divider"></div>

                    <div className="tb-section">
                       <button onClick={() => { const url = prompt('URL:'); if(url) execCmd('createLink', url); }} className="tb-btn"><LinkIcon size={18} /></button>
                       <button onClick={() => openLibrary('content')} className="tb-btn media-btn"><ImageIcon size={18} /> <span>Media</span></button>
                       <button onClick={() => execCmd('insertHorizontalRule')} className="tb-btn"><Minus size={18} /></button>
                       <button onClick={() => execCmd('removeFormat')} className="tb-btn"><Eraser size={18} /></button>
                    </div>
                  </div>

                  <div style={{ padding: '40px 50px' }}>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      onBlur={handleTitleBlur}
                      placeholder="Enter Article Title" 
                      style={{ border: 'none', borderBottom: '2px solid #f1f5f9', outline: 'none', fontSize: '2.5rem', fontWeight: 900, marginBottom: '30px', width: '100%', color: '#0f172a' }} 
                    />
                    
                    <div 
                      ref={editorRef}
                      contentEditable 
                      onBlur={saveSelection}
                      onKeyUp={saveSelection}
                      onClick={saveSelection}
                      suppressContentEditableWarning
                      style={{ 
                        minHeight: '600px',
                        outline: 'none', 
                        fontSize: '1.2rem', 
                        lineHeight: '1.9', 
                        color: '#334155' 
                      }}
                      data-placeholder="Begin your story here..."
                    ></div>
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
               <div className="glass-card side-box" style={{ padding: '24px', background: 'white' }}>
                  <h3 className="side-title">Featured Image</h3>
                  {formData.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img src={formData.image_url} alt="Featured" style={{ width: '100%', borderRadius: '12px', height: '200px', objectFit: 'cover' }} />
                      <button onClick={() => setFormData({...formData, image_url: ''})} className="img-remove-badge">Change</button>
                    </div>
                  ) : (
                    <button onClick={() => openLibrary('featured')} className="featured-upload-btn">
                      <Plus size={30} />
                      <span>Set Feature Image</span>
                    </button>
                  )}
               </div>

               <div className="glass-card side-box" style={{ padding: '24px', marginTop: '20px', background: 'white' }}>
                  <h3 className="side-title">SEO Optimization</h3>
                  <div style={{ marginBottom: '16px' }}>
                     <label className="side-label">URL Slug</label>
                     <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="side-input" />
                  </div>
                  <div>
                     <label className="side-label">Meta Description</label>
                     <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows="4" className="side-input" style={{ resize: 'none' }}></textarea>
                  </div>
               </div>
            </div>

         </div>
       </div>

       {/* Media Library */}
       {showMediaLibrary && (
         <div className="modal-overlay">
           <div className="modal-content" style={{ maxWidth: '900px', width: '95%', height: '80vh', display: 'flex', flexDirection: 'column' }}>
             <div className="modal-header">
               <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Media Library</h2>
               </div>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <button onClick={fetchMedia} title="Refresh" className="modal-refresh-btn"><RefreshCw size={20} /></button>
                 <label className="btn btn-primary" style={{ cursor: 'pointer', padding: '8px 16px' }}>
                   + Upload
                   <input type="file" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                 </label>
                 <button onClick={() => setShowMediaLibrary(false)} className="modal-close"><X size={24} /></button>
               </div>
             </div>
             
             <div className="modal-body">
               {storageError ? (
                 <div className="error-box">
                    <p>Error: {storageError}</p>
                 </div>
               ) : (
                 <div className="media-grid">
                   {isUploading && <div className="media-card loading-card"><RefreshCw className="spin" /></div>}
                   {mediaLibrary.map((item, idx) => (
                     <div key={idx} className="media-card" onClick={() => handleImageSelect(item.url)}>
                       <img src={item.url} alt={item.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }} />
                       <div className="media-card-name">{item.name.split('_').pop() || item.name}</div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

       <style>{`
          .tb-section { display: flex; gap: 4px; align-items: center; }
          .tb-v-divider { width: 1px; height: 24px; background: #e2e8f0; margin: 0 8px; }
          .tb-btn { border: none; background: transparent; color: #64748b; padding: 8px; border-radius: 6px; cursor: pointer; transition: 0.2s; display: flex; }
          .tb-btn:hover { background: #f1f5f9; color: #0f172a; }
          .media-btn { background: #0f172a !important; color: white !important; font-weight: 700; gap: 8px; padding: 6px 12px !important; }
          .tb-select { border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; outline: none; }
          
          .side-title { font-size: 1.1rem; border-left: 3px solid var(--primary-blue); padding-left: 10px; margin-bottom: 20px; font-weight: 800; }
          .side-label { display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; color: #475569; }
          .side-input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; background: #f8fafc; font-size: 0.95rem; }
          .side-input:focus { border-color: var(--primary-blue); background: white; }
          
          .featured-upload-btn { width: 100%; height: 200px; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--primary-blue); cursor: pointer; background: #f8fafc; }
          .img-remove-badge { position: absolute; top: 10px; right: 10px; background: rgba(239, 68, 68, 0.9); color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 700; }

          .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
          .modal-content { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.3); }
          .modal-header { padding: 20px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
          .modal-body { flex: 1; padding: 20px; overflow-y: auto; background: #f9fafb; }
          .modal-close { background: none; border: none; cursor: pointer; color: #64748b; }
          .modal-refresh-btn { background: none; border: none; cursor: pointer; color: #64748b; display: flex; }
          
          .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; }
          .media-card { background: white; border: 1px solid #eee; border-radius: 8px; padding: 10px; cursor: pointer; transition: 0.2s; position: relative; }
          .media-card:hover { border-color: var(--primary-blue); transform: translateY(-2px); }
          .media-card img { width: 100%; height: 120px; object-fit: cover; border-radius: 4px; }
          .media-card-name { font-size: 0.7rem; margin-top: 8px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          
          .loading-card { display: flex; align-items: center; justify-content: center; height: 160px; }
          .error-box { padding: 40px; text-align: center; color: #b91c1c; }

          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

          [contentEditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
          .content-img-wrapper { text-align: center; margin: 30px 0; }
          .blog-body-image { max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          
          @media (max-width: 900px) {
            .editor-layout { grid-template-columns: 1fr; }
          }
       `}</style>
    </div>
  );
};

export default AgentBlogEditor;
