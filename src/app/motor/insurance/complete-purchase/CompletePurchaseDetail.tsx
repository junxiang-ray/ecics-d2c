'use client';

import { Button, Drawer, Modal } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Option } from '@/libs/types/quote';
import {
  formatCurrency,
  formatCurrencyString,
  formatBooleanToYesNo,
} from '@/libs/utils/utils';

import { CarIcon, PersonIcon } from '@/components/icons/add-on-icons';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';

import { useInsurance } from '@/app/motor/insurance/InsuranceLayoutContext';
import { ROUTES } from '@/constants/routes';
import { usePayment, useSaveProposal } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import ReviewSection from './ReviewSection';
import { AddOnFormat, mapIconToTypeAddOn } from '../add-on/AddonDetail';
import { PricingSummary } from '../components/FeeBar';

function calculateFee(
  option: Option,
  addonsAdded: Record<string, string>,
): number {
  if (!option?.dependencies || option.dependencies.length === 0) {
    return option.premium_with_gst ?? 0;
  }
  const dependency = option.dependencies.find((dep) =>
    dep.conditions.every(
      (condition) => addonsAdded[condition.addon.code] === condition.value,
    ),
  );
  return dependency?.premium_with_gst ?? 0;
}

export default function CompletePurchaseDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouterWithQuery();
  const { handleBack } = useInsurance();

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const { isMobile } = useDeviceDetection();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const quote = useAppSelector((state) => state.quote?.quote);
  const quoteInfo = useAppSelector((state) => state.quote?.quote);
  const vehicleSelected = quote?.data?.vehicle_info_selected;

  const plan = quote?.data?.plans?.find(
    (plan) => quote.data?.selected_plan === plan.title,
  );

  const {
    mutate: payment,
    data: dataPayment,
    isPending: isPendingPay,
  } = usePayment();
  const {
    mutateAsync: saveProposal,
    isSuccess,
    isPending: isPendingSave,
  } = useSaveProposal();
  const handleEditClick = (key: string) => {
    toggleSection(key);
  };
  const routerBySectionKey = (key: string) => {
    switch (key) {
      case 'basic':
      case 'vehicle':
      case 'policy':
        return ROUTES.INSURANCE.BASIC_DETAIL;
      case 'addons':
      case 'driver':
        return ROUTES.INSURANCE.ADD_ON;
      case 'owner':
        return ROUTES.INSURANCE.PERSONAL_DETAIL;
      default:
        return undefined;
    }
  };

  const addonsSectionData = (
    quote?.data?.review_info_premium?.data_section_add_ons || []
  ).map((addon: any) => {
    const baseData = {
      title: addon.title,
      value: formatCurrency(addon.feeSelected / 1.09),
    };
    if (addon.optionLabel !== 'YES') {
      return {
        ...baseData,
        coverage_amount: formatCurrencyString(addon.optionLabel),
      };
    }
    return baseData;
  });

  const addonsIncludedData = (
    quote?.data?.review_info_premium?.add_ons_included_in_this_plan || []
  ).map((item: any) => ({
    title: item.add_on_name,
    value: 'Included',
  }));

  const getAdditionalDriverData = (drivers: any[] = []) => {
    return drivers.flatMap((driver, index) => [
      {
        title: `Additional Driver ${index + 1}`,
        value: '',
        isTitleOnly: true,
      },
      {
        title: 'Name',
        value: driver.name,
      },
      {
        title: 'NRIC/FIN',
        value: driver.nric_or_fin,
      },
    ]);
  };

  const getDriverSections = (drivers: any[] = []) => {
    return drivers.map((driver, index) => {
      const data = [
        { title: 'Name as Per NRIC/FIN', value: driver.name },
        { title: 'NRIC/FIN', value: driver.nric_or_fin },
        { title: 'Date of Birth', value: driver.date_of_birth },
        { title: 'Gender', value: driver.gender },
        { title: 'Marital Status', value: driver.marital_status },
        { title: 'Driving Experience', value: driver.driving_experience },
        {
          title: 'Do you have a claim in the past 3 years',
          value: formatBooleanToYesNo(driver.is_claim_in_3_years),
        },
      ];

      return {
        key: `driver-${index}`,
        title: `Additional Driver ${index + 1}`,
        description: driver.name,
        icon: <AdditionalDriverDetailsIcon className='text-white' />,
        data,
      };
    });
  };

  const selectedPlanTitle = quote?.data?.selected_plan || 'N/A';
  const plans = quote?.data?.plans || [];
  const matchedPlan = plans.find(
    (plan) => plan.title && plan.title.includes(selectedPlanTitle),
  );
  const addonsTitles =
    matchedPlan?.benefits
      ?.filter((benefit) => benefit.is_active)
      .map((benefit) => benefit.name)
      .filter(Boolean) || [];

  const sharedDataMap: {
    [key: string]: { title: string; value: any; coverage_amount?: string }[];
  } = {
    personal: [
      {
        title: 'Email Address',
        value: quote?.data?.personal_info?.email || 'N/A',
      },
      {
        title: 'Phone Number',
        value: quote?.data?.personal_info?.phone,
      },
      {
        title: 'Date of Birth',
        value: quote?.data?.personal_info?.date_of_birth,
      },
    ],
    vehicle: [
      {
        title: 'Vehicle Make',
        value: vehicleSelected?.vehicle_make || 'N/A',
      },
      {
        title: 'Vehicle Model',
        value: vehicleSelected?.vehicle_model || 'N/A',
      },
      {
        title: "Vehicle's Year of Registration",
        value: vehicleSelected?.first_registered_year || 'N/A',
      },
      {
        title: 'Vehicle Financed By',
        value: quote?.company?.name || 'N/A',
      },
      // { title: 'Engine Capacity', value: 'N/A' },
      // { title: 'Power Rate', value: 'N/A' },
      // { title: 'Year of Manufacture', value: 'N/A' },
    ],
    policy: [
      {
        title: 'Policy Start Date',
        value: quote?.data?.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data?.insurance_additional_info?.end_date || 'N/A',
      },
    ],
    driving_experiences: [
      {
        title: 'Years of Driving Experience',
        value: quote?.data?.personal_info?.driving_experience || 'N/A',
      },
      {
        title: 'Your No Claim Discount',
        value: `${quote?.data?.insurance_additional_info?.no_claim_discount}%`,
      },
      {
        title: 'Number of claims in the past 3 years',
        value: quote?.data?.insurance_additional_info?.no_of_claim || 'N/A',
      },
    ],
    vehicle_details: [
      {
        title: 'Chassis Number',
        value: vehicleSelected?.chasis_number || 'N/A',
      },
      {
        title: 'Engine Number',
        value: vehicleSelected?.engine_number || 'N/A',
      },
      {
        title: 'Vehicle Number',
        value: vehicleSelected?.vehicle_number || 'N/A',
      },
    ],
    policy_plan: [
      {
        title: 'Selected Plan',
        value: selectedPlanTitle,
      },
      {
        title: 'Plan Details',
        value: addonsTitles.length > 0 ? addonsTitles.join(', ') : 'N/A',
      },
    ],
    addons:
      addonsSectionData.length === 0 && addonsIncludedData.length === 0
        ? [{ title: 'You have no Add Ons selected', value: '' }]
        : [...addonsSectionData, ...addonsIncludedData],
    driver: getAdditionalDriverData(quote?.data?.add_named_driver_info),
    owner: [
      {
        title: 'Name as per NRIC',
        value: quote?.data?.personal_info?.name ?? 'N/A',
      },
      { title: 'NRIC/FIN', value: quote?.data?.personal_info?.nric ?? 'N/A' },
      { title: 'Gender', value: quote?.data?.personal_info?.gender ?? 'N/A' },
      {
        title: 'Marital Status',
        value: quote?.data?.personal_info?.marital_status ?? 'N/A',
      },
      {
        title: 'Address Line 1',
        value: quote?.data?.personal_info?.address?.[0] ?? 'N/A',
      },
      {
        title: 'Address Line 2',
        value: quote?.data?.personal_info?.address?.[1]
          ? quote?.data?.personal_info?.address?.[1]
          : 'N/A',
      },
      {
        title: 'Address Line 3',
        value: quote?.data?.personal_info?.address?.[2]
          ? quote?.data?.personal_info?.address?.[2]
          : 'N/A',
      },
      {
        title: 'Postal Code',
        value: quote?.data?.personal_info?.post_code ?? 'N/A',
      },
    ],
  };

  const sections = [
    {
      key: 'personal',
      title: 'Personal Information',
    },
    {
      key: 'vehicle',
      title: 'Vehicle Information',
      description: `${vehicleSelected?.vehicle_make} ${vehicleSelected?.vehicle_model} ${vehicleSelected?.chasis_number}`,
      icon: <CarIcon className='text-white' />,
    },
    {
      key: 'policy',
      title: 'Policy Start & End Date',
      description: `${plan?.title} Plan`,
      icon: <PolicyPlanIcon className='text-white' />,
    },
    {
      key: 'driving_experiences',
      title: 'Driving Experiences',
    },
    {
      key: 'policy_plan',
      title: 'Policy Plan',
    },
    {
      key: 'addons',
      title: 'Add-ons',
      description: 'Additional Named Driver(s)',
      icon: <AddOnsSelectedIcon className='text-white' />,
    },
    {
      key: 'vehicle_details',
      title: 'Vehicle Details',
    },
    {
      key: 'owner',
      title: 'Personal Info (Main Driver)',
      description: `${quote?.data?.personal_info?.name}  ${quote?.data?.vehicle_info_selected?.vehicle_number}`,
      icon: <PersonIcon className='text-white' />,
    },
    {
      key: 'driver',
      title: 'Additional Driver Details',
      description: 'Steve Smith',
      icon: <AdditionalDriverDetailsIcon className='text-white' />,
    },
  ];

  const [addonsAdded, setAddonsAdded] = useState<any>(null);
  const [addonsSelected, setAddonsSelected] = useState<any>(null);

  const defaultAddonsAdded = useMemo(() => {
    if (!plan?.addons.length) return {};
    const addonCodes = plan.addons.map((addon) => addon.code);
    return Object.fromEntries(addonCodes.map((code) => [code, 'NO']));
  }, [plan]);

  const defaultAddonsSelected = useMemo(() => {
    if (!plan?.addons.length) return {};
    const selected_addons = quote?.data?.selected_addons ?? {};
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
  }, [plan]);

  useEffect(() => {
    // setDrivers(quoteInfo?.data?.add_named_driver_info ?? []);
    setAddonsAdded(defaultAddonsAdded);
    setAddonsSelected(defaultAddonsSelected);
  }, [defaultAddonsAdded, defaultAddonsSelected]);

  useEffect(() => {
    if (isSuccess) {
      payment(key);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (dataPayment?.payment_url) {
      router.push(dataPayment.payment_url);
    }
  }, [dataPayment]);

  const onPay = async () => {
    const data: any = {
      key: key,
      selected_plan: quote?.data?.selected_plan,
      selected_addons: quote?.data?.selected_addons,
      add_named_driver_info: quote?.data?.add_named_driver_info,
    };
    saveProposal(data).then((res) => {
      if (!res?.final_premium) return;
      dispatch(updateQuote({ is_finalized: true }));
    });
  };

  const onClosePopup = () => {
    setIsShowPopupPremium(false);
  };

  const addons = plan?.addons ?? [];

  const addonsFormatted: AddOnFormat[] = addons.map((addon) => {
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

  const totalAddonFeeSelected =
    quote?.data?.review_info_premium?.data_section_add_ons.reduce(
      (total: number, addon: any) => total + (addon.feeSelected || 0),
      0,
    );

  const totalAddonDriver =
    quote?.data?.review_info_premium?.drivers?.reduce(
      (total: number, driver: any, index: number) => {
        if (index === 0) return total;
        return (
          total +
          (quote?.data?.review_info_premium?.addon_additional_driver
            ?.options?.[0]?.premium_with_gst
            ? quote?.data?.review_info_premium?.addon_additional_driver
                .options[0].premium_with_gst
            : 0)
        );
      },
      0,
    ) || 0;

  const totalAdditionFee = totalAddonFeeSelected + totalAddonDriver;
  const planFreeTotal =
    (quote?.data?.review_info_premium?.total_final_price || 0) -
    (totalAdditionFee || 0);

  const _renderPremium = () => {
    const tax = 1.09;
    const drivers = quote?.data?.review_info_premium?.drivers;
    const addonAdditionalDriver =
      quote?.data?.review_info_premium?.addon_additional_driver;
    const AddOnIncludedInPlan =
      quote?.data?.review_info_premium?.add_ons_included_in_this_plan;

    const hasAddons =
      quote?.data?.review_info_premium?.data_section_add_ons?.length > 0;
    const hasDrivers = drivers && drivers.length > 0;
    const hasIncludedAddOns =
      AddOnIncludedInPlan && AddOnIncludedInPlan.length > 0;
    const hasAnyContent = hasAddons || hasDrivers || hasIncludedAddOns;

    return (
      <div className='max-h-[70svh] w-full overflow-y-auto bg-white'>
        {/* <div className='flex h-[50px] justify-end'>
                  <div className='flex w-[150px] cursor-pointer items-center justify-center border border-[#00ADEF] py-3 font-normal'>
                    Save
                  </div>
                </div> */}
        <div className='flex w-full flex-col gap-3 rounded-lg '>
          <p className='sticky top-0 bg-white pb-2 text-xl font-semibold leading-[30px] text-[#171A1F] md:px-4'>
            Premium Breakdown
          </p>
          <div className='flex w-full flex-col gap-4'>
            <div className='flex flex-col gap-4 py-2 md:px-4'>
              <div className='flex flex-col gap-2'>
                <p className='text-base font-bold text-[#303030]'>Plan</p>
                <div className='flex flex-row justify-between text-sm font-normal text-[#303030]'>
                  <p>{quote?.data?.selected_plan ?? ''}</p>
                  <p>
                    {formatCurrency(
                      quote?.data?.review_info_premium?.price_plan ?? 0,
                    )}
                  </p>
                </div>
                {quote?.promo_code && (
                  <div className='flex flex-row justify-between text-sm font-semibold text-[#00ADEF]'>
                    <p>Coupon Discount</p>
                    <p>
                      -
                      {formatCurrency(
                        quote?.data?.review_info_premium?.coupon_discount ?? 0,
                      )}
                    </p>
                  </div>
                )}
              </div>
              {hasAnyContent && (
                <div className='flex flex-col py-2'>
                  {hasAddons && (
                    <div className='gap-4'>
                      <p className='text-base font-bold text-[#303030]'>
                        Add-onnn:
                      </p>
                      <div className='flex flex-col gap-3'>
                        {quote?.data?.review_info_premium?.data_section_add_ons.map(
                          (addon: any) => (
                            <p
                              key={addon.title}
                              className='flex flex-row items-center justify-between'
                            >
                              <p className='flex flex-col'>
                                {addon.title}
                                {addon.optionLabel !== 'YES' && (
                                  <span className='ml-2 flex flex-row items-center gap-2'>
                                    <p className='h-[4px] w-[4px] rounded-full bg-[#303030]'></p>
                                    {addon.optionLabel} Coverage
                                  </span>
                                )}
                              </p>
                              <span>
                                {formatCurrency(addon.feeSelected / tax)}
                              </span>
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    {hasDrivers && (
                      <div className='gap-4'>
                        <p className='my-1 text-sm font-semibold text-[#303030]'>
                          Additional Named Driver(s)
                        </p>
                        {drivers.map((driver, index) => (
                          <div
                            key={index}
                            className='flex flex-row items-center justify-between text-sm text-[#636262]'
                          >
                            <p>{driver.name}</p>
                            <p>
                              {index === 0
                                ? 'FREE'
                                : addonAdditionalDriver?.options?.[0]
                                      ?.premium_with_gst
                                  ? formatCurrency(
                                      addonAdditionalDriver.options[0]
                                        .premium_with_gst / 1.09,
                                    )
                                  : ''}{' '}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    {hasIncludedAddOns && (
                      <div className='mt-4 flex flex-col gap-2'>
                        {AddOnIncludedInPlan.map((item, index) => (
                          <div
                            key={index}
                            className='flex flex-row items-center justify-between'
                          >
                            <span>{item.add_on_name}</span>
                            <span>INCLUDED</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className='flex flex-col gap-1 rounded-lg py-2'>
                <div className='flex flex-row justify-between text-base font-bold text-[#303030]'>
                  <p>Sub-Total</p>
                  <p>
                    {formatCurrency(
                      quote?.data?.review_info_premium?.net_premium ?? 0,
                    )}
                  </p>
                </div>
                <div className='flex flex-row justify-between text-base font-normal text-[#303030]'>
                  <p>GST</p>
                  <p>
                    {formatCurrency(quote?.data?.review_info_premium?.gst ?? 0)}
                  </p>
                </div>
                <div className='flex flex-row justify-between text-base font-bold text-[#303030]'>
                  <p>Total Premium</p>
                  <p>
                    {formatCurrency(
                      quote?.data?.review_info_premium?.total_final_price ?? 0,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className='sticky bottom-0 z-10 md:px-4'>
              <Button
                onClick={onClosePopup}
                loading={isPendingSave || isPendingPay}
                className='mx-auto w-full cursor-pointer rounded-none border border-[#00ADEF] py-6 text-center text-base font-bold leading-[21px] text-[#00ADEF] md:px-4'
              >
                Close Breakdown
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex w-full flex-col items-center px-4 py-4 md:py-4'>
      <div
        className={`flex w-full flex-col justify-center md:gap-10 ${isMobile ? 'pb-20 md:flex-row' : 'item-center max-w-[1280px] flex-col p-4 pb-28'}`}
      >
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <div className='pb-4 text-[16px] font-bold underline'>Summary</div>
            {sections.map((section, index) => {
              if (section.key === 'driver') {
                const drivers = getDriverSections(
                  quote?.data?.add_named_driver_info,
                );
                return drivers.map((driverSection) => (
                  <ReviewSection
                    key={driverSection.key}
                    title={driverSection.title}
                    description={driverSection.description}
                    icon={driverSection.icon}
                    data={driverSection.data}
                    isExpanded={true}
                    setShowModal={setShowModal}
                    editRoute={ROUTES.INSURANCE.ADD_ON}
                  />
                ));
              }

              // Handle special case for policy_plan + addons on desktop
              if (
                !isMobile &&
                section.key === 'policy_plan' &&
                sections[index + 1]?.key === 'addons'
              ) {
                const policyData = sharedDataMap['policy_plan'] || [];
                const addonsData = sharedDataMap['addons'] || [];

                return (
                  <div key='policy_plan' className='flex gap-4'>
                    <ReviewSection
                      key='policy_plan'
                      title='Policy Plan'
                      description={section.description}
                      data={policyData}
                      isExpanded={true}
                      sectionKey='policy_plan'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('policy_plan')}
                    />
                    <ReviewSection
                      key='addons'
                      title='Add-ons'
                      description={section.description}
                      data={addonsData}
                      isExpanded={true}
                      sectionKey='addons'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('addons')}
                    />
                  </div>
                );
              }

              // Skip rendering 'addons' if already rendered with 'policy_plan'
              if (
                !isMobile &&
                section.key === 'addons' &&
                sections[index - 1]?.key === 'policy_plan'
              ) {
                return null;
              }

              return (
                <ReviewSection
                  key={section.key}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  data={sharedDataMap[section.key] || []}
                  isExpanded={true}
                  sectionKey={section.key}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className='mt-16 w-full bg-[#FFFEFF] md:mt-2'>
        <PricingSummary
          planFee={planFreeTotal}
          addonFee={totalAdditionFee}
          discount={quote?.promo_code?.discount || 0}
          loading={isPendingSave || isPendingPay}
          title='Premium breakdown'
          textButton='Submit & Pay'
          handleBack={handleBack}
          onClick={onPay}
          setIsShowPopupPremium={setIsShowPopupPremium}
        />
        {isMobile ? (
          <Drawer
            placement='bottom'
            open={isShowPopupPremium}
            onClose={() => setIsShowPopupPremium(false)}
            closable={false}
            height='auto'
            className='w-full rounded-t-xl'
          >
            {_renderPremium()}
          </Drawer>
        ) : (
          <Modal
            open={isShowPopupPremium}
            onCancel={() => setIsShowPopupPremium(false)}
            closable={false}
            maskClosable={true}
            keyboard={true}
            footer={null}
            width={500}
            centered
          >
            <div>{_renderPremium()}</div>
          </Modal>
        )}
      </div>
    </div>
  );
}
