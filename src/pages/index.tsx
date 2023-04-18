import Head from 'next/head';
import Link from 'next/link';


export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>home - marlow.ai</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 py-20 font-sans text-center">
        <h1 className="text-4xl font-bold mb-8 ">Welcome to marlow.ai ✨</h1>
        <p className="text-xl mb-8 font-light">Good book recommendations</p>
        <p className="text-xl mb-8 font-light"> </p>
        <div className="flex justify-center text-m">
          <p className="relative border-l-4 border-gray-500 pl-4 py-2 italic font-light">
            The most wholesome use case I’ve heard [for AI] so far
            <span className="absolute top-0 left-0 text-gray-500 text-4xl">&ldquo;</span>
          </p>
        </div>
        <Link className="text-m mb-8 font-light" href="/manage">
          Try it out
        </Link>

      </main>
    </div>
  )
}
