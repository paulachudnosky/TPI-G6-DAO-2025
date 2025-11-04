// 1. IMPORTS - Trae las dependencias necesarias
import React from 'react';                              // Biblioteca principal de React
import MedicoForm from '../components/MedicoForm';      // Componente con el formulario
import { createMedico } from '../services/medicoService'; // Función para enviar datos al backend
import { useNavigate } from 'react-router-dom';         // Hook para navegación entre rutas
import '../styles/medico.css';                          // Estilos CSS para médico

// 2. COMPONENTE - Define la página de creación
const MedicoCreate = () => {

    // 3. HOOK DE NAVEGACIÓN - Para redirigir después de crear
    const navigate = useNavigate();

    // 4. FUNCIÓN MANEJADORA - Se ejecuta cuando el usuario envía el formulario
    const onSubmit = async (data) => {
        // data contiene: { nombre, apellido, matricula, email }

        try {
            await createMedico(data);    // Envía los datos al backend (espera respuesta)
            alert('✅ Médico creado exitosamente');
            navigate('/medico');         // Redirige a la lista de médicos
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al crear el médico. Por favor, intente de nuevo.';
            alert(`❌ ${errorMessage}`);
        }
    };

    // 5. RENDERIZADO - Lo que se muestra en pantalla
    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>➕ Nuevo Médico</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/medico')}>
                    ← Volver a la lista
                </button>
            </div>
            {/* Renderiza el formulario y le pasa la función onSubmit */}
            <MedicoForm onSubmit={onSubmit} />
        </div>
    );
};

// 6. EXPORTACIÓN - Permite usar este componente en otros archivos
export default MedicoCreate;