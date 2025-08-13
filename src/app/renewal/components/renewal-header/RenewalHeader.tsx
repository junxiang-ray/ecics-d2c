'use client';

import {
  ArrowRightOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

const RenewalHeader = () => {
  const router = useRouter();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      router.push('/renewal/profile');
    }
    if (key === 'settings') {
      router.push('/renewal/settings');
    }
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
    <div className='flex h-[56px] flex-row items-center justify-between px-6 md:px-14'>
      <img src='/ecics.svg' alt='ecics' />
      <Dropdown
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
      </Dropdown>
    </div>
  );
};

export default RenewalHeader;
