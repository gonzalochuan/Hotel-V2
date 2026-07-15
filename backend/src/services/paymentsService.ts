import { paymongoRequest } from '../lib/paymongo.js'

interface PaymentIntentResponse {
  data: {
    id: string
    attributes: {
      client_key: string
      status: string
    }
  }
}

export async function createPaymentIntent(amountCentavos: number): Promise<{ id: string; clientKey: string }> {
  const response = await paymongoRequest<PaymentIntentResponse>('/payment_intents', {
    data: {
      attributes: {
        amount: amountCentavos,
        currency: 'PHP',
        capture_type: 'automatic',
        payment_method_allowed: ['card', 'gcash', 'paymaya'],
        payment_method_options: {
          card: { request_three_d_secure: 'automatic' },
        },
      },
    },
  })

  return { id: response.data.id, clientKey: response.data.attributes.client_key }
}
