import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const cloudinaryName = env('CLOUDINARY_NAME');
  const cloudinaryKey = env('CLOUDINARY_KEY');
  const cloudinarySecret = env('CLOUDINARY_SECRET');
  const useCloudinary = Boolean(cloudinaryName && cloudinaryKey && cloudinarySecret);

  const uploadConfig = {
    sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 15 * 1024 * 1024),
    breakpoints: {
      large: 1200,
      medium: 800,
      small: 480,
    },
    sharp: {
      cache: false,
      concurrency: env.int('UPLOAD_SHARP_CONCURRENCY', 1),
    },
    security: {
      allowedTypes: ['image/*'],
      deniedTypes: ['image/svg+xml'],
    },
    concurrentUploadSize: env.int('UPLOAD_CONCURRENT_SIZE', 1),
  };

  return {
    upload: {
      config: useCloudinary
        ? {
            ...uploadConfig,
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: cloudinaryKey,
              api_secret: cloudinarySecret,
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          }
        : {
            ...uploadConfig,
            providerOptions: {
              localServer: {
                maxage: 300000,
              },
            },
          },
    },
  };
};

export default config;
