import type { Booking } from '../types/booking.js'

const RESEND_API_URL = 'https://api.resend.com/emails'

function formatCurrency(value: number): string {
  return `PHP ${value.toLocaleString('en-PH')}`
}

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function sendBookingConfirmationEmail(params: {
  to: string
  roomName: string
  booking: Booking
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping booking confirmation email')
    return
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  const { booking, roomName, to } = params

  const enhancementsHtml = booking.enhancements.length
    ? `<ul>${booking.enhancements
        .map((item) => `<li>${item.label} — ${item.price > 0 ? formatCurrency(item.price) : 'Included'}</li>`)
        .join('')}</ul>`
    : '<p>None selected</p>'

  const html = `
    <h2>Booking confirmed</h2>
    <p>Thank you for booking with us. Here are your reservation details:</p>
    <table cellpadding="6">
      <tr><td><strong>Room</strong></td><td>${roomName}</td></tr>
      <tr><td><strong>Check-in</strong></td><td>${formatDate(booking.checkIn)}</td></tr>
      <tr><td><strong>Check-out</strong></td><td>${formatDate(booking.checkOut)}</td></tr>
      <tr><td><strong>Guests</strong></td><td>${booking.adults} adult(s), ${booking.children} child(ren)</td></tr>
      <tr><td><strong>Rooms</strong></td><td>${booking.roomsCount}</td></tr>
    </table>
    <h3>Enhancements</h3>
    ${enhancementsHtml}
    <h3>Total</h3>
    <p>Subtotal: ${formatCurrency(booking.subtotal)}<br/>
       Taxes & fees: ${formatCurrency(booking.taxes)}<br/>
       <strong>Total: ${formatCurrency(booking.total)}</strong></p>
  `

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject: `Booking confirmed — ${roomName}`,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error(`Failed to send booking confirmation email: ${response.status} ${body}`)
  }
}
