import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="nl">
      <Head>
        <meta name="description" content="Vergelijk vaatwasstrips van alle Nederlandse aanbieders. Bespaar tot 75% op je afwas met milieuvriendelijke alternatieven." />
        <meta name="keywords" content="vaatwasstrips, vergelijken, nederland, prijs, milieuvriendelijk" />
        <meta property="og:title" content="Vaatwasstrips Vergelijker Nederland" />
        <meta property="og:description" content="De meest complete vergelijking van vaatwasstrips" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}