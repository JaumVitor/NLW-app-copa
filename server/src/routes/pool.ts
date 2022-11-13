import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

export async function poolRoutes(fastify: FastifyInstance){
  fastify.get('/pools/count', async (request, reply) => {
    const count = await prisma.pool.count()

    return reply.status(200).send( { count } )
  })

  fastify.post('/pools', async (request, reply) => {
    // Criando formato da minha request
    const createPoolBody = z.object({
      title: z.string(),
    })

    // Vai tentar converter para o formato que criei, se não der, dispara uma exception
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
}