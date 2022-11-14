import '@fastify/jwt'

//Definindo a tipagem do meu token 
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string,
      name: string, 
      avatarUrl: string
    }
  }
}