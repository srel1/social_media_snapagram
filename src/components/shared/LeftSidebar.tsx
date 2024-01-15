import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { INITIAL_USER, useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queries';

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { user, setIsAuthenticated, setUser } = useUserContext();
  const {mutate: signOut} = useSignOutAccount();
  const  navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false)
    setUser(INITIAL_USER)
    navigate('/sign-in')
  }

  return (
    <nav className='hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-dark-2'>
      <div className='flex flex-col gap-11'>
        <Link to={'/'}>
          <img src='/assets/image/logo.svg'
            alt='logo'
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`}
          className='flex gap-3 items-center'
        >
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt='profile'
            className='h-14 w-14 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='body-bold'>{user.name}</p>
            <p className='small-regular text-light-3'>@{user.username}</p>
          </div>
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`rounded-lg base-medium hover:bg-primary-500 transition ${isActive && 'bg-primary-500'}`}>
                <NavLink to={link.route}
                  className='flex gap-4 items-center p-4'
                >
                <img 
                  src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button 
        variant='ghost'
        className='flex gap-4 items-center justify-start hover:bg-transparent hover:text-white !important'
        onClick={(e) => handleSignOut(e)}
      >
        <img
          src='/assets/icons/logout.svg'
          alt='logout'
        />
        <p className='base-medium'>Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar