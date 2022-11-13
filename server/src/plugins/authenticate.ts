import { FastifyRequest } from 'fastify'

export async function authenticate(fastify: FastifyRequest) {
  //Metodo para validar header jwt enviado pelo client, na request 
  await fastify.jwtVerify()
}