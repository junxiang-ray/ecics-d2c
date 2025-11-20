'use client';

import { ROUTES } from '@/constants/routes';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import Link from 'next/link';
import { Divider, Dropdown } from 'antd';

import HeaderCollapsible from './PortalPageHeaderCollapsible';

import EcicsIcon from '/public/ecics.svg';
import DocumentOutlined from '@/assets/icons/document-oulined.svg';
import MenuOutlined from '@/assets/icons/menu-outlined.svg';
import LogoutOutlined from '@/assets/icons/logout-outlined.svg';
import ShieldOutlined from '@/assets/icons/renewal/shield.svg';
import ScrollTextOutlined from '@/assets/icons/scroll-text-outlined.svg';
import ProfileOutlined from '@/assets/icons/renewal/policy-holder.svg';

const PortalPageHeader = (): JSX.Element => {
  const pathName = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const navItems = useRef([
    { name: 'Home', path: ROUTES.PORTAL.HOME.ROOT },
    { name: 'Policies', path: ROUTES.PORTAL.POLICIES.ROOT },
    { name: 'Claims', path: ROUTES.PORTAL.CLAIMS.ROOT },
    { name: 'Rewards', path: ROUTES.PORTAL.REWARDS.ROOT },
  ]).current;

  const dropdownItems = useRef([
    {
      key: 'profile',
      routerPath: ROUTES.PORTAL.HOME.ROOT,
      icon: <ProfileOutlined height='14' width='14' />,
      label: 'Profile',
    },
    {
      key: 'payment',
      routerPath: ROUTES.PORTAL.HOME.ROOT,
      icon: <DocumentOutlined height='14' width='14' />,
      label: 'Payment Methods',
    },
    { type: 'divider' },
    {
      key: 'terms',
      routerPath: ROUTES.PORTAL.HOME.ROOT,
      icon: <ScrollTextOutlined height='14' width='14' />,
      label: 'Terms and Conditions',
    },
    {
      key: 'privacy',
      routerPath: ROUTES.PORTAL.HOME.ROOT,
      icon: <ShieldOutlined height='14' width='14' />,
      label: 'Privacy Policy',
    },
    { type: 'divider' },
    {
      key: 'sign-out',
      className: 'text-red-500',
      icon: <LogoutOutlined height='14' width='14' />,
      label: 'Sign Out',
      onClick: () => {
        // todo: Handle signout here.
      },
    },
  ]).current;

  const overlayPanel: JSX.Element = (
    <div className='text-popover-foreground w-56 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-white p-1 font-body shadow-md'>
      {dropdownItems.map((item, idx) =>
        item.type === 'divider' ? (
          <Divider key={idx} className='m-1' />
        ) : item.routerPath ? (
          <Link key={item.key} href={item.routerPath} legacyBehavior>
            <button
              className={`transition-bg flex w-full cursor-pointer flex-nowrap items-center gap-3.5 rounded-md px-3.5 py-2 text-sm text-gray-500 duration-200 hover:bg-gray-200 ${item.className ?? ''}`}
            >
              {item.icon}
              <span className='text-nowrap leading-tight opacity-95 hover:opacity-100'>
                {item.label}
              </span>
            </button>
          </Link>
        ) : (
          <button
            key={item.key}
            className={`transition-bg flex w-full cursor-pointer flex-nowrap items-center gap-3.5 rounded-md px-3.5 py-2 text-sm text-gray-500 duration-200 hover:bg-gray-200 ${item.className ?? ''}`}
            onClick={item.onClick}
          >
            {item.icon}
            <span className='text-nowrap leading-tight opacity-90 hover:opacity-100'>
              {item.label}
            </span>
          </button>
        ),
      )}
    </div>
  );

  return (
    <>
      <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm'>
        <div className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <button
              className='rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 md:hidden'
              aria-label='Open navigation menu'
              onClick={() => setOpenMenu(true)}
            >
              <MenuOutlined className='text-gray-700' height='18' width='18' />
            </button>
            <div className='absolute left-1/2 flex -translate-x-1/2 items-center md:static md:mr-auto md:translate-x-0'>
              <EcicsIcon height='28' width='auto' />
            </div>
            <nav className='hidden items-center font-body md:mr-8 md:flex [&>*:not(:last-child)]:mr-8'>
              {navItems.map((navItem) => (
                <Link key={navItem.path} href={navItem.path} legacyBehavior>
                  <button
                    className={`font-medium transition-colors duration-200 hover:text-[#02ADEF]/90 ${
                      pathName.startsWith(navItem.path) ? 'text-[#02ADEF]' : ''
                    }`}
                  >
                    {navItem.name}
                  </button>
                </Link>
              ))}
            </nav>

            <Dropdown
              overlay={overlayPanel}
              placement='bottomRight'
              trigger={['click']}
            >
              <button className='flex items-center rounded-lg p-2 font-body transition-colors duration-200 hover:bg-gray-100 [&>*:not(:last-child)]:mr-3'>
                <div className='flex aspect-square h-8 items-center justify-center rounded-full bg-[#02adef]'>
                  <span className='text-[.875em] font-medium text-white'>
                    J
                  </span>
                </div>
                <div className='hidden text-left sm:block'>
                  <p className='text-sm font-medium text-gray-900'>John Doe</p>
                </div>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>

      <HeaderCollapsible
        open={openMenu}
        pathName={pathName}
        onClose={() => setOpenMenu(false)}
        onSelect={(path) => router.push(path)}
      />
    </>
  );
};
export default PortalPageHeader;
