import { Html, Head, Main, NextScript } from "next/document"

export default function Document(){
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-gray-900 bg-app bg-no-repeat bg-cover">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// Next Não fornece o index.html, logo preciso criar o document para importar a minha font