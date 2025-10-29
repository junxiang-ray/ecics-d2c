'use client';
//#region Imports
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CustomizationData,
  MyInfoData,
  PersonalInfoForm,
  PromoCodeStatus,
  QUOTE_FORM_KEYS,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
// Utils
import { calculateTotalPremium } from '@/libs/utils/calculations';
import {
  isFormValid,
  validatePersonalInfoForm,
  validateQuoteForm,
} from '@/libs/utils/home-content';

import { ProgressStepper } from '@/components/new-ui/StepsCard';
import AppBar from '@/components/ui/appbar';

import { ADD_ONS } from '@/constants/home.content.addon.constants';
import { PLANS } from '@/constants/home.content.constants';

import Step1QuoteForm from '../../../../app/home-contents/insurance/quote-detail/Step1QuoteForm';
import Step2PersonalInfo from '../../../../app/home-contents/insurance/quote-detail/Step2PersonalInfo';
import { usePathname, useSearchParams } from 'next/navigation';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { cn, formatPromoCode, saveToLocalStorage } from '@/libs/utils/utils';
import { useAppDispatch } from '@/redux/store';
import { resetEcicsUserInfo } from '@/redux/slices/ecicsUserInfo.slice';
import { clearQuote, clearMatchedMakeModel } from '@/redux/slices/quote.slice';
import { clearUserInfoCar } from '@/redux/slices/userInfoCar.slice';
import Step3Summary from '../../../../app/home-contents/insurance/quote-detail/Step3Summary';
import Step4Success from '../../../../app/home-contents/insurance/quote-detail/Step4Success';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scrollArea';
import { Card, CardContent, CardTitle } from '@/components/ui/cardNew';

//#endregion

const TOMORROW_DATE = new Date(Date.now() + 86400000)
  .toISOString()
  .split('T')[0];

//#region Initial Form Data
// Pre-computed initial state objects to prevent recreation
const INITIAL_FORM_DATA: QuoteForm = {
  ownership: 'owner-living-in',
  homeType: 'hdb',
  unitType: '4-room',
  policyStartDate: TOMORROW_DATE,
  promoCode: '',
};

const INITIAL_PERSONAL_INFO: PersonalInfoForm = {
  policyHolderFullName: '',
  policyHolderNricFin: '',
  policyHolderNationality: 'Singaporean',
  policyHolderMobileNumber: '',
  policyHolderEmail: '',
  policyHolderDateOfBirth: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  postalCode: '',
  mailingAddressDifferent: 'no',
  mailingAddressLine1: '',
  mailingAddressLine2: '',
  mailingAddressLine3: '',
  mailingPostalCode: '',
  previousInsurerName: '',
  otherInsurerName: '',
};

const INITIAL_MYINFO_DATA: MyInfoData = {
  isRetrieved: false,
  isLoading: false,
  data: undefined,
};

const INITIAL_PROMO_STATUS: PromoCodeStatus = { status: 'none' };

const INITIAL_CUSTOMIZATION_DATA: CustomizationData = {
  hdbFireInsurance: 'yes', // Default to "Yes" - most common case
  building: '100000', // Default $100,000 (smallest option)
  homeContent: '30000', // Default $30,000 (smallest option)
  renovation: '10000', // Default $10,000 (smallest option)
};
//#endregion

