'use client';

import { Drawer, Modal } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { AddOnFormat, AddonOption } from '@/libs/types/quote';
import { formatCurrency, formatCurrencyString } from '@/libs/utils/utils';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PricingSummary } from '@/components/page/FeeBar';
import ReviewSection from '@/components/page/insurance/complete-purchase/ReviewSection';
import PremiumBreakdownContent from '@/components/PremiumBreakdownContent';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { usePayment, useSaveProposal } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { mapIconToTypeAddOn } from '../add-on/AddonDetail';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';

function calculateFee(
  option: AddonOption,
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
  const maidQuote = useAppSelector((state) => state.maidQuote?.maidQuote);

  const plan = maidQuote?.data?.plans?.find(
    (plan) => maidQuote.data?.selected_plan === plan.title,
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
      [
        'helper_details',
        'helper_basic_information',
        'policy',
        'personal',
      ].includes(key)
    ) {
      return ROUTES.INSURANCE_MAID.BASIC_DETAIL;
    }
    if (['owner'].includes(key)) {
      return ROUTES.INSURANCE_MAID.PERSONAL_DETAIL;
    }
    if (key === 'policy_plan') {
      return ROUTES.INSURANCE_MAID.PLAN;
    }
    if (['addons'].includes(key)) {
      return ROUTES.INSURANCE_MAID.ADD_ON;
    }
    return undefined;
  };

  const addonsSectionData = (
    maidQuote?.data?.review_info_premium?.data_section_add_ons || []
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
    maidQuote?.data?.review_info_premium?.add_ons_included_in_this_plan || []
  ).map((item: any) => ({
    title: item.add_on_name,
    value: 'Included',
  }));

  const selectedPlanTitle = maidQuote?.data?.selected_plan || 'N/A';
  const plans = maidQuote?.data?.plans || [];
  const matchedPlan = plans.find(
    (plan) => plan.title && plan.title.includes(selectedPlanTitle),
  );
  const addonsTitles =
    matchedPlan?.addons
      ?.filter((addon) => addon.is_display)
      .map((addon) => addon.title)
      .filter(Boolean) || [];

  const sharedDataMap: {
    [key: string]: { title: string; value: any; coverage_amount?: string }[];
  } = {
    helper_details: [
      {
        title: 'Helper’s Full Name',
        value: maidQuote?.data?.maid_info?.name || 'N/A',
      },
      {
        title: 'FIN',
        value: maidQuote?.data?.maid_info?.fin || 'N/A',
      },
      {
        title: 'Passport Number',
        value: maidQuote?.data?.maid_info?.passport_number || 'N/A',
      },
      {
        title: 'Has the helper been employed by you for more than 12 months?',
        value: maidQuote?.data?.maid_info?.has_helper_worked_12_months || 'N/A',
      },
      {
        title: 'Previous Insurer Name',
        value: maidQuote?.data?.maid_info?.company_name || 'N/A',
      },
      {
        title: 'Other Insurer Name',
        value: maidQuote?.data?.maid_info?.company_name_other || 'N/A',
      },
    ],
    helper_basic_information: [
      {
        title: 'Helper Type',
        value: maidQuote?.data?.insurance_other_info?.maid_type || 'N/A',
      },
      {
        title: 'Nationality',
        value: maidQuote?.data?.maid_info?.nationality || 'N/A',
      },
      {
        title: 'Date of Birth',
        value: maidQuote?.data?.maid_info?.date_of_birth || 'N/A',
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
        value: maidQuote?.data?.insurance_other_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: maidQuote?.data?.insurance_other_info?.end_date || 'N/A',
      },
      {
        title: 'Policy Duration',
        value: maidQuote?.data?.insurance_other_info?.plan_period || 'N/A',
      },
    ],
    owner: [
      {
        title: 'Name as per NRIC',
        value: maidQuote?.data?.personal_info?.name ?? 'N/A',
      },
      {
        title: 'Date of Birth',
        value: maidQuote?.data?.personal_info?.date_of_birth ?? 'N/A',
      },
      {
        title: 'NRIC/FIN',
        value: maidQuote?.data?.personal_info?.nric ?? 'N/A',
      },
      {
        title: 'Nationality',
        value: maidQuote?.data?.personal_info?.nationality ?? 'N/A',
      },
      {
        title: 'Address Line 1',
        value: maidQuote?.data?.personal_info?.address?.[0] ?? 'N/A',
      },
      {
        title: 'Address Line 2',
        value: maidQuote?.data?.personal_info?.address?.[1]
          ? maidQuote?.data?.personal_info?.address?.[1]
          : 'N/A',
      },
      {
        title: 'Address Line 3',
        value: maidQuote?.data?.personal_info?.address?.[2]
          ? maidQuote?.data?.personal_info?.address?.[2]
          : 'N/A',
      },
      {
        title: 'Postal Code',
        value: maidQuote?.data?.personal_info?.post_code ?? 'N/A',
      },
    ],
    personal: [
      {
        title: 'Email Address',
        value: maidQuote?.data?.personal_info?.email || 'N/A',
      },
      {
        title: 'Phone Number',
        value: maidQuote?.data?.personal_info?.phone,
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
    const selected_addons = maidQuote?.data?.selected_addons ?? {};
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
      selected_plan: maidQuote?.data?.selected_plan,
      selected_addons: maidQuote?.data?.selected_addons,
      personal_info: maidQuote?.data?.personal_info,
      maid_info: maidQuote?.data?.maid_info,
    };
    saveProposal(data).then((res) => {
      if (!res?.final_premium) return;
      dispatch(updateMaidQuote({ is_finalized: true }));
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
    maidQuote?.data?.review_info_premium?.data_section_add_ons.reduce(
      (total: number, addon: any) => total + (addon.feeSelected || 0),
      0,
    );

  const totalAddonDriver =
    maidQuote?.data?.review_info_premium?.drivers?.reduce(
      (total: number, driver: any, index: number) => {
        if (index === 0) return total;
        return (
          total +
          (maidQuote?.data?.review_info_premium?.addon_additional_driver
            ?.options?.[0]?.premium_with_gst
            ? maidQuote?.data?.review_info_premium?.addon_additional_driver
                .options[0].premium_with_gst
            : 0)
        );
      },
      0,
    ) || 0;

  const totalAdditionFee = totalAddonFeeSelected + totalAddonDriver;
  const planFreeTotal =
    (maidQuote?.data?.review_info_premium?.total_final_price || 0) -
    (totalAdditionFee || 0);

  const _renderPremiumBreakdownContent = (
    <PremiumBreakdownContent
      productType={ProductType.MAID}
      maidQuote={maidQuote}
      dataSelectedAddOn={
        maidQuote?.data?.review_info_premium?.data_section_add_ons
      }
      drivers={maidQuote?.data?.review_info_premium?.drivers ?? []}
      addonAdditionalDriver={
        maidQuote?.data?.review_info_premium?.addon_additional_driver
      }
      pricePlanMain={maidQuote?.data?.review_info_premium?.price_plan ?? 0}
      couponDiscount={
        maidQuote?.data?.review_info_premium?.coupon_discount ?? 0
      }
      tax={1.09}
      gst={maidQuote?.data?.review_info_premium?.gst ?? 0}
      netPremium={maidQuote?.data?.review_info_premium?.net_premium ?? 0}
      addonsIncluded={
        maidQuote?.data?.review_info_premium?.add_ons_included_in_this_plan
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
                      productType={ProductType.MAID}
                      key='policy_plan'
                      title='Policy Plan'
                      data={policyData}
                      isExpanded={true}
                      sectionKey='policy_plan'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('policy_plan')}
                    />
                    <ReviewSection
                      productType={ProductType.MAID}
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
                  productType={ProductType.MAID}
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
          productType={ProductType.MAID}
          planFee={planFreeTotal}
          addonFee={totalAdditionFee}
          discount={maidQuote?.promo_code?.discount || 0}
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
