import React, { useState } from 'react';
import Modal from './Modal';

const ProductCard = ({ product }) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const description = product.descricao || '';
  const shortDescription = description.substring(0, 100);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div className="overflow-hidden cursor-pointer" onClick={openModal}>
          <img
            src={product.img}
            alt={product.nome}
            className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            {product.nome}
          </h3>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {description.length > 100 ? (
              <>
                {showMore ? description : `${shortDescription}...`}
                <button
                  className="text-blue-500 hover:underline ml-2"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Ver menos' : 'Ver mais'}
                </button>
              </>
            ) : (
              description
            )}
          </p>
          <p className="text-lg font-bold">
                R$ {product?.preco
                ? Number(product.preco).toLocaleString('pt-BR', {
                minimumFractionDigits: 2
            })
              : '0,00'}
          </p>

          <a
            href={`https://wa.me/5563992952695?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.nome)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded mt-4"
          >
            Comprar
          </a>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img
          src={product.img}
          alt={product.nome}
          className="object-contain max-h-[70vh]"
        />
      </Modal>
    </>
  );
};

export default ProductCard;
