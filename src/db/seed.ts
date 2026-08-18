import { db } from './index';
import { products } from './schema';

async function main() {
  console.log('Seeding GOSU local database with original Framer assets...');

  console.log('Cleaning old products...');
  try {
    await db.delete(products);
  } catch (err) {
    console.log('Table might not exist yet.');
  }

  const items = [
    {
      slug: 'board-game-sleeves',
      nameEs: 'Fundas para Juegos de Mesa GOSU® (Board Game Sleeves)',
      nameEn: 'GOSU® Board Game Sleeves',
      descriptionEs: 'Protege y extiende la vida de tus juegos de mesa. Hechas de material ultra resistente de 100 micras, totalmente transparentes.',
      descriptionEn: 'Protect and extend the life of your board games. Made from ultra-durable 100-micron material, totally clear.',
      price: 15.00,
      category: 'board-sleeves',
      image: '/assets/images/image-4f57375b.jpg',
      stock: 150,
      colorsEs: 'Transparente',
      colorsEn: 'Clear',
      detailsEs: 'Paquete de 102 unidades|100 micras de grosor|Libres de PVC y Ácido|Diferentes tamaños disponibles',
      detailsEn: '102 PCS per pack|100 microns of thickness|PVC-FREE & ACID-FREE|Different sizes according to games',
    },
    {
      slug: 'tcg-sleeves-standard',
      nameEs: 'Sleeves TCG GOSU® - Tamaño Estándar Matte',
      nameEn: 'GOSU® TCG Sleeves - Standard Size Matte',
      descriptionEs: 'Sleeves premium de 140 micras con frente ultra transparente y reverso mate con textura especial para un barajado insuperable.',
      descriptionEn: 'Premium 140-micron sleeves with ultra-clear front and textured matte back for smooth shuffling.',
      price: 25.00,
      category: 'tcg-sleeves',
      image: '/assets/images/image-52e660c6.jpg',
      stock: 300,
      colorsEs: 'Negro, Azul, Rojo, Verde, Morado, Blanco',
      colorsEn: 'Black, Blue, Red, Green, Purple, White',
      detailsEs: 'Paquete de 102 unidades|140 micras de grosor|Reverso mate de fácil barajado|Para Magic, Pokémon, One Piece|Libres de PVC y Ácido',
      detailsEn: '102 PCS per pack|140 microns thickness|Textured matte back for smooth shuffle|For Magic, Pokemon, One Piece|PVC-FREE & ACID-FREE',
    },
    {
      slug: 'tcg-sleeves-japanese',
      nameEs: 'Sleeves TCG GOSU® - Tamaño Japonés Matte',
      nameEn: 'GOSU® TCG Sleeves - Japanese Size Matte',
      descriptionEs: 'Diseñados con el ajuste perfecto para cartas de Yu-Gi-Oh!, Cardfight!! Vanguard y más. 140 micras de puro rendimiento.',
      descriptionEn: 'Designed with a perfect fit for Yu-Gi-Oh!, Cardfight!! Vanguard and more. 140 microns of pure performance.',
      price: 22.00,
      category: 'tcg-sleeves',
      image: '/assets/images/image-d02d8bfe.jpg',
      stock: 200,
      colorsEs: 'Negro, Blanco, Rojo, Azul, Rosado, Morado',
      colorsEn: 'Black, White, Red, Blue, Pink, Purple',
      detailsEs: 'Paquete de 102 unidades|140 micras de grosor|Tamaño Japonés específico|Reverso mate texturizado|Libres de PVC y Ácido',
      detailsEn: '102 PCS per pack|140 microns thickness|Specific Japanese size|Textured matte back|PVC-FREE & ACID-FREE',
    },
    {
      slug: 'inner-sleeves',
      nameEs: 'Inner Sleeves GOSU® (Fundas Internas)',
      nameEn: 'GOSU® Inner Sleeves',
      descriptionEs: 'Fundas duras de 140 micras diseñadas para encajar perfectamente dentro de tus fundas estándar de color, protegiendo el arte de la carta.',
      descriptionEn: 'Hard 140-micron sleeves designed to fit perfectly inside standard color sleeves, protecting card art.',
      price: 12.00,
      category: 'inner-over',
      image: '/assets/images/image-cbe9164e.png',
      stock: 500,
      colorsEs: 'Transparente',
      colorsEn: 'Clear',
      detailsEs: 'Funda dura de 140 micras|102 sleeves por paquete|Frente transparente, reverso mate transparente|Libres de PVC y Ácido',
      detailsEn: 'Hard 140-micron sleeve|102 sleeves per pack|Clear front, matte clear back|PVC-FREE & ACID-FREE',
    },
    {
      slug: 'over-sleeves',
      nameEs: 'Over Sleeves GOSU® (Fundas Externas)',
      nameEn: 'GOSU® Over Sleeves',
      descriptionEs: 'Ajuste perfecto de 100 micras. Se colocan sobre tus sleeves normales para añadir una capa extra de protección y mantenerlos nuevos.',
      descriptionEn: 'Perfect 100-micron fit. Placed over normal sleeves to add an extra layer of protection and keep them brand new.',
      price: 14.00,
      category: 'inner-over',
      image: '/assets/images/image-f5e8b751.png',
      stock: 400,
      colorsEs: 'Transparente',
      colorsEn: 'Clear',
      detailsEs: 'Funda protectora externa de 100 micras|102 fundas por paquete|Totalmente transparente|Libres de PVC y Ácido',
      detailsEn: 'Outer protective 100-micron sleeve|102 sleeves per pack|Totally clear|PVC-FREE & ACID-FREE',
    },
    {
      slug: '9-pocket-pro-binder',
      nameEs: 'PRO-Binder GOSU® - Carpeta de 9 Bolsillos',
      nameEn: 'GOSU® 9-Pocket PRO-Binder',
      descriptionEs: 'Carpeta de carga lateral premium con capacidad para 360 cartas. El fondo de malla negra central enmarca tus cartas de manera elegante.',
      descriptionEn: 'Premium side-loading folder holding up to 360 cards. The central black web background frames cards elegantly.',
      price: 65.00,
      category: 'binders',
      image: '/assets/images/image-3a743382.jpg',
      stock: 80,
      colorsEs: 'Negro, Azul, Rojo, Verde, Blanco',
      colorsEn: 'Black, Blue, Red, Green, White',
      detailsEs: 'PRO-Binder de 9 bolsillos (360 cartas)|Carga lateral anti-caídas|Correa elástica de cierre seguro|Material libre de PVC y Ácido',
      detailsEn: '9-pocket PRO-Binder (360 cards)|Side-loading anti-fall design|Elastic strap for secure closure|PVC-FREE & ACID-FREE material',
    },
    {
      slug: 'premium-deck-box',
      nameEs: 'Premium Deck Box GOSU® (Portamazos)',
      nameEn: 'GOSU® Premium Deck Box',
      descriptionEs: 'Caja portamazos fabricada en cuero sintético de alta resistencia con cierre magnético y doble muesca para un acceso rápido y seguro.',
      descriptionEn: 'Deck box crafted from high-resistance leatherette with a strong magnetic closure and dual notches for quick, secure access.',
      price: 85.00,
      category: 'deckboxes',
      image: '/assets/images/image-113ac3f9.png',
      stock: 120,
      colorsEs: 'Negro, Rojo, Azul, Verde, Blanco',
      colorsEn: 'Black, Red, Blue, Green, White',
      detailsEs: 'Capacidad para 100 cartas con doble funda|Cierre magnético con bloqueo|Acabado en cuero sintético premium|Muescas de extracción rápida',
      detailsEn: 'Stores 100 double-sleeved cards|Magnetic closure with lock|Premium leatherette finish|Dual thumb extraction notches',
    },
  ];

  for (const item of items) {
    await db.insert(products).values(item);
  }

  console.log('Seeding completed successfully!');
}

main().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
