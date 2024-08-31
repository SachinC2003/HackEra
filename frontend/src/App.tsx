import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import Layout from './components/general/Layout';
import Settings from './components/pages/Settings';
import Analytics from './components/pages/Analytics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/general/Loader';
import ProtectedRoute from './components/general/ProtectedRoute';
import TaskPublicView from './components/pages/TaskPublicView';
import Chat from './components/pages/Chat'; // New import
import VideoCall from './components/pages/Videocall';

function App() {
  return (
    <>
      <BrowserRouter>
        <Loader />
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/:boardId" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings/>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <Analytics/>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tasks/:taskId" element={<TaskPublicView />} />
          {/* New chat route */}
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout>
               <Chat />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:boardId" element={
            <ProtectedRoute>
              <Layout>
                <Chat />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/videocall" element={
            <ProtectedRoute>
              <Layout>
                <VideoCall />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/videocall/:callId" element={
            <ProtectedRoute>
              <Layout>
                <VideoCall />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App