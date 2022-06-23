import '../styles/globals.css'
import Link from 'next/link'

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <p className='bg-black text-white text-center' >Note: Please Use Rinkeby Testnet </p>
      <nav className='border-b py-6 navbar'>
        <Link href="/">
          <h1 className='text-4xl font-bold cursor-pointer inline ml-5'>NFT MarketPlace</h1>
        </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        <div className='flex float-right collapse navbar-collapse' >
          <Link className='navbar-item' href="/">
            <a className='mr-6 text-pink-500 font-medium' >
              Home
            </a>
          </Link>
          <Link className='navbar-item' href="/create-items">
            <a className='mr-6 text-pink-500 font-medium' >
              Create NFT
            </a>
          </Link>
          <Link className='navbar-item' href="/my-assets">
            <a className='mr-6 text-pink-500 font-medium' >
              My Digital Assets
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  ) 
}

export default MyApp;