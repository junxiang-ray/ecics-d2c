import EditIcon from '@/components/icons/EditIcon';
import { SecondaryButton } from '@/components/ui/buttons';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { InsuranceAdditionalInfo, Vehicle } from '@/libs/types/quote';

interface Props {
  vehicleInfo?: Vehicle;
  insuranceAdditionalInfo?: InsuranceAdditionalInfo;
}

const HeaderPlan = ({ vehicleInfo, insuranceAdditionalInfo }: Props) => {
  const router = useRouterWithQuery();

  const CAR_INFO = [
    `${vehicleInfo?.vehicle_make} ${vehicleInfo?.vehicle_model}`,
    vehicleInfo?.chasis_number,
    vehicleInfo?.first_registered_year,
    `NCD: ${insuranceAdditionalInfo?.no_claim_discount}%`,
    `Policy Period: ${insuranceAdditionalInfo?.start_date} to ${insuranceAdditionalInfo?.end_date}`,
  ];

  const renderInfoCar = () => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        {CAR_INFO.map((item, index) => {
          const isRedBackground = index === 1 || index === 2;
          const isLastItem = index === CAR_INFO.length - 1;
          return (
            <div key={index} className='flex items-center gap-4'>
              <p
                className={`rounded-lg px-4 py-2 text-base font-semibold text-[#151515] ${
                  isRedBackground ? 'bg-[#00ADEF] text-white' : 'bg-[#0000000D]'
                }`}
              >
                {item}
              </p>
              {!isLastItem && <p className='h-1 w-1 rounded-full bg-black'></p>}
            </div>
          );
        })}
      </div>

      <div className='flex flex-row'>
        <div className='flex items-center gap-4'>
          <p className='rounded-lg bg-[#0000000D] px-4 py-2 text-base font-semibold text-[#151515]'>
            Claims in past 3 years: {insuranceAdditionalInfo?.no_of_claim}
          </p>
        </div>
        {/* <div className='flex items-center gap-4'>
          <p className='rounded-lg bg-[#0000000D] px-4 py-2 text-base font-semibold text-[#151515]'>
            Last Claim Amount: 
          </p>
        </div> */}
      </div>
    </div>
  );

  return (
    <div className='hidden w-full items-center justify-between gap-4 rounded-2xl border border-[#EEEEEE] px-6  py-3 shadow-sm md:flex md:flex-col xl:flex-row xl:gap-6'>
      {renderInfoCar()}
      <SecondaryButton
        className='flex items-center rounded-[52px] bg-[#00ADEF] px-5 py-2 font-bold text-white'
        icon={<EditIcon size={18} className='mt-1' />}
        onClick={() => router.push(ROUTES.INSURANCE.BASIC_DETAIL)}
      >
        Edit
      </SecondaryButton>
    </div>
  );
};

export default HeaderPlan;
