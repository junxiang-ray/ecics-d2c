import BoxIcon from '@/components/ui/BoxIcon';

interface Props {
  icon?: JSX.Element;
  title?: JSX.Element | string;
  subTitle?: JSX.Element | string;
  children?: JSX.Element;
}

const PolicyCard = ({
  icon,
  title,
  subTitle,
  children,
}: Props): JSX.Element | null => {
  if (!children) return null;

  return (
    <div
      className='text-card-foreground mb-6 flex flex-col gap-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'
      data-slot='card'
    >
      <div
        className='has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 border-b border-gray-100 bg-gradient-to-r from-[#02ADEF1A] via-[#EBF8FFCC] to-[#EEF2FF80] p-8'
        data-slot='card-header'
      >
        <div className='flex items-center gap-4'>
          <BoxIcon
            icon={icon ?? <></>}
            className='text-primary [&_.boxIcon-overlay]:rounded-2xl'
          />
          <div>
            <p className='font-heading m-0 mb-1 text-2xl font-bold text-gray-800'>
              {title}&nbsp;
            </p>
            <p className='font-body mt-1 text-sm text-gray-600'>
              {subTitle}&nbsp;
            </p>
          </div>
        </div>
      </div>
      <div className='[&amp;:last-child]:pb-6 p-8' data-slot='card-content'>
        {children}
      </div>
    </div>
  );
};
export default PolicyCard;
