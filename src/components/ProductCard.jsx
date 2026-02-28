import React, { useState } from 'react';
import Modal from './Modal';

const ProductCard = ({ product }) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const description = product.descricao || '';
  const shortDescription = description.substring(0, 60);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleShare = () => {
    const message = `Confira este produto: *${product.nome}*\nPreço: R$ ${product?.preco ? Number(product.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}\n\nVeja mais em: ${window.location.origin}/#/catalogo?search=${encodeURIComponent(product.nome)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
        <div className="overflow-hidden cursor-pointer shrink-0" onClick={openModal}>
          <img
            src={product.img}
            alt={product.nome || 'Imagem do produto'}
            className="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-3 flex flex-col grow">
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
          <p className="text-base font-bold text-center mt-2 text-gray-900">
                R$ {product?.preco
                ? Number(String(product.preco).replace(',', '.')).toLocaleString('pt-BR', {
                minimumFractionDigits: 2
            })
              : '0,00'}
          </p>

          <div className="flex gap-2 mt-3">
            <a
              href={`https://wa.me/5563992952695?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.nome || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center font-bold py-1.5 px-2 rounded text-sm flex items-center justify-center"
            >
              Comprar
            </a>
            <button
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-2 rounded flex items-center justify-center"
              title="Compartilhar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
