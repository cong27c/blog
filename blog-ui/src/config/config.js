const env = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
};

const config = {
  routes: {
    home: "/",
  },
};

export { env, config };
