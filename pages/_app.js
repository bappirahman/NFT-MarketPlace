import '../styles/globals.css'
import Link from 'next/link'

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <nav className='border-b p-6'>
        <h1 className='text-4xl font-bold'>NFT MarketPlace</h1>
        <div className='flex mt-4' >
          <Link href="/">
            <a className='mr-6 text-pink-500 font-medium' >
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a className='mr-6 text-pink-500 font-medium' >
              Create NFT
            </a>
          </Link>
          <Link href="/my-assets">
            <a className='mr-6 text-pink-500 font-medium' >
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className='mr-6 text-pink-500 font-medium' >
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  ) 
}

export default MyApp;