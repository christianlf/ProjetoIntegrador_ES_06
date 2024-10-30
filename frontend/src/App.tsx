
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import './index.css';
import Tela1 from './tela1';
import Jogo from './jogo'; // Importando o componente do jogo
import CreateEvent from './eventos/CreateEvent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tela1" element={<Tela1 />} />
        <Route path="/criarevento" element={<CreateEvent />} />
        <Route path="/jogo/:gameName" element={<Jogo />} /> {/* Rota para jogos */}
      </Routes>
    </Router>
  );
};

export default App;
