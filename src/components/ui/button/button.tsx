import { Button } from "antd";

interface ButtonProps {
  htmlType: "button" | "submit" | "reset";
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const PrimaryButton = ({
  htmlType,
  label,
  disabled,
  onClick,
  style,
}: ButtonProps) => {
  return (
    <Button
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "18px 0px",
        fontSize: 16,
        fontWeight: 600,
        ...(disabled
          ? {}
          : {
              background: "#00ADEF",
              color: "#FFFFFF",
            }),
        ...style,
      }}
    >
      {label}
    </Button>
  );
};
