import './styles/index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ResumeProvider } from './context/ResumeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { UniversalSaveProvider } from './components/UniversalSaveProvider.jsx';

// Import universal save service to enable database saves for all templates
import './services/universalSaveService.js';

function App() {
  return (
    <>
    <AuthProvider>
    <ResumeProvider>
      <UniversalSaveProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UniversalSaveProvider>
      </ResumeProvider>
      </AuthProvider>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;