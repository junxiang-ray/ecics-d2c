'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CustomizationData,
  MyInfoData,
  PersonalInfoForm,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import { calculateTotalPremium } from '@/libs/utils/calculations';
import {
  isFormValid,
  validatePersonalInfoForm,
  validateQuoteForm,
} from '@/libs/utils/home-content';
import {
  formatPromoCode,
  generateKeyAndAttachToUrl,
  saveToLocalStorage,
} from '@/libs/utils/utils';

import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ADD_ONS } from '@/constants/home.content.addon.constants';
import { PLANS } from '@/constants/home.content.constants';
import { useGenerateHomeContentsQuote } from '@/hook/insurance/homeContentQuote';
import { useRequestLog } from '@/hook/insurance/quote';
import { resetEcicsUserInfo } from '@/redux/slices/ecicsUserInfo.slice';
import { clearMatchedMakeModel, clearQuote } from '@/redux/slices/quote.slice';
import { clearUserInfoCar } from '@/redux/slices/userInfoCar.slice';
import { useAppDispatch } from '@/redux/store';

import Step1QuoteForm from './Step1QuoteForm';
import Step2PersonalInfo from './Step2PersonalInfo';
import Step3Summary from './Step3Summary';
import Step4Success from './Step4Success';

//#region Initial Form Data

const TOMORROW_DATE = new Date(Date.now() + 86400000)
  .toISOString()
  .split('T')[0];

// Pre-computed initial state objects to prevent recreation
const INITIAL_FORM_DATA: QuoteForm = {
  ownership: 'owner',
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

export default function QuoteDetailPage() {
  //#region State Management
  // State management - using pre-computed initial objects
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([1]);

  //generate quote
  const { mutateAsync: generateHomeContentQuote, isPending } =
    useGenerateHomeContentsQuote();

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

  useEffect(() => {
    const keyQuote = generateKeyAndAttachToUrl(initKey);
    setKey(keyQuote);
  }, []);

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

  //#region Product type code
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
    requestLog();
  }, []);

  function getProductName(): string {
    switch (productType) {
      case ProductType.HOMECONTENTS:
        return PRODUCT_NAME.HOME_CONTENT;
      case ProductType.CAR:
        return PRODUCT_NAME.MOTOR;
      case ProductType.MOTORCYCLE:
        return PRODUCT_NAME.MOTORCYCLE;
      case ProductType.MAID:
        return PRODUCT_NAME.MAID;
      default:
        return PRODUCT_NAME.MOTOR;
    }
  }

  const initKey = searchParams.get('key') || '';
  const [key, setKey] = useState(initKey);

  const { mutate: requestLog } = useRequestLog(getProductName());

  //#endregion

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
            newData.unitType = '';
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

    const payload = {
      key: key,
      homeOwnership: formData.ownership,
      homeType: formData.homeType,
      unitType: formData.unitType,
      startDate: formData.policyStartDate,
      promoCode: formData.promoCode,
      redirectUrl: '',
      returnUrl: '',
    };
    console.log(`formData = ${JSON.stringify(formData)}`);
    console.log(`payload = ${JSON.stringify(payload)}`);

    generateHomeContentQuote(payload)
      .then((res) => {
        setShowPlans(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('ERROR');
      });

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

  const steps = [
    <Step1QuoteForm
      key='Step 1'
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
    />,
    <Step2PersonalInfo
      key='Step 2'
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
    />,
    <Step3Summary
      key='Step 3'
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
    />,
    <Step4Success
      key='Step 4'
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
    />,
  ];
  return (
    <QuoteDetail
      steps={steps}
      currentStep={currentStep}
      onStepClick={handleStepClick}
    />
  );
}
