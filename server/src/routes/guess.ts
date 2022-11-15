import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function guessRoutes(fastify: FastifyInstance){
  fastify.get('/guesses/count', async (request, reply) => {
    const count = await prisma.guess.count()

    return reply.status(200).send( { count } )
  })

<<<<<<< HEAD
  // Criar palpites dentro do bolão, de um jogo especificado
=======
>>>>>>> 227f60d4c1655f085f1c69ddd5d7e71d4a62c5a8
  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate]
  }, async (request, reply) => {

    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string()
    })

    const createGuessBody = z.object({
      firtTeamPoints: z.number(),
      secondTeamPoints: z.number()
    })

    const { poolId, gameId } = createGuessParams.parse(request.params)
    const { firtTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

    // Encontrar o participante correto, com o userId e poolId
    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    })

    if (!participant){
      return reply.status(400).send({
        message: 'Participant not found with theses informations'
      })
    }

    // Ao encontrar o participante, buscar palpite dele no game especificado
    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          gameId,
          participantId: participant.id
        }
      }
    })

    if (guess){ 
      return reply.status(400).send({
        message: 'Guess for this user already exists'
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if (!game) {
      return reply.status(400).send({
        message: 'Game not found'
      })
    }

    if (game.date < new Date()) {
      return reply.status(400).send({
        message: 'Cannot send guesses after the game'
      })
    }

    // Apos validações, criar o palpite 
    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firtTeamPoints,
        secondTeamPoints,
      }
    })

    return reply.status(200).send({
      poolId, 
      gameId, 
      firtTeamPoints,
      secondTeamPoints,
    })
  })
}