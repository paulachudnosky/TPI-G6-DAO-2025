// 1. IMPORTS - Trae las dependencias necesarias
import React from 'react';                                          // Biblioteca principal de React
import EspecialidadForm from '../components/EspecialidadForm';      // Componente con el formulario
import { createEspecialidad } from '../services/especialidadService'; // Función para enviar datos al backend
import { useNavigate } from 'react-router-dom';                     // Hook para navegación entre rutas
import '../styles/especialidad.css';                                // Estilos CSS para especialidad

// 2. COMPONENTE - Define la página de creación
const EspecialidadCreate = () => {

    // 3. HOOK DE NAVEGACIÓN - Para redirigir después de crear
    const navigate = useNavigate();

    // 4. FUNCIÓN MANEJADORA - Se ejecuta cuando el usuario envía el formulario
    const onSubmit = async (data) => {
        // data contiene: { nombre, descripcion }

        try {
            await createEspecialidad(data);    // Envía los datos al backend (espera respuesta)
            alert('✅ Especialidad creada exitosamente');
            navigate('/especialidad');         // Redirige a la lista de especialidades
        } catch (error) {
            alert('❌ Error al crear la especialidad');
            console.error(error);
        }
    };

    // 5. RENDERIZADO - Lo que se muestra en pantalla
    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>➕ Nueva Especialidad</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/especialidad')}>
                    ← Volver a la lista
                </button>
            </div>
            {/* Renderiza el formulario y le pasa la función onSubmit */}
            <EspecialidadForm onSubmit={onSubmit} />
        </div>
    );
};

// 6. EXPORTACIÓN - Permite usar este componente en otros archivos
export default EspecialidadCreate;