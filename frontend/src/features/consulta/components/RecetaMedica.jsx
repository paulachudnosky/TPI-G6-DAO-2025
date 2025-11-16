import React from 'react';
import styles from '../styles/RecetaMedica.module.css';

// Si quisieras usar un QR real, podrías instalar `qrcode.react`
// import QRCode from 'qrcode.react';

const RecetaMedica = ({
  fechaEmision,
  numeroRecetario,
  obraSocial,
  numeroAfiliado,
  dniPaciente,
  diagnostico,
  plan,
  medicamentos,
  nombreDoctor,
  matriculaDoctor,
  especialidadDoctor,
  urlQr,
  firmaDoctorUrl // 1. Añadimos la prop para la URL de la firma
}) => {
  return (
    <div className={styles.recetaContainer}>
      {/* --- Sección 1: Header --- */}
      <header className={styles.header}>
        <div className={styles.logo}>Clinica Curae  </div>
        <div className={styles.headerInfo}>
          <p><strong>Fecha Receta:</strong> {fechaEmision}</p>
          <p><strong>Recetario:</strong> {numeroRecetario}</p>
        </div>
      </header>

      {/* --- Sección 2: Datos del Afiliado --- */}
      <section className={styles.patientInfo}>
        <div className={styles.infoGrid}>
          <p><strong>OS:</strong> {obraSocial}</p>
          <p><strong>Afiliado:</strong> {numeroAfiliado}</p>
          <p><strong>D.N.I.:</strong> {dniPaciente}</p>
          <p><strong>Plan:</strong> {plan}</p>
        </div>
        <p><strong>Diagnóstico:</strong> {diagnostico}</p>
      </section>

      {/* --- Sección 3: Medicamentos --- */}
      <section className={styles.medications}>
        <h2 className={styles.rpTitle}>RP/</h2>
        {medicamentos && medicamentos.map((med, index) => (
          <div key={index} className={styles.medicationItem}>
            <p className={styles.medName}>
              <strong>{med.nombre}</strong>
            </p>
            <div className={styles.medDetails}>
              <p><strong>Forma:</strong> {med.forma_farmaceutica || 'No especificada'}</p>
              <p><strong>Presentación:</strong> {med.presentacion || 'No especificada'}</p>
            </div>
            <p className={styles.medQuantity}>Cantidad: {med.cantidad}</p>
          </div>
        ))}
      </section>

      {/* --- Sección 4: Firma del Doctor --- */}
      <section className={styles.doctorSignature}>
        <p>Firmado electrónicamente por:</p>
        <p><strong>Dr/a:</strong> {nombreDoctor}</p>
        <p><strong>Matrícula:</strong> {matriculaDoctor}</p>
        <p><strong>Especialidad:</strong> {especialidadDoctor}</p>
      </section>

      {/* --- Sección 5: Firma Electrónica (Footer) --- */}
      <footer className={styles.footer}>
        <div className={styles.qrSection}>
          {/* La firma del doctor ahora se muestra aquí, encima del texto */}
          {firmaDoctorUrl && (
            <img src={firmaDoctorUrl} alt="Firma del Doctor" className={styles.firmaImagen} />
          )}
          <p>Firma Electrónica:</p>
          <div className={styles.qrCodePlaceholder}>
            {/* 3. Mostramos la imagen del QR si la URL existe */}
            {urlQr ? (
              <img src={urlQr} alt="Código QR de la receta" />
            ) : (
              <span>QR</span>
            )}
          </div>
          <p className={styles.legalText}>
            La firma electrónica sustituye legalmente a la firma ológrafa según Ley 25.506.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RecetaMedica;