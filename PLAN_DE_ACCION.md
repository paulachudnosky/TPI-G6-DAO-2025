# 📋 PLAN DE ACCIÓN - Estandarización de Entidades

## 🎯 Objetivo
Este documento sirve como guía para estandarizar **todas las entidades restantes** del proyecto siguiendo el patrón establecido en **Médico** y **Especialidad**. 

### ✅ Entidades Completadas
- ✅ **Médico** - 100% funcional con relación a Especialidad
- ✅ **Especialidad** - 100% funcional con validación de eliminación

### 🔄 Entidades Pendientes
- ⏳ Paciente
- ⏳ Historial Clínico
- ⏳ Tipo Consulta
- ⏳ Tipo Medicamento
- ⏳ Medicamento
- ⏳ Horario Atención
- ⏳ Turno

---

## 📐 Estructura Base del Frontend

Cada entidad debe seguir esta estructura de carpetas:

```
src/features/[nombre-entidad]/
├── components/
│   └── [NombreEntidad]Form.jsx          # Formulario reutilizable
├── pages/
│   ├── [NombreEntidad]Create.jsx        # Página de creación
│   ├── [NombreEntidad]Edit.jsx          # Página de edición
│   ├── [NombreEntidad]List.jsx          # Página de listado
│   └── [NombreEntidad]View.jsx          # Página de detalle
├── services/
│   └── [nombreEntidad]Service.js        # Cliente API
└── styles/
    └── [nombre-entidad].css              # Estilos específicos
```

---

## 🎨 1. SERVICIOS (API Client)

### Archivo: `services/[nombreEntidad]Service.js`

**Patrón a seguir:**

```javascript
import apiClient from '../../../services/apiClient';

const BASE_URL = '/[entidades]'; // Plural del nombre de la entidad

// GET ALL
export const get[NombreEntidades] = async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

// GET ONE
export const get[NombreEntidad] = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

// CREATE
export const create[NombreEntidad] = async (data) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
};

// UPDATE
export const update[NombreEntidad] = async (id, data) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

// DELETE
export const delete[NombreEntidad] = async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
};
```

**⚠️ IMPORTANTE:**
- Usar **exports nombrados** (`export const`) NO `export default`
- Mantener nomenclatura consistente
- La URL base debe coincidir con el endpoint del backend

**Ejemplo real (Médico):**

```javascript
export const getMedicos = async () => { /* ... */ };
export const getMedico = async (id) => { /* ... */ };
export const createMedico = async (data) => { /* ... */ };
export const updateMedico = async (id, data) => { /* ... */ };
export const deleteMedico = async (id) => { /* ... */ };
```

---

## 📝 2. FORMULARIO (Form Component)

### Archivo: `components/[NombreEntidad]Form.jsx`

**Patrón a seguir:**

```jsx
import React, { useState, useEffect } from 'react';
import '../styles/[nombre-entidad].css';

const [NombreEntidad]Form = ({ initialData, onSubmit }) => {
    // 1. Estado unificado con todos los campos
    const [formData, setFormData] = useState({
        campo1: '',
        campo2: '',
        campo3: '',
        // ... todos los campos del formulario
    });

    // 2. Cargar datos iniciales (para modo edición)
    useEffect(() => {
        if (initialData) {
            setFormData({
                campo1: initialData.campo1 || '',
                campo2: initialData.campo2 || '',
                // ... mapear todos los campos
            });
        }
    }, [initialData]);

    // 3. Manejador de cambios unificado
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 4. Manejador de submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);  // Pasar datos al componente padre
    };

    // 5. Renderizado del formulario
    return (
        <form className="entity-form" onSubmit={handleSubmit}>
            <div className="entity-form-group">
                <label htmlFor="campo1" className="entity-form-label required">
                    Nombre del Campo
                </label>
                <input
                    type="text"
                    id="campo1"
                    name="campo1"
                    className="entity-form-input"
                    value={formData.campo1}
                    onChange={handleChange}
                    required
                    placeholder="Descripción del campo"
                />
            </div>

            {/* Repetir para cada campo */}

            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    💾 Guardar [NombreEntidad]
                </button>
            </div>
        </form>
    );
};

export default [NombreEntidad]Form;
```

**📋 Tipos de campos comunes:**

