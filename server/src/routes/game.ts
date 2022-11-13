import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function gameRoutes(fastify: FastifyInstance){
  fastify.get('/game', async (request, reply) => {
    const count = await prisma.pool.count()

    return reply.status(200).send( { count } )
  })
}