'use client';

import EnhancedAccidentIcon from '@/components/icons/EnhancedAccidentIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PersonalAccidentIcon from '@/components/icons/PersonalAccidentIcon';
import RepairIcon from '@/components/icons/RepairIcon';
import RoadSideIcon from '@/components/icons/RoadSideIcon';
import {
  useGetQuote,
  useSaveProposal,
  useSaveQuote,
} from '@/hook/insurance/quote';
import { UserStep } from '@/libs/enums/processBarEnums';
import { Addon, Option, ProposalPayload } from '@/libs/types/quote';
import { Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PricingSummary } from '../components/FeeBar';
// import HeaderVehicleInfo from '../plan/components/HeaderVehicleInfo';
import AddonAdditionalDriver, { ADDON_CARS } from './AddonAdditionalDriver';
import AddOnRowDetail from './AddOnRowDetail';
import AddOnBonusDetailManualForm from './bonus-personal-detail/AddOnBonusDetailManualForm';
import ModalPremium from './ModalPremium';
import AddOnRow from './AddOnRow';
import TruncateText from './TruncateText ';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';

const mapIconToTypeAddOn = [
  {
    code: 'CAR_COM_ANW',
    icon: <KeyIcon className='text-brand-blue' />,
    isRecommended: true,
  },
  {
    code: 'CAR_COM_AJE',
    icon: <RepairIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_AND',
    icon: <RoadSideIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_BUN',
    icon: <EnhancedAccidentIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_LOU',
    icon: <PersonalAccidentIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_PAC',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_MDE',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_RSA',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_KRC',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_NOR',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
];

export interface AddOnFormat extends Addon {
  icon: JSX.Element | null;
  selectedOption: Option | null;
  feeAdded: number; // feeAdded is the fee used to calculate the premium for the addon

  activeOption: Option | null;
  feeSelected: number; // feeSelected is the fee used to show fee when user change option
}

function calculateFee(
  option: Option,
  addonsAdded: Record<string, string>,
): number {
  if (
    !option?.dependencies ||
    option.dependencies.length === 0 ||
    !addonsAdded ||
    Object.keys(addonsAdded).length === 0
  ) {
    return option.premium_with_gst ?? 0;
  }

  const dependency = option.dependencies.find((dep) =>
    dep.conditions.every(
      (condition) => addonsAdded[condition.addon.code] === condition.value,
    ),
  );
  return dependency?.premium_with_gst ?? 0;
}

function AddOnDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouterWithQuery();
  const key = searchParams.get('key') || '';
  const isManual = searchParams.get('manual') === 'true';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [addonsAdded, setAddonsAdded] = useState<any>(null);
  const [addonsSelected, setAddonsSelected] = useState<any>(null);
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const [isShowBonusDetail, setIsShowBonusDetail] = useState(false);
  const { data: quoteInfo, isLoading } = useGetQuote(key);
  const { mutateAsync: saveQuote, isPending } = useSaveQuote();

  const plan = useMemo(() => {
    return quoteInfo?.data?.plans?.find(
      (plan) => quoteInfo.data?.selected_plan === plan.title,
    );
  }, [quoteInfo]);

  const addonAdditionalDriver = useMemo(() => {
    return plan?.addons.find((addon) => ADDON_CARS.includes(addon.code));
  }, [plan]);

  const normalAddons = useMemo(() => {
    return (
      plan?.addons.filter((addon) => !ADDON_CARS.includes(addon.code)) ?? []
    );
  }, [plan]);

  const defaultAddonsAdded = useMemo(() => {
    if (!normalAddons.length) return {};
    const addonCodes = normalAddons.map((addon) => addon.code);
    return Object.fromEntries(
      addonCodes.map((code) => [
        code,
        quoteInfo?.data?.selected_addons?.[code] ?? 'NO',
      ]),
    );
  }, [normalAddons, quoteInfo]);

  const defaultAddonsSelected = useMemo(() => {
    if (!plan?.addons.length) return {};
    const selected_addons = quoteInfo?.data?.selected_addons ?? {};
    return plan.addons.reduce(
      (acc: Record<string, string>, addon) => {
        if (addon.type === 'checkbox') {
          acc[addon.code] = 'YES';
        } else {
          const selectedValue = selected_addons?.[addon.code];
          if (selectedValue && selectedValue !== 'NO') {
            acc[addon.code] = selectedValue;
          } else {
            const defaultOption = addon.options.find(
              (option) => option.id === addon.default_option_id,
            );
            acc[addon.code] = defaultOption
              ? defaultOption.value
              : addon.options[0]?.value;
          }
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [plan, quoteInfo]);

  useEffect(() => {
    setDrivers(quoteInfo?.data?.add_named_driver_info ?? []);
    setAddonsAdded(defaultAddonsAdded);
    setAddonsSelected(defaultAddonsSelected);
  }, [defaultAddonsAdded, defaultAddonsSelected]);

  const addonsFormatted: AddOnFormat[] = normalAddons.map((addon) => {
    // map the icon to the addon
    const iconMatched = mapIconToTypeAddOn.find(
      (item) => item.code === addon.code,
    );

    // For feeAdded use the "addonsAdded" defaults
    const initValueForAdded = addonsAdded?.[addon.code] ?? null;
    const selectedOptionForAdded = addon.options.find(
      (option) => option.value === initValueForAdded,
    );
    const feeAdded = selectedOptionForAdded
      ? calculateFee(selectedOptionForAdded, addonsAdded)
      : 0;

    // For feeSelected use the "addonsSelected" defaults
    const initValueForSelected = addonsSelected?.[addon.code] ?? null;
    const activeOption = addon.options.find(
      (option) => option.value === initValueForSelected,
    );
    const feeSelected = activeOption
      ? calculateFee(activeOption, addonsAdded)
      : 0;

    return {
      ...addon,
      icon: iconMatched?.icon || null,
      selectedOption: selectedOptionForAdded ?? null,
      feeAdded: feeAdded,
      activeOption: activeOption ?? null,
      feeSelected: feeSelected,
    };
  });

  const dataSelectedAddOn = Object.entries(addonsAdded || {})
    .filter(([code, selectedValue]) => {
      const isHidden = ['CAR_COM_AJE', 'CAR_FNCD_AJE'].includes(code);
      return !isHidden && selectedValue !== 'NO';
    })
    .map(([code, selectedValue]) => {
      const addon = addonsFormatted.find((a) => a.code === code);
      const feeSelected = addon?.feeSelected || 0;
      return {
        title: addon?.title || code,
        feeSelected: feeSelected,
        selectedValue: selectedValue,
      };
    });

  useEffect(() => {
    const addonsAdd: Record<string, string> = { ...addonsAdded };
    if (plan?.code === 'COM' || plan?.code === 'FNCD') {
      addonsAdd['CAR_COM_AJE'] = 'SGD 750.00';
    }
    //
    if (addonAdditionalDriver?.code) {
      const isExistDriver = drivers.every((driver) => driver.nric_or_fin);
      addonsAdd[addonAdditionalDriver.code] = isExistDriver
        ? 'drivers_age_from_27_to_70'
        : 'NO';
    }

    const data = {
      key: key,
      selected_plan: quoteInfo?.data?.selected_plan ?? '',
      selected_addons: addonsAdd,
      add_named_driver_info: drivers,
    };
    onSaveRegister(() => ({
      currentStep: UserStep.SELECT_ADD_ON,
      ...data,
    }));
  }, [addonsAdded]);

  const totalAddonNormalFee = addonsFormatted.reduce((acc, addon) => {
    const fee = addon.feeAdded ?? 0;
    return acc + fee;
  }, 0);
  const baseFeeAdditionalDriver =
    addonAdditionalDriver?.options?.[0]?.premium_with_gst ?? 0;
  const additionalDriverFee = drivers.length
    ? baseFeeAdditionalDriver * (drivers.length - 1)
    : 0;
  const totalAddonFee = additionalDriverFee + totalAddonNormalFee;
  const premiumWithGst = plan?.premium_with_gst ?? 0;
  const baseFee = addonAdditionalDriver?.options?.[0].premium_with_gst ?? 0;
  const totalFeeDriver = drivers.length ? baseFee * (drivers.length - 1) : 0;
  const discountRate = quoteInfo?.promo_code?.discount || 0;
  const tax = 1.09;
  const pricePlanMain = premiumWithGst / (1 - discountRate / 100) / tax;
  const couponDiscount = pricePlanMain * (discountRate / 100);

  const selectAddOnTotal = dataSelectedAddOn.reduce((acc: any, addon: any) => {
    const value = addon.feeSelected || 0;
    return acc + value;
  }, 0);

  const netPremium =
    pricePlanMain -
    couponDiscount +
    selectAddOnTotal / tax +
    totalFeeDriver / tax;
  const valueCalculatedGST = 9;
  const gst = (netPremium * valueCalculatedGST) / 100;
  const totalFinalPrice = netPremium + gst;

  const handleOkay = () => {
    const addonsAdd: Record<string, string> = { ...addonsAdded };
    //For plan codes [COM, FNCD], the default value of CAR_COM_AJE is 'SGD 750.00'.
    if (plan?.code === 'COM' || plan?.code === 'FNCD') {
      addonsAdd['CAR_COM_AJE'] = 'SGD 750.00';
    }
    //
    if (addonAdditionalDriver?.code) {
      const isExistDriver =
        drivers.every((driver) => driver.nric_or_fin) && drivers.length;
      addonsAdd[addonAdditionalDriver.code] = isExistDriver
        ? 'drivers_age_from_27_to_70'
        : 'NO';
    }

    const data: any = {
      key: key,
      selected_addons: addonsAdd,
      add_named_driver_info: drivers,
      review_info_premium: {
        price_plan: pricePlanMain,
        coupon_discount: couponDiscount,
        data_section_add_ons: dataSelectedAddOn,
        net_premium: netPremium,
        gst: gst,
        total_final_price: totalFinalPrice,
        drivers: drivers,
        addon_additional_driver: addonAdditionalDriver,
      },
    };

    saveQuote({
      key: key,
      data: data,
      is_sending_email: false,
    }).then(() => {
      setIsShowPopupPremium(false);
      if (isManual) {
        setIsShowBonusDetail(true);
      } else {
        router.push(ROUTES.INSURANCE.COMPLETE_PURCHASE);
      }
    });
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='flex w-[full] flex-col items-center'>
      <div className='flex w-full max-w-[1280px] flex-col items-center justify-center'>
        <div className='w-full'>
          {isShowBonusDetail ? (
            <AddOnBonusDetailManualForm
              key={quoteInfo?.data.key}
              personal_info={quoteInfo?.data.personal_info}
              vehicle_info_selected={quoteInfo?.data.vehicle_info_selected}
              onClose={() => setIsShowBonusDetail(false)}
            />
          ) : (
            <>
              <div className='mt-2 flex flex-col gap-4 px-4'>
                {/* Edit bar - hide for now */}
                {/* <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4 xl:flex-row xl:gap-6'>
                  <HeaderVehicleInfo
                    vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                    insuranceAdditionalInfo={
                      quoteInfo?.data.insurance_additional_info
                    }
                    selectPlan={quoteInfo?.data.selected_plan}
                    isShowScreen={true}
                  />
                </div> */}
                <div className='mt-4 flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-3'>
                  {addonAdditionalDriver && (
                    <AddonAdditionalDriver
                      addon={addonAdditionalDriver}
                      drivers={drivers}
                      setDrivers={setDrivers}
                      policyStartDate={
                        quoteInfo?.data.insurance_additional_info?.start_date ??
                        dayjs().format('DD/MM/YYYY')
                      }
                    />
                  )}
                  {plan?.add_ons_included_in_this_plan?.map((addon) => (
                    <AddOnRow
                      key={addon.add_on_id}
                      title={addon.add_on_name}
                      icon={<RoadSideIcon className='text-brand-blue' />}
                      status='completed'
                    >
                      <TruncateText text={addon.add_on_desc} />
                      <hr className='my-2 border-t border-dashed border-[#00ADEFB2]' />
                      <p>Included in Plan</p>
                    </AddOnRow>
                  ))}
                  {addonsFormatted.map((addon) => {
                    return (
                      <AddOnRowDetail
                        key={addon.code}
                        addon={addon}
                        addonsAdded={addonsAdded}
                        setAddonsAdded={setAddonsAdded}
                        addonsSelected={addonsSelected}
                        setAddonsSelected={setAddonsSelected}
                      />
                    );
                  })}
                </div>
              </div>
              <Modal
                title='Edit Information'
                open={isModalVisible}
                footer={[]}
                onCancel={() => setIsModalVisible(false)}
              >
                <p>Here you can edit the car info or insurance details.</p>
              </Modal>

              <ModalPremium
                isShowPopupPremium={isShowPopupPremium}
                setIsShowPopupPremium={setIsShowPopupPremium}
                quoteInfo={quoteInfo}
                dataSelectedAddOn={dataSelectedAddOn}
                handleOkay={handleOkay}
                isPending={isPending}
                drivers={drivers}
                addonAdditionalDriver={addonAdditionalDriver}
                pricePlanMain={pricePlanMain}
                couponDiscount={couponDiscount}
                tax={tax}
                gst={gst}
                netPremium={netPremium}
              />
            </>
          )}
        </div>
      </div>

      {!isShowBonusDetail && (
        <div className='mt-20 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-2'>
          <PricingSummary
            planFee={premiumWithGst}
            addonFee={totalAddonFee}
            discount={quoteInfo?.promo_code?.discount || 0}
            title='Premium breakdown'
            textButton='Continue'
            onClick={() => setIsShowPopupPremium(true)}
          />
        </div>
      )}
    </div>
  );
}

export default AddOnDetail;
