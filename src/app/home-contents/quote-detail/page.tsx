'use client';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DataFromSingpass } from '@/libs/types/quote';

import {
  CustomizationData,
  HomeContentQuoteSavePayload,
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
  generateKeyAndAttachToUrl,
  saveToLocalStorage,
  saveToSessionStorage,
} from '@/libs/utils/utils';

import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

import { ADD_ONS } from '@/constants/home.content.addon.constants';
import { PLANS } from '@/constants/home.content.constants';
import {
  useGenerateHomeContentsQuote,
  useGetPremiumCalc,
  useGetProductDetails,
} from '@/hook/insurance/homeContentQuote';

import Step1QuoteForm from './Step1QuoteForm';
import Step2PersonalInfo from './Step2PersonalInfo';
import Step3Summary from './Step3Summary';
import Step4Success from './Step4Success';
import {
  INITIAL_PERSONAL_INFO,
  INITIAL_PROMO_STATUS,
  INITIAL_MYINFO_DATA,
  INITIAL_FORM_DATA,
} from './initialData';
import {
  usePostPersonalInfoHomeContent,
  useRequestLoginHomeContent,
} from '@/hook/auth/login-home-content';
import { PRODUCT_NAME } from '@/app/api/constants/product';
import { useAppSelector } from '@/redux/store';
import { GetUserInfoFromSingpassService } from '@/app/api/v1/singpass/user-info/[product]/singpass-get-user-info.service';
import { DATA_FROM_SINGPASS } from '@/constants/general.constant';
import { useSaveProposal } from '@/hook/insurance/quote';

