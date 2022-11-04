import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main(){
  const user = await prisma.user.create({
    data: {
      name: 'Jaum Poole',
      email: 'outro@gmail.com',
      avatarUrl: 'http://github.com/JaumVitor.png'
    }
  })

  const user1 = await prisma.user.create({
    data: {
      name: 'Digo Jorge',
      email: 'digeo@gmail.com',
      avatarUrl: 'http://github.com/diego3g.png'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Rodrigo Almeida',
      email: 'rodrigo@gmail.com',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Exemple Poll',
      code: 'BOL232', 
      ownerId: user.id, 

      participants: {
        create: [
          {
            userId: user.id,
          },
          {
            userId: user1.id
          },
          {
            userId: user2.id
          }
        ]
      }
    }
  })
  
  const pool1 = await prisma.pool.create({
    data: {
      title: 'Segundo Bolão',
      code: 'BOL222', 
      ownerId: user1.id, 

      participants: {
        create: [
          {
            userId: user1.id
          },
          {
            userId: user2.id
          }
        ]
      }
    }
  })

  // Game 1 sem palpites 
  await prisma.game.create({
    data: {
      date: '2022-11-03T21:05:21.534Z',
      firtTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',

      guesses: {
        create: {
          firtTeamPoints: 1,
          secondTeamPoints: 7,
          createdAt: '2022-10-21T14:30:00.534Z',

          participant: {
            connect: {
              userId_poolId: {
                userId: user2.id,
                poolId: pool1.id
              }
            }
          }
        }
      }
    }
  })

  // Game 2 com 2 palpites
  await prisma.game.create({
    data: {
      date: '2022-11-06T13:00:00.534Z',
      firtTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',
      // Com palpite 
      guesses: {
        create: [
          {
            firtTeamPoints: 3,
            secondTeamPoints: 1,
            createdAt: '2022-10-21T14:30:00.534Z',

            participant: { //Participante ja existente 
              connect: {
                userId_poolId: {
                  userId: user.id,
                  poolId: pool.id
                }
              }           
            },
          },
          {
            firtTeamPoints: 4,
            secondTeamPoints: 0,
            createdAt: '2022-10-21T14:30:00.534Z',

            participant: { //Participante ja existente 
              connect: {
                userId_poolId: {
                  userId: user1.id,
                  poolId: pool.id
                }
              }           
            },
          }
        ]
      }
    }
  })

  // game 3 com 1 palpite do user1
  await prisma.game.create({
    data: {
      date: '2022-11-10T14:00:00.534Z',
      firtTeamCountryCode: 'BZ',
      secondTeamCountryCode: 'CL',
      guesses: {
        create: {
          firtTeamPoints: 1,
          secondTeamPoints: 0,
          createdAt: '2022-10-21T14:30:00.534Z',

          participant: {
            connect: {
              userId_poolId: {
                userId: user1.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}
main()