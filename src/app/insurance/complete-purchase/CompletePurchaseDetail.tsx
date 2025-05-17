'use client';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import { useEffect, useMemo, useState } from 'react';
import ReviewSection from './ReviewSection';

import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import { ROUTES } from '@/constants/routes';
import {
  useGetQuote,
  usePayment,
  useSaveProposal,
} from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { Option } from '@/libs/types/quote';
import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { PricingSummary } from '../components/FeeBar';
import ReviewDesktop from './ReviewDesktop';

import { CarIcon, PersonIcon } from '@/components/icons/add-on-icons';
import { SecondaryButton } from '@/components/ui/buttons';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { formatCurrency } from '@/libs/utils/utils';
import { AddOnFormat, mapIconToTypeAddOn } from '../add-on/AddonDetail';

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
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const { isMobile } = useDeviceDetection();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const router = useRouterWithQuery();
  const { data: quote, isLoading } = useGetQuote(key);
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
      case 'owner':
        return ROUTES.INSURANCE.BASIC_DETAIL;
      case 'addons':
      case 'driver':
        return ROUTES.INSURANCE.ADD_ON;
      case 'policy':
        return ROUTES.INSURANCE.PLAN;
      default:
        return undefined;
    }
  };

  const addonsSectionData = (
    quote?.data?.review_info_premium?.data_section_add_ons || []
  ).map((addon: any) => ({
    title: addon.title,
    value: formatCurrency(addon.feeSelected / 1.09),
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
        title: 'NRIC',
        value: driver.nric_or_fin,
      },
    ]);
  };

  const getDriverSections = (drivers: any[] = []) => {
    return drivers.map((driver, index) => {
      const data = [
        { title: 'Name as Per NRIC', value: driver.name },
        { title: 'NRIC', value: driver.nric_or_fin },
        { title: 'Date of Birth', value: driver.date_of_birth },
        { title: 'Gender', value: driver.gender },
        { title: 'Marital Status', value: driver.marital_status },
        { title: 'Driving Experience', value: driver.driving_experience },
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

  const sharedDataMap: { [key: string]: { title: string; value: any }[] } = {
    basic: [
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info?.end_date,
      },
      {
        title: 'No Claim Discount',
        value: `${quote?.data.insurance_additional_info?.no_claim_discount}%`,
      },
      {
        title: 'Number of claims in last 3 years',
        value: quote?.data.insurance_additional_info?.no_of_claim,
      },
      { title: 'Vehicle financed by', value: quote?.company?.name || 'N/A' },
    ],
    vehicle: [
      {
        title: 'Vehicle Number',
        value: quote?.data.vehicle_info_selected?.vehicle_number || 'N/A',
      },
      {
        title: 'Year of Registration',
        value:
          quote?.data.vehicle_info_selected?.first_registered_year || 'N/A',
      },
      {
        title: 'Vehicle Make',
        value: quote?.data.vehicle_info_selected?.vehicle_make || 'N/A',
      },
      {
        title: 'Vehicle Model',
        value: quote?.data.vehicle_info_selected?.vehicle_model || 'N/A',
      },
      {
        title: 'Chassis Number',
        value: quote?.data.vehicle_info_selected?.chasis_number || 'N/A',
      },
      {
        title: 'Engine Number',
        value: quote?.data.vehicle_info_selected?.engine_number || 'N/A',
      },
      { title: 'Engine Capacity', value: 'N/A' },
      { title: 'Power Rate', value: 'N/A' },
      { title: 'Year of Manufacture', value: 'N/A' },
    ],
    policy: [
      { title: 'Selected Plan', value: quote?.data.selected_plan || 'N/A' },
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info?.end_date || 'N/A',
      },
    ],
    addons: addonsSectionData,
    driver: getAdditionalDriverData(quote?.data.add_named_driver_info),
    owner: [
      { title: 'Owner Name', value: `${quote?.data.personal_info?.name} ` },
      {
        title: 'Vehicle number',
        value: `${quote?.data.vehicle_info_selected?.vehicle_number} `,
      },
    ],
  };

  const sections = [
    {
      key: 'basic',
      title: 'Basic Details',
      description: 'Policy Period NCD No. of claims',
      icon: <BasicDetailsIcon className='text-white' />,
    },
    {
      key: 'vehicle',
      title: 'Vehicle Details',
      description: `${quote?.data.vehicle_info_selected?.vehicle_make} ${quote?.data.vehicle_info_selected?.vehicle_model} ${quote?.data.vehicle_info_selected?.chasis_number}`,
      icon: <CarIcon className='text-white' />,
    },
    {
      key: 'policy',
      title: 'Policy Plan',
      description: 'Comprehensive Plan',
      icon: <PolicyPlanIcon className='text-white' />,
    },
    {
      key: 'addons',
      title: 'Add Ons Selected',
      description: 'Additional Named Driver',
      icon: <AddOnsSelectedIcon className='text-white' />,
    },
    {
      key: 'driver',
      title: 'Additional Driver Details',
      description: 'Steve Smith',
      icon: <AdditionalDriverDetailsIcon className='text-white' />,
    },
    {
      key: 'owner',
      title: 'Vehicle Owner',
      description: `${quote?.data.personal_info?.name}  ${quote?.data.vehicle_info_selected?.vehicle_number}`,
      icon: <PersonIcon className='text-white' />,
    },
  ];

  const plan = quote?.data?.plans?.find(
    (plan) => quote.data?.selected_plan === plan.title,
  );
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
      selected_plan: quote?.data.selected_plan,
      selected_addons: quote?.data.selected_addons,
      add_named_driver_info: quote?.data.add_named_driver_info,
    };
    saveProposal(data);
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

  const totalAdditionFee = addonsFormatted.reduce((acc, addon) => {
    const fee = addon.feeAdded ?? 0;
    return acc + fee;
  }, 0);

  const premiumWithGst = plan?.premium_with_gst || 0;

  const _renderPremium = () => {
    const tax = 1.09;
    const drivers = quote?.data.review_info_premium?.drivers;
    const addonAdditionalDriver =
      quote?.data.review_info_premium?.addon_additional_driver;
    const AddOnIncludedInPlan =
      quote?.data.review_info_premium?.add_ons_included_in_this_plan;
    return (
      <div className='min-w-[400px]'>
        <div className='flex h-[50px] justify-end'>
          {/* <div className='flex w-[150px] cursor-pointer items-center justify-center border border-[#00ADEF] py-3 font-normal'>
            Save
          </div> */}
        </div>
        <div className='mt-6 flex w-full flex-col gap-3 rounded-lg border border-[#E4E4E4] p-4'>
          <p className='text-center text-xl font-semibold leading-[30px] text-[#171A1F]'>
            Premium Breakdown
          </p>
          <div className='flex w-full flex-col gap-4'>
            <div className='flex flex-col gap-4 border-b border-[#E4E4E4] px-4 py-2'>
              <div className='flex flex-row justify-between text-base leading-[30px] text-[#171A1F]'>
                <p className=' font-normal'>
                  {quote?.data?.selected_plan ?? ''}
                </p>
                <p>
                  {formatCurrency(
                    quote?.data.review_info_premium?.price_plan ?? 0,
                  )}
                </p>
              </div>
              {quote?.promo_code && (
                <div className='flex flex-row justify-between text-sm font-semibold text-[#00ADEF]'>
                  <p>Coupon Discount</p>
                  <p>
                    -
                    {formatCurrency(
                      quote?.data.review_info_premium?.coupon_discount ?? 0,
                    )}
                  </p>
                </div>
              )}

              <div className='flex flex-col border-b border-[#E4E4E4] py-2'>
                <p className='font-bold text-[#171A1F]'>Add-on:</p>
                <div className='flex flex-col gap-1'>
                  {quote?.data.review_info_premium?.data_section_add_ons.map(
                    (addon: any) => (
                      <p
                        key={addon.title}
                        className='flex flex-row justify-between'
                      >
                        {addon.title}:{' '}
                        <span>{formatCurrency(addon.feeSelected / tax)}</span>
                      </p>
                    ),
                  )}
                </div>
                <div>
                  {drivers && drivers.length > 0 && (
                    <div className=''>
                      <p className='my-1 text-sm font-semibold text-[#303030]'>
                        Additional Named Driver
                      </p>
                      {drivers.map((driver, index) => (
                        <div
                          key={index}
                          className='flex flex-row items-center justify-between text-sm text-[#636262]'
                        >
                          <p>{driver.name}</p>
                          <p>
                            {index === 0
                              ? 'Free'
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
                  {AddOnIncludedInPlan && AddOnIncludedInPlan.length > 0 && (
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

              <div className='flex flex-col gap-2 border-b border-[#E4E4E4] py-2 text-base font-normal leading-[30px] text-[#171A1F]'>
                <div className='flex flex-row justify-between'>
                  <p>Net Premium</p>
                  <p>
                    {formatCurrency(
                      quote?.data.review_info_premium?.net_premium ?? 0,
                    )}
                  </p>
                </div>
                <div className='flex flex-row justify-between'>
                  <p>GST</p>
                  <p>
                    {formatCurrency(quote?.data.review_info_premium?.gst ?? 0)}
                  </p>
                </div>
              </div>
              <div className='flex flex-row justify-between font-bold'>
                <p>Total (including GST)</p>
                <p>
                  {formatCurrency(
                    quote?.data.review_info_premium?.total_final_price ?? 0,
                  )}
                </p>
              </div>
            </div>

            <SecondaryButton
              onClick={onPay}
              loading={isPendingSave || isPendingPay}
              className='w-full cursor-pointer rounded-lg bg-[#00ADEF] px-4 py-3 text-center text-base font-bold leading-[21px] text-white'
            >
              Pay
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='w-full px-4 py-4 md:py-16'>
      <div className='flex w-full flex-col justify-center md:flex-row md:gap-10'>
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <h1 className='text-xl font-semibold text-[#080808] md:text-center md:text-[32px] md:font-bold md:leading-[48px] md:text-[#171A1F]'>
              Review your details
            </h1>

            {sections.map((section) => {
              if (section.key === 'driver') {
                const drivers = getDriverSections(
                  quote?.data.add_named_driver_info,
                );
                return drivers.map((driverSection) =>
                  isMobile ? (
                    <ReviewSection
                      key={driverSection.key}
                      title={driverSection.title}
                      description={driverSection.description}
                      icon={driverSection.icon}
                      data={driverSection.data}
                      isExpanded={!!expandedSections[driverSection.key]}
                      onToggle={() => handleEditClick(driverSection.key)}
                      setShowModal={setShowModal}
                      editRoute={ROUTES.INSURANCE.ADD_ON}
                    />
                  ) : (
                    <ReviewDesktop
                      key={driverSection.key}
                      title={driverSection.title}
                      data={driverSection.data}
                      setShowModal={setShowModal}
                      editRoute={ROUTES.INSURANCE.ADD_ON}
                    />
                  ),
                );
              }

              return isMobile ? (
                <ReviewSection
                  key={section.key}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  data={sharedDataMap[section.key] || []}
                  isExpanded={!!expandedSections[section.key]}
                  onToggle={() => handleEditClick(section.key)}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                />
              ) : (
                <ReviewDesktop
                  key={section.key}
                  title={section.title}
                  data={sharedDataMap[section.key] || []}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                />
              );
            })}
          </div>
        </div>

        {!isMobile && _renderPremium()}
      </div>
      {isMobile && (
        <div className='mt-16 w-full bg-[#FFFEFF] md:mt-2'>
          <PricingSummary
            planFee={premiumWithGst}
            addonFee={totalAdditionFee}
            loading={isPendingSave || isPendingPay}
            discount={15}
            title='Premium breakdown'
            textButton='Pay'
            onClick={onPay}
          />
        </div>
      )}
    </div>
  );
}
