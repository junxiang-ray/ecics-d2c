import React, { useState } from "react";
import { Modal, Radio, Space, Drawer, Typography, Flex } from "antd";
import { PrimaryButton } from "./button";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

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

const titleFontStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', Arial, sans-serif",
  fontWeight: 700,
  fontSize: "1rem",
  lineHeight: "100%",
};

const commonFontStyle: React.CSSProperties = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  margin: 0,
  fontWeight: 400,
  fontSize: "0.9375rem",
  lineHeight: "100%",
};

export const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({
  vehicles,
  visible,
  onSubmit,
}) => {
  const screens = useBreakpoint(); // Gives you screen info like xs, sm, md, etc.
  const isMobile = !screens.md;
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
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        <Space direction="vertical" align="baseline" style={{ width: "100%" }}>
          {vehicles.map((vehicle, index) => (
            <Space key={index} direction="horizontal" align="baseline">
              <Radio key={index} value={vehicle.regNo}>
                <Flex>
                  <Typography.Paragraph
                    style={{
                      ...commonFontStyle,
                      whiteSpace: "nowrap",
                      width: "4.5rem",
                    }}
                  >
                    {vehicle.regNo}
                  </Typography.Paragraph>
                </Flex>
              </Radio>
              <Typography.Paragraph
                style={{
                  ...commonFontStyle,
                  padding: "0 0.5rem",
                  fontWeight: 900,
                }}
              >
                ●
              </Typography.Paragraph>
              <Typography.Paragraph
                style={{
                  ...commonFontStyle,
                  wordBreak: "break-word",
                  flex: 1,
                }}
              >
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
          style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        >
          <Typography.Title
            level={5}
            style={{
              ...titleFontStyle,
              marginTop: "0px",
              marginBottom: "1rem",
            }}
          >
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
