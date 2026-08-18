import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon PostgreSQL database...');

  // 1. Create or update Categories
  const catBoard = await prisma.categoria.upsert({
    where: { slug: 'board-sleeves' },
    update: { nombre: 'Fundas para Juegos de Mesa' },
    create: { nombre: 'Fundas para Juegos de Mesa', slug: 'board-sleeves' },
  });

  const catTcg = await prisma.categoria.upsert({
    where: { slug: 'tcg-sleeves' },
    update: { nombre: 'Sleeves TCG Matte' },
    create: { nombre: 'Sleeves TCG Matte', slug: 'tcg-sleeves' },
  });

  const catBinders = await prisma.categoria.upsert({
    where: { slug: 'binders' },
    update: { nombre: 'Carpetas & Binders' },
    create: { nombre: 'Carpetas & Binders', slug: 'binders' },
  });

  const catDeckboxes = await prisma.categoria.upsert({
    where: { slug: 'deckboxes' },
    update: { nombre: 'Deck Boxes' },
    create: { nombre: 'Deck Boxes', slug: 'deckboxes' },
  });

  // 2. Create Board Game Sleeves product with variants
  const prodBoard = await prisma.producto.upsert({
    where: { slug: 'board-game-sleeves-clear' },
    update: {
      nombre: 'Fundas para Juegos de Mesa GOSU®',
      descripcion: 'Protección ultra resistente de 100 micras totalmente transparente, libre de ácido y PVC para tus cartas de juegos de mesa favoritos.',
      precioBase: 15.0,
      imagenes: [
        '/assets/images/image-4f57375b.jpg',
        '/assets/images/image-6800b5c8.png',
        '/assets/images/image-dee03b08.png',
      ],
      seoTitle: 'Fundas para Juegos de Mesa GOSU® 100 Micras | Protección Premium',
      seoDescription: 'Fundas de 100 micras ultra transparentes libres de ácido y PVC. Disponibles en tamaños Mini USA, Standard USA, Mini Euro y Chimera.',
      seoKeywords: 'fundas juegos de mesa, board game sleeves, gosu sleeves, mini usa, standard usa',
      categoriaId: catBoard.id,
    },
    create: {
      nombre: 'Fundas para Juegos de Mesa GOSU®',
      slug: 'board-game-sleeves-clear',
      descripcion: 'Protección ultra resistente de 100 micras totalmente transparente, libre de ácido y PVC para tus cartas de juegos de mesa favoritos.',
      precioBase: 15.0,
      imagenes: [
        '/assets/images/image-4f57375b.jpg',
        '/assets/images/image-6800b5c8.png',
        '/assets/images/image-dee03b08.png',
      ],
      seoTitle: 'Fundas para Juegos de Mesa GOSU® 100 Micras | Protección Premium',
      seoDescription: 'Fundas de 100 micras ultra transparentes libres de ácido y PVC. Disponibles en tamaños Mini USA, Standard USA, Mini Euro y Chimera.',
      seoKeywords: 'fundas juegos de mesa, board game sleeves, gosu sleeves, mini usa, standard usa',
      categoriaId: catBoard.id,
    },
  });

  // Create variants for Board Game Sleeves
  const boardVariants = [
    { sku: 'GOSU-BG-MINIUSA', titulo: 'Transparente / Mini USA (41x63mm)', precio: 15.0, stock: 350 },
    { sku: 'GOSU-BG-STDUSA', titulo: 'Transparente / Standard USA (56x87mm)', precio: 15.0, stock: 280 },
    { sku: 'GOSU-BG-MINIEURO', titulo: 'Transparente / Mini Euro (45x68mm)', precio: 15.0, stock: 200 },
    { sku: 'GOSU-BG-CHIMERA', titulo: 'Transparente / Mini Chimera (43x65mm)', precio: 15.0, stock: 150 },
  ];

  for (const v of boardVariants) {
    await prisma.variante.upsert({
      where: { sku: v.sku },
      update: { titulo: v.titulo, precio: v.precio, stock: v.stock, productoId: prodBoard.id },
      create: { sku: v.sku, titulo: v.titulo, precio: v.precio, stock: v.stock, productoId: prodBoard.id },
    });
  }

  // 3. Create TCG Sleeves product
  const prodTcg = await prisma.producto.upsert({
    where: { slug: 'tcg-sleeves-standard-matte' },
    update: {
      nombre: 'Sleeves TCG GOSU® Standard Matte',
      descripcion: 'Sleeves de 140 micras con textura mate trasera para un shuffle perfecto en juegos como Magic: The Gathering, Pokémon y Lorcana.',
      precioBase: 25.0,
      imagenes: [
        '/assets/images/image-52e660c6.jpg',
        '/assets/images/image-3a743382.jpg',
      ],
      seoTitle: 'Sleeves TCG GOSU® Standard Matte 140 Micras | Magic & Pokémon',
      seoDescription: 'Sleeves de reverso mate texturizado de 140 micras para jugadores competitivos de TCG. Excelente durabilidad.',
      seoKeywords: 'tcg sleeves, sleeves magic, sleeves pokemon, gosu matte sleeves',
      categoriaId: catTcg.id,
    },
    create: {
      nombre: 'Sleeves TCG GOSU® Standard Matte',
      slug: 'tcg-sleeves-standard-matte',
      descripcion: 'Sleeves de 140 micras con textura mate trasera para un shuffle perfecto en juegos como Magic: The Gathering, Pokémon y Lorcana.',
      precioBase: 25.0,
      imagenes: [
        '/assets/images/image-52e660c6.jpg',
        '/assets/images/image-3a743382.jpg',
      ],
      seoTitle: 'Sleeves TCG GOSU® Standard Matte 140 Micras | Magic & Pokémon',
      seoDescription: 'Sleeves de reverso mate texturizado de 140 micras para jugadores competitivos de TCG. Excelente durabilidad.',
      seoKeywords: 'tcg sleeves, sleeves magic, sleeves pokemon, gosu matte sleeves',
      categoriaId: catTcg.id,
    },
  });

  const tcgVariants = [
    { sku: 'GOSU-TCG-BLACK', titulo: 'Negro Matte / 100u', precio: 25.0, stock: 120 },
    { sku: 'GOSU-TCG-BLUE', titulo: 'Azul Cobalto Matte / 100u', precio: 25.0, stock: 90 },
    { sku: 'GOSU-TCG-[#ff5c00]', titulo: 'Rojo Carmín Matte / 100u', precio: 25.0, stock: 80 },
  ];

  for (const v of tcgVariants) {
    await prisma.variante.upsert({
      where: { sku: v.sku },
      update: { titulo: v.titulo, precio: v.precio, stock: v.stock, productoId: prodTcg.id },
      create: { sku: v.sku, titulo: v.titulo, precio: v.precio, stock: v.stock, productoId: prodTcg.id },
    });
  }

  // 4. Create PRO-Binder product
  const prodBinder = await prisma.producto.upsert({
    where: { slug: 'pro-binder-9-pocket' },
    update: {
      nombre: 'PRO-Binder GOSU® 9-Pocket',
      descripcion: 'Carpeta de almacenamiento de alta seguridad con carga lateral para 360 cartas de tamaño estándar.',
      precioBase: 65.0,
      imagenes: [
        '/assets/images/image-3a743382.jpg',
        '/assets/images/image-113ac3f9.png',
      ],
      seoTitle: 'PRO-Binder GOSU® 9-Pocket 360 Cartas | Carpeta Coleccionista',
      seoDescription: 'Carpeta portacartas de carga lateral con elástico de seguridad. Capacidad para 360 cartas con sleeves.',
      seoKeywords: 'carpeta tcg, binder 9 pocket, carpeta coleccionista, gosu binder',
      categoriaId: catBinders.id,
    },
    create: {
      nombre: 'PRO-Binder GOSU® 9-Pocket',
      slug: 'pro-binder-9-pocket',
      descripcion: 'Carpeta de almacenamiento de alta seguridad con carga lateral para 360 cartas de tamaño estándar.',
      precioBase: 65.0,
      imagenes: [
        '/assets/images/image-3a743382.jpg',
        '/assets/images/image-113ac3f9.png',
      ],
      seoTitle: 'PRO-Binder GOSU® 9-Pocket 360 Cartas | Carpeta Coleccionista',
      seoDescription: 'Carpeta portacartas de carga lateral con elástico de seguridad. Capacidad para 360 cartas con sleeves.',
      seoKeywords: 'carpeta tcg, binder 9 pocket, carpeta coleccionista, gosu binder',
      categoriaId: catBinders.id,
    },
  });

  await prisma.variante.upsert({
    where: { sku: 'GOSU-BINDER-9P-BLACK' },
    update: { titulo: 'Negro Obsidian / 9 Bolsillos', precio: 65.0, stock: 50, productoId: prodBinder.id },
    create: { sku: 'GOSU-BINDER-9P-BLACK', titulo: 'Negro Obsidian / 9 Bolsillos', precio: 65.0, stock: 50, productoId: prodBinder.id },
  });

  // 5. Create Premium Deck Box product
  const prodDeck = await prisma.producto.upsert({
    where: { slug: 'premium-deck-box' },
    update: {
      nombre: 'Premium Deck Box GOSU® 100+',
      descripcion: 'Caja portamazos de cuero sintético con cierre magnético y revestimiento interior de microfibra suave.',
      precioBase: 85.0,
      imagenes: [
        '/assets/images/image-113ac3f9.png',
        '/assets/images/image-52e660c6.jpg',
      ],
      seoTitle: 'Premium Deck Box GOSU® 100+ | Caja Portamazos Cuero',
      seoDescription: 'Caja portamazos para 100+ cartas con doble sleeve. Cierre magnético potente.',
      seoKeywords: 'deck box, caja portamazos, deckbox tcg, gosu deckbox',
      categoriaId: catDeckboxes.id,
    },
    create: {
      nombre: 'Premium Deck Box GOSU® 100+',
      slug: 'premium-deck-box',
      descripcion: 'Caja portamazos de cuero sintético con cierre magnético y revestimiento interior de microfibra suave.',
      precioBase: 85.0,
      imagenes: [
        '/assets/images/image-113ac3f9.png',
        '/assets/images/image-52e660c6.jpg',
      ],
      seoTitle: 'Premium Deck Box GOSU® 100+ | Caja Portamazos Cuero',
      seoDescription: 'Caja portamazos para 100+ cartas con doble sleeve. Cierre magnético potente.',
      seoKeywords: 'deck box, caja portamazos, deckbox tcg, gosu deckbox',
      categoriaId: catDeckboxes.id,
    },
  });

  await prisma.variante.upsert({
    where: { sku: 'GOSU-DECKBOX-BLACK' },
    update: { titulo: 'Negro Mate / 100+ Cartas', precio: 85.0, stock: 40, productoId: prodDeck.id },
    create: { sku: 'GOSU-DECKBOX-BLACK', titulo: 'Negro Mate / 100+ Cartas', precio: 85.0, stock: 40, productoId: prodDeck.id },
  });

  // 6. Create Coupons
  await prisma.cupon.upsert({
    where: { codigo: 'GOSU10' },
    update: { descuentoPorcentaje: 10, activo: true },
    create: { codigo: 'GOSU10', descuentoPorcentaje: 10, activo: true },
  });

  await prisma.cupon.upsert({
    where: { codigo: 'LANZAMIENTO20' },
    update: { descuentoPorcentaje: 20, limiteUso: 100, activo: true },
    create: { codigo: 'LANZAMIENTO20', descuentoPorcentaje: 20, limiteUso: 100, activo: true },
  });

  // 7. Create Admin User
  await prisma.adminUser.upsert({
    where: { email: 'admin@gosu.pe' },
    update: {
      nombre: 'Administrador GOSU',
      // Plain text hash comparison helper for demo / bcrypt hash string
      passwordHash: '$2a$10$8.z8pC2R0k9E6kX9q1w3O.1d8z8pC2R0k9E6kX9q1w3O.1', 
    },
    create: {
      email: 'admin@gosu.pe',
      nombre: 'Administrador GOSU',
      passwordHash: '$2a$10$8.z8pC2R0k9E6kX9q1w3O.1d8z8pC2R0k9E6kX9q1w3O.1',
      role: 'admin',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
