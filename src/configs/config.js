const development = {
  app: {
    main_api: import.meta.env.VITE_MAIN_API_ENDPOINT || 'http://localhost:8080',
  },
};

const production = {
  app: {
    main_api: import.meta.env.VITE_MAIN_API_ENDPOINT || 'http://localhost:8080',
  },
};

const config = { development, production };
const env = import.meta.env.NODE_ENV || 'development';

export default config[env];