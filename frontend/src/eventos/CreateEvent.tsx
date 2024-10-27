import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent: React.FC<{ onEventCreated: (evento: { id: number; name: string }) => void }> = ({ onEventCreated }) => {
    const [eventName, setEventName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const novoEvento = { id: Date.now(), name: eventName }; // Cria um novo evento
        onEventCreated(novoEvento); // Chama a função para atualizar a lista de eventos
        navigate('/'); // Redireciona para a tela principal
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl mb-4">Criar Evento</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Nome do Evento"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="p-2 border rounded mb-4"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                    Criar Evento
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
