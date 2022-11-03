import Fastify from "fastify";
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

// configurando para fazer manipulações no BD
const prisma = new PrismaClient({
  log: ['query']
})

async function bootstrap(){
  const fastify = Fastify({
    logger: true
  })
  
  await fastify.register(cors, {
    //Configurando quem pode acessar esse backend
    origin: true
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  })

  await fastify.listen({ port: 8080, /*host: '0.0.0.0'*/ })
}

bootstrap()