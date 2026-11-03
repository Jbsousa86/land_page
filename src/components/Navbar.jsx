import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ itemCount, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [secretCount, setSecretCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const handleSecretClick = () => {
    setSecretCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (secretCount === 5) {
      navigate('/admin/login');
      setSecretCount(0);
    }
  }, [secretCount, navigate]);

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMenu();
  };

  const handleScroll = (e, id) => {
    e.preventDefault();
    if (id === 'contact') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  return (
    <nav className="bg-rose-300 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <Link to="/">
                <img className="h-12 w-auto transition-all duration-300 ease-in-out transform hover:scale-110 rounded-md opacity-75 hover:opacity-100" src="/logo.png" alt="Logo" />
              </Link>
              <span 
                onClick={handleSecretClick}
                className="ml-2 whitespace-nowrap text-lg text-white select-none cursor-default min-[360px]:text-2xl sm:ml-4 md:text-3xl" 
                style={{ fontFamily: '"Dancing Script", cursive' }}
              >
                Eliane Importados
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" onClick={handleHomeClick} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Início</Link>
                <a href="#quem-sou-eu" onClick={(e) => handleScroll(e, 'quem-sou-eu')} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sobre</a>
                <Link to="/catalogo" className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Catálogo</Link>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contato</a>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500 p-0 text-white shadow-sm transition hover:bg-rose-600 md:w-auto md:gap-2 md:rounded-md md:px-3"
              aria-label={`Abrir carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
              title="Abrir carrinho"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 8H6" />
                <circle cx="10" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
              </svg>
              <span className="hidden md:inline">Carrinho</span>
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold md:static md:text-xs">
                {itemCount}
              </span>
            </button>
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded={isOpen}>
                <span className="sr-only">{isOpen ? 'Fechar menu' : 'Abrir menu'}</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={handleHomeClick} className="text-gray-600 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Início</Link>
            <a href="#quem-sou-eu" onClick={(e) => handleScroll(e, 'quem-sou-eu')} className="text-gray-600 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sobre</a>
            <Link to="/catalogo" onClick={closeMenu} className="text-gray-600 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Catálogo</Link>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-gray-600 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contato</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
