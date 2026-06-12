import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { useLocation } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const ServicesList = lazy(() => import('./pages/ServicesList'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const AgentSignup = lazy(() => import('./pages/AgentSignup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChatRoom = lazy(() => import('./pages/ChatRoom'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AgentBlogEditor = lazy(() => import('./pages/AgentBlogEditor'));
const AIPlanner = lazy(() => import('./pages/AIPlanner'));

// Utility component to always start at the top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const pageLoader = (
    <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', padding: '120px 20px' }}>
      <div style={{ color: 'var(--primary-blue)', fontWeight: 700, textAlign: 'center' }}>
        Loading page...
      </div>
    </div>
  );

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, marginTop: '80px' }}>
          <Suspense fallback={pageLoader}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<ServicesList />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/agentworkerhive" element={<AgentSignup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blog/edit/:id" element={<AgentBlogEditor />} />
              <Route path="/chat/:agentId" element={<ChatRoom />} />
              <Route path="/ai-planner" element={<AIPlanner />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
