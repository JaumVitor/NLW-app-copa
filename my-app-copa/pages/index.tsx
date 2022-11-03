interface HomeProps {
  count: number
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Hello word!</h1>
      <h2>Contagem: {props.count}</h2>
    </div>
  )
}

export const getServerSideProps = async () => {
  // Function rodando no lado do server, o console.log() não aparece no browser
  // Consumindo minha propia api, e enviando para o componente Home
  const response = await fetch('http://localhost:8080/pools/count')
  const data = await response.json()
  
  return {
    props: {
      count: data.count
    }
  }  
}
