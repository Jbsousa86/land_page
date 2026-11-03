import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-purple-400 text-gray-200 py-4 sm:py-5 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Contato</h2>
        <p className="mb-3">
          📍 Ananás – TO · Bairro 4 Bocas
        </p>
        <div className="flex justify-center gap-3 mb-3 flex-wrap">
          <a
            href="https://wa.me/5563992952695"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold transition shadow-md hover:scale-105"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/elianeimportados1?igsh=bWk3NXdtczZ6cDI3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-pink-500 hover:opacity-90 text-white px-4 py-2 rounded-full font-semibold transition shadow-md hover:scale-105"
          >
            Instagram
          </a>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} Eliane Importados. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

