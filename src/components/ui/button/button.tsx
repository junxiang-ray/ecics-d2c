import { Button } from "antd";

interface ButtonProps {
  htmlType: "button" | "submit" | "reset";
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PrimaryButton = ({
  htmlType,
  label,
  disabled,
  onClick,
  className,
  style,
}: ButtonProps) => {
  const defaultClass = "w-full px-[18px] py-0 text-[16px] font-semibold";
  if (!className) className = defaultClass;
  return (
    <Button
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...style,
      }}
    >
      {label}
    </Button>
  );
};
