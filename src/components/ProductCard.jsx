import React, { useState } from 'react';
import Modal from './Modal';
import { formatCurrency, parseCurrency } from '../utils/currency';

const ProductCard = ({ product, onAddToCart }) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const description = product.descricao || '';
  const shortDescription = description.substring(0, 60);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/#/catalogo?search=${encodeURIComponent(product.nome || '')}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.nome || 'Produto',
          text: `Confira este produto: ${product.nome || ''}`,
          url: productUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(productUrl);
        setLinkCopied(true);
        window.setTimeout(() => setLinkCopied(false), 2000);
      } else {
        window.prompt('Copie o link do produto:', productUrl);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing product:', error);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
        <div className="overflow-hidden cursor-pointer shrink-0" onClick={openModal}>
          <img
            src={product.img}
            alt={product.nome || 'Imagem do produto'}
            className="w-full h-32 md:h-40 object-cover transform hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-2 md:p-3 flex flex-col grow">
          <p className="text-xs text-gray-500 text-center">{product.categoria}</p>
          <h3 className="text-sm font-bold text-gray-800 text-center leading-tight mb-1">
            {product.nome}
          </h3>
          <div className="grow">
            <p className="text-xs text-gray-600 mt-1 text-center">
              {description.length > 60 ? (
                <>
                  {showMore ? description : `${shortDescription}...`}
                  <button
                    className="text-blue-500 hover:underline ml-1"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? 'Ver menos' : 'Ver mais'}
                  </button>
                </>
              ) : (
                description
              )}
            </p>
          </div>
          <p className="text-sm md:text-base font-bold text-center mt-2 text-gray-900">
            {formatCurrency(parseCurrency(product.preco))}
          </p>

          <div className="flex gap-2 mt-2 md:mt-3">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-center font-bold py-1.5 px-2 rounded text-xs md:text-sm flex items-center justify-center"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-2 rounded flex items-center justify-center"
              title={linkCopied ? 'Link copiado' : 'Compartilhar produto'}
              aria-label={linkCopied ? 'Link copiado' : 'Compartilhar produto'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.49-8.48" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img
          src={product.img}
          alt={product.nome || 'Imagem do produto'}
          className="object-contain max-h-[70vh]"
        />
      </Modal>
    </>
  );
};

export default ProductCard;
