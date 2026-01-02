import {
  AlertCircle,
  Building,
  CalendarCheck,
  CheckCircle,
  Home,
  X,
} from 'lucide-react';
import { Briefcase, Shield } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import {
  CustomizationData,
  InsurancePlan,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import {
  calculateExpiryDate,
  calculateTotalPremium,
  validatePromoCode,
} from '@/libs/utils/calculations';
import { cn } from '@/libs/utils/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AddOnCard } from '@/components/ui/addOnCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/cardNew';
import { DateInput } from '@/components/ui/dateInput';
import { Label } from '@/components/ui/label';
import { OptionSelector } from '@/components/ui/optionSelector';
import { PlanCard } from '@/components/ui/planCard';
import { PremiumSummary } from '@/components/ui/premiumSummary';
import { Select } from '@/components/ui/select';

import { ADD_ONS } from '@/constants/home.content.addon.constants';
import {
  BUILDING_COVERAGE_OPTIONS,
  HOME_CONTENT_COVERAGE_OPTIONS,
  HOME_OWNERSHIP_TYPES,
  HOME_TYPES,
  PLANS,
  RENOVATION_COVERAGE_OPTIONS,
  UNIT_TYPES,
} from '@/constants/home.content.constants';

interface Step1Props {
  formData: QuoteForm;
  planData: InsurancePlan[];
  updateFormData: (field: keyof QuoteForm, value: string) => void;
  resetFormData: () => void;
  errors: Partial<QuoteForm>;
  promoStatus: PromoCodeStatus;
  setPromoStatus: (status: PromoCodeStatus) => void;
  showPlans: boolean;
  showCustomization: boolean;
  showAddOns: boolean;
  selectedAddOns: SelectedAddOn[];
  customizationData: CustomizationData;
  updateCustomizationData: (
    field: keyof CustomizationData,
    value: string,
  ) => void;
  isLoading: boolean;
  onCalculateQuote: () => void;
  onPlanSelect: (planId: string) => void;
  onCustomizationComplete: () => void;
  onAddOnToggle: (addOnId: string, price: number) => void;
  onAddOnOptionChange: (addOnId: string, option: string, price: number) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  hasViewedCustomization: boolean;
  setHasViewedCustomization: (viewed: boolean) => void;
  totalPremium: number;
}

const Step1QuoteForm = memo<Step1Props>(
  ({
    formData,
    planData,
    updateFormData,
    resetFormData,
    errors,
    promoStatus,
    setPromoStatus,
    showPlans,
    showCustomization,
    showAddOns,
    selectedAddOns,
    customizationData,
    updateCustomizationData,
    isLoading,
    onCalculateQuote,
    onPlanSelect,
    onCustomizationComplete,
    onAddOnToggle,
    onAddOnOptionChange,
    onNext,
    onBack,
    currentStep,
    hasViewedCustomization,
    setHasViewedCustomization,
    totalPremium,
  }) => {
    // Ref for the customization section
    const customizationRef = useRef<HTMLDivElement>(null);

    // Intersection Observer to detect when customization section is viewed
    useEffect(() => {
      if (!showCustomization || hasViewedCustomization) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Mark as viewed when at least 50% of the section is visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setHasViewedCustomization(true);
            }
          });
        },
        {
          threshold: 0.5, // Trigger when 50% of the element is visible
          rootMargin: '0px',
        },
      );

      if (customizationRef.current) {
        observer.observe(customizationRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [showCustomization, hasViewedCustomization, setHasViewedCustomization]);

    // Memoized calculations
    const policyExpiryDate = useMemo(() => {
      // Default to 1 year for expiry date calculation since duration is now plan-based
      return calculateExpiryDate(formData.policyStartDate, '12');
    }, [formData.policyStartDate]);

    const currentPlan = useMemo(() => {
      if (!planData || !Array.isArray(planData) || !formData.selectedPlan)
        return null;
      return planData.find((p) => p.id === formData.selectedPlan) || null;
    }, [formData, planData]);

    const isCalculateQuoteDisabled = useMemo(() => {
      return isLoading;
    }, [isLoading]);

    const availableUnitTypes = useMemo(() => {
      return UNIT_TYPES.filter((unit) =>
        unit.homeTypes.includes(formData.homeType),
      );
    }, [formData.homeType]);

    // Memoized handlers
    const handleApplyPromo = useCallback(() => {
      const result = validatePromoCode(formData.promoCode);
      setPromoStatus(result);
    }, [formData.promoCode, setPromoStatus]);

    const handlePromoCodeClear = useCallback(() => {
      setPromoStatus({ status: 'none' });
      updateFormData('promoCode', '');
    }, [setPromoStatus, updateFormData]);

    // Early return if constants aren't loaded
    if (
      !PLANS ||
      !Array.isArray(PLANS) ||
      !ADD_ONS ||
      !Array.isArray(ADD_ONS) ||
      !HOME_OWNERSHIP_TYPES ||
      !Array.isArray(HOME_OWNERSHIP_TYPES)
    ) {
      return (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-[#02ADEF]'></div>
        </div>
      );
    }

    const labelToValueMap = Object.fromEntries(
      availableUnitTypes.map(({ label, value }) => [label, value]),
    );

    return (
      <>
        {/* Quote Form */}
        <Card className='mb-8 overflow-hidden border-0 shadow-xl'>
          <CardHeader className='from-[#02ADEF]/8 border-b border-gray-100 bg-gradient-to-r via-blue-50/80 to-indigo-50/50 p-5 sm:p-8'>
            <div className='mb-3 flex items-center gap-4'>
              <div className='w-fit rounded-xl bg-[#02ADEF]/10 p-2 sm:p-3'>
                <Home className='size-5 text-[#02ADEF] sm:size-6' />
              </div>

              <div className='flex flex-col'>
                <h2 className='m-0 mb-1 text-3xl font-bold text-gray-800 sm:text-3xl'>
                  Calculate Your Quote
                </h2>

                <p className='m-0 text-sm leading-snug text-gray-600 sm:text-base'>
                  Fill in the details below to get your personalized home
                  content insurance quote
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-5 sm:p-8'>
            <div className='grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2'>
              {/* Ownership of your home - Full Width Row */}
              <OptionSelector
                labelIcon={<Building className='size-5 text-[#02ADEF]' />}
                required={true}
                label='Ownership of your home'
                selected={formData.ownership}
                options={HOME_OWNERSHIP_TYPES}
                error={errors.ownership}
                onChange={(value) => {
                  updateFormData('ownership', value);
                  if (showPlans) {
                    resetFormData();
                  }
                }}
                className='col-span-1 space-y-4 lg:col-span-2'
              ></OptionSelector>
              {/* Type of Home - Full Width Row */}
              <OptionSelector
                labelIcon={<Home className='size-5 text-[#02ADEF]' />}
                label='Type of Home'
                options={HOME_TYPES}
                className='col-span-1 space-y-4 lg:col-span-2'
                onChange={(value) => {
                  updateFormData('homeType', value);
                  if (value === 'landed property') {
                    updateFormData('unitType', 'landed');
                  }
                  if (showPlans) {
                    resetFormData();
                  }
                }}
                error={errors.homeType}
                required={true}
                selected={formData.homeType}
              ></OptionSelector>

              {/* Unit Type - Only show for non-landed properties */}
              {formData.homeType !== 'landed property' && (
                <div className='space-y-3'>
                  <Label className='flex items-center gap-2 text-base font-semibold text-gray-700 sm:text-lg'>
                    <Building className='size-5 text-[#02ADEF]' />
                    Unit Type <span className='text-red-500'>*</span>
                  </Label>

                  <Select
                    defaultValue={
                      availableUnitTypes.find(
                        (u) => u.value === formData.unitType,
                      )?.label
                    }
                    placeholder='Select unit type'
                    onChange={(label) => {
                      // Map the label back to the corresponding value
                      const selectedUnit = availableUnitTypes.find(
                        (u) => u.label === label,
                      );
                      if (selectedUnit) {
                        updateFormData('unitType', selectedUnit.value);
                        if (showPlans) {
                          resetFormData();
                        }
                      }
                    }}
                    options={availableUnitTypes.map((unit) => unit.label)}
                    className=''
                  />

                  {errors.unitType && (
                    <p className='mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white'>
                        !
                      </span>
                      {errors.unitType}
                    </p>
                  )}
                </div>
              )}
              {/* Home Content Coverage*/}
              <div className='space-y-3'>
                <Label className='flex items-center gap-2 text-base font-semibold text-gray-700 sm:text-lg'>
                  <Shield className='size-5 text-[#02ADEF]' />
                  Home Content Coverage <span className='text-red-500'>*</span>
                </Label>
                <Select
                  options={HOME_CONTENT_COVERAGE_OPTIONS.map(
                    (option) => option.label,
                  )}
                  defaultValue={
                    HOME_CONTENT_COVERAGE_OPTIONS.find(
                      (option) =>
                        option.value ===
                        customizationData.homeContentCoverageValue,
                    )?.label
                  }
                  onChange={(label) => {
                    const selected = HOME_CONTENT_COVERAGE_OPTIONS.find(
                      (option) => option.label === label,
                    );
                    if (selected)
                      updateCustomizationData(
                        'homeContentCoverageValue',
                        selected.value,
                      );
                    if (showPlans) {
                      resetFormData();
                    }
                  }}
                  className='h-14 w-full text-lg'
                />

                {/* {errors.unitType && (
                    <p className='mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white'>
                        !
                      </span>
                      {errors.unitType}
                    </p>
                  )} */}
              </div>
              {formData.ownership != 'tenant' && (
                <div className='space-y-3'>
                  <Label className='flex items-center gap-2 text-base font-semibold text-gray-700 sm:text-lg'>
                    <CalendarCheck className='size-5 text-[#02ADEF]' />
                    Renovation Coverage <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    options={RENOVATION_COVERAGE_OPTIONS.map(
                      (option) => option.label,
                    )}
                    defaultValue={
                      RENOVATION_COVERAGE_OPTIONS.find(
                        (option) =>
                          option.value ===
                          customizationData.renovationCoverageValue,
                      )?.label
                    }
                    onChange={(label) => {
                      const selected = RENOVATION_COVERAGE_OPTIONS.find(
                        (option) => option.label === label,
                      );
                      if (selected) {
                        updateCustomizationData(
                          'renovationCoverageValue',
                          selected.value,
                        );
                        if (showPlans) {
                          resetFormData();
                        }
                      }
                    }}
                    className='h-14 w-full text-lg'
                  />
                  {/* {errors.policyStartDate && (
                  <p className='mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white'>
                      !
                    </span>
                    {errors.policyStartDate}
                  </p>
                )} */}
                </div>
              )}

              {/* Policy Start Date */}
              <div className='space-y-3'>
                <Label className='flex items-center gap-2 text-base font-semibold text-gray-700 sm:text-lg'>
                  <CalendarCheck className='size-5 text-[#02ADEF]' />
                  Policy Start Date <span className='text-red-500'>*</span>
                </Label>
                <DateInput
                  value={formData.policyStartDate}
                  onChange={(value: string) => {
                    updateFormData('policyStartDate', value);
                    if (showPlans) {
                      resetFormData();
                    }
                  }}
                  error={!!errors.policyStartDate}
                />
                {errors.policyStartDate && (
                  <p className='mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white'>
                      !
                    </span>
                    {errors.policyStartDate}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promo Code Section */}
        <Card className='mb-10 overflow-hidden border-0 shadow-xl'>
          <CardContent className='p-8 sm:p-10'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex-1'>
                <h3 className='mb-2 text-2xl font-bold text-gray-800'>
                  Have a Promo Code?
                </h3>
                <p className='m-0 text-base text-gray-600'>
                  Apply your promo code to get additional discounts on your
                  insurance premium
                </p>
              </div>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='min-w-0 flex-1'>
                  <input
                    type='text'
                    placeholder='Enter promo code'
                    value={formData.promoCode}
                    onChange={(e) =>
                      updateFormData('promoCode', e.target.value)
                    }
                    className={cn(
                      'h-12 w-full rounded-xl border-2 px-4 transition-all duration-200 sm:h-14 sm:px-6',
                      'text-base font-medium leading-normal sm:text-lg',
                      'bg-white hover:border-[#02ADEF]/60 hover:shadow-sm',
                      'focus:border-[#02ADEF] focus:outline-none focus:ring-4 focus:ring-[#02ADEF]/10',
                      'placeholder:text-gray-500',
                      promoStatus.status === 'applied'
                        ? 'border-green-500'
                        : promoStatus.status === 'invalid'
                          ? 'border-red-500'
                          : 'border-gray-200',
                    )}
                    style={{ fontSize: '16px' }}
                  />
                </div>
                <div className='flex-shrink-0'>
                  <Button
                    onClick={handleApplyPromo}
                    variant='outline'
                    className='h-12 w-full border-2 border-[#02ADEF] px-6 text-base font-semibold text-[#02ADEF] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#02ADEF] hover:text-white hover:shadow-md sm:h-14 sm:w-auto sm:px-8 sm:text-lg'
                  >
                    Apply Code
                  </Button>
                </div>
              </div>
            </div>

            {/* Promo Status Messages */}
            {promoStatus.status !== 'none' && (
              <div className='mt-6'>
                {promoStatus.status === 'applied' && (
                  <div className='flex items-center gap-3 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4'>
                    <CheckCircle className='size-5 flex-shrink-0 text-[#52c41a]' />
                    <div className='flex-1'>
                      <p className='m-0 text-sm font-semibold leading-tight text-[#45a615]'>
                        Promo Code Applied!
                      </p>
                      <p className='m-0 mt-1 text-sm leading-tight text-[#52c41a]'>
                        Code "{promoStatus.code}" - {promoStatus.discount}%
                        discount applied to your premium
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handlePromoCodeClear}
                      className='mobile-touch-target text-[#52c41a] hover:bg-green-100 hover:text-[#45a615]'
                      aria-label='Remove promo code'
                    >
                      <X className='size-4' />
                    </Button>
                  </div>
                )}

                {promoStatus.status === 'invalid' && (
                  <div className='flex items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4'>
                    <AlertCircle className='size-5 flex-shrink-0 text-red-600' />
                    <div className='flex-1'>
                      <p className='m-0 text-sm font-semibold leading-tight text-red-700'>
                        Invalid Promo Code
                      </p>
                      <p className='m-0 mt-1 text-sm leading-tight text-red-600'>
                        {promoStatus.message ||
                          'Please check your promo code and try again.'}
                      </p>
                    </div>
                  </div>
                )}

                {promoStatus.status === 'applying' && (
                  <div className='flex items-center gap-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
                    <div className='h-5 w-5 flex-shrink-0 animate-spin rounded-full border-b-2 border-blue-600'></div>
                    <div className='flex-1'>
                      <p className='m-0 text-sm font-semibold leading-tight text-blue-700'>
                        Validating Promo Code...
                      </p>
                      <p className='m-0 mt-1 text-sm leading-tight text-blue-600'>
                        Please wait while we verify your promo code.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calculate Quote Button */}
        <div className='mb-12 flex justify-center text-center'>
          <Button
            onClick={onCalculateQuote}
            disabled={isCalculateQuoteDisabled}
            className={cn(
              'flex h-16 min-w-[250px] items-center justify-center rounded-md px-12 py-6 text-lg font-bold shadow-xl transition-all duration-300',
              isCalculateQuoteDisabled
                ? 'cursor-not-allowed bg-gray-400 text-gray-600 hover:bg-gray-400'
                : 'bg-[#52c41a] text-white hover:scale-105 hover:bg-[#45a615] hover:shadow-2xl',
            )}
          >
            {isLoading ? (
              <>
                <div className='mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                Calculating...
              </>
            ) : (
              'Calculate Quote'
            )}
          </Button>
        </div>

        {/* Plans Section */}
        {showPlans && (
          <div id='plans-section' className='animate-in fade-in duration-500'>
            <div className='mb-8 text-center'>
              <h2 className='mt-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text py-3 text-4xl font-bold text-gray-800 text-transparent'>
                Choose Your Plan
              </h2>
              <p className='mx-auto mt-2 max-w-[800px] text-base leading-relaxed text-gray-600 sm:text-xl'>
                Select your preferred policy duration. Both plans offer the same
                comprehensive coverage for your home contents. Terms &
                Conditions Apply.
              </p>
            </div>

            <div className='mb-16 pt-4'>
              <div className='mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-6 xl:gap-4'>
                {planData.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => {
                      onPlanSelect(plan.id);
                    }}
                    isSelected={formData.selectedPlan === plan.id}
                    promoStatus={promoStatus}
                    customizationData={customizationData}
                  />
                ))}
              </div>
            </div>

            {/* What's Included in All Plans Section - Accordion */}
            <div className='mb-16'>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem
                  value='coverage-benefits'
                  className='rounded-lg border shadow-sm'
                >
                  <AccordionTrigger className='rounded-t-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/30 px-6 py-4 transition-colors hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-indigo-100/40 hover:no-underline [&>svg]:hidden'>
                    <div className='flex w-full items-center justify-between gap-4'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-[#02ADEF]/10 p-2'>
                          <Shield className='size-5 text-[#02ADEF]' />
                        </div>
                        <span className='font-bold text-gray-800'>
                          Standard Coverage Features
                        </span>
                      </div>
                      <span className='pointer-events-none whitespace-nowrap rounded-lg bg-[#02ADEF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0291CC]'>
                        View Benefits
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='overflow-x-auto overflow-y-auto px-6 pb-6 pt-4'>
                    <div className='w-full overflow-x-auto'>
                      <table className='w-full min-w-[600px] border-collapse'>
                        <thead>
                          <tr className='border-b-2 border-gray-200'>
                            <th className='w-1/4 px-2 py-3 text-left font-semibold text-gray-800'>
                              Coverage
                            </th>
                            <th className='w-1/2 px-2 py-3 text-left font-semibold text-gray-800'>
                              What's Covered
                            </th>
                            <th className='w-1/4 px-2 py-3 text-left font-semibold text-gray-800'>
                              Maximum Benefit Limit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Emergency Cash Allowance
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Pay for basic necessities (food, clothes,
                              transport), alternative accommodation, replace
                              locks and keys of your damaged home, and more
                            </td>
                            <td className='px-2 py-3 text-gray-800'>
                              <div className='space-y-1'>
                                <div>
                                  100% Uninhabitable:{' '}
                                  <span className='font-semibold'>$5,000</span>
                                </div>
                                <div>
                                  50% Uninhabitable:{' '}
                                  <span className='font-semibold'>$2,500</span>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Emergency Home Assistance
                              <div className='mt-1 text-xs text-gray-500'>
                                (Applicable for plans of 3 years or more)
                              </div>
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Emergency assistance for urgent home repairs and
                              services
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $200 per event, up to 4 times per year
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Personal Legal Liability
                              <div className='mt-1 text-xs text-gray-500'>
                                (Worldwide)
                              </div>
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Legal liability coverage for personal accidents
                              and property damage
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $500,000
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Valuables
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Coverage for jewelry, watches, art, and other
                              valuable items
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              30% of Content Sum Insured
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Removal of Debris
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Cost of removing debris following damage to
                              renovated areas
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              10% of Renovation Sum Insured
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Professional Fees
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Architect, surveyor, and legal fees for rebuilding
                              or renovation
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              10% of Building and/or Renovation Sum Insured
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Conservancy Charge
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Monthly maintenance fees during alternative
                              accommodation period
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $500
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Unauthorised Transactions
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Fraudulent use of stolen ATM or credit cards
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $1,000
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Accidental Breakage
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Mirrors and fixed glass breakage due to accidents
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $1,000
                            </td>
                          </tr>

                          <tr>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Money
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Cash, cheques, and monetary instruments
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $750
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}

        {/* Add-ons Section */}
        {showAddOns && (
          <div id='addons-section' className='animate-in fade-in duration-500'>
            <div className='mb-12 text-center'>
              <h2 className='mb-6 text-4xl font-bold text-gray-800'>
                Enhance Your Coverage
              </h2>
              <p className='mx-auto max-w-[600px] text-base leading-relaxed text-gray-600 sm:text-lg'>
                Choose from our additional coverage options to protect what
                matters most
              </p>
            </div>

            <div
              className={`mb-8 grid grid-cols-1  sm:mb-12 sm:gap-6 ${formData.homeType !== 'landed property' ? 'md:grid-cols-1 lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2'}`}
            >
              {ADD_ONS.map((addOn) => {
                const isSelected = selectedAddOns.some(
                  (item) => item.id === addOn.id,
                );
                const selectedOption = selectedAddOns.find(
                  (item) => item.id === addOn.id,
                )?.selectedOption;
                let displayPrice = 0;
                if (addOn.id === 'building') {
                  if (formData.homeType !== 'landed property') {
                    return;
                  }
                  displayPrice =
                    planData.find((plan) => plan.id === formData.selectedPlan)
                      ?.buildingCoverageWithDiscount || 0;
                } else {
                  displayPrice =
                    planData.find((plan) => plan.id === formData.selectedPlan)
                      ?.worldwideFpaWithDiscount || 0;
                }

                return (
                  <AddOnCard
                    key={addOn.id}
                    addOn={addOn}
                    isSelected={isSelected}
                    selectedOption={selectedOption}
                    onToggle={() => onAddOnToggle(addOn.id, displayPrice)}
                    onOptionChange={(option) =>
                      onAddOnOptionChange(addOn.id, option, displayPrice)
                    }
                    displayPrice={displayPrice}
                  />
                );
              })}
            </div>
            <br />
          </div>
        )}

        {/* Premium Summary - Show when plan is selected */}
        {currentPlan && (
          <PremiumSummary
            selectedPlan={currentPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            promoStatus={promoStatus}
            currentStep={currentStep}
            onNext={onNext}
            onBack={onBack}
            formData={formData}
            customizationData={customizationData}
            showAddOns={showAddOns}
          />
        )}
      </>
    );
  },
);

Step1QuoteForm.displayName = 'Step1QuoteForm';
export default Step1QuoteForm;
