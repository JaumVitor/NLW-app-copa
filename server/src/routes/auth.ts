import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function authRoutes(fastify: FastifyInstance){
  fastify.get('/auth', async (request, reply) => {

    return reply.status(200).send( { status: 'Ok' } )
  })
}