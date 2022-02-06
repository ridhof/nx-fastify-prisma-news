module.exports = {
  apps: [
    {
      name: '[8002] Nx Fastify - News API',
      script: 'npx nx serve newfeed-api',
      watch: true,
      env: {
        PORT: 3000,
        DATABASE_PROVIDER: 'mysql',
        DATABASE_USERNAME: 'root',
        DATABASE_PASSWORD: 'root',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 3306,
        DATABASE_NAME: 'learn_prisma'
      },
    },
  ],
};