import { Link } from 'react-router-dom';
import '@/components/nav/nav.scss';

const Nav = () => {
  return (
    <div className='nav'>
      <nav className='nav-bar'>
        <div className='nav-bar-logo'>
          <div></div>
        </div>
        <div className='nav-bar-content'>
          <ul className='nav-bar-menu'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/work">Work</Link></li>
            <li><Link to="/culture">Culture</Link></li>
            <li><Link to="/rule">Rule</Link></li>
          </ul>
          <div className='nav-bar-user'>
            <div className='nav-user-login'><Link to='/login'>Login</Link></div>
            <div className='nav-user'></div>
            <ul className='user-down'></ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;