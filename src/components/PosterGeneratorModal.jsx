import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatCurrency, parseCurrency } from '../utils/currency';

const FORMATS = {
  feed: {
    id: 'feed',
    label: 'Feed (1080 × 1080)',
    subtitle: 'Instagram / Facebook (1:1)',
    width: 1080,
    height: 1080,
  },
  stories: {
    id: 'stories',
    label: 'Stories / Status (1080 × 1920)',
    subtitle: 'Instagram Stories / WhatsApp Status (9:16)',
    width: 1080,
    height: 1920,
  },
};

const THEMES = {
  rose: {
    id: 'rose',
    name: 'Rosa Eliane',
    bgStart: '#fff1f2',
    bgMiddle: '#ffe4e6',
    bgEnd: '#fecdd3',
    headerBg: '#e11d48',
    headerText: '#ffffff',
    accent: '#be123c',
    badgeBg: '#e11d48',
    badgeText: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: '#fda4af',
    titleColor: '#881337',
    textColor: '#1f2937',
    mutedColor: '#6b7280',
    priceBg: '#e11d48',
    priceText: '#ffffff',
    footerBg: '#881337',
    footerText: '#ffffff',
    decorCircle: 'rgba(225, 29, 72, 0.08)',
  },
  luxury: {
    id: 'luxury',
    name: 'Luxo Dourado',
    bgStart: '#18181b',
    bgMiddle: '#27272a',
    bgEnd: '#09090b',
    headerBg: '#d4af37',
    headerText: '#18181b',
    accent: '#f59e0b',
    badgeBg: '#d4af37',
    badgeText: '#18181b',
    cardBg: '#27272a',
    cardBorder: '#d4af37',
    titleColor: '#fef3c7',
    textColor: '#f4f4f5',
    mutedColor: '#a1a1aa',
    priceBg: '#d4af37',
    priceText: '#18181b',
    footerBg: '#09090b',
    footerText: '#fef3c7',
    decorCircle: 'rgba(212, 175, 55, 0.08)',
  },
  lavender: {
    id: 'lavender',
    name: 'Lilás Romântico',
    bgStart: '#faf5ff',
    bgMiddle: '#f3e8ff',
    bgEnd: '#e9d5ff',
    headerBg: '#9333ea',
    headerText: '#ffffff',
    accent: '#7e22ce',
    badgeBg: '#db2777',
    badgeText: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: '#d8b4fe',
    titleColor: '#581c87',
    textColor: '#1f2937',
    mutedColor: '#6b7280',
    priceBg: '#9333ea',
    priceText: '#ffffff',
    footerBg: '#581c87',
    footerText: '#ffffff',
    decorCircle: 'rgba(147, 51, 234, 0.08)',
  },
  clean: {
    id: 'clean',
    name: 'Clean Elegante',
    bgStart: '#ffffff',
    bgMiddle: '#fdf8f6',
    bgEnd: '#f5ebe6',
    headerBg: '#f43f5e',
    headerText: '#ffffff',
    accent: '#e11d48',
    badgeBg: '#111827',
    badgeText: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    titleColor: '#111827',
    textColor: '#1f2937',
    mutedColor: '#6b7280',
    priceBg: '#f43f5e',
    priceText: '#ffffff',
    footerBg: '#111827',
    footerText: '#ffffff',
    decorCircle: 'rgba(244, 63, 94, 0.06)',
  },
};

const BADGE_PRESETS = [
  'OFERTA ESPECIAL',
  'NOVIDADE',
  'PRONTA ENTREGA',
  'BUQUÊ ETERNO',
  'DESTAQUE DA SEMANA',
  '',
];

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function getWrappedLines(ctx, text, maxWidth, maxLines = 2) {
  if (!text) return [];
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i += 1) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines - 1) {
        const remaining = [currentLine, ...words.slice(i + 1)].join(' ');
        let truncated = remaining;
        while (ctx.measureText(`${truncated}...`).width > maxWidth && truncated.length > 1) {
          truncated = truncated.slice(0, -1).trim();
        }
        currentLine = truncated.length < remaining.length ? `${truncated}...` : truncated;
        break;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.slice(0, maxLines);
}

function formatPriceDisplay(rawPrice) {
  if (!rawPrice && rawPrice !== 0) return '';
  const str = String(rawPrice).trim();
  const parsed = parseCurrency(str);
  if (parsed > 0) {
    return formatCurrency(parsed);
  }
  return str.startsWith('R$') ? str : `R$ ${str}`;
}