const QuoteDetail = () => {
  //#region State Management
  // State management - using pre-computed initial objects
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([1]);

  // Form data with memory-efficient initial values
  const [formData, setFormData] = useState<QuoteForm>(() => {
    if (typeof window !== 'undefined') {
      const savedForm = { ...INITIAL_FORM_DATA }; // Start with defaults

      (Object.keys(INITIAL_FORM_DATA) as (keyof QuoteForm)[]).forEach((key) => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
          // Force cast safely — localStorage only stores strings
          savedForm[key] = storedValue as QuoteForm[typeof key];
        }
      });

      return savedForm;
    }

    return INITIAL_FORM_DATA;
  });

  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoForm>(
    INITIAL_PERSONAL_INFO,
  );
  const [customizationData, setCustomizationData] = useState<CustomizationData>(
    INITIAL_CUSTOMIZATION_DATA,
  );

  // UI state
  const [showPlans, setShowPlans] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAddOns, setShowAddOns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasViewedCustomization, setHasViewedCustomization] = useState(false);

  // Selections
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);

  // Errors
  const [errors, setErrors] = useState<Partial<QuoteForm>>({});
  const [personalInfoErrors, setPersonalInfoErrors] = useState<
    Partial<PersonalInfoForm>
  >({});

  // Status state
  const [promoStatus, setPromoStatus] =
    useState<PromoCodeStatus>(INITIAL_PROMO_STATUS);
  const [myInfoData, setMyInfoData] = useState<MyInfoData>(INITIAL_MYINFO_DATA);

  // Success screen state
  const [policyDetailsOpen, setPolicyDetailsOpen] = useState(false);
  const [helperDetailsOpen, setHelperDetailsOpen] = useState(false);
  const [insuredInfoOpen, setInsuredInfoOpen] = useState(false);

  // Legal document popup state
  const [eligibilityPopupOpen, setEligibilityPopupOpen] = useState(false);
  const [termsPopupOpen, setTermsPopupOpen] = useState(false);
  const [privacyPopupOpen, setPrivacyPopupOpen] = useState(false);
  //#endregion

  ///Check product type here
  const pathname = usePathname();

  function getProductTypeFromPathname(pathname: string): ProductType {
    switch (true) {
      case pathname.startsWith('/maid'):
        return ProductType.MAID;
      case pathname.startsWith('/motorcycle'):
        return ProductType.MOTORCYCLE;
      case pathname.startsWith('/home-contents'):
        return ProductType.HOMECONTENTS;
      default:
        return ProductType.CAR;
    }
  }

  const productType: ProductType = getProductTypeFromPathname(pathname);
  ///get partner code and promo code
  const searchParams = useSearchParams();
  const partnerCode = searchParams.get('partner_code') || '';
  const promoCodeDefault = formatPromoCode(searchParams.get('promo_code'));

  ///Reset all stored info
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetEcicsUserInfo());
    dispatch(clearQuote());
    dispatch(clearMatchedMakeModel());
    dispatch(clearUserInfoCar());
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  // Memoized computed values with early returns
  const currentPlan = useMemo(() => {
    if (!selectedPlan) return null;
    return PLANS.find((p) => p.id === selectedPlan) || null;
  }, [selectedPlan]);

  const totalPremium = useMemo(() => {
    if (!currentPlan) return 0;
    // Policy duration will be determined by the selected plan instead of form data
    return calculateTotalPremium(
      currentPlan,
      selectedAddOns,
      promoStatus,
      undefined,
      customizationData,
    );
  }, [currentPlan, selectedAddOns, promoStatus, customizationData]);

  // Memoized visited steps set to prevent recreation
  const visitedStepsSet = useMemo(() => new Set(visitedSteps), [visitedSteps]);

  // Optimized handlers with useCallback to prevent child re-renders
  const updateFormData = useCallback(
    (field: keyof QuoteForm, value: string) => {
      setFormData((prev) => {
        // Early return if value hasn't changed (memory optimization)
        if (prev[field] === value) return prev;

        const newData = { ...prev, [field]: value };

        // Business logic for ownership changes
        if (field === 'ownership') {
          // Reset unit type based on default for each ownership type
          if (value === 'tenant') {
            // Tenants typically live in smaller units
            if (newData.homeType === 'hdb') {
              newData.unitType = '3-room';
            } else if (newData.homeType === 'condo') {
              newData.unitType = '2-room';
            }
          }
        }

        // Business logic for home type and unit type
        if (field === 'homeType') {
          // Reset unit type when home type changes
          if (value === 'landed') {
            newData.unitType = 'landed-single';
          } else if (value === 'hdb') {
            newData.unitType = '4-room';
          } else if (value === 'condo') {
            newData.unitType = '3-room';
          }
        }
        // console.log(`formData = ${JSON.stringify(newData)}`);

        saveToLocalStorage(newData);
        return newData;
      });

      // Clear errors efficiently
      if (errors[field]) {
        setErrors((prev) => {
          const { [field]: _, ...rest } = prev;
          return rest;
        });
      }

      // Reset promo status if promo code changes
      if (field === 'promoCode' && promoStatus.status !== 'none') {
        setPromoStatus(INITIAL_PROMO_STATUS);
      }
    },
    [errors, promoStatus.status],
  );

  const updatePersonalInfoData = useCallback(
    (field: keyof PersonalInfoForm, value: string) => {
      setPersonalInfoData((prev) => {
        // Early return if value hasn't changed
        if (prev[field] === value) return prev;

        const newData = { ...prev, [field]: value };

        // 🔒 PROTECTED - Business logic for insurer selection
        if (field === 'previousInsurerName' && value !== 'Other') {
          newData.otherInsurerName = '';
        }

        // Business logic for mailing address
        if (field === 'mailingAddressDifferent' && value === 'no') {
          newData.mailingAddressLine1 = '';
          newData.mailingAddressLine2 = '';
          newData.mailingAddressLine3 = '';
          newData.mailingPostalCode = '';
        }

        return newData;
      });

      // Clear errors efficiently
      if (personalInfoErrors[field]) {
        setPersonalInfoErrors((prev) => {
          const { [field]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [personalInfoErrors],
  );

  const updateCustomizationData = useCallback(
    (field: keyof CustomizationData, value: string) => {
      setCustomizationData((prev) => {
        // Early return if value hasn't changed
        if (prev[field] === value) return prev;

        return { ...prev, [field]: value };
      });
    },
    [],
  );

  // Optimized scroll functions
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToElement = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // 🔒 PROTECTED - Step navigation logic with optimizations
  const handleStepClick = useCallback(
    (targetStep: number) => {
      if (targetStep === currentStep) return;

      if (visitedSteps.includes(targetStep)) {
        setCurrentStep(targetStep);
        scrollToTop();
        return;
      }

      if (targetStep === currentStep + 1) {
        let canProceed = false;

        if (targetStep === 2) {
          if (!selectedPlan) return;
          const newErrors = validateQuoteForm(formData);
          setErrors(newErrors);
          canProceed = isFormValid(newErrors);
        } else if (targetStep === 3) {
          if (!selectedPlan || !visitedSteps.includes(2)) return;
          if (currentStep === 2) {
            const newErrors = validatePersonalInfoForm(personalInfoData);
            setPersonalInfoErrors(newErrors);
            canProceed = isFormValid(newErrors);
          } else {
            canProceed = true;
          }
        }

        if (canProceed) {
          setCurrentStep(targetStep);
          setVisitedSteps((prev) => [...prev, targetStep]);
          scrollToTop();
        }
      }
    },
    [
      currentStep,
      visitedSteps,
      selectedPlan,
      formData,
      personalInfoData,
      scrollToTop,
    ],
  );

  // 🔒 PROTECTED - MyInfo handler with memory cleanup
  const handleRetrieveMyInfo = useCallback(() => {
    setMyInfoData((prev) => ({ ...prev, isLoading: true }));

    const timeoutId = setTimeout(() => {
      const mockData = {
        policyHolderFullName: 'John Tan Wei Ming',
        policyHolderDateOfBirth: '1985-05-15',
        policyHolderNricFin: 'S8505123A',
        policyHolderNationality: 'Singaporean',
        policyHolderMobileNumber: '91234567',
        policyHolderEmail: 'john.tan@email.com',
        addressLine1: '123 Orchard Road',
        addressLine2: '#12-34',
        addressLine3: 'Orchard Plaza',
        postalCode: '238874',
      };

      setPersonalInfoData((prev) => ({ ...prev, ...mockData }));
      setPersonalInfoErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(mockData).forEach((key) => {
          delete newErrors[key as keyof PersonalInfoForm];
        });
        return newErrors;
      });
      setMyInfoData({
        isRetrieved: true,
        isLoading: false,
        data: mockData,
      });
    }, 2000);

    // Memory cleanup
    return () => clearTimeout(timeoutId);
  }, []);

  // 🔒 PROTECTED - Quote calculation with timeout management
  const handleCalculateQuote = useCallback(() => {
    const newErrors = validateQuoteForm(formData);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) return;

    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setShowPlans(true);
      setIsLoading(false);

      const scrollTimeoutId = setTimeout(() => {
        scrollToElement('#plans-section');
      }, 150);

      return () => clearTimeout(scrollTimeoutId);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, scrollToElement]);

  // 🔒 PROTECTED - Plan selection with customization revelation
  const handlePlanSelect = useCallback(
    (planId: string) => {
      setSelectedPlan(planId);
      setShowCustomization(true);

      const timeoutId = setTimeout(() => {
        scrollToElement('#customization-section');
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [scrollToElement],
  );

  // Handler for continuing from customization to add-ons
  const handleCustomizationComplete = useCallback(() => {
    setShowAddOns(true);

    const timeoutId = setTimeout(() => {
      scrollToElement('#addons-section');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);

  // 🔒 PROTECTED - Add-on toggle with efficient array operations
  const handleAddOnToggle = useCallback((addOnId: string) => {
    setSelectedAddOns((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === addOnId);
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        const addOn = ADD_ONS.find((a) => a.id === addOnId);
        const newAddOn: SelectedAddOn = {
          id: addOnId,
          ...(addOn?.hasOptions && {
            selectedOption: addOn.options?.[0]?.value,
          }),
        };
        return [...prev, newAddOn];
      }
    });
  }, []);

  const handleAddOnOptionChange = useCallback(
    (addOnId: string, option: string) => {
      setSelectedAddOns((prev) =>
        prev.map((item) =>
          item.id === addOnId ? { ...item, selectedOption: option } : item,
        ),
      );
    },
    [],
  );

  // 🔒 PROTECTED - Navigation handlers with progressive sub-steps
  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      const newErrors = validateQuoteForm(formData);
      setErrors(newErrors);

      if (!isFormValid(newErrors)) return;

      if (!selectedPlan) {
        const timeoutId = setTimeout(() => {
          scrollToElement('#plans-section');
        }, 100);
        return () => clearTimeout(timeoutId);
      }

      // Progressive sub-step navigation within Step 1
      // If customization is shown but add-ons are not, trigger add-ons
      if (showCustomization && !showAddOns) {
        handleCustomizationComplete();
        return;
      }

      // If add-ons are shown, proceed to Step 2
      if (showAddOns) {
        setCurrentStep(2);
        setVisitedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]));
        scrollToTop();
        return;
      }

      // Fallback: if somehow neither condition is met, go to Step 2
      setCurrentStep(2);
      setVisitedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]));
      scrollToTop();
    } else if (currentStep === 2) {
      const newErrors = validatePersonalInfoForm(personalInfoData);
      setPersonalInfoErrors(newErrors);

      if (isFormValid(newErrors)) {
        setCurrentStep(3);
        setVisitedSteps((prev) => (prev.includes(3) ? prev : [...prev, 3]));
        scrollToTop();
      }
    }
  }, [
    currentStep,
    formData,
    selectedPlan,
    personalInfoData,
    showCustomization,
    showAddOns,
    handleCustomizationComplete,
    scrollToTop,
    scrollToElement,
  ]);

  const handleMakePayment = useCallback(() => {
    setCurrentStep(4);
    scrollToTop();
  }, [scrollToTop]);

  const handleBack = useCallback(() => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  }, [currentStep, scrollToTop]);

  // Edit handlers for Step 3
  const handleEditPolicyDetails = useCallback(() => {
    setCurrentStep(1);
    scrollToTop();
  }, [scrollToTop]);

  const handleEditPolicyHolderInfo = useCallback(() => {
    setCurrentStep(2);
    const timeoutId = setTimeout(() => {
      scrollToElement('[data-section="policyholder"]');
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);

  const handleEditPropertyInfo = useCallback(() => {
    setCurrentStep(2);
    const timeoutId = setTimeout(() => {
      scrollToElement('[data-section="property"]');
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      <AppBar />
      <div className='mx-auto max-w-6xl px-3 py-4 pb-24 sm:px-4 sm:py-6 sm:pb-32 lg:px-6 lg:py-8'>
        <ProgressStepper
          currentStep={currentStep}
          onStepClick={handleStepClick}
          visitedSteps={visitedStepsSet}
          selectedPlan=''
        />
        {currentStep === 1 && (
          <Step1QuoteForm
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            promoStatus={promoStatus}
            setPromoStatus={setPromoStatus}
            showPlans={showPlans}
            showCustomization={showCustomization}
            showAddOns={showAddOns}
            selectedPlan={selectedPlan}
            selectedAddOns={selectedAddOns}
            customizationData={customizationData}
            updateCustomizationData={updateCustomizationData}
            isLoading={isLoading}
            onCalculateQuote={handleCalculateQuote}
            onPlanSelect={handlePlanSelect}
            onCustomizationComplete={handleCustomizationComplete}
            onAddOnToggle={handleAddOnToggle}
            onAddOnOptionChange={handleAddOnOptionChange}
            onNext={handleNext}
            onBack={handleBack}
            currentStep={currentStep}
            hasViewedCustomization={hasViewedCustomization}
            setHasViewedCustomization={setHasViewedCustomization}
          />
        )}
        {currentStep === 2 && (
          <Step2PersonalInfo
            personalInfoData={personalInfoData}
            updatePersonalInfoData={updatePersonalInfoData}
            personalInfoErrors={personalInfoErrors}
            myInfoData={myInfoData}
            onRetrieveMyInfo={handleRetrieveMyInfo}
            onNext={handleNext}
            onBack={handleBack}
            selectedPlan={currentPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            promoStatus={promoStatus}
            currentStep={currentStep}
            formData={formData}
            customizationData={customizationData}
          />
        )}
        {currentStep === 3 && (
          <Step3Summary
            formData={formData}
            personalInfoData={personalInfoData}
            selectedPlan={currentPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            promoStatus={promoStatus}
            myInfoData={myInfoData}
            onBack={handleBack}
            onMakePayment={handleMakePayment}
            onEditPolicyDetails={handleEditPolicyDetails}
            onEditPolicyHolderInfo={handleEditPolicyHolderInfo}
            onEditPropertyInfo={handleEditPropertyInfo}
            currentStep={currentStep}
            customizationData={customizationData}
          />
        )}
        {currentStep === 4 && (
          <Step4Success
            selectedPlan={currentPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            formData={formData}
            personalInfoData={personalInfoData}
            policyDetailsOpen={policyDetailsOpen}
            setPolicyDetailsOpen={setPolicyDetailsOpen}
            helperDetailsOpen={helperDetailsOpen}
            setHelperDetailsOpen={setHelperDetailsOpen}
            insuredInfoOpen={insuredInfoOpen}
            setInsuredInfoOpen={setInsuredInfoOpen}
          />
        )}
        {/* Legal Notice */}
        {currentStep === 3 && (
          <Card className='mb-6 border-l-4 border-l-[#02ADEF] bg-yellow-50/60'>
            <CardContent className='p-4 sm:p-6'>
              <div className='text-sm leading-relaxed text-gray-700'>
                <CardTitle className='mb-2 font-semibold text-gray-800'>
                  Notice:
                </CardTitle>
                <p className='mb-3'>
                  By clicking "Make Payment", you understand, acknowledge and
                  agree that:
                </p>
                <ul className='ml-4 list-inside list-disc space-y-2'>
                  <li>
                    You have read and meet all the{' '}
                    <button
                      onClick={() => setEligibilityPopupOpen(true)}
                      className='rounded-sm font-medium text-[#02ADEF] underline hover:text-[#0291CC] focus:outline-none focus:ring-2 focus:ring-[#02ADEF] focus:ring-offset-2'
                    >
                      eligibility conditions
                    </button>
                    .
                  </li>
                  <li>
                    You have read and accept the{' '}
                    <button
                      onClick={() => setTermsPopupOpen(true)}
                      className='rounded-sm font-medium text-[#02ADEF] underline hover:text-[#0291CC] focus:outline-none focus:ring-2 focus:ring-[#02ADEF] focus:ring-offset-2'
                    >
                      Terms and Conditions
                    </button>
                    .
                  </li>
                  <li>
                    You consent to the collection, use, and disclosure of your
                    personal data in accordance with the{' '}
                    <button
                      onClick={() => setPrivacyPopupOpen(true)}
                      className='rounded-sm font-medium text-[#02ADEF] underline hover:text-[#0291CC] focus:outline-none focus:ring-2 focus:ring-[#02ADEF] focus:ring-offset-2'
                    >
                      Privacy Policy
                    </button>
                    .
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legal Document Popups */}

        {/* Eligibility Conditions Popup */}
        <Dialog
          open={eligibilityPopupOpen}
          onOpenChange={setEligibilityPopupOpen}
          title={
            <div className='flex flex-row items-center justify-between'>
              <DialogTitle className='text-xl font-semibold'>
                Eligibility Conditions
              </DialogTitle>
              <Button
                onClick={() => setEligibilityPopupOpen(false)}
                className='h-6 w-6 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          }
          width={700} // adjust width as needed
        >
          <div className='max-h-[60vh] space-y-4 overflow-auto pr-4 text-sm text-gray-700'>
            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Policy Holder Eligibility
              </h3>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>Must be at least 18 years old</li>
                <li>Must be a Singapore Citizen or Permanent Resident</li>
                <li>
                  Must be the legal owner or tenant of the insured property
                </li>
                <li>Must have a valid Singapore address</li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Property Eligibility
              </h3>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>Property must be located in Singapore</li>
                <li>Property must be used for residential purposes</li>
                <li>
                  Property must be in good condition and properly maintained
                </li>
                <li>
                  Property must not be subject to any building restrictions or
                  demolition orders
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Coverage Limitations
              </h3>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>Maximum coverage limits apply based on property type</li>
                <li>Certain high-risk items may require separate coverage</li>
                <li>Pre-existing damage is not covered</li>
                <li>
                  Commercial use of residential property may void coverage
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Disclosure Requirements
              </h3>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>All information provided must be accurate and complete</li>
                <li>Any material changes must be reported immediately</li>
                <li>Previous claims history must be disclosed</li>
                <li>All security measures in place must be disclosed</li>
              </ul>
            </div>
          </div>
        </Dialog>

        {/* Terms and Conditions Popup */}
        <Dialog
          open={termsPopupOpen}
          onOpenChange={setTermsPopupOpen}
          title={
            <div className='flex flex-row items-center justify-between'>
              <DialogTitle className='text-xl font-semibold'>
                Terms and Conditions
              </DialogTitle>
              <Button
                onClick={() => setTermsPopupOpen(false)}
                className='h-6 w-6 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          }
          width={700} // adjust width as needed
        >
          <div className='max-h-[60vh] space-y-4 overflow-auto pr-4 text-sm text-gray-700'>
            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                1. Policy Agreement
              </h3>
              <p>
                This policy constitutes a legal contract between the insured and
                the insurance company. By purchasing this policy, you agree to
                all terms and conditions outlined herein.
              </p>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                2. Coverage Details
              </h3>
              <p>
                Coverage is provided for personal belongings, home contents, and
                renovations as specified in your selected plan. Coverage limits
                and exclusions apply as detailed in the policy schedule.
              </p>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                3. Premium Payment
              </h3>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>Premiums must be paid in full before coverage begins</li>
                <li>Late payment may result in policy suspension</li>
                <li>
                  Refunds are subject to company policy and applicable charges
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                4. Claims Process
              </h3>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>Claims must be reported within 24 hours of discovery</li>
                <li>Proper documentation and evidence must be provided</li>
                <li>Investigation may be conducted before settlement</li>
                <li>Fraudulent claims will result in policy cancellation</li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                5. Policy Cancellation
              </h3>
              <p>
                Either party may cancel this policy with appropriate notice.
                Cancellation terms and refund calculations are detailed in the
                policy document.
              </p>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                6. Governing Law
              </h3>
              <p>
                This policy is governed by the laws of Singapore. Any disputes
                will be subject to the jurisdiction of Singapore courts.
              </p>
            </div>
          </div>
        </Dialog>

        {/* Privacy Policy Popup */}
        <Dialog
          open={privacyPopupOpen}
          onOpenChange={setPrivacyPopupOpen}
          width={700}
          closable={false}
          className={cn('max-h-[80vh] overflow-hidden')}
          title={
            <div className='flex flex-row items-center justify-between'>
              <DialogTitle className='text-xl font-semibold'>
                Privacy Policy
              </DialogTitle>
              <Button
                onClick={() => setPrivacyPopupOpen(false)}
                className='flex h-6 w-6 items-center justify-center p-0 hover:bg-gray-100'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          }
        >
          {/* Scrollable content */}
          <div className='max-h-[60vh] overflow-y-auto pr-2'>
            <div className='space-y-4 text-sm text-gray-700'>
              <div>
                <h3 className='mb-2 font-semibold text-gray-800'>
                  1. Information Collection
                </h3>
                <p>
                  We collect personal information necessary for providing
                  insurance services, including but not limited to:
                </p>
                <ul className='ml-4 mt-2 list-inside list-disc space-y-1'>
                  <li>
                    Personal identification details (NRIC/FIN, name, date of
                    birth)
                  </li>
                  <li>Contact information (address, phone, email)</li>
                  <li>Property and coverage details</li>
                  <li>Payment and financial information</li>
                </ul>
              </div>

              <div>
                <h3 className='mb-2 font-semibold text-gray-800'>
                  2. Use of Information
                </h3>
                <p>Your personal information is used for:</p>
                <ul className='ml-4 mt-2 list-inside list-disc space-y-1'>
                  <li>Policy issuance and administration</li>
                  <li>Claims processing and investigation</li>
                  <li>Customer service and support</li>
                  <li>Regulatory compliance and reporting</li>
                  <li>Product improvement and development</li>
                </ul>
              </div>

              <div>
                <h3 className='mb-2 font-semibold text-gray-800'>
                  3. Information Sharing
                </h3>
                <p>We may share your information with:</p>
                <ul className='ml-4 mt-2 list-inside list-disc space-y-1'>
                  <li>Authorized service providers and vendors</li>
                  <li>Regulatory authorities when required by law</li>
                  <li>
                    Reinsurers and business partners for legitimate business
                    purposes
                  </li>
                  <li>Legal authorities in case of suspected fraud</li>
                </ul>
              </div>

              <div>
                <h3 className='mb-2 font-semibold text-gray-800'>
                  4. Data Security
                </h3>
                <p>
                  We implement appropriate security measures to protect your
                  personal information from unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </div>

              <div>
                <h3 className='mb-2 font-semibold text-gray-800'>
                  5. Your Rights
                </h3>
                <p>You have the right to:</p>
                <ul className='ml-4 mt-2 list-inside list-disc space-y-1'>
                  <li>Access and review your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Withdraw consent where applicable</li>
                  <li>Lodge complaints with relevant authorities</li>
                </ul>
              </div>

              <div>
                <h3 className='mb-2 font-semibold text-gray-800'>
                  6. Contact Information
                </h3>
                <p>
                  For privacy-related inquiries, please contact our Data
                  Protection Officer at{' '}
                  <a
                    href='mailto:privacy@company.com'
                    className='text-blue-600 hover:underline'
                  >
                    privacy@company.com
                  </a>{' '}
                  or call our customer service hotline.
                </p>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Bottom spacing */}
        <div className='h-20 sm:h-32' />
      </div>
    </div>
  );
};

export default QuoteDetail;
