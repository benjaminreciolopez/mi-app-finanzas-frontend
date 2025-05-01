import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Reset básico */
  *, *::before, *::after {
    box-sizing: border-box;
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
  }

  .container {
    width: 100%;
    max-width: 420px; /* tamaño típico de pantalla móvil */
    margin: 0 auto;
    padding: 20px 16px;
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
    color: #dc2626; /* rojo para fines de semana */
  }
`;
export default GlobalStyles;
