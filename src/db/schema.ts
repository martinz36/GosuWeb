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
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  total: real('total').notNull(),
  status: text('status').notNull().default('pending'),
  paymentId: text('payment_id'),
  createdAt: integer('created_at').notNull(),
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
  code: text('code').notNull().unique(),
  commissionRate: real('commission_rate').notNull().default(10.0),
  balancePending: real('balance_pending').notNull().default(0.0),
  balancePaid: real('balance_paid').notNull().default(0.0),
  paymentInfo: text('payment_info'),
  status: text('status').notNull().default('aprobado'),
  totalClicks: integer('total_clicks').notNull().default(0),
  createdAt: integer('created_at').notNull(),
});

export const referralSales = sqliteTable('referral_sales', {
  id: text('id').primaryKey(),
  affiliateId: text('affiliate_id').notNull().references(() => affiliates.id),
  orderId: text('order_id').notNull().references(() => orders.id),
  orderAmount: real('order_amount').notNull(),
  commission: real('commission').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at').notNull(),
});

// STORE SETTINGS
export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey().default('default'),
  
  mercadoPagoActive: integer('mercado_pago_active', { mode: 'boolean' }).notNull().default(false),
  mercadoPagoMode: text('mercado_pago_mode').notNull().default('sandbox'),
  mpPublicSandboxKey: text('mp_public_sandbox_key'),
  mpAccessSandboxToken: text('mp_access_sandbox_token'),
  mpPublicProdKey: text('mp_public_prod_key'),
  mpAccessProdToken: text('mp_access_prod_token'),
  mpClientId: text('mp_client_id'),
  mpClientSecret: text('mp_client_secret'),

  stripeActive: integer('stripe_active', { mode: 'boolean' }).notNull().default(false),
  stripeMode: text('stripe_mode').notNull().default('sandbox'),
  stripePublishableKey: text('stripe_publishable_key'),
  stripeSecretKey: text('stripe_secret_key'),

  culqiActive: integer('culqi_active', { mode: 'boolean' }).notNull().default(true),
  culqiPublicKey: text('culqi_public_key'),
  culqiSecretKey: text('culqi_secret_key'),

  freeShippingThreshold: real('free_shipping_threshold').default(200.0),

  updatedAt: integer('updated_at').notNull(),
});

// SHIPPING ZONES
export const shippingZones = sqliteTable('shipping_zones', {
  id: text('id').primaryKey(),
  countryCode: text('country_code').notNull(),
  region: text('region'),
  rate: real('rate').notNull(),
  currency: text('currency').notNull().default('PEN'),
  estimatedDays: text('estimated_days'),
  createdAt: integer('created_at').notNull(),
});
