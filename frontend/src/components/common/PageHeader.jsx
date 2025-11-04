import React from 'react';
import { Link } from 'react-router-dom';

const colorToBtn = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
    info: 'btn-info',
    dark: 'btn-dark',
    light: 'btn-light',
};

const PageHeader = ({ title, to, buttonText = 'Nuevo', color = 'primary', right = null }) => {
    const btnClass = colorToBtn[color] || 'btn-primary';
    return (
        <div className={`d-flex justify-content-between align-items-center mb-3 border rounded p-3 bg-white`}>
            <h1 className="h4 m-0">{title}</h1>
            <div className="d-flex align-items-center gap-2">
                {right}
                {to && (
                    <Link to={to} className={`btn ${btnClass}`}>{buttonText}</Link>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