```jsx
{/* INPUT TEXT */}
<input
    type="text"
    id="nombre"
    name="nombre"
    className="entity-form-input"
    value={formData.nombre}
    onChange={handleChange}
    required
    placeholder="Ingrese el nombre"
/>

{/* INPUT EMAIL */}
<input
    type="email"
    id="email"
    name="email"
    className="entity-form-input"
    value={formData.email}
    onChange={handleChange}
    placeholder="ejemplo@correo.com"
/>

{/* INPUT NUMBER */}
<input
    type="number"
    id="cantidad"
    name="cantidad"
    className="entity-form-input"
    value={formData.cantidad}
    onChange={handleChange}
    min="0"
/>

{/* INPUT DATE */}
<input
    type="date"
    id="fecha"
    name="fecha"
    className="entity-form-input"
    value={formData.fecha}
    onChange={handleChange}
/>

{/* TEXTAREA */}
<textarea
    id="descripcion"
    name="descripcion"
    className="entity-form-input"
    value={formData.descripcion}
    onChange={handleChange}
    rows="4"
    placeholder="Ingrese la descripción"
/>

{/* SELECT (relación con otra entidad) */}
<select
    id="id_categoria"
    name="id_categoria"
    className="entity-form-input"
    value={formData.id_categoria}
    onChange={handleChange}
    required
>
    <option value="">Seleccione una categoría</option>
    {categorias.map(cat => (
        <option key={cat.id} value={cat.id}>
            {cat.nombre}
        </option>
    ))}
</select>
```

**🔗 Para selects con datos externos:**

```jsx
const [NombreEntidad]Form = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({ /* ... */ });
    const [relacionados, setRelacionados] = useState([]);

    // Cargar datos de la entidad relacionada
    useEffect(() => {
        const loadRelacionados = async () => {
            try {
                const data = await get[EntidadRelacionada]();
                setRelacionados(data);
            } catch (error) {
                console.error('Error al cargar relacionados:', error);
            }
        };
        loadRelacionados();
    }, []);

    // ... resto del código
};
```

---

## 📄 3. PÁGINA DE LISTADO (List Page)

### Archivo: `pages/[NombreEntidad]List.jsx`

**Patrón a seguir:**

```jsx
import React, { useEffect, useState } from 'react';
import { get[NombreEntidades], delete[NombreEntidad] } from '../services/[nombreEntidad]Service';
import { useNavigate } from 'react-router-dom';
import '../styles/[nombre-entidad].css';

const [NombreEntidad]List = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para cargar datos
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await get[NombreEntidades]();
            setItems(data);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar al montar el componente
    useEffect(() => {
        load();
    }, []);

    // Manejador de eliminación con validación
    const onDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este registro?')) return;

        try {
            await delete[NombreEntidad](id);
            alert('✅ Registro eliminado exitosamente');
            await load();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error desconocido';
            
            // Validación de restricción de clave foránea
            if (err.response?.status === 409 || errorMessage.includes('asignados') || errorMessage.includes('asociados')) {
                alert('⚠️ No se puede eliminar este registro porque tiene datos asociados.\n\nPrimero debe eliminar o reasignar los registros relacionados.');
            } else {
                alert('❌ Error al eliminar: ' + errorMessage);
            }
            console.error(err);
        }
    };

    // Estados de carga y error
    if (loading) {
        return <div className="entity-loading">Cargando datos...</div>;
    }

    if (error) {
        return <div className="entity-alert entity-alert-danger">{error}</div>;
    }

    // Renderizado de la tabla
    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Gestión de [NombreEntidades]</h2>
                <button 
                    className="btn-entity-primary" 
                    onClick={() => navigate('/[ruta]/nuevo')}
                >
                    ➕ Nuevo [NombreEntidad]
                </button>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Campo 1</th>
                            <th>Campo 2</th>
                            {/* Agregar todas las columnas necesarias */}
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="X" className="empty-state">
                                    No hay registros disponibles
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.campo1}</td>
                                    <td>{item.campo2}</td>
                                    {/* Mostrar todos los campos */}
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => navigate(`/[ruta]/${item.id}`)}
                                            title="Ver detalle"
                                        >
                                            👁️ Ver
                                        </button>
                                        <button
                                            className="btn-entity-secondary btn-entity-sm"
                                            onClick={() => navigate(`/[ruta]/${item.id}/editar`)}
                                            title="Editar"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn-entity-danger btn-entity-sm"
                                            onClick={() => onDelete(item.id)}
                                            title="Eliminar"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default [NombreEntidad]List;
```

**💡 Tips para el listado:**
- Mostrar valores legibles (ej: `especialidad_nombre` en lugar de `id_especialidad`)
- Para valores opcionales usar: `{item.campo || <span className="entity-text-muted">Sin dato</span>}`
- Para badges de estado: `<span className="entity-badge entity-badge-success">{item.estado}</span>`

---

