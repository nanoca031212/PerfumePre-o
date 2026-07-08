import { CheckCircle2, PackageSearch, PackageCheck, Truck, MapPin, PartyPopper, type LucideIcon } from 'lucide-react'

export interface EmailAutomationStep {
  id: string
  title: string
  subtitle?: string
  description: string
  icon: LucideIcon
}

export const EMAIL_AUTOMATION_STEPS: EmailAutomationStep[] = [
  {
    id: 'order-confirmed',
    title: 'Order Confirmed',
    description: 'Confirma para o cliente que o pedido foi recebido com sucesso.',
    icon: CheckCircle2,
  },
  {
    id: 'in-preparation',
    title: 'In Preparation',
    description: 'Avisa que o pedido está sendo preparado para envio.',
    icon: PackageSearch,
  },
  {
    id: 'processing-update',
    title: 'Processing Update',
    subtitle: 'Dispatched',
    description: 'Atualiza o cliente informando que o pedido foi processado e despachado.',
    icon: PackageCheck,
  },
  {
    id: 'in-transit',
    title: 'In Transit',
    description: 'Informa que o pedido está a caminho do endereço de entrega.',
    icon: Truck,
  },
  {
    id: 'delivery-update',
    title: 'Delivery Update',
    subtitle: 'Final Stage',
    description: 'Atualização de entrega: o pedido está na etapa final.',
    icon: MapPin,
  },
  {
    id: 'post-delivery',
    title: 'Post-Delivery',
    subtitle: 'Completed',
    description: 'Confirma que o pedido foi entregue com sucesso.',
    icon: PartyPopper,
  },
]
