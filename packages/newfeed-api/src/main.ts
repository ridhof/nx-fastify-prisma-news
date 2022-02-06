/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

//  import * as express from 'express';
import { fastify } from 'fastify';
import ProductRoute from './routes/product';
import ArticleRoute from './routes/article';
import TopicRoute from './routes/topic';

//  const app = express();
const app = fastify({ logger: true });
 
app.get('/api', async (request, reply) => {
    // return { message: 'Welcome to fastify-ftw!' };
    return reply.send({ message: 'Welcome to fastify-ftw!' });
});

app.register(ProductRoute);
app.register(ArticleRoute);
app.register(TopicRoute);
 
const port = process.env.port || 4444;
const start = async () => {
    try {
        await app.listen(port);
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()
// const server = app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);
 