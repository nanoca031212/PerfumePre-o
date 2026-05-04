import Link, { LinkProps } from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { appendUTMsToUrl } from '@/utils/utm-helper';

interface UTMLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Um wrapper para o componente Link do Next.js que anexa automaticamente
 * os parâmetros UTM salvos à URL de destino.
 */
export default function UTMLink({ href, children, ...props }: UTMLinkProps) {
  const [finalHref, setFinalHref] = useState<string>(href.toString());

  useEffect(() => {
    // Só anexa se for uma rota interna ou se desejado
    const updatedHref = appendUTMsToUrl(href.toString());
    setFinalHref(updatedHref);
  }, [href]);

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
}
