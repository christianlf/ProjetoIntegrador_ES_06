// src/Jogo.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const Jogo: React.FC = () => {
    const { gameName } = useParams<{ gameName: string }>();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <h1 className="text-2xl font-bold">Você está jogando: {gameName}</h1>
            {/* Aqui você pode adicionar a lógica do jogo */}
        </div>
    );
};

export default Jogo;
