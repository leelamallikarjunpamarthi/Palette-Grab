
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Palettes from './pages/Palettes';
import PaletteDetail from './pages/PaletteDetail';
import History from './pages/History';
import ColorDetail from './pages/ColorDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary text-primary font-sans">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/palettes" element={<Palettes />} />
            <Route path="/palettes/:id" element={<PaletteDetail />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Detail pages or Auth might be outside layout if needed, but for now simplify */}
          <Route path="/color/:id" element={<ColorDetail />} /> {/* Maybe modal-like? */}
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