## ➕ 4. PÁGINA DE CREACIÓN (Create Page)

### Archivo: `pages/[NombreEntidad]Create.jsx`

```jsx
import React from 'react';
import [NombreEntidad]Form from '../components/[NombreEntidad]Form';
import { create[NombreEntidad] } from '../services/[nombreEntidad]Service';
import { useNavigate } from 'react-router-dom';
import '../styles/[nombre-entidad].css';

const [NombreEntidad]Create = () => {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await create[NombreEntidad](data);
            alert('✅ [NombreEntidad] creado exitosamente');
            navigate('/[ruta]');
        } catch (error) {
            alert('❌ Error al crear el registro');
            console.error(error);
        }
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>➕ Nuevo [NombreEntidad]</h2>
                <button 
                    className="btn-entity-secondary" 
                    onClick={() => navigate('/[ruta]')}
                >
                    ← Volver a la lista
                </button>
            </div>
            <[NombreEntidad]Form onSubmit={onSubmit} />
        </div>
    );
};

export default [NombreEntidad]Create;
```

---

## ✏️ 5. PÁGINA DE EDICIÓN (Edit Page)

### Archivo: `pages/[NombreEntidad]Edit.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import [NombreEntidad]Form from '../components/[NombreEntidad]Form';
import { get[NombreEntidad], update[NombreEntidad] } from '../services/[nombreEntidad]Service';
import '../styles/[nombre-entidad].css';

const [NombreEntidad]Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await get[NombreEntidad](id);
                setInitialData(data);
            } catch (error) {
                alert('❌ Error al cargar el registro');
                navigate('/[ruta]');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const onSubmit = async (data) => {
        try {
            await update[NombreEntidad](id, data);
            alert('✅ [NombreEntidad] actualizado exitosamente');
            navigate('/[ruta]');
        } catch (error) {
            alert('❌ Error al actualizar el registro');
            console.error(error);
        }
    };

    if (loading) {
        return <div className="entity-loading">Cargando datos...</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>✏️ Editar [NombreEntidad]</h2>
                <button 
                    className="btn-entity-secondary" 
                    onClick={() => navigate('/[ruta]')}
                >
                    ← Volver a la lista
                </button>
            </div>
            <[NombreEntidad]Form 
                initialData={initialData} 
                onSubmit={onSubmit} 
            />
        </div>
    );
};

export default [NombreEntidad]Edit;
```

---

## 👁️ 6. PÁGINA DE DETALLE (View Page)

### Archivo: `pages/[NombreEntidad]View.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get[NombreEntidad] } from '../services/[nombreEntidad]Service';
import '../styles/[nombre-entidad].css';

const [NombreEntidad]View = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await get[NombreEntidad](id);
                setItem(data);
            } catch (error) {
                alert('❌ Error al cargar el registro');
                navigate('/[ruta]');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    if (loading) {
        return <div className="entity-loading">Cargando datos...</div>;
    }

    if (!item) {
        return <div className="entity-alert entity-alert-danger">Registro no encontrado</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>👁️ Detalle de [NombreEntidad]</h2>
                <div>
                    <button 
                        className="btn-entity-primary" 
                        onClick={() => navigate(`/[ruta]/${id}/editar`)}
                    >
                        ✏️ Editar
                    </button>
                    <button 
                        className="btn-entity-secondary" 
                        onClick={() => navigate('/[ruta]')}
                    >
                        ← Volver a la lista
                    </button>
                </div>
            </div>

            <div className="entity-detail">
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Campo 1:</label>
                    <p className="entity-detail-value">{item.campo1}</p>
                </div>

                <div className="entity-detail-group">
                    <label className="entity-detail-label">Campo 2:</label>
                    <p className="entity-detail-value">{item.campo2 || <span className="entity-text-muted">Sin dato</span>}</p>
                </div>

                {/* Repetir para todos los campos */}
            </div>
        </div>
    );
};

export default [NombreEntidad]View;
```

---

## 🎨 7. ESTILOS (CSS)

### Archivo: `styles/[nombre-entidad].css`

```css
/* ===================================
   ESTILOS ESPECÍFICOS - [NOMBRE_ENTIDAD]
   ===================================
   Importa los estilos base y sobrescribe variables de color.
*/

/* Importar estilos base */
@import '../../../styles/entity-base.css';

/* Sobrescribir variables de color para [NombreEntidad] */
:root {
    /* Elegir un color único para cada entidad */
    --entity-primary: #0d6efd;        /* Azul (ejemplo) */
    --entity-primary-hover: #0b5ed7;
    --entity-primary-light: #cfe2ff;
}

