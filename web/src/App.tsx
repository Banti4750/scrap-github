import { Route, Routes, Navigate } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import ComparePage from './pages/ComparePage'

export default function App() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}
