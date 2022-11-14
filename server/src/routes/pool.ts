import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'
import { authenticate } from '../plugins/authenticate'

export async function poolRoutes(fastify: FastifyInstance){
  fastify.get('/pools/count', async (request, reply) => {
    const count = await prisma.pool.count()

    return reply.status(200).send( { count } )
  })

  // Criando bolão
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

      try {
        await request.jwtVerify() //Verifica se esta logado, caso contrario vai pro catch
        await prisma.pool.create({
          data: {
            title: title,
            code: code,
            ownerId: request.user.sub,
            
            participants: {
              create: {
                userId: request.user.sub
              }
            }
          }
        })
  
      } catch {
        // Criando bolão sem owner
        await prisma.pool.create({
          data: {
            title: title,
            code: code
          }
        })
      }

      // Quando cria o bolão retorna o code
      return reply.status(201).send({ code: code }) 
    }catch (e){
      return reply.status(400).send({ error: 'Value null' })
    }
  })

  // Inserindo participante no bolão
  fastify.post('/pools/join', {
    onRequest: [authenticate]
  },
  async (request, reply) => {
    const joinPoolsBody = z.object({
      code: z.string(),
    })

    const { code } = joinPoolsBody.parse(request.body)
    
    const pool = await prisma.pool.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          //Dentro dos bolões, verificando se ja esta cadastrado
          where: {
            userId: request.user.sub
          }
        }
      }
    })

    // Bolão não encontrado
    if (!pool) {
      return reply.status(400).send({ 
        message: 'Pool not found'
      })
    }
    
    //Esse participante ja esta logado
    if (pool.participants.length > 0){
      return reply.status(400).send({
        message: 'Participant already exist in this pool',
        pool
      })
    }

    //Primeiro participante vira o owner do bolão
    if (!pool.ownerId){
      await prisma.pool.update({
        where: {
          id: pool.id
        },
        data: { 
          ownerId: request.user.sub
        }
      })
    }

    // Adicionando participante no bolão
    await prisma.participant.create({
      data: {
        poolId: pool.id,
        userId: request.user.sub
      }
    })

    return reply.status(201).send({
      message: 'Pool match foud',
      pool
    })
  })

  // Bolões usuario participa
  fastify.get('/pools', {
    onRequest: [authenticate]
  },
  async (request) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub
          }
        }
      },
      include: { //Incuindo os campos do owner, como id e name
        _count: {
          select: {
            participants: true
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4 //Capturar info dos 4 primeiros participantes
        }
      }
    })

    return { pools }
  })

  // Buscando unico bolão por id
  fastify.get('/pools/:id',{
    onRequest: [authenticate]
  }, 
  async (request) => {
    const getPoolParams = z.object({
      id: z.string()
    })

    const { id } = getPoolParams.parse(request.params)

    const pool = await prisma.pool.findUnique({
      where: {
        id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        _count: true,
      }
    })

    return { pool }
  })
}