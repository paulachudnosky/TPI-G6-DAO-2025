import React from 'react';
import './ToggleFilter.css';

/**
 * Componente de interruptor (toggle switch) reutilizable.
 * @param {object} props
 * @param {string} props.labelOn - El texto a mostrar cuando el interruptor está encendido.
 * @param {string} props.labelOff - El texto a mostrar cuando el interruptor está apagado.
 * @param {React.ReactNode} [props.iconOn] - El icono a mostrar cuando está encendido.
 * @param {React.ReactNode} [props.iconOff] - El icono a mostrar cuando está apagado.
 * @param {boolean} props.isChecked - El estado actual del interruptor (encendido/apagado).
 * @param {function} props.onChange - La función que se ejecuta cuando el estado cambia.
 */
const ToggleFilter = ({ labelOn, labelOff, iconOn, iconOff, isChecked, onChange }) => {
  const uniqueId = `toggle-switch-${(labelOff || labelOn).replace(/\s+/g, '-')}`;
  const currentLabel = isChecked ? labelOn : labelOff;
  const currentIcon = isChecked ? iconOn : iconOff;

  return (
    <div className="toggle-filter-container">
      <label htmlFor={uniqueId} className="toggle-switch-wrapper">
        <input
          type="checkbox"
          id={uniqueId}
          checked={isChecked}
          onChange={onChange}
          className="toggle-switch-checkbox"
        />
        <div className="toggle-switch-label"></div>
      </label>
      <div className="toggle-filter-text">
        {currentIcon} {currentLabel}
      </div>
    </div>
  );
};

export default ToggleFilter;