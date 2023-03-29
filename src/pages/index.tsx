import Head from 'next/head'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>home - marlow.ai</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 py-20 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to marlow.ai ✨</h1>
        <p className="text-xl mb-8 text-center font-light">Good book recommendations, seriously</p>
      </main>
    </div>
  )
}
