'use client';
//#region Imports
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/libs/utils/utils';

// Utils
import {
  ProgressStepper,
  ProgressStepperProps,
} from '@/components/new-ui/StepsCard';
import AppBar from '@/components/ui/appbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/cardNew';
import { Dialog, DialogTitle } from '@/components/ui/dialog';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useRequestLog } from '@/hook/insurance/quote';

//#endregion

interface QuoteDetailProps {
  progressStepperData: ProgressStepperProps;
  steps: React.ReactElement[]; // array of React components with props already applied
  currentStep: number;
}

const QuoteDetail = ({
  progressStepperData,
  steps,
  currentStep,
  // onStepClick
}: QuoteDetailProps) => {
  //#region State Management
  // State management - using pre-computed initial objects

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

  useEffect(() => {
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

  const { mutate: requestLog } = useRequestLog(getProductName());

  //#endregion

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      <AppBar />
      <div className='mx-auto max-w-6xl px-3 py-4 pb-24 sm:px-4 sm:py-6 sm:pb-32 lg:px-6 lg:py-8'>
        {currentStep < 4 && (
          <ProgressStepper {...progressStepperData}></ProgressStepper>
        )}
        {currentStep === 1 && steps[0]}
        {currentStep === 2 && steps[1]}
        {currentStep === 3 && steps[2]}
        {currentStep === 4 && steps[3]}
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
