import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-purple-400 text-gray-200 py-6 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Contato</h2>
        <p className="mb-4">
          📍 Ananás – TO · Bairro 4 Bocas
        </p>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <a
            href="https://wa.me/5563992952695"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition shadow-lg hover:scale-105"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/elianeimportados1?igsh=bWk3NXdtczZ6cDI3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-pink-500 hover:opacity-90 text-white px-6 py-3 rounded-full font-semibold transition shadow-lg hover:scale-105"
          >
            Instagram
          </a>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} Eliane Importados. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

