'use client';

import { Drawer, Modal, Radio, Space, Typography } from 'antd';
import React, { useState } from 'react';

import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { VehicleSelection } from '@/interfaces/vehicle.interface';

import { PrimaryButton } from './ui/buttons';

interface VehicleSelectionModalProps {
  isReviewScreen?: boolean;
  vehicles: VehicleSelection[];
  visible: boolean;
  onSubmit: (selected: VehicleSelection | null) => void;
}

const defaultProps = {
  isReviewScreen: false,
};

const commonFontClass = 'mt-3 font-normal text-base leading-none break-words';

export const VehicleSelectionModal = ({
  isReviewScreen,
  vehicles,
  visible,
  onSubmit,
}: VehicleSelectionModalProps) => {
  const { isMobile } = useDeviceDetection();
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = () => {
    const selectedVehicle = vehicles.find((v) => v.regNo === selected);
    onSubmit(selectedVehicle || null);
    setSelected(null);
  };

  const content = (
    <>
      {isReviewScreen && (
        <div className='mb-3 text-base'>
          We have found multiple vehicles in your Myinfo data
        </div>
      )}
      <div className='mb-3 break-words text-base font-bold leading-none'>
        Select the vehicle you want to insure now
      </div>

      <Radio.Group
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
        className='w-full'
      >
        <Space direction='vertical' className='my-3 w-full'>
          {vehicles?.map((vehicle, index) => (
            <Space
              key={index}
              direction='horizontal'
              align='baseline'
              className='-my-3 w-full'
            >
              <Radio key={index} value={vehicle.regNo}>
                <Typography.Paragraph className={`${commonFontClass} w-32`}>
                  {vehicle.regNo}
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
        onClick={handleClick}
        disabled={!selected}
        className='w-full'
      >
        {isReviewScreen ? 'Submit' : 'Continue'}
      </PrimaryButton>
    </>
  );

  return isMobile ? (
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
      onOk={handleClick}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
      centered
    >
      {content}
    </Modal>
  );
};

VehicleSelectionModal.defaultProps = defaultProps;
