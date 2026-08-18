import { Resend } from 'resend';

export interface EmailOrderPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  total: number;
  items: Array<{
    name: string;
    variantTitle?: string;
    quantity: number;
    price: number;
  }>;
}

export function generateOrderConfirmationHtml(payload: EmailOrderPayload): string {
  const { orderId, customerName, shippingAddress, total, items } = payload;

  const itemsRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #27272a; color: #ffffff; font-size: 13px; font-weight: 600;">
        ${item.name} ${item.variantTitle ? `<span style="color: #a1a1aa; font-size: 11px;">(${item.variantTitle})</span>` : ''}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 13px; text-align: center; font-family: monospace;">
        x${item.quantity}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #27272a; color: #00e8ff; font-size: 13px; font-weight: 700; text-align: right; font-family: monospace;">
        S/. ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido - GOSU®</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #000000; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #09090b; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,232,255,0.15);">
              
              <!-- HEADER BRAND BAR -->
              <tr>
                <td align="center" style="padding: 32px 24px; background-color: #09090b; border-bottom: 1px solid #18181b;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; text-shadow: 0 0 15px rgba(0,232,255,0.6);">
                    GOSU<span style="color: #00e8ff;">®</span>
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase;">
                    Official E-Commerce Store
                  </p>
                </td>
              </tr>

              <!-- HERO SUCCESS BADGE -->
              <tr>
                <td style="padding: 32px 32px 16px 32px; text-align: center;">
                  <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding: 6px 16px; border-radius: 9999px; margin-bottom: 16px;">
                    ✓ Pago Confirmado con Éxito
                  </div>
                  <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                    ¡Gracias por tu compra, ${customerName}!
                  </h2>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
                    Hemos registrado tu orden <strong style="color: #00e8ff;">${orderId}</strong> y estamos preparando tus fundas y accesorios con protección de 100 micras.
                  </p>
                </td>
              </tr>

              <!-- ORDER ITEMS TABLE -->
              <tr>
                <td style="padding: 16px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #18181b;">
                        <th align="left" style="padding: 10px 16px; color: #71717a; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Producto</th>
                        <th align="center" style="padding: 10px 16px; color: #71717a; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Cant</th>
                        <th align="right" style="padding: 10px 16px; color: #71717a; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsRows}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- TOTAL MATH SUMMARY -->
              <tr>
                <td style="padding: 0 32px 24px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #18181b; border-radius: 16px; padding: 16px;">
                    <tr>
                      <td style="color: #a1a1aa; font-size: 12px; font-weight: 600;">Total Pagado:</td>
                      <td align="right" style="color: #00e8ff; font-size: 20px; font-weight: 900; font-family: monospace;">
                        S/. ${total.toFixed(2)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SHIPPING ADDRESS BLOCK -->
              <tr>
                <td style="padding: 0 32px 32px 32px;">
                  <div style="background-color: #000000; border: 1px solid #27272a; border-radius: 16px; padding: 20px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #00e8ff; text-transform: uppercase; letter-spacing: 1px;">
                      📍 Dirección de Despacho
                    </h4>
                    <p style="margin: 0; font-size: 12px; color: #d4d4d8; line-height: 1.5; font-family: monospace;">
                      ${shippingAddress}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- FOOTER SUPPORT NOTE -->
              <tr>
                <td align="center" style="padding: 24px 32px; background-color: #18181b; border-top: 1px solid #27272a; color: #71717a; font-size: 11px; line-height: 1.6;">
                  <p style="margin: 0 0 6px 0;">
                    ¿Tienes dudas sobre tu envío? Respóndenos directamente a este correo o contáctanos por WhatsApp.
                  </p>
                  <p style="margin: 0; font-weight: 700; color: #a1a1aa;">
                    GOSU® Accessories — Elevando tu configuración.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendOrderConfirmationEmail(payload: EmailOrderPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.startsWith('re_mock')) {
    console.log('--- [RESEND MOCK EMAIL DISPATCH] ---');
    console.log(`To: ${payload.customerEmail}`);
    console.log(`Subject: Confirmación de Pedido ${payload.orderId} - GOSU®`);
    console.log(`Total: S/. ${payload.total.toFixed(2)}`);
    console.log('------------------------------------');
    return { success: true, isMock: true };
  }

  try {
    const resend = new Resend(apiKey);
    const htmlContent = generateOrderConfirmationHtml(payload);

    const data = await resend.emails.send({
      from: 'GOSU® Store <ventas@gosu.pe>',
      to: [payload.customerEmail],
      subject: `¡Confirmación de Pedido ${payload.orderId}! - GOSU®`,
      html: htmlContent,
    });

    console.log('Resend email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending Resend email:', error);
    return { success: false, error };
  }
}
