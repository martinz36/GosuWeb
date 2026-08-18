import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  nameEs: text('name_es').notNull(),
  nameEn: text('name_en').notNull(),
  descriptionEs: text('description_es').notNull(),
  descriptionEn: text('description_en').notNull(),
  price: real('price').notNull(), // Price in PEN (Soles)
  category: text('category').notNull(), // 'board-sleeves' | 'tcg-sleeves' | 'inner-over' | 'binders' | 'deckboxes'
  image: text('image').notNull(),
  stock: integer('stock').notNull().default(100),
  colorsEs: text('colors_es'),
  colorsEn: text('colors_en'),
  detailsEs: text('details_es'), // Bullet points in Spanish
  detailsEn: text('details_en'), // Bullet points in English
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // We can use UUID or nanoId
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  total: real('total').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'completed' | 'failed'
  paymentId: text('payment_id'), // Culqi charge ID
  createdAt: integer('created_at').notNull(), // timestamp
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

// PROGRAMA DE AFILIADOS
export const affiliates = sqliteTable('affiliates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  code: text('code').notNull().unique(), // e.g. "GOSU-CARLOS"
  commissionRate: real('commission_rate').notNull().default(10.0), // Percentage e.g. 10%
  balancePending: real('balance_pending').notNull().default(0.0),
  balancePaid: real('balance_paid').notNull().default(0.0),
  paymentInfo: text('payment_info'), // Yape, Plin, CCI, Banco
  status: text('status').notNull().default('aprobado'), // 'pendiente' | 'aprobado' | 'rechazado'
  totalClicks: integer('total_clicks').notNull().default(0),
  createdAt: integer('created_at').notNull(),
});

export const referralSales = sqliteTable('referral_sales', {
  id: text('id').primaryKey(),
  affiliateId: text('affiliate_id').notNull().references(() => affiliates.id),
  orderId: text('order_id').notNull().references(() => orders.id),
  orderAmount: real('order_amount').notNull(),
  commission: real('commission').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'paid'
  createdAt: integer('created_at').notNull(),
});

// STORE SETTINGS & PAYMENT GATEWAYS
export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey().default('default'),
  
  // Mercado Pago Perú
  mercadoPagoActive: integer('mercado_pago_active', { mode: 'boolean' }).notNull().default(false),
  mercadoPagoMode: text('mercado_pago_mode').notNull().default('sandbox'),
  mpPublicSandboxKey: text('mp_public_sandbox_key'),
  mpAccessSandboxToken: text('mp_access_sandbox_token'),
  mpPublicProdKey: text('mp_public_prod_key'),
  mpAccessProdToken: text('mp_access_prod_token'),

  // Stripe
  stripeActive: integer('stripe_active', { mode: 'boolean' }).notNull().default(false),
  stripeMode: text('stripe_mode').notNull().default('sandbox'),
  stripePublishableKey: text('stripe_publishable_key'),
  stripeSecretKey: text('stripe_secret_key'),

  // Culqi
  culqiActive: integer('culqi_active', { mode: 'boolean' }).notNull().default(true),
  culqiPublicKey: text('culqi_public_key'),
  culqiSecretKey: text('culqi_secret_key'),

  updatedAt: integer('updated_at').notNull(),
});
