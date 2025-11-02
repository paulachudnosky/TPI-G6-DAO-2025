# 🚀 Guía Rápida: Aplicar Estilos a Otras Entidades

## Pasos para aplicar los estilos a cualquier entidad

### 1️⃣ Crear archivo CSS de la entidad

```bash
# Ejemplo para Paciente
touch src/features/paciente/styles/paciente.css
```

```css
/* features/paciente/styles/paciente.css */
@import '../../styles/entity-base.css';

:root {
    --entity-primary: #ffc107;        /* Color de la entidad */
    --entity-primary-hover: #e0a800;
    --entity-primary-light: #fff3cd;
}
```

### 2️⃣ Importar en componentes

```jsx
// En TODOS los archivos de pages/ y components/
import '../styles/paciente.css';
```

### 3️⃣ Actualizar componente List

```jsx
// Antes
<div>
    <h2>Pacientes</h2>
    <button onClick={...}>Nuevo</button>
    <table>...</table>
</div>

// Después
<div className="entity-container">
    <div className="entity-header">
        <h2>Gestión de Pacientes</h2>
        <button className="btn-entity-primary" onClick={...}>
            ➕ Nuevo Paciente
        </button>
    </div>
    
    <div className="entity-table-container">
        <table className="entity-table">
            <thead>
                <tr>
                    <th>Columna 1</th>
                    <th className="actions-cell">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="X" className="empty-state">
                            No hay registros
                        </td>
                    </tr>
                ) : (
                    items.map(item => (
                        <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td className="actions-cell">
                                <button className="btn-entity-primary btn-entity-sm">👁️ Ver</button>
                                <button className="btn-entity-secondary btn-entity-sm">✏️ Editar</button>
                                <button className="btn-entity-danger btn-entity-sm">🗑️ Eliminar</button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
</div>
```

### 4️⃣ Actualizar componente Form

```jsx
// Antes
<form onSubmit={...}>
    <div>
        <label>Campo</label>
        <input value={...} onChange={...} />
    </div>
    <button type="submit">Guardar</button>
</form>

// Después
<form className="entity-form" onSubmit={...}>
    <div className="entity-form-group">
        <label htmlFor="campo" className="entity-form-label required">
            Campo
        </label>
        <input
            type="text"
            id="campo"
            name="campo"
            className="entity-form-input"
            value={...}
            onChange={...}
            required
            placeholder="..."
        />
        <span className="entity-form-help">Texto de ayuda</span>
    </div>
    
    <div className="entity-form-actions">
        <button type="submit" className="btn-entity-primary">
            💾 Guardar
        </button>
    </div>
</form>
```

### 5️⃣ Actualizar páginas Create/Edit

```jsx
// Antes
<div>
    <h2>Nuevo ...</h2>
    <Form onSubmit={...} />
</div>

// Después
<div className="entity-container">
    <div className="entity-header">
        <h2>➕ Nuevo Paciente</h2>
        <button className="btn-entity-secondary" onClick={() => navigate('/paciente')}>
            ← Volver a la lista
        </button>
    </div>
    <Form onSubmit={...} />
</div>
```

### 6️⃣ Actualizar página View

```jsx
// Antes
<div>
    <h2>Detalle</h2>
    <p><b>Campo:</b> {valor}</p>
    <button onClick={...}>Volver</button>
</div>

// Después
<div className="entity-container">
    <div className="entity-header">
        <h2>👁️ Detalle de Paciente</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-entity-primary" onClick={...}>
                ✏️ Editar
            </button>
            <button className="btn-entity-secondary" onClick={...}>
                ← Volver
            </button>
        </div>
    </div>
    
    <div className="entity-detail-card">
        <div className="entity-detail-row">
            <span className="entity-detail-label">Campo:</span>
            <span className="entity-detail-value">{valor}</span>
        </div>
    </div>
</div>
```

### 7️⃣ Agregar estados de carga

```jsx
// Loading
if (loading) {
    return <div className="entity-loading">Cargando...</div>;
}

// Error
if (error) {
    return <div className="entity-alert entity-alert-danger">{error}</div>;
}

// Success (temporal)
<div className="entity-alert entity-alert-success">✅ Guardado exitosamente</div>
```

## 🎨 Paleta de colores disponibles

```css
/* Copiar y pegar el que corresponda */

/* Verde - Especialidad, Horario Atención */
:root {
    --entity-primary: #198754;
    --entity-primary-hover: #157347;
    --entity-primary-light: #d1e7dd;
}

/* Azul cyan - Médico */
:root {
    --entity-primary: #0dcaf0;
    --entity-primary-hover: #0ab7d6;
    --entity-primary-light: #cff4fc;
}

/* Azul - Turno, Historial Clínico */
:root {
    --entity-primary: #0d6efd;
    --entity-primary-hover: #0b5ed7;
    --entity-primary-light: #cfe2ff;
}

/* Amarillo - Paciente */
:root {
    --entity-primary: #ffc107;
    --entity-primary-hover: #e0a800;
    --entity-primary-light: #fff3cd;
}

/* Gris - Medicamento */
:root {
    --entity-primary: #6c757d;
    --entity-primary-hover: #5c636a;
    --entity-primary-light: #e2e3e5;
}

/* Rojo - Tipo Medicamento */
:root {
    --entity-primary: #dc3545;
    --entity-primary-hover: #bb2d3b;
    --entity-primary-light: #f8d7da;
}

/* Oscuro - Tipo Consulta */
:root {
    --entity-primary: #212529;
    --entity-primary-hover: #1a1e21;
    --entity-primary-light: #d3d3d4;
}
```

## ✅ Checklist por entidad

- [ ] Crear archivo `styles/[entidad].css`
- [ ] Importar CSS en todos los componentes
- [ ] Actualizar `[Entidad]List.jsx`
- [ ] Actualizar `[Entidad]Form.jsx`
- [ ] Actualizar `[Entidad]Create.jsx`
- [ ] Actualizar `[Entidad]Edit.jsx`
- [ ] Actualizar `[Entidad]View.jsx`
- [ ] Agregar manejo de errores
- [ ] Agregar estados de carga
- [ ] Probar navegación completa

## 📦 Orden recomendado de implementación

1. **Médico** ✅ (Ya hecho - usar como referencia)
2. **Especialidad** (Similar a médico, simple)
3. **Paciente** (Más campos)
4. **Turno** (Relaciones con otras entidades)
5. **Resto de entidades**

## 🔍 Ejemplo completo: Paciente

Ver carpeta `features/medico/` como referencia completa.

Básicamente:
1. Copiar estructura de `features/medico/`
2. Buscar y reemplazar "medico" → "paciente"
3. Buscar y reemplazar "Médico" → "Paciente"
4. Ajustar campos del formulario según modelo
5. Cambiar color en CSS
6. ¡Listo!
