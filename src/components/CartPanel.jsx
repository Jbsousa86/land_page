import React, { useState } from 'react';
import { formatCurrency, parseCurrency } from '../utils/currency';

const CartPanel = ({ items, onUpdateQuantity, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + parseCurrency(item.product.preco) * item.quantity,
    0
  );

  const handleCheckout = () => {
    const orderLines = items.map(({ product, quantity }) => {
      const unitPrice = parseCurrency(product.preco);
      return `- ${product.nome}: ${quantity} x ${formatCurrency(unitPrice)} = ${formatCurrency(unitPrice * quantity)}`;
    });
    const message = `Olá! Gostaria de fazer este pedido:\n\n${orderLines.join('\n')}\n\nTotal: ${formatCurrency(total)}`;
    window.open(`https://wa.me/5563992952695?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition hover:bg-rose-600 md:bottom-5 md:right-6"
        aria-label={`Abrir carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
        title="Abrir carrinho"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 8H6" />
          <circle cx="10" cy="21" r="1" />
          <circle cx="18" cy="21" r="1" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-900 px-1 text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-end justify-center bg-black/55 sm:items-stretch sm:justify-end"
          onClick={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-xl bg-white shadow-2xl sm:max-h-screen sm:rounded-none"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="cart-title" className="text-xl font-bold text-gray-900">Seu carrinho</h2>
                <p className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                aria-label="Fechar carrinho"
                title="Fechar carrinho"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="grow overflow-y-auto px-5 py-3">
              {items.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center text-center">
                  <p className="font-semibold text-gray-800">Seu carrinho está vazio</p>
                  <p className="mt-1 text-sm text-gray-500">Adicione produtos para montar seu pedido.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {items.map(({ product, quantity }) => {
                    const unitPrice = parseCurrency(product.preco);
                    return (
                      <li key={product.id} className="flex gap-3 py-4">
                        <img
                          src={product.img}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-md bg-gray-100 object-cover"
                        />
                        <div className="min-w-0 grow">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-gray-900">{product.nome}</h3>
                              <p className="mt-0.5 text-xs text-gray-500">{formatCurrency(unitPrice)} cada</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemove(product.id)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600"
                              aria-label={`Remover ${product.nome}`}
                              title="Remover produto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                                disabled={quantity <= 1}
                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Diminuir quantidade de ${product.nome}`}
                              >
                                −
                              </button>
                              <span className="min-w-5 text-center text-sm font-semibold">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                                aria-label={`Aumentar quantidade de ${product.nome}`}
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(unitPrice * quantity)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <footer className="border-t border-gray-200 bg-white px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full rounded-md bg-green-600 px-4 py-3 text-center font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Enviar pedido pelo WhatsApp
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
};

export default CartPanel;
