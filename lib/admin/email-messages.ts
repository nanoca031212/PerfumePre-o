import type { OrderStatus } from './orders'

export interface EmailMessageTemplate {
  subject: string
  body: (name: string) => string
}

export const ORDER_STATUS_EMAIL_MESSAGES: Partial<Record<OrderStatus, EmailMessageTemplate>> = {
  order_confirmed: {
    subject: 'Your order has been confirmed',
    body: (name) =>
      `Hello ${name},\n\nYour order has been successfully placed.\n\nWe are now preparing it for dispatch.\n\nYou will receive your tracking code within the next few days.`,
  },
  in_preparation: {
    subject: 'Your order is being prepared',
    body: () =>
      `Your order is currently being processed and prepared for dispatch.\n\nDue to high demand, your tracking code will be sent within 3 to 5 days.`,
  },
  processing_update: {
    subject: 'Processing update',
    body: () =>
      `Your order is in the final stage of preparation and is leaving our distribution centre.\n\nYou will receive your tracking code shortly.`,
  },
  Dispatched: {
    subject: 'Your order has been dispatched',
    body: () =>
      `Your order has been dispatched.\n\nTracking Details\n\nTracking number: 22\n\nTrack your order here: Track your order\n\nTracking updates may take a few days to appear.`,
  },
  in_transit: {
    subject: 'Your order is on its way',
    body: () =>
      `Your order is on its way.\n\nAt this stage, it is in international transit.\n\nTracking updates may take a few days to reflect new movements.\n\nDue to the high demand during this period, we are offering you a 10% discount on your next order.`,
  },
  delivery_update: {
    subject: 'Delivery update',
    body: () =>
      `Your order is currently progressing through international logistics.\n\nAt this stage, it may go through intermediate processing before final delivery.\n\nTracking updates may take a few days to reflect this stage.\n\nMost orders are delivered within the expected timeframe.\n\nIf you require any assistance, our support team is available.`,
  },
  final_stage: {
    subject: 'Your order is in the final stage',
    body: () =>
      `Your order is in the final stage of delivery.\n\nLocal carrier handling may vary depending on your area.\n\nPlease monitor your tracking for final updates.`,
  },
  post_delivery: {
    subject: 'Your order has been delivered',
    body: () =>
      `Your order has been delivered.\n\nIf you require any support, please contact us — we'll be pleased to assist you.\n\nNorth Mind Team\n\nAs a valued customer, you can unlock an exclusive discount by creating your account with us.`,
  },
  // Completed é apenas um marcador de fim de processo — não dispara email.
}
