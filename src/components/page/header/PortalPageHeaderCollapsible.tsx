import type { GetProp, MenuProps } from 'antd';

import { ROUTES } from '@/constants/routes';

import { Drawer, Menu } from 'antd';

import EcicsIcon from '/public/ecics.svg';
import DocumentOutlined from '@/assets/icons/document-oulined.svg';
import FileCheckOutlined from '@/assets/icons/file-check-outlined.svg';
import GiftOutlined from '@/assets/icons/renewal/gift.svg';
import HomeOutlined from '@/assets/icons/add-on/home-outlined.svg';
import InfoCircleOutlined from '@/assets/icons/add-on/info-circle-outlined.svg';
import LogoutOutlined from '@/assets/icons/logout-outlined.svg';
import ShieldOutlined from '@/assets/icons/renewal/shield.svg';
import ScrollTextOutlined from '@/assets/icons/scroll-text-outlined.svg';
import ProfileOutlined from '@/assets/icons/renewal/policy-holder.svg';

type MenuItem = GetProp<MenuProps, 'items'>[number];

interface Props {
  open: boolean;
  pathName: string;
  onClose: () => void;
  onSelect: (path: string) => void;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: ROUTES.PORTAL.HOME.ROOT,
    label: 'Home',
    icon: <HomeOutlined width='17.5' height='17.5' />,
  },
  {
    key: ROUTES.PORTAL.POLICIES.ROOT,
    label: 'Policies',
    icon: <FileCheckOutlined width='17.5' height='17.5' />,
  },
  {
    key: ROUTES.PORTAL.CLAIMS.ROOT,
    label: 'Claims',
    icon: <InfoCircleOutlined width='17.5' height='17.5' />,
  },
  {
    key: ROUTES.PORTAL.REWARDS.ROOT,
    label: 'Rewards',
    icon: <GiftOutlined width='17.5' height='17.5' />,
  },
  {
    type: 'divider',
    className: 'my-4',
  },
  {
    key: ROUTES.PORTAL.PROFILE.ROOT,
    label: 'Profile',
    icon: <ProfileOutlined width='17.5' height='17.5' />,
  },
  {
    key: ROUTES.PORTAL.PAYMENT_METHODS.ROOT,
    label: 'Payment Methods',
    icon: <DocumentOutlined width='17.5' height='17.5' />,
  },
  {
    type: 'divider',
    className: 'my-4',
  },
  {
    key: ROUTES.PORTAL.TERM.ROOT,
    label: 'Terms and Conditions',
    icon: <ScrollTextOutlined width='17.5' height='17.5' />,
  },
  {
    key: ROUTES.PORTAL.PRIVACY_POLICY.ROOT,
    label: 'Privacy Policy',
    icon: <ShieldOutlined width='17.5' height='17.5' />,
  },
  {
    type: 'divider',
    className: 'my-4',
  },
  {
    key: ROUTES.PORTAL.LOGIN,
    label: <span className='text-red-500'>Sign Out</span>,
    icon: (
      <LogoutOutlined className='text-red-500' width='17.5' height='17.5' />
    ),
  },
];

const PortalPageHeaderCollapsible = ({
  open,
  pathName,
  onClose,
  onSelect,
}: Props): JSX.Element => {
  const activeKeys: string[] = [pathName.split('/').at(1) ?? ''];

  const onMenuClick = ({ keyPath }: { keyPath: string[] }): void => {
    // if (keyPath?.at(0) === ROUTES.PORTAL.LOGIN) {
    //   // todo: handle logic logout here
    //   return;
    // }

    onClose();
    onSelect(keyPath.join('/'));
  };

  return (
    <Drawer
      title={<EcicsIcon height='28' width='93' />}
      placement='left'
      width='auto'
      classNames={{
        header:
          '[&_.ant-drawer-header-title]:flex [&_.ant-drawer-header-title]:flex-row-reverse p-4 pr-3 mb-4',
        body: 'p-0 sm:max-w-sm w-[280px] sm:w-[320px]',
      }}
      open={open}
      onClose={onClose}
    >
      <Menu
        className='[&_.ant-menu-item].rounded-lg mt-4 border-none [&_.ant-menu-item.ant-menu-item-selected]:text-primary [&_.ant-menu-item:not(:last-child)]:mb-1 [&_.ant-menu-item]:m-0 [&_.ant-menu-item]:w-full [&_.ant-menu-item]:select-none [&_.ant-menu-item]:px-4 [&_.ant-menu-item]:py-3 [&_.ant-menu-item]:font-medium [&_.ant-menu-item]:text-gray-600'
        mode='inline'
        items={MENU_ITEMS}
        selectedKeys={activeKeys}
        onClick={onMenuClick}
      />
    </Drawer>
  );
};
export default PortalPageHeaderCollapsible;
