import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CareerTestIntro from "./pages/CareerTestIntro";
import CareerTestQuestions from "./pages/CareerTestQuestions";
import CareerTestResults from "./pages/CareerTestResults";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import Roadmap from "./pages/Roadmap";
import Colleges from "./pages/Colleges";
import Scholarships from "./pages/Scholarships";
import MockInterview from "./pages/MockInterview";
import AIChat from "./pages/AIChat";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/career-test" element={<CareerTestIntro />} />
              <Route path="/career-test/questions" element={<CareerTestQuestions />} />
              <Route path="/career-test/results" element={<CareerTestResults />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:slug" element={<CareerDetail />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
