import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateEvent from './eventos/CreateEvent';
import EventList from './eventos/EventList';

const Tela1: React.FC = () => {
    const [eventos, setEventos] = useState<{ id: number; name: string }[]>([]);
    const [games, setGames] = useState(['Game 1', 'Game 2', 'Game 3', 'Game 4']);
    const navigate = useNavigate();

    const handleEventCreated = (novoEvento: { id: number; name: string }) => {
        setEventos(prev => [...prev, novoEvento]);
        setGames(prev => [...prev, novoEvento.name]); // Adiciona o evento como um novo jogo
    };

    const handlePlayClick = (gameName: string) => {
        navigate(`/jogo/${gameName}`);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <header className="w-full flex justify-between items-center bg-blue-600 p-4 rounded-lg shadow-md">
                <h1 className="text-white text-2xl font-bold">PUC</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Pesquisar jogos..."
                        className="p-2 rounded-l-md border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-700 transition">
                        🔍
                    </button>
                </div>
            </header>

            {/* Formulário oculto para criação de eventos */}
            <CreateEvent onEventCreated={handleEventCreated} />

            {/* Listagem de Eventos como jogos */}
            <EventList eventos={eventos} />

            <div className="mt-4 w-full flex flex-col items-center">
                {games.map(game => (
                    <button key={game} onClick={() => handlePlayClick(game)} className="mt-2 bg-green-500 text-white p-3 rounded-md hover:bg-green-700 transition">
                        {game}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tela1;