export default function QuoteDetailPage() {
  //#region State Management
  // State management - using pre-computed initial objects
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const storedData = localStorage.getItem('currentStep');
      if (storedData) {
        const step = parseInt(storedData);
        if (!isNaN(step)) {
          return step;
        }
      }
      return 1;
    } catch (e) {
      console.error('error getting step');
      return 1;
    }
  });
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  useEffect(() => {
    localStorage.setItem('currentStep', currentStep.toString());
    setVisitedSteps((prev) => {
      const newSet = new Set(prev);
      for (let i = 2; i <= currentStep; i++) {
        newSet.add(i);
      }
      return newSet;
    });
  }, [currentStep]);

  //generate quote
  const { mutateAsync: generateHomeContentQuote } =
    useGenerateHomeContentsQuote();

  const { mutateAsync: getPremiumCalc } = useGetPremiumCalc();

  useEffect(() => {
    const keyQuote = generateKeyAndAttachToUrl(initKey);
    setKey(keyQuote);
  }, []);

  // const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoForm>(
  //   INITIAL_PERSONAL_INFO,
  // );

  // UI state
  const [showPlans, setShowPlans] = useState(false);
  const [allplans, setAllPlans] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('plans');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          return PLANS;
        }
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }
    return PLANS;
  });
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

  // Form data with memory-efficient initial values
  const [formData, setFormData] = useState<QuoteForm>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('quoteFormData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          setSelectedAddOns(parsedData.addons || INITIAL_FORM_DATA.addons);

          return {
            ...INITIAL_FORM_DATA,
            ...parsedData,
            coverageOptions: {
              ...INITIAL_FORM_DATA.coverageOptions,
              ...(parsedData.coverageOptions || {}),
            },
            addons: parsedData.addons || INITIAL_FORM_DATA.addons,
          };
        }
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }

    return INITIAL_FORM_DATA;
  });
  ///stores updated data in local storage.
  useEffect(() => {
    console.log(`formData changed: ${JSON.stringify(formData)}`);
    localStorage.setItem('quoteFormData', JSON.stringify(formData));
    if (formData.quoteStep >= 1) {
      setShowPlans(true);
    }
    if (formData.quoteStep >= 2) {
      setSelectedPlan(formData.selectedPlan);
      setShowAddOns(true);
    }
    // if (formData.quoteStep >= 3) {
    //   setShowAddOns(true);
    //   // scrollToBottom();
    // }
  }, [formData]);

  const resetQuoteForm = useCallback(() => {
    console.log('Resetting');
    setShowPlans(false);
    setShowCustomization(false);
    setShowAddOns(false);
    updateFormData('quoteStep', '0'); // remember to reset the step so that the page properly resets.
    setSelectedPlan('');
    updateFormData('selectedPlan', '');
    setSelectedAddOns([]);

    // setFormData(INITIAL_FORM_DATA);
  }, [formData]);

  //#endregion

  //#region Product type code
  const searchParams = useSearchParams();
  const partnerCode = searchParams.get('partner_code') || '';
  const promoDefault = searchParams.get('promo_code') || '';

  const initKey = searchParams.get('key') || '';
  const [key, setKey] = useState(initKey);

  const homeContentsInsuranceSteps = [
    {
      step: 1,
      title: 'Quote Details',
      description: 'Home Info',
    },
    {
      step: 2,
      title: 'Personal Info',
      description: "Policyholder's Detail",
    },
    {
      step: 3,
      title: 'Review & Pay',
      description: 'Confirm & checkout',
    },
  ];

  //#endregion

  // Memoized computed values with early returns
  const currentPlan = useMemo(() => {
    if (!selectedPlan) return null;
    return allplans.find((p) => p.id === selectedPlan) || null;
  }, [selectedPlan]);

  const totalPremium = useMemo(() => {
    if (!currentPlan) return 0;
    // Policy duration will be determined by the selected plan instead of form data
    return calculateTotalPremium(
      currentPlan,
      selectedAddOns,
      promoStatus,
      undefined,
      formData.coverageOptions,
    );
  }, [currentPlan, selectedAddOns, promoStatus, formData]);

  const updateFormData = useCallback(
    (
      field: keyof QuoteForm | keyof CustomizationData | 'addon',
      value: string,
      addOnId?: string,
      remove?: boolean,
    ) => {
      setFormData((prev) => {
        //Addon case
        if (field === 'addon' && addOnId) {
          if (remove) {
            const newData: QuoteForm = {
              ...prev,
              addons: prev.addons.filter((item) => item.id !== addOnId),
            };
            return newData;
          }

          const exists = prev.addons.some((item) => item.id === addOnId);

          const newData: QuoteForm = {
            ...prev,
            addons: exists
              ? prev.addons.map((item) =>
                  item.id === addOnId
                    ? { ...item, selectedOption: value }
                    : item,
                )
              : [...prev.addons, { id: addOnId, selectedOption: value }],
          };

          return newData;
        }

        // coverage Options
        if (field in prev.coverageOptions) {
          const coverageField = field as keyof CustomizationData;
          if (prev.coverageOptions[coverageField] === value) return prev;

          const newData: QuoteForm = {
            ...prev,
            coverageOptions: {
              ...prev.coverageOptions,
              [coverageField]: value,
            },
          };
          return newData;
        }

        // QuoteForm fields
        const quoteField = field as keyof QuoteForm;
        if (prev[quoteField] === value) return prev;

        const newData: QuoteForm = { ...prev, [quoteField]: value };

        // Ownership logic
        if (quoteField === 'ownership') {
          if (value === 'tenant') {
            if (newData.homeType === 'hdb') newData.unitType = '3-room';
            else if (newData.homeType === 'condo') newData.unitType = '2-room';
          }
        }

        // Home type logic
        if (quoteField === 'homeType') {
          if (value === 'landed') newData.unitType = 'landed';
          else if (value === 'hdb') newData.unitType = '4-Room';
          else if (value === 'condo') newData.unitType = '3-Room';
        }

        if (quoteField === 'quoteStep') {
          newData.quoteStep = parseInt(value);
        }

        // Special cases
        if (quoteField === 'coverageOptions')
          newData.coverageOptions = JSON.parse(value);

        return newData;
      });

      // --- Clear errors only for top-level QuoteForm fields ---
      if (
        (Object.keys(INITIAL_FORM_DATA) as (keyof QuoteForm)[]).includes(
          field as keyof QuoteForm,
        )
      ) {
        const key = field as keyof QuoteForm;
        setErrors((prev) => {
          const { [key]: _, ...rest } = prev;
          return rest;
        });
      }

      // --- Reset promo if needed ---
      if (field === 'promoCode' && promoStatus.status !== 'none') {
        setPromoStatus(INITIAL_PROMO_STATUS);
      }
    },
    [promoStatus.status],
  );

  //#region Personal Info Handler
  const homeContentInfo = useAppSelector(
    (state) => state.ecicsUserInfo?.userInfo,
  );
  const personalInfo = homeContentInfo ? JSON.parse(homeContentInfo) : null;

  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoForm>(
    () => {
      if (typeof window !== 'undefined') {
        try {
          const storedData = sessionStorage.getItem(DATA_FROM_SINGPASS);
          if (storedData) {
            const parsedData = JSON.parse(storedData);

            // setSelectedAddOns(parsedData.addons || INITIAL_FORM_DATA.addons);

            const newData = INITIAL_PERSONAL_INFO;
            newData.policyHolderEmail = parsedData?.email.value || '';
            newData.policyHolderMobileNumber =
              parsedData?.mobileno.nbr.value || '';
            newData.addressLine1 =
              parsedData?.regadd?.block?.value &&
              parsedData?.regadd?.street?.value
                ? `${parsedData.regadd.block.value} ${parsedData.regadd.street.value}`
                : '';
            newData.addressLine2 = parsedData?.regadd?.building?.value || '';
            newData.policyHolderFullName = parsedData?.name?.value || '';
            newData.policyHolderNationality =
              parsedData?.nationality?.desc || '';
            newData.policyHolderNricFin = parsedData?.uinfin?.value || '';
            newData.policyHolderDateOfBirth = parsedData?.dob?.value || '';
            newData.postalCode = parsedData?.regadd?.postal?.value || '';
            return newData;
          } else {
            console.log(`singpass Data not found`);
          }
        } catch (error) {
          console.error('Failed to parse saved form data:', error);
        }
      }

      return INITIAL_PERSONAL_INFO;
    },
  );

  useEffect(() => {
    setPersonalInfoErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(personalInfoData).forEach((key) => {
        delete newErrors[key as keyof PersonalInfoForm];
      });
      return newErrors;
    });
  }, [personalInfoData]);

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
  //#endregion

  //#region Scroll
  // Optimized scroll functions
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, []);

  const scrollToElement = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);
  //#endregion

  // 🔒 PROTECTED - Step navigation logic with optimizations
  const handleStepClick = useCallback(
    (targetStep: number) => {
      if (targetStep === currentStep) return;

      if (visitedSteps.has(targetStep)) {
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
          if (!selectedPlan || !visitedSteps.has(2)) return;
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
          setVisitedSteps((prev) => new Set(prev).add(targetStep));
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

  //#region Singpass Retrieve
  const { mutate: savePersonalInfo } = usePostPersonalInfoHomeContent();

  const { mutate: requestLoginHomeContents } = useRequestLoginHomeContent(
    PRODUCT_NAME.HOME_CONTENT,
    {
      onError: () => {
        console.log('ERROR');
      },
    },
  );

  // 🔒 PROTECTED - MyInfo handler with memory cleanup
  const handleRetrieveMyInfo = () => requestLoginHomeContents();

  //#endregion

  // 🔒 PROTECTED - Build payload helper for both initial quote and add-on recalculation
  const buildPayload = useCallback(
    (addOnsOverride?: SelectedAddOn[]) => {
      const storedMap = localStorage.getItem('hc_result_map');
      const resultMap = storedMap ? JSON.parse(storedMap) : null;
      const addOnsToUse =
        addOnsOverride !== undefined ? addOnsOverride : selectedAddOns;

      const payload: any = {
        key: key,
        homeOwnership: formData.ownership,
        homeType: formData.homeType,
        unitType: formData.unitType,
        startDate: formData.policyStartDate,
        promoCode: formData.promoCode,
        renovations: formData.coverageOptions.renovationCoverageValue,
        homeContents: formData.coverageOptions.homeContentCoverageValue,
        resultMap: resultMap,
        redirectUrl: '',
        returnUrl: '',
      };

      // Add building and worldwide FPA from add-ons to payload
      addOnsToUse.forEach((addOn) => {
        if (addOn.id === 'building' && addOn.selectedOption) {
          const value =
            ADD_ONS.find((addon) => addon.id === addOn.id)?.options?.find(
              (o) => o.label === addOn.selectedOption,
            )?.value || '0';
          payload.building = `${value?.replace('$', 'SGD')}`;
        } else if (addOn.id === 'worldwide-fpa' && addOn.selectedOption) {
          payload.worldwideFpa = addOn.selectedOption;
        }
      });

      return payload;
    },
    [formData, key, selectedAddOns],
  );

  // 🔒 PROTECTED - Recalculate premium with new add-ons
  const recalculateWithAddOns = useCallback(
    async (newAddOns: SelectedAddOn[]) => {
      const payload = buildPayload(newAddOns);
      console.log(
        `recalculating with add-ons, payload = ${JSON.stringify(payload)}`,
      );

      try {
        const res = await getPremiumCalc(payload);
        console.log(`add-on recalculation response = ${JSON.stringify(res)}`);
        setAllPlans(res);
      } catch (err) {
        console.log('ERROR RECALCULATING PREMIUM WITH ADD-ONS:', err);
      }
    },
    [buildPayload],
  );

  useEffect(() => {
    // Only recalc after base quote exists
    if (!showPlans) return;
    if (showAddOns) {
      recalculateWithAddOns(selectedAddOns);
    }
  }, [selectedAddOns, showPlans, recalculateWithAddOns]);

  //#region HANDLE GET QUOTE
  // 🔒 PROTECTED - Quote calculation with timeout management
  const handleCalculateQuote = useCallback(() => {
    const newErrors = validateQuoteForm(formData);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) return;

    setIsLoading(true);

    const payload = buildPayload();

    getPremiumCalc(payload)
      .then((res) => {
        console.log(`res = ${JSON.stringify(res)}`);
        // const returns = JSON.parse(res);
        // console.log(`cells = ${JSON.stringify(res.data.cells)}`);
        // setAllPlans(res);
        setShowPlans(true);
        setIsLoading(false);
        updateFormData('quoteStep', '1');
        setAllPlans(res);

        const timeoutId = setTimeout(() => {
          const scrollTimeoutId = setTimeout(() => {
            scrollToElement('#plans-section');
          }, 10);
          return () => clearTimeout(scrollTimeoutId);
        }, 100);
        return () => clearTimeout(timeoutId);
      })
      .catch((err) => {
        console.log('ERROR GENERATING QUOTE:', err);
      });
  }, [formData, scrollToElement, buildPayload]);
  //#endregion
  // 🔒 PROTECTED - Plan selection with customization revelation
  const handlePlanSelect = useCallback(
    (planId: string) => {
      setSelectedPlan(planId);
      setShowAddOns(true);
      updateFormData('selectedPlan', planId);
      updateFormData('quoteStep', '2');

      const timeoutId = setTimeout(() => {
        scrollToElement('#addons-section');
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [scrollToElement],
  );

  const handleSaveQuote = useCallback(() => {
    const payload: HomeContentQuoteSavePayload = {
      key: key,
      proposerDetails: {
        addressLine1: personalInfoData.addressLine1,
        addressLine2: personalInfoData.addressLine2 || '',
        addressLine3: personalInfoData.addressLine3 || '',
        postCode: personalInfoData.postalCode,
        name: personalInfoData.policyHolderFullName,
        nric: personalInfoData.policyHolderNricFin,
        dob: personalInfoData.policyHolderDateOfBirth,
        gender: 'M',
        maritalStatus: 'M',
        mobile: personalInfoData.policyHolderMobileNumber,
        email: personalInfoData.policyHolderEmail,
        differentMailingAddress:
          personalInfoData.mailingAddressDifferent.toUpperCase(),
        mailingAddress1: personalInfoData.mailingAddressLine1,
        mailingAddress2: personalInfoData.mailingAddressLine2 || '',
        mailingAddress3: personalInfoData.mailingAddressLine3 || '',
        mailingPostCode: personalInfoData.mailingPostalCode,
      },
      planDetails: {
        homeOwnership: 'Owner',
        homeType: 'Landed Property',
        unitType: 'Landed',
        homeContentCoverage: '40000',
        renovationsCoverage: '30000',
        buildingCoverage: '200000',
        wpaCoverage: '100000',
        policyPeriod: '3 Years',
        promoCode: 'HOME40',
        selectedPlan: '3 Years',
        startDate: '2025-12-31',
      },

      __finalize: 1,
    };

    generateHomeContentQuote(payload).then((res) => {
      console.log(`quote res = ${JSON.stringify(res)}`);
      if (res.status === '0') {
        setCurrentStep(3);
        setVisitedSteps((prev) => new Set(prev).add(3));
        scrollToTop();
      } else {
        console.log('Quote save failed');
      }
    });
  }, [isLoading]);

  // Handler for continuing from customization to add-ons
  const handleCustomizationComplete = useCallback(() => {
    setShowAddOns(true);
    updateFormData('quoteStep', '3');
    const timeoutId = setTimeout(() => {
      scrollToElement('#addons-section');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);

  // 🔒 PROTECTED - Add-on toggle - ISP recalculation
  const handleAddOnToggle = useCallback(
    (addOnId: string) => {
      setSelectedAddOns((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === addOnId);
        let newAddOns: SelectedAddOn[];

        if (existingIndex >= 0) {
          // Remove add-on
          updateFormData('addon', '', addOnId, true);
          newAddOns = prev.filter((_, index) => index !== existingIndex);
        } else {
          // Add add-on with default option
          const addOn = ADD_ONS.find((a) => a.id === addOnId);
          const newAddOn: SelectedAddOn = {
            id: addOnId,
            ...(addOn?.hasOptions && {
              selectedOption: addOn.options?.[0]?.value,
            }),
          };
          newAddOns = [...prev, newAddOn];
          updateFormData('addon', '', addOnId, false);
        }
        return newAddOns;
      });
    },
    [updateFormData],
  );

  const handleAddOnOptionChange = useCallback(
    (addOnId: string, option: string) => {
      setSelectedAddOns((prev) => {
        const newAddOns = prev.map((item) =>
          item.id === addOnId ? { ...item, selectedOption: option } : item,
        );

        updateFormData('addon', option, addOnId);

        return newAddOns;
      });
    },
    [updateFormData],
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
        setVisitedSteps((prev) => new Set(prev).add(2));
        scrollToTop();
        return;
      }

      // Fallback: if somehow neither condition is met, go to Step 2
      setCurrentStep(2);
      setVisitedSteps((prev) => new Set(prev).add(2));
      scrollToTop();
    } else if (currentStep === 2) {
      const newErrors = validatePersonalInfoForm(personalInfoData);
      setPersonalInfoErrors(newErrors);

      if (isFormValid(newErrors)) {
        handleSaveQuote();
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

  //#region Payment
  const {
    mutateAsync: saveProposal,
    isSuccess,
    isPending: isPendingSave,
    isError,
  } = useSaveProposal();

  const handleMakePayment = useCallback(() => {
    // saveProposal()
    setCurrentStep(4);
    scrollToTop();
  }, [scrollToTop]);
  //#endregion
  const handleBack = useCallback(() => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  }, [currentStep, scrollToTop]);

  //#region Edit handlers for Step 3
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
  //#endregion

  //#region STEPS
  const steps = [
    <Step1QuoteForm
      key='Step 1'
      formData={formData}
      planData={allplans}
      updateFormData={updateFormData}
      resetFormData={resetQuoteForm}
      errors={errors}
      promoStatus={promoStatus}
      setPromoStatus={setPromoStatus}
      showPlans={showPlans}
      showCustomization={showCustomization}
      showAddOns={showAddOns}
      selectedPlan={selectedPlan}
      selectedAddOns={selectedAddOns}
      customizationData={formData.coverageOptions}
      updateCustomizationData={updateFormData}
      isLoading={isLoading}
      onCalculateQuote={handleCalculateQuote}
      onPlanSelect={handlePlanSelect}
      onCustomizationComplete={handleCustomizationComplete}
      onAddOnToggle={handleAddOnToggle}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={currentStep}
      hasViewedCustomization={hasViewedCustomization}
      setHasViewedCustomization={setHasViewedCustomization}
      onAddOnOptionChange={handleAddOnOptionChange}
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
      customizationData={formData.coverageOptions}
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
      customizationData={formData.coverageOptions}
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
  //#endregion

  return (
    <QuoteDetail
      progressStepperData={{
        steps: homeContentsInsuranceSteps,
        title: 'Home Contents Insurance Quotation',
        currentStep: currentStep,
        onStepClick: handleStepClick,
        visitedSteps: visitedSteps,
        selectedPlan: selectedPlan,
      }}
      steps={steps}
      currentStep={currentStep}
    />
  );
}
