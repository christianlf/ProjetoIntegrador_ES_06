import React from 'react';

interface Event {
    id: number;
    name: string;
}

interface EventListProps {
    eventos: Event[];
}

const EventList: React.FC<EventListProps> = ({ eventos }) => {
    return (
        <div className="mt-4 w-full">
            {eventos.length === 0 ? (
                <p>Nenhum evento encontrado.</p>
            ) : (
                eventos.map(evento => (
                    <div key={evento.id} className="p-2 border-b">
                        {evento.name}
                    </div>
                ))
            )}
        </div>
    );
};

export default EventList;
