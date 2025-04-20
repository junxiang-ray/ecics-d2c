"use client";

import React, { useState } from "react";
import { Modal, Radio, Space, Drawer, Typography } from "antd";
import { PrimaryButton } from "./button";
import { useDeviceDetection } from "@/providers/useDeviceDetection";

export interface VehicleSelection {
  regNo: string;
  vehMake: string;
  vehModel: string;
}

interface VehicleSelectionModalProps {
  vehicles: VehicleSelection[];
  visible: boolean;
  onSubmit: (selected: VehicleSelection | null) => void;
}

const titleFontClass = "font-bold text-base leading-none break-words";
const commonFontClass = "mt-3 font-normal text-base leading-none break-words";

export const VehicleSelectionModal = ({
  vehicles,
  visible,
  onSubmit,
}: VehicleSelectionModalProps) => {
  const { isMobile } = useDeviceDetection();
  const [selected, setSelected] = useState<string | null>(null);

  const onClick = () => {
    const selectedVehicle = vehicles.find((v) => v.regNo === selected);
    onSubmit(selectedVehicle || null);
    setSelected(null);
  };

  const content = (
    <>
      <Radio.Group
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
        className="w-full"
      >
        <Space direction="vertical" className="my-3">
          {vehicles.map((vehicle, index) => (
            <Space
              key={index}
              direction="horizontal"
              align="baseline"
              className="w-full -my-3"
            >
              <Radio key={index} value={vehicle.regNo}>
                <Typography.Paragraph className={commonFontClass + " w-20"}>
                  {vehicle.regNo}
                </Typography.Paragraph>
              </Radio>
              <Typography.Paragraph className={commonFontClass}>
                ●
              </Typography.Paragraph>
              <Typography.Paragraph className={commonFontClass}>
                {vehicle.vehMake} {vehicle.vehModel}
              </Typography.Paragraph>
            </Space>
          ))}
        </Space>
      </Radio.Group>

      <PrimaryButton
        htmlType="button"
        label="Continue"
        onClick={onClick}
        disabled={!selected}
      ></PrimaryButton>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          placement="bottom"
          open={visible}
          closable={false}
          height="auto"
          className="rounded-t-xl"
        >
          <Typography.Title level={5} className={titleFontClass}>
            Select the vehicle you want to insure now
          </Typography.Title>
          {content}
        </Drawer>
      ) : (
        <Modal
          title="Select the vehicle you want to insure now"
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
