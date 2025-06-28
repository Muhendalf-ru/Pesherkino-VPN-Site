import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import NotFound from './NotFound';
import Status from './Status';
import './App.css';
import WikiPage from './WikiPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/wiki" element={<WikiPage />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
