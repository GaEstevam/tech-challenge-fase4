import React, { useEffect, useState } from 'react';
import './Footer.css'; // Importando o arquivo CSS

const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Adiciona segundos
      setCurrentTime(formattedTime);
    };

    updateTime(); // Atualiza a hora imediatamente
    const intervalId = setInterval(updateTime, 1000); // Atualiza a cada segundo

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, []);

  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} . Todos os direitos reservados.</p>
      <p>{currentTime}</p>
    </footer>
  );
};

export default Footer;
