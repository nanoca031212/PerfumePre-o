declare global {
  interface Window {
    ttq?: {
      load: (pixelId: string) => void;
      page: () => void;
      track: (event: string, params?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      identify: (params: Record<string, unknown>) => void;
    };
  }
}

export {};
