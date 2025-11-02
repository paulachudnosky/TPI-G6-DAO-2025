import React from 'react';

const MedicamentoView = ({ medicamento }) => {
    if (!medicamento) {
        return <div>No medicamento selected.</div>;
    }

    return (
        <div>
            <h2>Medicamento Details</h2>
            <p><strong>ID:</strong> {medicamento.id}</p>
            <p><strong>Name:</strong> {medicamento.name}</p>
            <p><strong>Description:</strong> {medicamento.description}</p>
            <p><strong>Dosage:</strong> {medicamento.dosage}</p>
            <p><strong>Side Effects:</strong> {medicamento.sideEffects}</p>
            <p><strong>Type:</strong> {medicamento.type}</p>
        </div>
    );
};

export default MedicamentoView;