const PAYMONGO_API_URL = 'https://api.paymongo.com/v1'

function authHeader(key: string): string {
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`
}

export async function paymongoRequest<T>(path: string, body: unknown): Promise<T> {
  const secretKey = process.env.PAYMONGO_SECRET_KEY
  if (!secretKey) throw new Error('Missing PAYMONGO_SECRET_KEY environment variable')

  const response = await fetch(`${PAYMONGO_API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(secretKey),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = await response.json()
  if (!response.ok) {
    const message = json?.errors?.[0]?.detail ?? `PayMongo request failed with status ${response.status}`
    throw new Error(message)
  }

  return json as T
}
