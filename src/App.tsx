import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import NotFound from './NotFound';
import Status from './Status';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
