import Link from 'next/link'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href='/'>
      <Image
        src='/images/logo/cropped-PHLogo300dpi.webp'
        alt='logo'
        width={151}
        height={56}
        className='lg:w-80 sm:w-48 block dark:hidden'        
      />
      <Image
        src='/images/logo/cropped-PHLogo300dpi.webp'
        alt='logo'
        width={151}
        height={56}
        className='lg:w-80 sm:w-48 hidden dark:block'        
      />
    </Link>
  )
}

export default Logo
