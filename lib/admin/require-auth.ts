import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { isSsrAuthenticated } from './session'

export function requireAdminAuth<P extends Record<string, unknown> = Record<string, never>>(
  handler?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (context: GetServerSidePropsContext) => {
    if (!isSsrAuthenticated(context)) {
      return {
        redirect: {
          destination: '/login/admin',
          permanent: false,
        },
      }
    }
    if (handler) return handler(context)
    return { props: {} as P }
  }
}