/* Estilos adicionales específicos (si los necesitas) */
.[nombre-entidad]-custom {
    /* Agrega estilos personalizados aquí */
}
```

**🎨 Paleta de colores sugerida:**

| Entidad | Color | Código |
|---------|-------|--------|
| Especialidad | Verde | `#198754` |
| Médico | Azul | `#0d6efd` |
| Paciente | Índigo | `#6610f2` |
| Turno | Púrpura | `#6f42c1` |
| Medicamento | Cian | `#0dcaf0` |
| Tipo Consulta | Naranja | `#fd7e14` |
| Historial Clínico | Rosa | `#d63384` |

---

## 🔧 8. VALIDACIÓN DE ELIMINACIÓN (Backend)

### A. Modificar DAO

En `dao/[nombre_entidad]_dao.py`, actualizar la función de eliminación:

```python
def eliminar_[nombre_entidad](id):
    """Elimina un registro de la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM [NombreTabla] WHERE id = ?", (id,))
        conn.commit()
    except sqlite3.IntegrityError as e:
        # Error específico de clave foránea
        if "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("No se puede eliminar el registro porque tiene datos asociados")
        raise  # Re-lanzar si es otro tipo de IntegrityError
    except sqlite3.Error as e:
        print(f"Error al eliminar: {e}")
        raise  # Propagar el error hacia arriba
    finally:
        if conn:
            conn.close()
```

### B. Modificar Endpoint en `app.py`

```python
@app.route('/[entidades]/<int:id>', methods=['DELETE'])
def delete_[entidad]_route(id):
    try:
        [nombre_entidad]_dao.eliminar_[nombre_entidad](id)
        return jsonify({"mensaje": "Registro eliminado exitosamente"}), 200
    except ValueError as e:
        # Error de validación (ej: FOREIGN KEY)
        return jsonify({"error": str(e)}), 409  # 409 Conflict
    except Exception as e:
        # Otros errores
        return jsonify({"error": f"Error al eliminar: {str(e)}"}), 500
```

### C. Manejo en Frontend (ya incluido en el patrón List)

El código del `onDelete` en la página List ya maneja el error 409:

```javascript
if (err.response?.status === 409 || errorMessage.includes('asignados')) {
    alert('⚠️ No se puede eliminar...');
}
```

---

## 🔗 9. RUTAS (App.jsx)

Agregar las rutas en `src/App.jsx`:

```jsx
import [NombreEntidad]List from './features/[nombre-entidad]/pages/[NombreEntidad]List';
import [NombreEntidad]Create from './features/[nombre-entidad]/pages/[NombreEntidad]Create';
import [NombreEntidad]Edit from './features/[nombre-entidad]/pages/[NombreEntidad]Edit';
import [NombreEntidad]View from './features/[nombre-entidad]/pages/[NombreEntidad]View';

// Dentro de <Routes>
<Route path="/[ruta]" element={<[NombreEntidad]List />} />
<Route path="/[ruta]/nuevo" element={<[NombreEntidad]Create />} />
<Route path="/[ruta]/:id" element={<[NombreEntidad]View />} />
<Route path="/[ruta]/:id/editar" element={<[NombreEntidad]Edit />} />
```

---

## 📝 10. CHECKLIST POR ENTIDAD

Para cada entidad pendiente, completar:

- [ ] **Backend:**
  - [ ] Verificar endpoints en `app.py`
  - [ ] Validar función `eliminar_` en DAO
  - [ ] Agregar manejo de `ValueError` en DELETE endpoint

- [ ] **Frontend - Servicios:**
  - [ ] Crear `[nombreEntidad]Service.js`
  - [ ] Implementar las 5 funciones (get, getById, create, update, delete)
  - [ ] Usar exports nombrados

- [ ] **Frontend - Componentes:**
  - [ ] Crear `[NombreEntidad]Form.jsx`
  - [ ] Estado unificado `formData`
  - [ ] `handleChange` y `handleSubmit`
  - [ ] Usar clases CSS `entity-*`

- [ ] **Frontend - Páginas:**
  - [ ] Crear `[NombreEntidad]List.jsx`
  - [ ] Crear `[NombreEntidad]Create.jsx`
  - [ ] Crear `[NombreEntidad]Edit.jsx`
  - [ ] Crear `[NombreEntidad]View.jsx`
  - [ ] Agregar validación de eliminación en List

- [ ] **Frontend - Estilos:**
  - [ ] Crear `[nombre-entidad].css`
  - [ ] Importar `entity-base.css`
  - [ ] Definir color único en `:root`

