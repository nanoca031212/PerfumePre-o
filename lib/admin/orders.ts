export type OrderStatus =
  | "order_confirmed"
  | "in_preparation"
  | "processing_update"
  | "Dispatched"
  | "in_transit"
  | "delivery_update"
  | "post_delivery"
  | "final_stage"
  | "Completed";

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  phone?: string | null;
  address?: string | null;
  items?: OrderItem[];
}

export const ORDER_STATUS_ORDER: OrderStatus[] = [
  "order_confirmed",
  "in_preparation",
  "processing_update",
  "Dispatched",
  "in_transit",
  "delivery_update",
  "final_stage",
  "post_delivery",
  "Completed",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  order_confirmed: "Order Confirmed",
  in_preparation: "In Preparation",
  processing_update: "Processing Update",
  Dispatched: "Dispatched",
  in_transit: "In Transit",
  delivery_update: "Delivery Update",
  final_stage: "Final stage",
  post_delivery: "Post-Delivery",
  Completed: "Completed",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  order_confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  in_preparation: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  processing_update: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Dispatched: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  in_transit: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  delivery_update: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  final_stage: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  post_delivery: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "#PP-10235",
    customer: "nanoca",
    email: "splinepline27@gmail.com",
    date: "2026-07-10",
    total: 89.9,
    status: "order_confirmed",
  },
  {
    id: "#PP-10234",
    customer: "Ana Silva",
    email: "ana.silva@example.com",
    date: "2026-07-05",
    total: 189.9,
    status: "order_confirmed",
  },
  {
    id: "#PP-10233",
    customer: "Bruno Costa",
    email: "bruno.costa@example.com",
    date: "2026-07-04",
    total: 249.5,
    status: "in_preparation",
  },
  {
    id: "#PP-10232",
    customer: "Carla Souza",
    email: "carla.souza@example.com",
    date: "2026-07-04",
    total: 99.9,
    status: "processing_update",
  },
  {
    id: "#PP-10231",
    customer: "Diego Fernandes",
    email: "diego.fernandes@example.com",
    date: "2026-07-03",
    total: 320.0,
    status: "in_transit",
  },
  {
    id: "#PP-10230",
    customer: "Elisa Martins",
    email: "elisa.martins@example.com",
    date: "2026-07-02",
    total: 149.9,
    status: "delivery_update",
  },
  {
    id: "#PP-10229",
    customer: "Fábio Lima",
    email: "fabio.lima@example.com",
    date: "2026-07-01",
    total: 279.9,
    status: "post_delivery",
  },
  {
    id: "#PP-10228",
    customer: "Gabriela Rocha",
    email: "gabriela.rocha@example.com",
    date: "2026-06-30",
    total: 159.0,
    status: "post_delivery",
  },
];
