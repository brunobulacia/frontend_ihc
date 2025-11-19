export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const SITE_CONFIG = {
  name: 'CambaEats',
  description: 'Comida deliciosa al instante',
  slogan: 'Selecciona tu ubicación, ordena tu pedido desde nuestro menú y recíbelo en tu puerta de la manera más rápida y fácil posible.',
};

export const FEATURES = [
  {
    id: 1,
    title: 'Fácil y Seguro',
    description: 'Paga con QR o realiza reposiciones inmediatas',
    icon: 'shield',
    color: 'green',
  },
  {
    id: 2,
    title: 'Rápido y Fresco',
    description: 'Tu pedido llega en 30 minutos o menos',
    icon: 'clock',
    color: 'yellow',
  },
  {
    id: 3,
    title: 'Entrega a Domicilio',
    description: 'Con seguimiento en tiempo real las 24/7',
    icon: 'delivery',
    color: 'red',
  },
] as const;
