import Head from 'next/head'
import Link from 'next/link'
import { SiteMenu } from '@/components/SiteMenu'

export default function LandingPage() {
  const currentPage = "home";
  return (
    <div className="min-h-screen">
      <SiteMenu currentPage={currentPage} />
      <Head>
        <title>{`${currentPage} - marlow.ai`}</title>
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
        <ul className="list-none text-light font-light pl-0 ml-0">
          <li className="list-desc">Add books to library</li>
          <li className="list-desc">Generate recommendations</li>
          <li className="list-desc">Add ones you like to your pile to read</li>
        </ul>
        <Link className="text-m mb-8 font-light" href="/library">
          Try it out
        </Link>

      </main>
    </div>
  )
}
