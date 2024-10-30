// models/Evento.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IEvento extends Document {
    titulo: string;
    descricao: string;
    valor_cota: number;
    data_hora_inicio: Date;
    data_hora_fim: Date;
    data_evento: Date;
}

const eventoSchema: Schema = new Schema({
    titulo: { type: String, required: true, maxlength: 50 },
    descricao: { type: String, required: true, maxlength: 150 },
    valor_cota: { type: Number, required: true, min: 1 },
    data_hora_inicio: { type: Date, required: true },
    data_hora_fim: { type: Date, required: true },
    data_evento: { type: Date, required: true },
});

const Evento = mongoose.model<IEvento>('Evento', eventoSchema);

export default Evento;
