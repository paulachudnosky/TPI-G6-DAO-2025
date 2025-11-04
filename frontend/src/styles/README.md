# 🎨 Sistema de Estilos para Entidades (CRUD)

Sistema de estilos CSS reutilizable basado en variables CSS para mantener consistencia visual en todas las entidades del proyecto.

## 📁 Estructura

```
src/
├── styles/
│   └── entity-base.css          # Estilos base reutilizables
└── features/
    ├── especialidad/
    │   └── styles/
    │       └── especialidad.css  # Verde (success)
    ├── medico/
    │   └── styles/
    │       └── medico.css        # Azul cyan (info)
    ├── paciente/
    │   └── styles/
    │       └── paciente.css      # Amarillo (warning)
    └── turno/
        └── styles/
            └── turno.css         # Azul (primary)
```

## 🚀 Uso Rápido

### 1. Importar en tu componente

```jsx
import './styles/medico.css';  // O la entidad correspondiente
```

### 2. Usar las clases CSS

```jsx
<div className="entity-container">
  <div className="entity-header">
    <h2>Médicos</h2>
    <button className="btn-entity-primary">Nuevo Médico</button>
  </div>
  
  <div className="entity-table-container">
    <table className="entity-table">
      {/* ... */}
    </table>
  </div>
</div>
```

## 🎨 Crear Estilos para Nueva Entidad

Para crear estilos para una nueva entidad (ej: Medicamento):

```css
/* features/medicamento/styles/medicamento.css */

/* Importar estilos base */
@import '../../styles/entity-base.css';

/* Cambiar solo los colores */
:root {
    --entity-primary: #6c757d;        /* Gris (secondary) */
    --entity-primary-hover: #5c636a;
    --entity-primary-light: #e2e3e5;
}
```

## 📋 Clases CSS Disponibles

### Contenedores
- `.entity-container` - Contenedor principal
- `.entity-content` - Contenido interno

### Encabezados
- `.entity-header` - Encabezado con título y botón

### Botones
- `.btn-entity-primary` - Botón principal (usa el color de la entidad)
- `.btn-entity-secondary` - Botón secundario
- `.btn-entity-danger` - Botón de eliminar
- `.btn-entity-sm` - Botón pequeño
- `.btn-entity-lg` - Botón grande

### Tablas
- `.entity-table-container` - Contenedor de tabla
- `.entity-table` - Tabla de datos
- `.actions-cell` - Celda de acciones
- `.empty-state` - Mensaje cuando no hay datos

### Formularios
- `.entity-form` - Contenedor de formulario
- `.entity-form-group` - Grupo de campo
- `.entity-form-label` - Etiqueta de campo
- `.entity-form-label.required` - Etiqueta con asterisco
- `.entity-form-input` - Campo de texto
- `.entity-form-textarea` - Área de texto
- `.entity-form-select` - Select/dropdown
- `.entity-form-help` - Texto de ayuda
- `.entity-form-error` - Mensaje de error
- `.entity-form-actions` - Contenedor de botones

### Alertas
- `.entity-alert` - Alerta base
- `.entity-alert-info` - Alerta informativa
- `.entity-alert-success` - Alerta de éxito
- `.entity-alert-danger` - Alerta de error
- `.entity-alert-warning` - Alerta de advertencia

### Estados
- `.entity-loading` - Indicador de carga (con spinner animado)

### Tarjetas de Detalle
- `.entity-detail-card` - Tarjeta de detalle
- `.entity-detail-row` - Fila de detalle
- `.entity-detail-label` - Etiqueta de campo
- `.entity-detail-value` - Valor de campo

### Badges
- `.entity-badge` - Badge base
- `.entity-badge-primary` - Badge principal
- `.entity-badge-success` - Badge de éxito
- `.entity-badge-danger` - Badge de error
- `.entity-badge-warning` - Badge de advertencia
- `.entity-badge-info` - Badge informativo

### Utilidades
- `.entity-text-muted` - Texto atenuado
- `.entity-text-center` - Texto centrado
- `.entity-text-right` - Texto alineado a derecha
- `.entity-mt-1/2/3` - Margen superior
- `.entity-mb-1/2/3` - Margen inferior
- `.entity-gap-1/2/3` - Espaciado entre elementos

## 🎨 Paleta de Colores por Entidad

Basada en Bootstrap colors para mantener consistencia con el Home:

| Entidad | Color | Variable |
|---------|-------|----------|
| Especialidad | Verde | `#198754` (success) |
| Médico | Azul cyan | `#0dcaf0` (info) |
| Paciente | Amarillo | `#ffc107` (warning) |
| Turno | Azul | `#0d6efd` (primary) |
| Medicamento | Gris | `#6c757d` (secondary) |
| Tipo Medicamento | Rojo | `#dc3545` (danger) |
| Tipo Consulta | Oscuro | `#212529` (dark) |
| Historial Clínico | Azul | `#0d6efd` (primary) |
| Horario Atención | Verde | `#198754` (success) |

## 🔧 Personalización Avanzada

Si necesitas estilos específicos adicionales:

```css
/* features/medico/styles/medico.css */

@import '../../styles/entity-base.css';

:root {
    --entity-primary: #0dcaf0;
    --entity-primary-hover: #0ab7d6;
    --entity-primary-light: #cff4fc;
}

/* Estilos adicionales específicos */
.medico-specialization-badge {
    background-color: var(--entity-primary-light);
    padding: 0.5rem;
    border-radius: 0.25rem;
}
```

## 💡 Ventajas

✅ **Reutilizable**: Un solo archivo base para todas las entidades  
✅ **Consistente**: Mismo look & feel en todo el proyecto  
✅ **Fácil de mantener**: Cambios en un solo lugar  
✅ **Temático**: Cada entidad con su color distintivo  
✅ **Escalable**: Fácil agregar nuevas entidades  
✅ **Variables CSS**: Cambios dinámicos sin recompilar

## 📝 Ejemplo Completo

```jsx
// MedicoList.jsx
import React, { useState, useEffect } from 'react';
import { getMedicos } from '../services/medicoService';
import './styles/medico.css';

const MedicoList = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedicos().then(data => {
      setMedicos(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="entity-loading">Cargando médicos...</div>;
  }

  return (
    <div className="entity-container">
      <div className="entity-header">
        <h2>Gestión de Médicos</h2>
        <button className="btn-entity-primary">➕ Nuevo Médico</button>
      </div>

      <div className="entity-table-container">
        <table className="entity-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th className="actions-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map(m => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.matricula}</td>
                <td className="actions-cell">
                  <button className="btn-entity-primary btn-entity-sm">Ver</button>
                  <button className="btn-entity-secondary btn-entity-sm">Editar</button>
                  <button className="btn-entity-danger btn-entity-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicoList;
```

## 🤝 Compatibilidad con Bootstrap

Estos estilos **coexisten** con Bootstrap. Puedes:
- Usar clases de Bootstrap donde lo necesites
- Usar clases `entity-*` para componentes CRUD
- Combinar ambas según necesidad

No hay conflicto porque las clases tienen prefijos distintos.
