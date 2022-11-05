import Image from 'next/image'
import { FormEvent, useState } from 'react'

import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatars from '../assets/users-avatars.png'
import InfoStats from '../components/InfoStats'
import { api } from '../lib/axios'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  
  const createPoll = async (event: FormEvent) => {
    // Função vai emitir um post, para o endpoint 
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data
      await navigator.clipboard.writeText(code )

      alert('Seu bolão foi criado com sucesso, o codigo foi copiado na area de trasferência!')
      setPoolTitle('')

      return { code: code }

    } catch (err) {
      console.log(err)
      alert('Falha ao tentar criar bolão')
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoolTitle(e.target.value)
  }

  return (
    <div className='max-w-[1024px] h-[100vh] mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image className='mb-14' src={logoImg} alt='Logo NLW-copa' />
        <h1 className='text-white text-5xl font-bold leading-tight'>
          Crie seu bolão da copa e compartilhe com seus amigos!
        </h1>

        <div className='my-10 flex items-center gap-2'>
          <Image src={usersAvatars} alt='Representação dos usuarios do app NLW-copa' />
          <strong className='text-white text-xl'>
            <span className='text-green-600'>+{userCount} pessoas</span> já estão usando
          </strong>
        </div>

        {/* OnSubmit só é disparada quando submeter o form */}
        <form onSubmit={createPoll} className='flex gap-2 mb-4'>
          <input 
            type="text" 
            placeholder='Qual o nome do seu bolão ?' 
            required
            className='bg-gray-800 border border-gray-600 text-sm text-gray-100 flex-1 px-6 py-4 rounded'
            value={poolTitle}
            onChange={handleOnChange}
            // Simplificada : event => setPoolTitle(event.target.value)
          />
          <button 
            className='bg-yellow-500 px-6 py-4 text-sm uppercase font-bold rounded hover:bg-yellow-600 transition duration-150'
            type='submit'>
              criar meu bolão
          </button>
        </form>

        <p className='text-gray-300 text-sm leading-7 mb-10'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='flex justify-between border-t border-gray-600 py-10 items-center'>
          <InfoStats
            contentNumber={poolCount}
            contentText={'Bolões criados'}
          />
          <div className='w-px h-20 bg-gray-600'></div>
          <InfoStats
            contentNumber={guessCount}
            contentText={'Palpites enviados'}
          />
        </div>
      </main>
      
      <Image 
        src={appPreviewImage} 
        alt='Dois celulares exibindo o app do bolão NLW'
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  // Function rodando no lado do server, o console.log() não aparece no browser
  // Consumindo minha propia api, e enviando para o componente Home
  // Uso o axios para armazenar a url base

  // Criando concorrencias de chamadas a api
  const [
    poolCountResponse,
    guessCountResponse,
    userCountResponse
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }  
}
