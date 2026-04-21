declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string
    JWT_SECRET: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    ANTHROPIC_API_KEY: string
    NEXT_PUBLIC_APP_URL: string
  }
}

declare module '*.css'
