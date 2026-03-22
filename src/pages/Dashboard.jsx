import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, MessageSquare, ClipboardList, PenTool, ShoppingBag, LogOut, Users, Search, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  // States for fetching lists
  const [agentList, setAgentList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [agentBlogs, setAgentBlogs] = useState([]);
  const [orderedServices, setOrderedServices] = useState([]);
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetchingListing, setIsFetchingListing] = useState(false);
  const [todoInput, setTodoInput] = useState({ title: '', due_date: '', notes: '' });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (!loading && profile && !activeTab) {
      setActiveTab(profile.role === 'agent' ? 'customers' : 'agents');
    }
  }, [user, loading, navigate, profile, activeTab]);

  // Fetch logic on mount
  useEffect(() => {
    let unmounted = false;
    const prefetchAllData = async () => {
      setIsFetchingListing(true);
      
      if (profile?.role === 'customer') {
        const { data } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'agent');
        if (data && !unmounted) setAgentList(data);
        
        // Fetch Orders explicitly mapped to customer ID
        const { data: orders } = await supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (orders && !unmounted) setOrderedServices(orders);
      }
      
      if (profile?.role === 'agent') {
        const { data } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'customer');
        if (data && !unmounted) setCustomerList(data);
        
        // Fetch Agent Blogs
        const { data: blogData } = await supabase.from('blogs').select('*').eq('author_id', user?.id).order('created_at', { ascending: false });
        if (blogData && !unmounted) setAgentBlogs(blogData);

        // Fetch Todos
        const { data: todoData } = await supabase.from('todos').select('*').eq('agent_id', user?.id).order('due_date', { ascending: true });
        if (todoData && !unmounted) setTodos(todoData);
      }
      
      // Always preload the personal Inbox
      const { data: messages } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        
      if (messages) {
        const uniqueIds = new Set();
        messages.forEach(msg => {
          if (msg.sender_id !== user.id) uniqueIds.add(msg.sender_id);
          if (msg.receiver_id !== user.id) uniqueIds.add(msg.receiver_id);
        });
        
        if (uniqueIds.size > 0) {
          const idsArray = Array.from(uniqueIds);
          const { data: usersData } = await supabase.from('profiles').select('id, full_name, role').in('id', idsArray);
          if (usersData && !unmounted) setInboxUsers(usersData);
        } else if (!unmounted) {
          setInboxUsers([]);
        }
      }
      
      if (!unmounted) setIsFetchingListing(false);
    };
    
    if (profile && user) prefetchAllData();
    
    return () => { unmounted = true; };
  }, [profile, user]);

  if (loading) return <div className="section-padding text-center" style={{ minHeight: '60vh' }}>Loading your dashboard...</div>;
  if (!user || !profile) return null;

  const isAgent = profile.role === 'agent';

  const menuItems = isAgent ? [
    { id: 'profile', label: 'Profile' },
    { id: 'todo', label: 'To-do' },
    { id: 'customers', label: 'Client Directory' },
    { id: 'post-blog', label: 'Post Blog' },
    { id: 'chat', label: 'Message Hub' }
  ] : [
    { id: 'profile', label: 'Profile' },
    { id: 'services', label: 'Services Ordered' },
    { id: 'agents', label: 'Available Agents' },
    { id: 'chat', label: 'Message Hub' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="glass-card" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Your Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '30px', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {profile.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{profile.full_name}</h3>
                <p style={{ color: 'var(--color-gray)', marginBottom: '8px', fontSize: '1.1rem' }}><strong>Email:</strong> {user.email}</p>
                <p style={{ color: 'var(--color-gray)', marginBottom: '20px', fontSize: '1.1rem' }}><strong>Account Type:</strong> <span style={{ textTransform: 'capitalize', color: 'var(--primary-orange)', fontWeight: 600 }}>{profile.role}</span></p>
                {isAgent && (
                   <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(34, 197, 94, 0.1)', color: '#166534', borderRadius: '20px', fontSize: '0.95rem', fontWeight: 'bold', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                     Active Verified Agent
                   </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'agents':
        return (
          <div className="glass-card" style={{ padding: '40px' }}>
             <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Available Experts</h2>
             <p style={{ color: 'var(--color-gray)', marginBottom: '30px' }}>Select an expert below to start a direct consultation regarding your purchased services.</p>
             {isFetchingListing ? <p>Loading experts...</p> : (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                 {agentList.map(agent => (
                   <div key={agent.id} style={{ padding: '24px', background: 'rgba(10,50,115,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '50px', height: '50px', background: 'var(--primary-blue)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          {agent.full_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{agent.full_name}</h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', fontWeight: 600 }}>Verified Expert</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/chat/${agent.id}`)} className="btn btn-outline" style={{ width: '100%', padding: '10px' }}>Start Conversation</button>
                   </div>
                 ))}
                 {agentList.length === 0 && <p style={{fontWeight: 600, color: 'var(--color-gray)'}}>No agents are currently available to display.</p>}
               </div>
             )}
          </div>
        );
      case 'customers':
        const filteredCustomers = customerList.filter(c => 
          c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="glass-card" style={{ padding: '40px' }}>
             <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Client Directory</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <input 
                  type="text" 
                  placeholder="Search clients rapidly by name or email address..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', background: 'transparent' }}
                />
             </div>
             {isFetchingListing ? <p>Loading clients...</p> : (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                 {filteredCustomers.map(customer => (
                   <div key={customer.id} style={{ padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '50px', height: '50px', background: '#f3f4f6', color: 'var(--color-black)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          {customer.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{customer.full_name}</h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{customer.email}</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/chat/${customer.id}`)} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>Message Client</button>
                   </div>
                 ))}
                 {filteredCustomers.length === 0 && <p style={{fontWeight: 600, color: 'var(--color-gray)'}}>No clients matched your search query.</p>}
               </div>
             )}
          </div>
        );
      case 'todo':
        const handleAddTodo = async (e) => {
          e.preventDefault();
          if (!todoInput.title) return;
          const { data, error } = await supabase.from('todos').insert([{ 
            agent_id: user.id, 
            title: todoInput.title, 
            due_date: todoInput.due_date || null,
            notes: todoInput.notes || ''
          }]).select();
          if (data) {
            setTodos([...todos, data[0]]);
            setTodoInput({ title: '', due_date: '', notes: '' });
          }
        };

        const toggleTodo = async (id, currentStatus) => {
          const { error } = await supabase.from('todos').update({ is_completed: !currentStatus }).eq('id', id);
          if (!error) {
            setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
          }
        };

        const deleteTodo = async (id) => {
          const { error } = await supabase.from('todos').delete().eq('id', id);
          if (!error) setTodos(todos.filter(t => t.id !== id));
        };

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
            <div className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Agent Task Center</h2>
              <p style={{ color: 'var(--color-gray)', marginBottom: '30px' }}>Organize your workflow and track specific customer requirements.</p>
              
              <form onSubmit={handleAddTodo} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', background: 'rgba(10,50,115,0.02)', padding: '24px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input 
                    type="text" 
                    placeholder="Task Title (e.g. Design Logo for Client X)" 
                    value={todoInput.title}
                    onChange={(e) => setTodoInput({...todoInput, title: e.target.value})}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                  />
                  <input 
                    type="date" 
                    value={todoInput.due_date}
                    onChange={(e) => setTodoInput({...todoInput, due_date: e.target.value})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                  />
                </div>
                <textarea 
                  placeholder="Additional notes or specific instructions..." 
                  value={todoInput.notes}
                  onChange={(e) => setTodoInput({...todoInput, notes: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', height: '80px', resize: 'none' }}
                />
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '10px 30px' }}>Add Task</button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', background: 'white', border: '2px dashed #eee', borderRadius: '16px' }}>
                    <ClipboardList size={40} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--color-gray)' }}>Your task list is empty. Stay productive by adding your first task!</p>
                  </div>
                ) : (
                  todos.map(todo => (
                    <div key={todo.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', transition: '0.2s', opacity: todo.is_completed ? 0.6 : 1 }}>
                       <input 
                         type="checkbox" 
                         checked={todo.is_completed} 
                         onChange={() => toggleTodo(todo.id, todo.is_completed)}
                         style={{ marginTop: '5px', width: '20px', height: '20px', cursor: 'pointer' }}
                       />
                       <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, textDecoration: todo.is_completed ? 'line-through' : 'none', color: todo.is_completed ? 'var(--color-gray)' : 'var(--color-black)' }}>{todo.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', margin: '4px 0 8px' }}>Due: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'No date set'}</p>
                          {todo.notes && <p style={{ fontSize: '0.9rem', color: '#64748b', background: '#f8fafc', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #cbd5e1' }}>{todo.notes}</p>}
                       </div>
                       <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {/* Mini Calendar */}
               <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Task Calendar</h3>
                  <div style={{ textAlign: 'center' }}>
                     <div style={{ fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '10px', fontSize: '1.1rem' }}>
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray)', marginBottom: '8px' }}>
                        {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                          const day = i + 1;
                          const hasTask = todos.some(t => t.due_date && new Date(t.due_date).getDate() === day && new Date(t.due_date).getMonth() === new Date().getMonth());
                          return (
                            <div key={i} style={{ 
                              padding: '8px 0', 
                              background: day === new Date().getDate() ? 'var(--primary-orange)' : 'white', 
                              color: day === new Date().getDate() ? 'white' : 'var(--color-black)', 
                              borderRadius: '6px', 
                              fontSize: '0.85rem',
                              border: hasTask ? '1px solid var(--primary-blue)' : '1px solid transparent',
                              fontWeight: day === new Date().getDate() ? 800 : 400
                            }}>
                              {day}
                            </div>
                          );
                        })}
                     </div>
                  </div>
               </div>

               {/* Productivity Metrics */}
               <div className="glass-card" style={{ padding: '24px', background: 'var(--primary-blue)', color: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'white' }}>Productivity Index</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                     <span>Tasks Completed</span>
                     <span style={{ fontWeight: 800 }}>{todos.filter(t => t.is_completed).length} / {todos.length}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                     <div style={{ width: `${todos.length > 0 ? (todos.filter(t => t.is_completed).length / todos.length) * 100 : 0}%`, height: '100%', background: 'white' }}></div>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'post-blog':
        return (
          <div className="glass-card" style={{ padding: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                   <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Blog Content Manager</h2>
                   <p style={{ color: 'var(--color-gray)', margin: 0 }}>Create, edit, and manage SEO-optimized articles directly on the platform.</p>
                </div>
                <button onClick={() => navigate('/blog/edit/new')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                   <PenTool size={18} /> Create New Post
                </button>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isFetchingListing ? <p>Loading articles...</p> : agentBlogs.length === 0 ? (
                  <div style={{ padding: '40px', background: 'rgba(10,50,115,0.02)', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', color: 'var(--color-gray)' }}>
                     You haven't published any articles yet. Click "Create New Post" to start writing!
                  </div>
                ) : (
                  agentBlogs.map(blog => (
                    <div key={blog.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                       {blog.image_url ? 
                         <img src={blog.image_url} alt="Cover" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} /> :
                         <div style={{ width: '120px', height: '80px', background: 'var(--bg-light-blue)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon color="var(--color-gray)" /></div>
                       }
                       <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{blog.title || 'Untitled Post'}</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--color-gray)', fontSize: '0.85rem' }}>
                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: blog.status === 'published' ? '#22c55e' : 'orange' }}></div> {blog.status || 'draft'}</span>
                             <span>• Views: {blog.views || 0}</span>
                             <span>• {new Date(blog.created_at).toLocaleDateString()}</span>
                          </div>
                          {blog.meta_description && <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginTop: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '400px' }}>{blog.meta_description}</p>}
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                          <button onClick={() => navigate(`/blog/edit/${blog.id}`)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', width: '100%' }}>Edit Post</button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        );
      case 'services':
        return (
          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <div>
                 <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Services Ordered</h2>
                 <p style={{ color: 'var(--color-gray)' }}>Track the status of your purchased packages and active projects.</p>
               </div>
               <button onClick={() => navigate('/services')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} /> Purchase More Services
               </button>
            </div>
            
            {isFetchingListing ? <p>Loading your orders...</p> : orderedServices.length === 0 ? (
              <div style={{ padding: '40px', background: 'rgba(10,50,115,0.02)', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', marginTop: '30px' }}>
                <ShoppingBag size={48} color="var(--primary-blue)" style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p style={{ fontWeight: 600, color: 'var(--color-gray)', fontSize: '1.1rem', marginBottom: '16px' }}>You have no active orders yet.</p>
                <button onClick={() => navigate('/services')} className="btn btn-secondary">Browse BeconHive Services</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '20px' }}>
                {orderedServices.map((order) => (
                   <div key={order.id} className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                         <span style={{ fontSize: '0.8rem', fontWeight: 600, background: 'var(--bg-light-blue)', color: 'var(--primary-blue)', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
                            {order.package_name || 'Standard'} Tier
                         </span>
                         <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{order.service_id?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'BeconHive Elite Service'}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                         ${order.amount_usd} 
                         {order.amount_ngn && <span style={{ fontSize: '0.9rem', color: 'var(--color-gray)', fontWeight: 600 }}>(₦{(Number(order.amount_ngn) / 100).toLocaleString()})</span>}
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                         <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', margin: 0 }}><strong>Ref:</strong> {order.reference}</p>
                         <p style={{ fontSize: '0.9rem', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <strong>Status:</strong> <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }}></div> Approved & Active</span>
                         </p>
                      </div>
                      <button onClick={() => setActiveTab('agents')} className="btn btn-outline" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>Discuss with Agent</button>
                   </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'chat':
        return (
          <div className="glass-card" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Message Hub</h2>
            <p style={{ color: 'var(--color-gray)', marginBottom: '30px' }}>Review active conversations and respond directly to messages securely.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isFetchingListing ? <p>Loading messages...</p> : inboxUsers.length === 0 ? (
                <div style={{ padding: '40px', background: 'rgba(10,50,115,0.02)', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', color: 'var(--color-gray)' }}>
                   No active conversations yet. Once a message is sent or received, it will dynamically appear here.
                </div>
              ) : (
                inboxUsers.map(u => (
                  <div key={u.id} className="glass-card card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'white' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div style={{ width: '50px', height: '50px', background: 'var(--primary-orange)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                         {u.full_name?.charAt(0)}
                       </div>
                       <div>
                         <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{u.full_name}</h3>
                         <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)', textTransform: 'capitalize' }}>{u.role}</span>
                       </div>
                     </div>
                     <button onClick={() => navigate(`/chat/${u.id}`)} className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', gap: '8px' }}>
                       <MessageSquare size={16} /> Open Chat
                     </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light-blue)', flexDirection: 'row' }} className="dashboard-layout">
      {/* Side Panel Sidebar (Only on Desktop) */}
      <aside className="dashboard-sidebar" style={{ width: '280px', background: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '40px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--primary-blue)', color: 'white' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{isAgent ? 'Agent Portal' : 'Client Portal'}</h2>
        </div>
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
           {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px', 
                borderRadius: '12px', cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
                background: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--color-gray)',
                border: 'none', textAlign: 'left', fontWeight: 600, fontSize: '1.05rem',
                boxShadow: activeTab === item.id ? '0 4px 12px rgba(10,50,115,0.2)' : 'none'
              }}
            >
              {item.label}
            </button>
          ))}
          <button onClick={() => signOut()} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
             <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Mobile-only Tab Bar (Fiverr Style) */}
      <div className="mobile-dashboard-tabs" style={{ display: 'none', background: 'white', borderBottom: '1px solid var(--border-color)', overflowX: 'auto', padding: '12px 10px', whiteSpace: 'nowrap', gap: '10px' }}>
         {menuItems.map(item => (
            <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               style={{
                  padding: '10px 20px', borderRadius: '25px', border: 'none', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer',
                  background: activeTab === item.id ? 'var(--primary-blue)' : 'rgba(10,50,115,0.04)',
                  color: activeTab === item.id ? 'white' : 'var(--primary-blue)',
                  transition: '0.2s'
               }}
            >
               {item.label}
            </button>
         ))}
      </div>

      {/* Main Content Viewport */}
      <main className="dashboard-main" style={{ flex: 1, padding: '50px 40px', overflowX: 'hidden' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
           {renderContent()}
        </div>
      </main>

      <style>{`
        @media (max-width: 991px) {
          .dashboard-layout { flex-direction: column !important; }
          .dashboard-sidebar { display: none !important; }
          .mobile-dashboard-tabs { display: flex !important; }
          .dashboard-main { padding: 20px 16px !important; }
          
          /* Specific Tab Grid Fixes for Mobile */
          .dashboard-main .glass-card { padding: 24px !important; }
          .dashboard-main > div > div[style*="grid-template-columns: 1fr 350px"] { 
            grid-template-columns: 1fr !important;
          }
          .dashboard-main h2 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
