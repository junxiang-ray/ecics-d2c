'use client';

import { ROUTES } from '@/constants/routes';
import { resetRenewalQuote } from '@/redux/slices/renewalQuote.slice';
import {
  ArrowRightOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

const RenewalHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      router.push(ROUTES.RENEWAL.PROFILE);
    }
    if (key === 'settings') {
      router.push(ROUTES.RENEWAL.SETTINGS);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    dispatch(resetRenewalQuote());
    router.push(ROUTES.RENEWAL.LOGIN);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'signout',
      label: <span className='text-red-500'>Sign Out</span>,
      icon: <ArrowRightOutlined />,
    },
  ];

  return (
    <div className='mx-auto flex h-[56px] max-w-[1200px] flex-row items-center justify-between px-6 md:px-0'>
      <img src='/ecics.svg' alt='ecics' />
      {/* <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement='bottomRight'
        trigger={['click']}
        dropdownRender={(menu) => (
          <div className='w-[150px] md:w-[200px]'>{menu}</div>
        )}
      >
        <div className='flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100'>
          <Avatar className='h-[28px] w-[28px] bg-[#1890ff]'>J</Avatar>
          <span className='hidden text-[13px] font-medium md:inline'>
            John Doe
          </span>
          <MenuOutlined style={{ color: 'black', fontSize: '12px' }} />
        </div>
      </Dropdown> */}
      <p
        className='cursor-pointer text-sm text-[#E7000B]'
        onClick={handleLogout}
      >
        Log out
      </p>
    </div>
  );
};

export default RenewalHeader;
