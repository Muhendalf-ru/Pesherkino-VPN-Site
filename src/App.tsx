import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Status = lazy(() => import('./pages/StatusPage'));
import './styles/App.css';
const WikiPage = lazy(() => import('./pages/WikiPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
import CosmicSpinner from './components/ui/CosmicSpinner';
import NotFound from './pages/NotFound';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/wiki/*"
          element={
            <Suspense fallback={<CosmicSpinner />}>
              <WikiPage />
            </Suspense>
          }
        />
        <Route
          path="/status"
          element={
            <Suspense fallback={<CosmicSpinner />}>
              <Status />
            </Suspense>
          }
        />
        <Route
          path="/achievements"
          element={
            <Suspense fallback={<CosmicSpinner />}>
              <AchievementsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
