import '@/components/header/header.scss'
import Logo from '@/assets/img/logo.svg'

const Header: React.FC = () => {
  return (
    <div className='header'>
      <div className='inner'>
        <div className='logo'>
          <img src={Logo}></img>
        </div>
      </div>
    </div>
  )
}

export default Header;