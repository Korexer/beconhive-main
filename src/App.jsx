import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ServicesList from './pages/ServicesList';
import ServiceDetail from './pages/ServiceDetail';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AgentSignup from './pages/AgentSignup';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import Blog from './pages/Blog';
import AgentBlogEditor from './pages/AgentBlogEditor';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, marginTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/agentworkerhive" element={<AgentSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog/edit/:id" element={<AgentBlogEditor />} />
            <Route path="/chat/:agentId" element={<ChatRoom />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
