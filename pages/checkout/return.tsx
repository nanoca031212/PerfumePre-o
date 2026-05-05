import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import Head from 'next/head';
import { usePixel } from '@/hooks/usePixel';
import { retryFailedUtmfyConversions } from '@/lib/clientSideUtmfy';
import Image from 'next/image';

export default function CheckoutReturn() {
  const router = useRouter();
  const { session_id } = router.query;
  const { clearCart } = useCart();
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const pixel = usePixel();
  // useRef: survives StrictMode double-mounts — unlike useState which resets
  const purchaseTrackedRef = useRef(false);

  useEffect(() => {
    // Retry any UTMify conversions that previously failed (client-side localStorage fallback)
    retryFailedUtmfyConversions();
  }, []);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/stripe/session-details?session_id=${session_id}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.success && response.data) {
            const data = response.data;
            setStatus(data.status);
            setCustomerEmail(data.customer.email);

            if (data.status === 'complete') {
              clearCart();

              // ── Deduplicação client-side via localStorage ────────────────
              // Usa o session_id como chave — único por compra na Stripe.
              // Evita re-disparar pixels se o cliente recarregar a página.
              const dedupKey = `tracked_purchase_${Array.isArray(session_id) ? session_id[0] : session_id}`;
              const alreadyTracked = localStorage.getItem(dedupKey);

              if (!alreadyTracked && !purchaseTrackedRef.current) {
                purchaseTrackedRef.current = true;

                const sid = Array.isArray(session_id) ? session_id[0] : session_id as string;

                // Meta → fbq('Purchase') | TikTok → ttq('CompletePayment')
                // eventID = session_id para dedup com CAPI
                pixel.purchase({
                  value: data.amount_total / 100,
                  currency: data.currency.toUpperCase(),
                  content_ids: data.line_items.map((item: any) => item.product_id),
                  content_type: 'product',
                  num_items: data.line_items.reduce((acc: number, item: any) => acc + item.quantity, 0)
                }, {
                  eventID: sid
                });

                // Marca no localStorage para evitar re-disparo em reloads
                localStorage.setItem(dedupKey, Date.now().toString());
              } else if (alreadyTracked) {
                console.log('⏭️ Pixel Purchase ignorado (deduplicação localStorage) — sessão já rastreada:', session_id);
              }
              // ─────────────────────────────────────────────────────────────
            }
          }
        })
        .catch(err => console.error("Error fetching session details:", err));
    }
  }, [session_id]);


  if (status === 'open') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Payment not completed. Redirecting...</p>
        {/* Logic to redirect back to checkout if needed */}
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Head>
          <title>Order Confirmed | Perfumes UK</title>
        </Head>
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
            {customerEmail && (
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customerEmail)}&background=10B981&color=fff&rounded=true&size=64`}
                alt="Avatar do Cliente"
                className="w-16 h-16 rounded-full shadow-sm"
              />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to {customerEmail}.
          </p>
          <div className="flex justify-center flex-col col-span-2 gap-4">
            <a
              href="/"
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block"
            >
              Continue Shopping
            </a>
            <a
              href="/"
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block"
            >
              Open Mail
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}
