'use client';

import { Drawer, Modal } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { Option } from '@/libs/types/quote';
import { formatCurrency, formatCurrencyString } from '@/libs/utils/utils';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PricingSummary } from '@/components/page/FeeBar';
import PremiumBreakdownContent from '@/components/PremiumBreakdownContent';

import { ROUTES } from '@/constants/routes';
import { usePayment, useSaveProposal } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import ReviewSection from './ReviewSection';
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
    if (
      ['personal', 'vehicle', 'policy', 'driving_experiences'].includes(key)
    ) {
      return ROUTES.INSURANCE.BASIC_DETAIL;
    }
    if (['vehicle_details', 'owner'].includes(key)) {
      return ROUTES.INSURANCE.PERSONAL_DETAIL;
    }
    if (key === 'policy_plan') {
      return ROUTES.INSURANCE.PLAN;
    }
    if (['addons'].includes(key)) {
      return ROUTES.INSURANCE.ADD_ON;
    }
    return undefined;
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
    helper_details: [
      {
        title: 'Helper’s Full Name',
        value: 'N/A',
      },
      {
        title: 'FIN',
        value: 'N/A',
      },
      {
        title: 'Passport Number',
        value: 'N/A',
      },
      {
        title: 'Has the helper been employed by you for more than 12 months?',
        value: 'N/A',
      },
      {
        title: 'Previous Insurer Name',
        value: 'N/A',
      },
      {
        title: 'Other Insurer Name',
        value: 'N/A',
      },
    ],
    helper_basic_information: [
      {
        title: 'Helper Type',
        value: 'N/A',
      },
      {
        title: 'Nationality',
        value: 'N/A',
      },
      {
        title: 'Date of Birth',
        value: vehicleSelected?.first_registered_year || 'N/A',
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
    policy: [
      {
        title: 'Policy Start Date',
        value: quote?.data?.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data?.insurance_additional_info?.end_date || 'N/A',
      },
      {
        title: 'Policy Duration',
        value: 'N/A',
      },
    ],
    owner: [
      {
        title: 'Name as per NRIC',
        value: quote?.data?.personal_info?.name ?? 'N/A',
      },
      {
        title: 'Date of Birth',
        value: quote?.data?.personal_info?.date_of_birth ?? 'N/A',
      },
      { title: 'NRIC/FIN', value: quote?.data?.personal_info?.nric ?? 'N/A' },
      { title: 'Nationality', value: 'N/A' },
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
    personal: [
      {
        title: 'Email Address',
        value: quote?.data?.personal_info?.email || 'N/A',
      },
      {
        title: 'Phone Number',
        value: quote?.data?.personal_info?.phone,
      },
    ],
  };

  const sections = [
    {
      key: 'helper_details',
      title: 'Helper’s Details',
    },
    {
      key: 'helper_basic_information',
      title: 'Helper’s Basic Information',
    },
    {
      key: 'policy_plan',
      title: 'Policy Plan',
    },
    {
      key: 'addons',
      title: 'Add-ons',
    },
    {
      key: 'policy',
      title: 'Policy Start & End Date',
    },
    {
      key: 'owner',
      title: 'Employer Details',
    },
    {
      key: 'personal',
      title: 'Contact Info',
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
      // add_named_driver_info: quote?.data?.add_named_driver_info,
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
      (item: any) => item.code === addon.code,
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

  const _renderPremiumBreakdownContent = (
    <PremiumBreakdownContent
      quoteInfo={quote}
      dataSelectedAddOn={quote?.data?.review_info_premium?.data_section_add_ons}
      drivers={quote?.data?.review_info_premium?.drivers ?? []}
      addonAdditionalDriver={
        quote?.data?.review_info_premium?.addon_additional_driver
      }
      pricePlanMain={quote?.data?.review_info_premium?.price_plan ?? 0}
      couponDiscount={quote?.data?.review_info_premium?.coupon_discount ?? 0}
      tax={1.09}
      gst={quote?.data?.review_info_premium?.gst ?? 0}
      netPremium={quote?.data?.review_info_premium?.net_premium ?? 0}
      addonsIncluded={
        quote?.data?.review_info_premium?.add_ons_included_in_this_plan
      }
      onClose={() => setIsShowPopupPremium(false)}
    />
  );

  return (
    <div className='flex w-full flex-col items-center px-4 py-4 md:py-4'>
      <div
        className={`flex w-full flex-col justify-center md:gap-10 ${isMobile ? 'pb-20 md:flex-row' : 'item-center max-w-[1280px] flex-col p-4 pb-28'}`}
      >
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <div className='pb-4 text-[16px] font-bold underline'>Summary</div>
            {sections.map((section, index) => {
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
                      data={policyData}
                      isExpanded={true}
                      sectionKey='policy_plan'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('policy_plan')}
                    />
                    <ReviewSection
                      key='addons'
                      title='Add-ons'
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
            {_renderPremiumBreakdownContent}
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
            <div>{_renderPremiumBreakdownContent}</div>
          </Modal>
        )}
      </div>
    </div>
  );
}
