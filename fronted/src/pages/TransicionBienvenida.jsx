import React, { useState, useEffect } from 'react';
import '../styles/TransicionBienvenida.css';

const TransicionBienvenida = () => {
  const [animandoSalida, setAnimandoSalida] = useState(false);
  const [destruirComponente, setDestruirComponente] = useState(false);

  useEffect(() => {
    // 1. Asegúrate de que el archivo en la carpeta public se llame "transicion.m4a" (sin tilde)
    const audio = new Audio('/transicion.m4a');
    audio.volume = 0.5;

    // --- DEBUGGING: Esto te dirá si el archivo no carga ---
    audio.addEventListener('error', (e) => {
      console.error("ERROR CRÍTICO: No se pudo cargar el archivo de audio. Verifica el nombre en la carpeta public.", e);
    });
    
    // Intentamos reproducir
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio reproduciéndose correctamente.");
        })
        .catch(error => {
          // Si entra aquí, es 99% seguro que es el bloqueo de Autoplay de Chrome
          console.warn("Audio bloqueado por el navegador (Autoplay Policy). El usuario debe interactuar primero.", error);
        });
    }

    const fadeOutTimer = setTimeout(() => {
      setAnimandoSalida(true);
    }, 2500);

    const destroyTimer = setTimeout(() => {
      setDestruirComponente(true);
    }, 3200);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(destroyTimer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  if (destruirComponente) {
    return null;
  }

  return (
    <div className={`fondo-bienvenida ${animandoSalida ? 'oculto' : ''}`}>
      <div className="contenido-bienvenida">
        <h2 className="texto-bienvenida">Bienvenidos a</h2>
        <img 
          src="/logo.png" 
          alt="NextLevelPC Logo" 
          className="logo-imagen"
        />
        <p className="subtitulo-bienvenida">Despierta tu poder digital.</p>
      </div>
    </div>
  );
};

export default TransicionBienvenida;