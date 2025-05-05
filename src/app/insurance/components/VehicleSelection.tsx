'use client';

import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { Drawer, Modal, Radio, Space, Typography } from 'antd';
import { useState } from 'react';
import { PrimaryButton } from '../../../components/ui/buttons';
import { Vehicle } from '@/libs/types/quote';

interface VehicleSelectionModalProps {
  vehicles: Vehicle[];
  visible: boolean;
  selected?: Vehicle | null;
  setSelected: (selected: Vehicle | null) => void;
}

const commonFontClass = 'mt-3 font-normal text-base leading-none break-words';

export const VehicleSelectionModal = ({
  vehicles,
  visible,
  selected,
  setSelected,
}: VehicleSelectionModalProps) => {
  const { isMobile } = useDeviceDetection();
  const [selectedChasisNumber, setSelectedChasisNumber] = useState(
    selected?.chasis_number,
  );

  const onClick = () => {
    const selectedVehicle = vehicles.find(
      (v) => v.chasis_number === selectedChasisNumber,
    );
    setSelected(selectedVehicle || null);
  };
  const content = (
    <>
      <div className='mb-3 break-words text-base font-bold leading-none'>
        Select the vehicle you want to insure now
      </div>
      <Radio.Group
        onChange={(e) => setSelectedChasisNumber(e.target.value)}
        value={selectedChasisNumber}
        className='w-full'
      >
        <Space direction='vertical' className='my-3'>
          {vehicles?.map((vehicle, index) => (
            <Space
              key={index}
              direction='horizontal'
              align='baseline'
              className='-my-3 w-full'
            >
              <Radio key={index} value={vehicle.chasis_number}>
                <Typography.Paragraph className={commonFontClass + ' w-32'}>
                  {vehicle.chasis_number}
                </Typography.Paragraph>
              </Radio>
              <Typography.Paragraph className={commonFontClass}>
                ●
              </Typography.Paragraph>
              <Typography.Paragraph className={commonFontClass}>
                {vehicle.make} {vehicle.model}
              </Typography.Paragraph>
            </Space>
          ))}
        </Space>
      </Radio.Group>

      <PrimaryButton
        onClick={onClick}
        disabled={!selectedChasisNumber}
        className='w-full'
      >
        Continue
      </PrimaryButton>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          placement='bottom'
          open={visible}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          {content}
        </Drawer>
      ) : (
        <Modal
          open={visible}
          onOk={onClick}
          closable={false}
          maskClosable={false}
          keyboard={false}
          footer={null}
          centered
        >
          {content}
        </Modal>
      )}
    </>
  );
};
