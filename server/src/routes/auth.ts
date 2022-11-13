import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import fetch from 'node-fetch'

import { z } from 'zod'
import { authenticate } from '../plugins/authenticate'

export async function authRoutes(fastify: FastifyInstance){
  fastify.get('/me', {
    onRequest: [authenticate]
  }, //middware de validação do jwt
    async (request) => {
      // Retornando user com token validado
      return { user: request.user }
  })

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

    //Criando o user com base nos dados capturados 
    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    })

    //Caso o user não seja encontrado, crio ele
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
        }
      })
    }

    //encoded - informações encapsuladas, payload - info desencapsuladas
    //Não recomendado colocar informações senviveis, pois o token é visivel (Não é criptografia)
    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, {
      sub: user.id,
      expiresIn: '7 days'
    })

    return reply.status(200).send({ 
      status: 'Received access token',
      token,
    })
  })
}