- [ ] **Frontend - Routing:**
  - [ ] Importar componentes en `App.jsx`
  - [ ] Agregar 4 rutas (list, create, view, edit)

- [ ] **Testing:**
  - [ ] Crear nuevo registro
  - [ ] Editar registro existente
  - [ ] Ver detalle
  - [ ] Eliminar registro sin relaciones
  - [ ] Intentar eliminar con relaciones (debe fallar con mensaje)

---

## 🚀 PROMPT SUGERIDO PARA COPILOT

Puedes usar este prompt para cada entidad:

```
Necesito implementar la entidad [NOMBRE_ENTIDAD] siguiendo el patrón establecido en Médico y Especialidad.

La entidad tiene los siguientes campos:
- campo1 (tipo)
- campo2 (tipo)
- campo3 (tipo)

Relaciones con otras entidades:
- [Describir relaciones FK si existen]

Por favor, crea:
1. Service: [nombreEntidad]Service.js con las 5 funciones estándar
2. Form: [NombreEntidad]Form.jsx con todos los campos
3. Pages: List, Create, Edit y View
4. Styles: [nombre-entidad].css con color [COLOR_HEX]
5. Validación de eliminación en backend (DAO + app.py)

Sigue exactamente los patrones del archivo PLAN_DE_ACCION.md
```

---

## 📚 REFERENCIAS

### Archivos de referencia completos:
- **Servicio:** `frontend/src/features/medico/services/medicoService.js`
- **Formulario:** `frontend/src/features/medico/components/MedicoForm.jsx`
- **Listado:** `frontend/src/features/medico/pages/MedicoList.jsx`
- **Creación:** `frontend/src/features/medico/pages/MedicoCreate.jsx`
- **Edición:** `frontend/src/features/medico/pages/MedicoEdit.jsx`
- **Detalle:** `frontend/src/features/medico/pages/MedicoView.jsx`
- **Estilos:** `frontend/src/features/medico/styles/medico.css`
- **DAO:** `backend/dao/medico_dao.py`
- **Endpoint:** `backend/app.py` (sección MÉDICOS)

### Clases CSS disponibles (en `entity-base.css`):
- **Contenedores:** `.entity-container`, `.entity-header`
- **Formularios:** `.entity-form`, `.entity-form-group`, `.entity-form-input`, `.entity-form-label`
- **Tablas:** `.entity-table`, `.entity-table-container`
- **Botones:** `.btn-entity-primary`, `.btn-entity-secondary`, `.btn-entity-danger`
- **Utilidades:** `.entity-badge`, `.entity-text-muted`, `.entity-loading`
- **Detalles:** `.entity-detail`, `.entity-detail-group`, `.entity-detail-label`

---

## ⚠️ ERRORES COMUNES A EVITAR

1. **NO usar `create_file` en archivos existentes** → Usar `replace_string_in_file`
2. **NO mezclar export default con named exports** → Siempre usar `export const`
3. **NO olvidar `e.preventDefault()` en formularios** → Evita doble submit
4. **NO usar LEFT JOIN si la relación es obligatoria** → Usar INNER JOIN
5. **NO hardcodear valores de ID** → Cargar dinámicamente con useEffect
6. **NO olvidar el manejo de errores 409** → Validar eliminación con FK
7. **NO usar clases CSS personalizadas** → Usar las de `entity-base.css`

---

## 🎯 ORDEN SUGERIDO DE IMPLEMENTACIÓN

1. **Tipo Consulta** (simple, sin relaciones complejas)
2. **Tipo Medicamento** (simple, sin relaciones complejas)
3. **Medicamento** (tiene FK a Tipo Medicamento)
4. **Paciente** (independiente, pero importante)
5. **Historial Clínico** (depende de Paciente)
6. **Horario Atención** (depende de Médico)
7. **Turno** (depende de Paciente, Médico, Tipo Consulta - más complejo)

---

## ✅ RESULTADO ESPERADO

Al finalizar, cada entidad debe:
- ✅ Tener CRUD completo funcional
- ✅ Mostrar datos relacionados (nombres, no solo IDs)
- ✅ Validar eliminación con mensajes claros
- ✅ Usar estilos consistentes
- ✅ Manejar errores apropiadamente
- ✅ Seguir la misma estructura de carpetas
- ✅ Tener un color único identificador

---

**📌 Documento creado:** 2 de Noviembre de 2025  
**🔄 Última actualización:** 2 de Noviembre de 2025  
**👥 Equipo:** Proyecto TPI-G6-DAO-2025  
**📍 Estado:** Médico y Especialidad completos - Resto pendiente

---

¡Buena suerte con la implementación! 🚀
