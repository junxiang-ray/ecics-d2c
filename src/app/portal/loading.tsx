import { Spin } from 'antd';

export default function Loading(): JSX.Element {
  return <Spin className='pointer-events-none' fullscreen delay={150} />;
}
