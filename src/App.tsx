import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import {Login} from './components/Login/Login'
import "./index.css"
import { Dashboard } from './pages/Dashboard';
import { Candidate } from './pages/Candidate'
import { AgentsSupplier } from './pages/AgentsSupplier';
import { ManpowerSupply } from './pages/ManPowerSupply';
import { OverseasRecruitment } from './pages/OverseasRecruitment';
import { ClientEnquiry } from './pages/ClientEnquiry';
import { Reports } from './pages/Reports';
import { CandidateView } from './pages/Candidate/CandidateView';
import { LoginLayout } from './layout/LoginLayout';
//import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/Context/AuthContext';
import { ClientEnquiryView } from './pages/ClientEnquiry/ClientEnquiryView';
import { OverSeasRecruitmentView } from './pages/OverSeasRecruitment/OverSeasRecruitmentView';
import { AgentSupplyView } from './pages/AgentsSupplier/AgentSupplierView';
import { ManPowerSupplyView } from './pages/ManPowerSupply/ManPowerSupplyView';
import { ToastContainer } from 'react-toastify';
import { Categories } from './pages/Categories';
import { Settings } from './pages/Settings';

function App() {

  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/" element={<ProtectedRoute><LoginLayout /></ProtectedRoute>}> */}
          <Route path="/" element={<LoginLayout />}>
          {/* <Route path="/" element={<LoginLayout />}> */}
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Candidate" element={<Candidate />} />
            <Route path="/AgentsSupplier" element={<AgentsSupplier />} />
            <Route path="/ManpowerSupply" element={<ManpowerSupply />} />
            <Route path="/OverseasRecruitment" element={<OverseasRecruitment />} />
            <Route path="/ClientEnquiry" element={<ClientEnquiry />} />
            <Route path="/Categories" element={<Categories/>} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Candidate/:id" element={<CandidateView />} />
            <Route path="/ClientEnquiry/:id" element={<ClientEnquiryView />} />
            <Route path="/OverSeasRecruitment/:id" element={<OverSeasRecruitmentView />} />
            <Route path="/ManpowerSupply/:id" element={<ManPowerSupplyView />} />
            <Route path="/AgentsSupplier/:id" element={<AgentSupplyView />} />
            <Route path="/Settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
