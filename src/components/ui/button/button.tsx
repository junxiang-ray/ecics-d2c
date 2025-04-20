import { Button } from "antd";

interface ButtonProps {
  htmlType: "button" | "submit" | "reset";
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PrimaryButton = ({
  htmlType,
  label,
  disabled,
  onClick,
  className,
}: ButtonProps) => {
  const defaultClass = "w-full px-[18px] py-0 text-[16px] font-semibold";
  if (!className) className = defaultClass;
  return (
    <Button
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? '' : 'bg-brand-blue text-white'}`}
    >
      {label}
    </Button>
  );
};
