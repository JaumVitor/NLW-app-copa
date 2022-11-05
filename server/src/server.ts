import Fastify from "fastify";
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

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

  fastify.get('/pools/count', async (request, reply) => {
    const count = await prisma.pool.count()

    return reply.status(200).send( { count } )
  })

  fastify.get('/guesses/count', async (request, reply) => {
    const count = await prisma.guess.count()

    return reply.status(200).send( { count } )
  })

  fastify.get('/users/count', async (request, reply) => {
    const count = await prisma.user.count()
    
    return reply.status(200).send( { count } )
  })

  fastify.post('/pools', async (request, reply) => {
    // Criando formato da minha request
    const createPoolBody = z.object({
      title: z.string(),
    })

    // Vai tentar converter para o formato que criei, se não der dispara uma exception
    try {
      const { title } = createPoolBody.parse(request.body)
      const generate = new ShortUniqueId({ length: 6 })
      const code = String(generate()).toUpperCase()

      await prisma.pool.create({
        data: {
          title: title,
          code: code
        }
      })

      // Quando cria o bolão retorna o code
      return reply.status(201).send({ code: code }) 
    }catch (e){
      return reply.status(400).send({ error: 'Value null' })
    }
  })

  await fastify.listen({ port: 8080, /*host: '0.0.0.0'*/ })
}

bootstrap()