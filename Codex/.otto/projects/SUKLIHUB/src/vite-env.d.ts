/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Your hosted pack-identifier API (see /server). When set, browser never uses VITE_GEMINI_API_KEY. */
  readonly VITE_PRODUCT_IDENTIFY_URL?: string;
  /** Same value as server IDENTIFY_API_SECRET when you lock down the identify API */
  readonly VITE_PRODUCT_IDENTIFY_SECRET?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  /** Default: gemini-2.0-flash */
  readonly VITE_GEMINI_MODEL?: string;
  /** 1 / true = offline demo when no API key (placeholders, not real vision) */
  readonly VITE_PRODUCT_VISION_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
