import { PrismaClient } from '@prisma/client' //Importação de coneção com banco

// configurando para fazer manipulações no BD
// Arquivo separado para não criar uma nova conexão para cada entidade
export const prisma = new PrismaClient({
  log: ['query']
})