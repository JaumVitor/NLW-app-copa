import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function gameRoutes(fastify: FastifyInstance){
  fastify.get('/game', async (request, reply) => {
    const count = await prisma.pool.count()

    return reply.status(200).send( { count } )
  })

  fastify.get('/pools/:poolId/games', {
    onRequest: [authenticate]
  }, 
  async (request) => {
    const getPoolParams = z.object({
      poolId: z.string()
    })

    const { poolId } = getPoolParams.parse(request.params)

    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        guesses: {
          //Só vai aparecer palpites do meu usuario logado, que fez palpite no bolão passado (id)
          where: {
            participant: { 
              userId: request.user.sub,
              poolId: poolId,
            }
          }
        }
      }
    })

    // Formatando o retorno dos palpites
    return { 
      games: games.map( game => {
        return {
          ...game,
          guesses: undefined,
          guess: game.guesses.length > 0 ? game.guesses[0] : null
        }
      })
    }
  })
}