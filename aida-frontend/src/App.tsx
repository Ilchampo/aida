import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

import GuestRoute from '@components/Auth/GuestRoute';
import ProtectedRoute from '@components/Auth/ProtectedRoute';
import HomePage from '@pages/HomePage';
import InterviewPage from '@pages/InterviewPage';
import JobPage from '@pages/JobPage';
import LeaderboardPage from '@pages/LeaderboardPage';
import LoginPage from '@pages/LoginPage';
import ProgressPage from '@pages/ProgressPage';
import RoomPage from '@pages/RoomPage';

const AppRoutes: React.FC = () => {
    const { bootstrap } = useAuth();

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/sign-in" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs/:jobId" element={<JobPage />} />
                <Route path="/interview/:jobId" element={<RoomPage />} />
                <Route path="/results/:interviewId" element={<InterviewPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;
