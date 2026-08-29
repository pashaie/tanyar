import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ActiveWorkoutProvider } from './context/ActiveWorkoutContext'
import { ThemeProvider } from './context/ThemeContext'
import { ActiveWorkoutPage } from './pages/ActiveWorkoutPage'
import { DashboardPage } from './pages/DashboardPage'
import { HabitsPage } from './pages/HabitsPage'
import { HistoryPage } from './pages/HistoryPage'
import { PlanPage } from './pages/PlanPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <ThemeProvider>
      <ActiveWorkoutProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="habits" element={<HabitsPage />} />
              <Route path="plan" element={<PlanPage />} />
              <Route path="workout" element={<ActiveWorkoutPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ActiveWorkoutProvider>
    </ThemeProvider>
  )
}

export default App
