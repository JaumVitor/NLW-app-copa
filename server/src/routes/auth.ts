import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import fetch from 'node-fetch'

import { z } from 'zod'

export async function authRoutes(fastify: FastifyInstance){
  fastify.post('/users', async (request, reply) => {
    const createUserBody = z.object({
      accessToken: z.string()
    })

    const { accessToken } = createUserBody.parse(request.body)

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ accessToken }`,
      }
    })

    const userData = await userResponse.json()

    // Definindo schema de retorno da api (Esse é o formato que deve ser retornado)
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    })

    const userInfo = userInfoSchema.parse(userData)

    return reply.status(200).send({ 
      status: 'Recived access token',
      userInfo
    })
  })
}