import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Reset básico */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    overflow-x: hidden;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #f5f7fa;
    font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333333;
    line-height: 1.6;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input, button, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    outline: none;
  }

  button {
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .boton-accion {
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    margin-left: 6px;
    cursor: pointer;
  }

  button:hover {
    background-color: #4338ca;
  }

  input, select, textarea {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 12px;
    width: 100%;
    margin-top: 4px;
    margin-bottom: 12px;
  }

input:focus, select:focus, textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px #c7d2fe;
}

  .container {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    padding: 76px 16px 20px;
    background-color: #f9fafb;
  }

  .card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #e5e7eb;
    z-index: 1000;
  }
.clientes-list {
  max-height: 350px;
  overflow-y: auto;
  margin-top: 20px;
  /* Opcional scroll bonito */
  scrollbar-width: thin;
  scrollbar-color: #4f46e5 #e5e7eb;
}

.clientes-list::-webkit-scrollbar {
  width: 8px;
  background: #e5e7eb;
}
.clientes-list::-webkit-scrollbar-thumb {
  background: #4f46e5;
  border-radius: 8px;
}

  .bottom-nav a {
    flex: 1;
    text-align: center;
    font-size: 0.75rem;
    color: #6b7280;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 0;
    transition: color 0.3s ease;
  }

  .bottom-nav a.active {
    color: #4f46e5;
    font-weight: 600;
  }

  .bottom-nav a span {
    margin-top: 2px;
    font-size: 0.7rem;
  }

  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
  }

  .top-nav a {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 11px;
    color: #6b7280;
    padding: 4px 0;
    transition: color 0.2s ease;
  }

  .top-nav a:hover {
    color: #1e3a8a;
  }

  .top-nav a.active {
    color: #4f46e5;
    font-weight: 600;
  }

  .top-nav a span {
    font-size: 10px;
    margin-top: 2px;
  }

  /* Estilos personalizados para react-calendar */
  .react-calendar {
    background: white;
    border-radius: 12px;
    padding: 10px;
    border: 1px solid #ddd;
    font-family: inherit;
  }

  .react-calendar__tile {
    padding: 0.75rem 0;
    text-align: center;
    color: #333;
    font-weight: 500;
  }

  .react-calendar__tile--now {
    background: #e0e7ff;
    border-radius: 50%;
    color: #1e3a8a;
  }

  .react-calendar__tile--active {
    background: #4f46e5;
    color: white;
    border-radius: 50%;
  }

  .react-calendar__tile--hasActive {
    background: #c7d2fe;
    border-radius: 50%;
  }

  .react-calendar__tile.tiene-trabajo {
    background-color: #fce7d6 !important;
    color: #b45309 !important;
    font-weight: bold;
    border-radius: 6px;
  }

  .react-calendar__month-view__weekdays {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .react-calendar__navigation button {
    background: none;
    color: #4f46e5;
    font-weight: bold;
  }

  .react-calendar__navigation button:disabled {
    color: #ccc;
  }

  .react-calendar__tile:disabled {
    color: #ccc;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #dc2626;
  }

  /* Eliminar flechas del input tipo number */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Animación suave para cambio de pestañas */
.page-container {
  position: relative;
  min-height: calc(100vh - 56px);
  overflow: hidden;
}
.page-transition {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 2;
  will-change: transform, opacity;
}
.historial-pagos {
  max-height: 55vh;      /* Cambia 55vh por el % de pantalla que prefieras */
  overflow-y: auto;
  margin-bottom: 12px;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #a5b4fc #f3f4f6;
  transition: max-height 0.2s;
}

.historial-pagos::-webkit-scrollbar {
  width: 6px;
  background: #f3f4f6;
}
.historial-pagos::-webkit-scrollbar-thumb {
  background: #a5b4fc;
  border-radius: 6px;
}
input[type="date"] {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  background-color: #fff;
  margin-top: 4px;
  margin-bottom: 12px;
  color: #333;
  box-sizing: border-box;
  min-height: 40px; /* fuerza que se parezca en altura */
}

input[type="date"]:disabled {
  background: #f5f7fa;
  color: #aaa;
}
  /* Modal de AsignadorDeEstado */
  .modal {
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    max-width: 420px;
    width: 100%;
    margin: 40px auto;
    z-index: 2000;
    position: relative;
    animation: aparecer 0.3s ease-out forwards;
  }

  .modal h3 {
    font-size: 1.25rem;
    margin-bottom: 12px;
  }

  .modal h4 {
    font-size: 1.1rem;
    margin-top: 18px;
    margin-bottom: 6px;
    color: #4f46e5;
  }

  .modal ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .modal li {
    margin-bottom: 6px;
  }

  .modal input[type="checkbox"] {
    margin-right: 8px;
    transform: scale(1.1);
    cursor: pointer;
  }

  .modal button {
    min-width: 120px;
    text-align: center;
  }

  @keyframes aparecer {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1500;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(1px);
    animation: desvanecer 0.3s ease-out forwards;
  }

  @keyframes desvanecer {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

`;

export default GlobalStyles;