async function loadImageSafe(url) {
  if (!url) return null;

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      return await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
        img.src = objectUrl;
      });
    }
  } catch {
    // Fallback to standard Image load
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const PosterGeneratorModal = ({ isOpen, onClose, allProducts = [], initialSelectedIds = [] }) => {
  const canvasRef = useRef(null);
  const imageCacheRef = useRef(new Map());

  const [selectedIds, setSelectedIds] = useState([]);
  const [formatKey, setFormatKey] = useState('stories');
  const [themeKey, setThemeKey] = useState('rose');
  const [imageFit, setImageFit] = useState('contain');
  const [headline, setHeadline] = useState('Presentes & Ofertas Especiais');
  const [subheadline, setSubheadline] = useState('Pronta entrega e sob encomenda com todo carinho ✨');
  const [badgeText, setBadgeText] = useState('OFERTA ESPECIAL');
  const storeName = 'Eliane Importados';
  const [whatsapp, setWhatsapp] = useState('(63) 99295-2695');
  const [instagram, setInstagram] = useState('@elianeimportados1');
  const [locationText, setLocationText] = useState('Ananás – TO · Bairro 4 Bocas');
  const [showDescription, setShowDescription] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [showUnitPriceHighlight, setShowUnitPriceHighlight] = useState(true);
  const [unitSuffix, setUnitSuffix] = useState('cada'); // 'cada' | '/ unid.' | 'por item'
  const [unitNoticeText, setUnitNoticeText] = useState(
    '⚠️ Preço por unidade — cada produto é vendido separadamente (não é kit)'
  );
  const [customOverrides, setCustomOverrides] = useState({});
  const [rendering, setRendering] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileTab, setMobileTab] = useState('controls'); // 'controls' | 'preview'

  // Sync initial selection when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialSelectedIds && initialSelectedIds.length > 0) {
        setSelectedIds(initialSelectedIds.slice(0, 4));
      } else if (allProducts.length > 0) {
        setSelectedIds((prev) => (prev.length === 0 ? [allProducts[0].id] : prev));
      }
    }
  }, [isOpen, initialSelectedIds, allProducts]);

  const selectedProducts = selectedIds
    .map((id) => allProducts.find((p) => String(p.id) === String(id)))
    .filter(Boolean);

  // Build clickable interactive poster URL (/cartaz?...)
  const getClickablePosterUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    if (selectedIds.length > 0) {
      params.set('ids', selectedIds.join(','));
    }
    if (themeKey !== 'rose') {
      params.set('tema', themeKey);
    }
    if (headline && headline !== 'Presentes & Ofertas Especiais') {
      params.set('titulo', headline);
    }
    if (badgeText !== 'OFERTA ESPECIAL') {
      params.set('selo', badgeText);
    }
    if (!showUnitPriceHighlight) {
      params.set('unit', '0');
    } else if (unitSuffix) {
      params.set('suf', unitSuffix);
    }
    const activeOverrides = {};
    selectedIds.forEach((id) => {
      if (customOverrides[id]) {
        activeOverrides[id] = customOverrides[id];
      }
    });
    if (Object.keys(activeOverrides).length > 0) {
      params.set('ov', JSON.stringify(activeOverrides));
    }
    return `${baseUrl}/#/cartaz?${params.toString()}`;
  }, [selectedIds, themeKey, headline, badgeText, showUnitPriceHighlight, unitSuffix, customOverrides]);

  const toggleProductSelection = (id) => {
    setSelectedIds((prev) => {
      const exists = prev.some((item) => String(item) === String(id));
      if (exists) {
        return prev.filter((item) => String(item) !== String(id));
      }
      if (prev.length >= 4) {
        alert('Você pode selecionar no máximo 4 produtos por cartaz para manter a leitura perfeita.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleOverrideChange = (productId, field, value) => {
    setCustomOverrides((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value,
      },
    }));
  };

  const getCachedImage = useCallback(async (url) => {
    if (!url) return null;
    if (imageCacheRef.current.has(url)) {
      return imageCacheRef.current.get(url);
    }
    const img = await loadImageSafe(url);
    if (img) {
      imageCacheRef.current.set(url, img);
    }
    return img;
  }, []);

  const renderPoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setRendering(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const format = FORMATS[formatKey] || FORMATS.stories;
      const theme = THEMES[themeKey] || THEMES.rose;
      const W = format.width;
      const H = format.height;
      const isStories = formatKey === 'stories';

      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, theme.bgStart);
      bgGrad.addColorStop(0.5, theme.bgMiddle);
      bgGrad.addColorStop(1, theme.bgEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Decorative background circles
      ctx.fillStyle = theme.decorCircle;
      ctx.beginPath();
      ctx.arc(W * 0.9, H * 0.12, W * 0.32, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(W * 0.08, H * 0.82, W * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // 2. Load logo, product images & QR code (if enabled)
      const clickableUrl = getClickablePosterUrl();
      const qrApiUrl = showQrCode
        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(clickableUrl)}`
        : null;

      const [logoImg, qrImg, ...productImages] = await Promise.all([
        getCachedImage('/logo.png'),
        qrApiUrl ? getCachedImage(qrApiUrl) : Promise.resolve(null),
        ...selectedProducts.map((p) => getCachedImage(p.img)),
      ]);

      // 3. Header Section
      const headerTop = isStories ? 56 : 36;
      let cursorY = headerTop;

      const logoSize = isStories ? 86 : 70;
      ctx.save();
      ctx.font = `bold ${isStories ? 58 : 48}px "Dancing Script", cursive, sans-serif`;
      const storeNameWidth = ctx.measureText(storeName).width;
      const totalBrandWidth = (logoImg ? logoSize + 20 : 0) + storeNameWidth;
      const brandStartX = (W - totalBrandWidth) / 2;

      if (logoImg) {
        ctx.save();
        drawRoundedRect(ctx, brandStartX, cursorY, logoSize, logoSize, 20);
        ctx.clip();
        ctx.drawImage(logoImg, brandStartX, cursorY, logoSize, logoSize);
        ctx.restore();
      }

      ctx.fillStyle = theme.titleColor;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(
        storeName,
        brandStartX + (logoImg ? logoSize + 20 : 0),
        cursorY + logoSize / 2
      );
      ctx.restore();

      cursorY += logoSize + (isStories ? 26 : 16);

      // Badge pill (if any)
      if (badgeText && badgeText.trim()) {
        ctx.save();
        ctx.font = `800 ${isStories ? 26 : 22}px system-ui, -apple-system, sans-serif`;
        const textUpper = badgeText.trim().toUpperCase();
        const badgeW = ctx.measureText(textUpper).width + 56;
        const badgeH = isStories ? 48 : 40;
        const badgeX = (W - badgeW) / 2;

        ctx.fillStyle = theme.badgeBg;
        drawRoundedRect(ctx, badgeX, cursorY, badgeW, badgeH, badgeH / 2);
        ctx.fill();

        ctx.fillStyle = theme.badgeText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textUpper, W / 2, cursorY + badgeH / 2 + 1);
        ctx.restore();

        cursorY += badgeH + (isStories ? 22 : 14);
      }

      // Main Headline
      if (headline && headline.trim()) {
        ctx.save();
        ctx.font = `900 ${isStories ? 50 : 40}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = theme.titleColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const lines = getWrappedLines(ctx, headline.trim(), W - 120, 2);
        const lineHeight = isStories ? 58 : 46;
        lines.forEach((line) => {
          ctx.fillText(line, W / 2, cursorY);
          cursorY += lineHeight;
        });
        ctx.restore();
      }

      // Subheadline
      if (subheadline && subheadline.trim()) {
        cursorY += 4;
        ctx.save();
        ctx.font = `500 ${isStories ? 27 : 22}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = theme.mutedColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const subLines = getWrappedLines(ctx, subheadline.trim(), W - 140, 2);
        const subLineH = isStories ? 34 : 28;
        subLines.forEach((line) => {
          ctx.fillText(line, W / 2, cursorY);
          cursorY += subLineH;
        });
        ctx.restore();
      }

      cursorY += isStories ? 24 : 16;

      // 4. Footer & Unit Notice reservation
      const footerH = isStories ? 185 : 145;
      const footerY = H - footerH;
      const hasUnitBanner = showUnitPriceHighlight && unitNoticeText && unitNoticeText.trim();
      const unitBannerH = hasUnitBanner ? (isStories ? 52 : 42) : 0;
      const unitBannerY = footerY - unitBannerH - (hasUnitBanner ? (isStories ? 14 : 10) : 0);

      // 5. Products Content Area
      const contentTop = cursorY;
      const contentBottom = (hasUnitBanner ? unitBannerY : footerY) - (isStories ? 20 : 14);
      const contentH = Math.max(260, contentBottom - contentTop);
      const padX = isStories ? 56 : 48;
      const contentW = W - padX * 2;
      const count = selectedProducts.length;

      const drawProductCard = (product, img, x, y, w, h, isCompact = false) => {
        const override = customOverrides[product.id] || {};
        const displayName = override.nome !== undefined ? override.nome : product.nome;
        const displayPrice = formatPriceDisplay(
          override.preco !== undefined ? override.preco : product.preco
        );
        const oldPrice = override.precoAntigo
          ? formatPriceDisplay(override.precoAntigo)
          : '';
        const displayDesc =
          override.descricao !== undefined ? override.descricao : product.descricao;

        ctx.save();

        // Card shadow & background
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = theme.cardBg;
        drawRoundedRect(ctx, x, y, w, h, 28);
        ctx.fill();

        // Card border
        ctx.shadowColor = 'transparent';
        ctx.lineWidth = 3;
        ctx.strokeStyle = theme.cardBorder;
        drawRoundedRect(ctx, x, y, w, h, 28);
        ctx.stroke();

        const innerPad = isCompact ? 18 : 28;
        const textSectionH = isCompact
          ? (isStories ? 165 : 138)
          : (showDescription && displayDesc ? (isStories ? 250 : 205) : (isStories ? 195 : 165));

        const imgBoxX = x + innerPad;
        const imgBoxY = y + innerPad;
        const imgBoxW = w - innerPad * 2;
        const imgBoxH = Math.max(110, h - textSectionH - innerPad * 1.5);

        ctx.fillStyle = themeKey === 'luxury' ? '#18181b' : '#f9fafb';
        drawRoundedRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 20);
        ctx.fill();

        if (img) {
          ctx.save();
          drawRoundedRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 20);
          ctx.clip();

          const imgRatio = img.width / img.height;
          const boxRatio = imgBoxW / imgBoxH;
          let drawW = imgBoxW;
          let drawH = imgBoxH;
          let drawX = imgBoxX;
          let drawY = imgBoxY;

          if (imageFit === 'cover') {
            if (imgRatio > boxRatio) {
              drawH = imgBoxH;
              drawW = imgBoxH * imgRatio;
              drawX = imgBoxX - (drawW - imgBoxW) / 2;
            } else {
              drawW = imgBoxW;
              drawH = imgBoxW / imgRatio;
              drawY = imgBoxY - (drawH - imgBoxH) / 2;
            }
          } else {
            const padImg = isCompact ? 10 : 16;
            const availW = imgBoxW - padImg * 2;
            const availH = imgBoxH - padImg * 2;
            if (imgRatio > availW / availH) {
              drawW = availW;
              drawH = availW / imgRatio;
            } else {
              drawH = availH;
              drawW = availH * imgRatio;
            }
            drawX = imgBoxX + (imgBoxW - drawW) / 2;
            drawY = imgBoxY + (imgBoxH - drawH) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();
        } else {
          ctx.fillStyle = theme.mutedColor;
          ctx.font = '500 24px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Sem imagem', imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2);
        }

        if (product.categoria && (!isCompact || isStories)) {
          ctx.save();
          ctx.font = `700 ${isCompact ? 18 : 22}px system-ui, sans-serif`;
          const catLabel = String(product.categoria).toUpperCase();
          const catW = ctx.measureText(catLabel).width + 28;
          const catH = isCompact ? 32 : 38;
          ctx.fillStyle = 'rgba(17, 24, 39, 0.75)';
          drawRoundedRect(ctx, imgBoxX + 12, imgBoxY + 12, catW, catH, catH / 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(catLabel, imgBoxX + 12 + catW / 2, imgBoxY + 12 + catH / 2 + 1);
          ctx.restore();
        }

        let textY = imgBoxY + imgBoxH + (isCompact ? 16 : 22);
        const titleFontSize = isCompact
          ? (isStories ? 28 : 24)
          : (isStories ? 40 : 34);
        ctx.font = `800 ${titleFontSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = theme.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const titleLines = getWrappedLines(ctx, displayName, w - innerPad * 2, 2);
        const titleLineH = Math.round(titleFontSize * 1.2);
        titleLines.forEach((line) => {
          ctx.fillText(line, x + w / 2, textY);
          textY += titleLineH;
        });

        if (!isCompact && showDescription && displayDesc) {
          textY += 6;
          const descFontSize = isStories ? 24 : 20;
          ctx.font = `400 ${descFontSize}px system-ui, -apple-system, sans-serif`;
          ctx.fillStyle = theme.mutedColor;
          const descLines = getWrappedLines(ctx, displayDesc, w - innerPad * 2.5, 2);
          descLines.forEach((line) => {
            ctx.fillText(line, x + w / 2, textY);
            textY += Math.round(descFontSize * 1.25);
          });
        }

        if (displayPrice) {
          const pricePillH = isCompact ? (isStories ? 52 : 44) : (isStories ? 68 : 58);
          const pricePillY = y + h - innerPad - pricePillH;

          if (oldPrice) {
            ctx.save();
            const labelFontSize = isCompact ? 17 : 21;
            ctx.font = `700 ${labelFontSize}px system-ui, sans-serif`;
            ctx.fillStyle = theme.mutedColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`De ${oldPrice} por:`, x + w / 2, pricePillY - 5);
            ctx.restore();
          }

          const finalPriceText =
            showUnitPriceHighlight && unitSuffix
              ? `${displayPrice} ${unitSuffix}`
              : displayPrice;

          const priceFontSize = isCompact ? (isStories ? 28 : 23) : (isStories ? 40 : 34);
          ctx.font = `900 ${priceFontSize}px system-ui, -apple-system, sans-serif`;
          const priceW = Math.min(
            w - innerPad * 2,
            Math.max(ctx.measureText(finalPriceText).width + 56, isCompact ? 180 : 250)
          );
          const priceX = x + (w - priceW) / 2;

          ctx.fillStyle = theme.priceBg;
          drawRoundedRect(ctx, priceX, pricePillY, priceW, pricePillH, pricePillH / 2);
          ctx.fill();

          ctx.fillStyle = theme.priceText;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(finalPriceText, x + w / 2, pricePillY + pricePillH / 2 + 2);
        }

        ctx.restore();
      };

      const gap = isStories ? 26 : 22;

      if (count === 0) {
        ctx.fillStyle = theme.mutedColor;
        ctx.font = '600 32px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Selecione de 1 a 4 produtos ao lado', W / 2, contentTop + contentH / 2);
      } else if (count === 1) {
        drawProductCard(
          selectedProducts[0],
          productImages[0],
          padX,
          contentTop,
          contentW,
          contentH,
          false
        );
      } else if (count === 2) {
        if (isStories) {
          const cardH = (contentH - gap) / 2;
          drawProductCard(selectedProducts[0], productImages[0], padX, contentTop, contentW, cardH, true);
          drawProductCard(selectedProducts[1], productImages[1], padX, contentTop + cardH + gap, contentW, cardH, true);
        } else {
          const cardW = (contentW - gap) / 2;
          drawProductCard(selectedProducts[0], productImages[0], padX, contentTop, cardW, contentH, true);
          drawProductCard(selectedProducts[1], productImages[1], padX + cardW + gap, contentTop, cardW, contentH, true);
        }
      } else if (count === 3) {
        const topH = Math.round((contentH - gap) * 0.5);
        const bottomH = contentH - gap - topH;
        const bottomCardW = (contentW - gap) / 2;

        drawProductCard(selectedProducts[0], productImages[0], padX, contentTop, contentW, topH, true);
        drawProductCard(
          selectedProducts[1],
          productImages[1],
          padX,
          contentTop + topH + gap,
          bottomCardW,
          bottomH,
          true
        );
        drawProductCard(
          selectedProducts[2],
          productImages[2],
          padX + bottomCardW + gap,
          contentTop + topH + gap,
          bottomCardW,
          bottomH,
          true
        );
      } else {
        const cardW = (contentW - gap) / 2;
        const cardH = (contentH - gap) / 2;
        for (let i = 0; i < 4; i += 1) {
          const col = i % 2;
          const row = Math.floor(i / 2);
          drawProductCard(
            selectedProducts[i],
            productImages[i],
            padX + col * (cardW + gap),
            contentTop + row * (cardH + gap),
            cardW,
            cardH,
            true
          );
        }
      }

      // 5.5 Unit Price Notice Banner (above footer)
      if (hasUnitBanner) {
        ctx.save();
        ctx.fillStyle = themeKey === 'luxury' ? '#3f3f46' : '#fffbeb';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        drawRoundedRect(ctx, padX, unitBannerY, contentW, unitBannerH, unitBannerH / 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = `800 ${isStories ? 22 : 19}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = themeKey === 'luxury' ? '#fde047' : '#92400e';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unitNoticeText.trim(), W / 2, unitBannerY + unitBannerH / 2 + 1);
        ctx.restore();
      }

      // 6. Footer Bar (with Store CTA + optional QR Code)
      ctx.save();
      ctx.fillStyle = theme.footerBg;
      ctx.fillRect(0, footerY, W, footerH);

      const qrSize = isStories ? 136 : 112;
      const qrPad = isStories ? 24 : 16;
      const textCenterX = qrImg ? (W - qrSize - qrPad * 2) / 2 + 20 : W / 2;

      if (qrImg) {
        const qrX = W - qrSize - (isStories ? 44 : 32);
        const qrY = footerY + (footerH - qrSize) / 2;
        ctx.fillStyle = '#ffffff';
        drawRoundedRect(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 14);
        ctx.fill();
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      }

      // Line 0: Store CTA pill inside footer
      const ctaY = footerY + (isStories ? 42 : 34);
      ctx.font = `800 ${isStories ? 25 : 21}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        qrImg
          ? '🛍️ Aponte a câmera para o QR Code ou clique no link da postagem!'
          : '🛍️ Clique no link da postagem para comprar direto na loja!',
        textCenterX,
        ctaY
      );

      // Line 1: WhatsApp & Instagram
      const contactParts = [];
      if (whatsapp && whatsapp.trim()) contactParts.push(`📱 WhatsApp: ${whatsapp.trim()}`);
      if (instagram && instagram.trim()) contactParts.push(`📸 Insta: ${instagram.trim()}`);
      const contactLine = contactParts.join('   •   ');

      ctx.font = `700 ${isStories ? 28 : 23}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = theme.footerText;
      ctx.fillText(
        contactLine,
        textCenterX,
        footerY + footerH / 2 + (isStories ? 8 : 6)
      );

      // Line 2: Location
      if (locationText && locationText.trim()) {
        ctx.font = `500 ${isStories ? 22 : 18}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(
          `📍 ${locationText.trim()}`,
          textCenterX,
          footerY + footerH - (isStories ? 32 : 24)
        );
      }

      ctx.restore();
    } catch (err) {
      console.error('Erro ao renderizar cartaz:', err);
    } finally {
      setRendering(false);
    }
  }, [
    formatKey,
    themeKey,
    imageFit,
    headline,
    subheadline,
    badgeText,
    storeName,
    whatsapp,
    instagram,
    locationText,
    showDescription,
    showQrCode,
    showUnitPriceHighlight,
    unitSuffix,
    unitNoticeText,
    selectedProducts,
    customOverrides,
    getCachedImage,
    getClickablePosterUrl,
  ]);

  useEffect(() => {
    if (isOpen) {
      renderPoster();
    }
  }, [isOpen, renderPoster]);

  if (!isOpen) return null;

  const clickablePosterUrl = getClickablePosterUrl();

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const slug = selectedProducts.length === 1
      ? selectedProducts[0].nome.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : `vitrine-${selectedProducts.length}-produtos`;
    link.download = `cartaz-${formatKey}-${slug}.png`;
    link.href = dataUrl;
    link.click();
  };

  const generateCaption = () => {
    const itemsLines = selectedProducts.map((p) => {
      const ov = customOverrides[p.id] || {};
      const name = ov.nome !== undefined ? ov.nome : p.nome;
      const price = formatPriceDisplay(ov.preco !== undefined ? ov.preco : p.preco);
      const unitTag = showUnitPriceHighlight ? ` (${unitSuffix || 'por unidade'})` : '';
      return `✨ ${name}${price ? ` — ${price}${unitTag}` : ''}`;
    });

    return [
      `🌸 *${headline || 'Novidades na Eliane Importados'}* 🌸`,
      subheadline ? `${subheadline}\n` : '',
      ...itemsLines,
      showUnitPriceHighlight
        ? `\n⚠️ *Atenção: Valores referentes a cada produto individualmente (preço por unidade, itens vendidos separadamente).*`
        : '',
      '',
      `🛍️ *Clique no Cartaz Interativo para ver e comprar na loja:*`,
      clickablePosterUrl,
      '',
      whatsapp ? `📲 WhatsApp: ${whatsapp}` : '',
      locationText ? `📍 ${locationText}` : '',
      '',
      '#ElianeImportados #PresentesCriativos #BuqueEterno #AnanasTO #Ofertas',
    ]
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n');
  };

  const handleShareImageOnly = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
      if (!blob) return;
      const file = new File([blob], `cartaz-eliane-importados-${formatKey}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        handleDownload();
      }
    }
  };

  const handleShareWithLink = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
      if (!blob) return;
      const file = new File([blob], `cartaz-eliane-importados-${formatKey}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: headline || 'Eliane Importados',
          text: generateCaption(),
          url: clickablePosterUrl,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        handleDownload();
      }
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generateCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar legenda:', err);
    }
  };

  const handleCopyClickableLink = async () => {
    try {
      await navigator.clipboard.writeText(clickablePosterUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar link do cartaz:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-0 sm:p-4">
      <div className="bg-white sm:rounded-2xl shadow-2xl w-full max-w-7xl h-dvh sm:h-auto sm:max-h-[95vh] flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-rose-600 text-white shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base sm:text-xl font-bold flex items-center gap-2 truncate">
              🎨 Estúdio de Cartazes & Vitrine Clicável
            </h2>
            <p className="text-[11px] sm:text-sm text-rose-100 line-clamp-1">
              Gere a arte para Instagram/WhatsApp + Link do Cartaz Digital Clicável
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-rose-700 hover:bg-rose-800 w-9 h-9 flex items-center justify-center text-white transition cursor-pointer shrink-0"
            aria-label="Fechar gerador de cartaz"
          >
            ✕
          </button>
        </div>

        {/* Mobile Tab Switcher (Visible on phones/tablets < lg) */}
        <div className="grid grid-cols-2 lg:hidden bg-rose-50 border-b border-rose-200 p-1.5 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('controls')}
            className={`py-2 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mobileTab === 'controls'
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-900 hover:bg-rose-100'
            }`}
          >
            ⚙️ 1. Editar Opções ({selectedProducts.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`py-2 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-900 hover:bg-rose-100'
            }`}
          >
            👁️ 2. Ver Cartaz & Baixar
          </button>
        </div>

        {/* Main Studio Body */}
        <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50">
          {/* Left Column: Controls */}
          <div
            className={`${
              mobileTab === 'controls' ? 'block' : 'hidden lg:block'
            } lg:col-span-7 space-y-4 sm:space-y-5 pb-4`}
          >
            {/* Clickable Web Poster Highlight Box */}
            <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-xl space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-rose-950 text-sm flex items-center gap-1.5">
                    🔗 Link do Cartaz Digital Clicável (Encaminha para a Loja)
                  </h3>
                  <p className="text-xs text-rose-800">
                    Envie este link junto com a imagem no WhatsApp ou cole no adesivo de Link dos Stories! Quando o cliente abrir, cada produto do cartaz é clicável e leva direto à compra.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={clickablePosterUrl}
                  className="flex-1 text-xs bg-white border border-rose-300 rounded-lg px-3 py-2 text-gray-700 font-mono select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyClickableLink}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold whitespace-nowrap transition cursor-pointer shadow-sm"
                >
                  {copiedLink ? '✓ Link Copiado!' : '📋 Copiar Link Clicável'}
                </button>
                <a
                  href={clickablePosterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold whitespace-nowrap text-center transition shadow-sm"
                >
                  🌐 Abrir Cartaz Clicável ↗
                </a>
              </div>
            </div>

            {/* 1. Format & Theme */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                1. Formato e Estilo Visual
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(FORMATS).map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormatKey(fmt.id)}
                    className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${
                      formatKey === fmt.id
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{fmt.label}</div>
                    <div className="text-xs text-gray-500">{fmt.subtitle}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Tema de Cores
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeKey(t.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                        themeKey === t.id
                          ? 'border-rose-600 ring-2 ring-rose-200 bg-rose-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                        style={{ background: t.headerBg }}
                      />
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Enquadramento da foto:</span>
                  <button
                    type="button"
                    onClick={() => setImageFit('contain')}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                      imageFit === 'contain'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Inteira (Contain)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageFit('cover')}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                      imageFit === 'cover'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Preencher (Cover)
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  Incluir QR Code para a loja na arte
                </label>

                {selectedProducts.length === 1 && (
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDescription}
                      onChange={(e) => setShowDescription(e.target.checked)}
                      className="rounded text-rose-600"
                    />
                    Mostrar descrição do produto
                  </label>
                )}
              </div>

              {/* Unit Price Highlight Box */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showUnitPriceHighlight}
                      onChange={(e) => setShowUnitPriceHighlight(e.target.checked)}
                      className="rounded text-rose-600"
                    />
                    ⚠️ Destacar &ldquo;Preço por Unidade / Produto Individual&rdquo; (evitar confusão com Kit)
                  </label>

                  {showUnitPriceHighlight && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gray-600">Texto junto ao preço:</span>
                      {['cada', '/ unid.'].map((suf) => (
                        <button
                          key={suf}
                          type="button"
                          onClick={() => setUnitSuffix(suf)}
                          className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition ${
                            unitSuffix === suf
                              ? 'bg-rose-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {suf}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {showUnitPriceHighlight && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                      Aviso de venda unitária no rodapé da arte:
                    </label>
                    <input
                      type="text"
                      value={unitNoticeText}
                      onChange={(e) => setUnitNoticeText(e.target.value)}
                      placeholder="Ex: ⚠️ Preço por unidade — cada produto é vendido separadamente (não é kit)"
                      className="w-full text-xs border border-amber-300 bg-amber-50/40 rounded-lg px-3 py-1.5 text-gray-800 font-medium"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 2. Product Multi-Selector (1 to 4 products) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                  2. Produtos no Cartaz ({selectedProducts.length}/4 selecionados)
                </h3>
                {selectedProducts.length > 1 && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    Modo Encarte ({selectedProducts.length} produtos)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {allProducts.map((prod) => {
                  const isSelected = selectedIds.some((id) => String(id) === String(prod.id));
                  const orderIndex = selectedIds.findIndex((id) => String(id) === String(prod.id));
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => toggleProductSelection(prod.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-400'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={prod.img}
                          alt={prod.nome}
                          className="w-11 h-11 rounded object-cover bg-gray-100 border"
                        />
                        {isSelected && (
                          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow">
                            {orderIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{prod.nome}</p>
                        <p className="text-xs text-rose-600 font-semibold">
                          {formatPriceDisplay(prod.preco)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Overrides for selected products */}
              {selectedProducts.length > 0 && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-500">
                    Ajuste rápido de preço ou promoção apenas para este cartaz (opcional):
                  </p>
                  <div className="space-y-2">
                    {selectedProducts.map((prod, idx) => {
                      const ov = customOverrides[prod.id] || {};
                      return (
                        <div
                          key={prod.id}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
                        >
                          <span className="sm:col-span-5 text-xs font-semibold text-gray-700 truncate">
                            #{idx + 1} {prod.nome}
                          </span>
                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              placeholder="Preço 'De' (opcional)"
                              value={ov.precoAntigo ?? ''}
                              onChange={(e) =>
                                handleOverrideChange(prod.id, 'precoAntigo', e.target.value)
                              }
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              placeholder="Preço no cartaz"
                              value={ov.preco !== undefined ? ov.preco : prod.preco}
                              onChange={(e) =>
                                handleOverrideChange(prod.id, 'preco', e.target.value)
                              }
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white font-semibold text-rose-700"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Texts, Badge & Contact */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                3. Textos, Selo e Rodapé
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Selo de Destaque
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {BADGE_PRESETS.map((preset) => (
                    <button
                      key={preset || 'none'}
                      type="button"
                      onClick={() => setBadgeText(preset)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                        badgeText === preset
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {preset || 'Sem selo'}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Ou digite um selo personalizado..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Subtítulo / Chamada
                  </label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Canvas Preview & Export Buttons */}
          <div
            className={`${
              mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
            } lg:col-span-5 flex-col items-center justify-between bg-gray-900 rounded-xl p-4 text-white`}
          >
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Pré-visualização em Tempo Real
              </span>
              {rendering && (
                <span className="text-xs text-rose-400 animate-pulse">Atualizando arte...</span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center w-full my-2 overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-h-[52vh] w-auto max-w-full rounded-lg shadow-2xl border border-white/10 bg-white"
              />
            </div>

            {/* Export & Caption Actions */}
            <div className="w-full space-y-2.5 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleShareImageOnly}
                  disabled={selectedProducts.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 font-bold text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  📸 Compartilhar Só PNG (Stories / Status)
                </button>
                <button
                  type="button"
                  onClick={handleShareWithLink}
                  disabled={selectedProducts.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 font-bold text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  📲 Compartilhar PNG + Link (Conversas)
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={selectedProducts.length === 0}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 font-bold text-white shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                ⬇️ Baixar Imagem (PNG) no Aparelho
              </button>

              <button
                type="button"
                onClick={handleCopyClickableLink}
                disabled={selectedProducts.length === 0}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {copiedLink
                  ? '✅ Link do Cartaz Clicável copiado!'
                  : '🔗 Copiar Link do Cartaz Clicável (Direto para a Loja)'}
              </button>

              <button
                type="button"
                onClick={handleCopyCaption}
                disabled={selectedProducts.length === 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs sm:text-sm font-semibold text-gray-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedCaption
                  ? '✅ Legenda + Link copiados para a área de transferência!'
                  : '📋 Copiar Legenda Pronta (com Preços + Link da Loja)'}
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Footer Bar (< lg) */}
        <div className="lg:hidden border-t border-gray-200 bg-white px-3 py-2.5 flex items-center gap-2 shrink-0">
          {mobileTab === 'controls' ? (
            <>
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                👁️ Ver Cartaz Pronto & Baixar / Compartilhar →
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMobileTab('controls')}
                className="py-2.5 px-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer shrink-0"
              >
                ← Opções
              </button>
              <button
                type="button"
                onClick={handleShareImageOnly}
                disabled={selectedProducts.length === 0}
                className="flex-1 py-2.5 px-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs shadow cursor-pointer truncate"
              >
                📸 Só PNG (Stories)
              </button>
              <button
                type="button"
                onClick={handleShareWithLink}
                disabled={selectedProducts.length === 0}
                className="flex-1 py-2.5 px-2.5 rounded-xl bg-green-600 text-white font-bold text-xs shadow cursor-pointer truncate"
              >
                📲 PNG + Link
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterGeneratorModal;
