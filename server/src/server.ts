import Fastify from "fastify";
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

// Importando rotas 
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { poolRoutes } from './routes/pool'
import { userRoutes } from './routes/user'

async function bootstrap(){
  const fastify = Fastify({
    logger: true
  })
  
  await fastify.register(cors, {
    //Configurando quem pode acessar esse backend
    origin: true
  })

  //Em ambiente de produção deve ser uma variavel ambiente 
  fastify.register(jwt, { 
    secret: 'nlwcopa'
  })

  //Registrando rotas criadas
  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(poolRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({ port: 8080, /*host: '0.0.0.0'*/ })
}

bootstrap()