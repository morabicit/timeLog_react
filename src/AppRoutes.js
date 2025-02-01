import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SignupForm from "./components/SignupForm";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<SignupForm />} />
        </Routes>
    );
}