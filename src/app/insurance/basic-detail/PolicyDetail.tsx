'use client';

import {
  VehicleSelection,
  VehicleSelectionModal,
} from '@/components/VehicleSelection';
import { MOTOR_QUOTE } from '@/constants';
import { adjustDateInDate } from '@/libs/utils/date-utils';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { DropdownOption } from '@/components/ui/form/dropdownfield';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_PROMO_CODE } from './options';
import { PromoCodeModel } from '../components/PromoCode';
import VehicleBar from '../components/VehicleBar';
import PolicyDetailForm from './PolicyDetailForm';
import { PRODUCT_NAME } from '@/app/api/constants/product';

interface PolicyDetailProps {
  isSingPassFlow: boolean;
  selected_vehicle_singpass: VehicleSelection;
  // onSubmitPromoCode: (promoCode: string) => void;
}

export const PolicyDetail = ({
  isSingPassFlow = false,
  selected_vehicle_singpass,
}: PolicyDetailProps) => {
  const searchParams = useSearchParams();
  const partner_code = searchParams.get('partner_code') || '';
  const promo_code = searchParams.get('promo_code')?.toUpperCase().trim() || '';
  const [appliedPromoCode, setAppliedPromoCode] =
    useState<PromoCodeModel | null>(null);
  const [errMsgPromoCode, setErrMsgPromoCode] = useState<string>('');
  const [isVehSelectionVisible, setIsVehSelectionVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSelection>(
    {} as VehicleSelection,
  );
  const [initialValues, setInitialValues] = useState<any>(undefined);
  const [hirePurchaseList, setHirePurchaseList] = useState<DropdownOption[]>(
    [],
  );

  useEffect(() => {
    //retrieve Make and Model List

    // check promo code on url
    let initial_promo_code;
    if (promo_code) {
      verifyPromoCode(promo_code);
      initial_promo_code = promo_code;
    } else if (DEFAULT_PROMO_CODE) {
      initial_promo_code = DEFAULT_PROMO_CODE.code;
      setAppliedPromoCode(DEFAULT_PROMO_CODE);
    }

    const initialValues = {
      [MOTOR_QUOTE.quick_proposal_start_date]: new Date(),
      [MOTOR_QUOTE.quick_proposal_end_date]: adjustDateInDate(
        new Date(),
        1,
        0,
        -1,
      ),
      [MOTOR_QUOTE.quick_quote_owner_ncd]: 40,
      [MOTOR_QUOTE.quick_proposal_promo_code]: initial_promo_code || '',
    };

    if (selected_vehicle_singpass) {
      setSelectedVehicle(selected_vehicle_singpass);
    }
    setInitialValues(initialValues);
    fetchHirePurchaseList();
  }, []);

  // Options for Dropdown
  const vehicles: VehicleSelection[] = [
    {
      regNo: 'SBA2828T',
      make: 'MERCEDES BENZ',
      model: 'MAYBACH GLA650',
      first_registered_year: 2025,
    },
    {
      regNo: 'STJ2923J',
      make: 'BMW',
      model: 'Q5 2.2',
      first_registered_year: 2024,
    },
  ];

  // retrieve Hire purchase List
  const fetchHirePurchaseList = async () => {
    try {
      const resp = await fetch(`/api/v1/companies/${PRODUCT_NAME.CAR}`);
      if (resp.ok) {
        const response = await resp.json();
        const apiData: { id: number; name: string }[] = response.data;

        const formattedData = [
          { value: 0, text: '-- Others (Not Available in this list) --' }, // to update upon confirm hire purchase list
          ...apiData.map((item) => ({
            value: item.id,
            text: item.name,
          })),
        ];

        setHirePurchaseList(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch hire purchase list:', error);
    }
  };

  // retrieve Hire purchase List
  const verifyPartnerCode = async () => {
    try {
      const resp = await fetch(`/api/v1/partner/info/${partner_code}`);
      if (resp.ok) {
        const response = await resp.json();
        const apiData: { partner_code: number; partner_name: string } =
          response.data;
      }
    } catch (error) {
      console.error('Failed to fetch hire purchase list:', error);
    }
  };

  const verifyPromoCode = async (value: string) => {
    const resp = await fetch('/api/v1/promo-code/validation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promo_code: value, product_type: 'motor' }),
    });
    const data = await resp.json();
    if (data.data) {
      setAppliedPromoCode({ code: data.data.code, desc: data.data.discount });
    } else {
      setErrMsgPromoCode('Promo code not valid');
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
  };

  const onEditClick = () => {
    setIsVehSelectionVisible(true);
    console.log('click');
  };

  const handleSelection = (selected: VehicleSelection | null) => {
    if (selected) {
      setSelectedVehicle(selected);
    }
    setIsVehSelectionVisible(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let payload;
    payload = { ...data };

    if (isSingPassFlow) {
      // data from Singpass
      const personal_info = {
        name: 'Susan',
        gender: 'FEMALE',
        maritalStatus: 'SINGLE',
        date_of_birth: '03/12/1998',
        nric: 'S6020900F',
        address: '10 Eunos Road Singapore 4324',
        driving_experience: 4,
        phone_number: '98989898',
        email: 'test@gmail.com',
      };

      const vehicle_basic_details = {
        make: 'Audi',
        model: 'A8 3.0',
        first_registered_year: '2024',
        chasis_number: 'SBA123A',
      };
      payload = { ...payload, personal_info, vehicle_basic_details };
    }

    try {
      console.log('submitted');
      console.log('payload:', payload); // Form data after validation
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <div className='mt-4 px-4 md:px-12'>
        {!isSingPassFlow ? null : (
          <div className='my-6 grid gap-4 lg:grid-cols-3'>
            <div className='mx-auto w-full sm:max-w-[50%] lg:col-span-1 lg:col-start-2 lg:max-w-none'>
              <VehicleBar
                selected_vehicle={selectedVehicle}
                onClick={onEditClick}
              ></VehicleBar>
            </div>
          </div>
        )}
        <PolicyDetailForm
          onSubmit={onSubmit}
          veh_make_model_list={[
            { value: 'BMW | 116d 1.5', text: 'BMW 116d 1.5' },
            {
              value: 'MERCEDES BENZ | A200 AMG Line 1.4',
              text: 'MERCEDES BENZ A200 AMG Line 1.4',
            },
          ]}
          hirePurchaseOptions={hirePurchaseList}
          isSingpassFlow={isSingPassFlow}
          onSubmitPromoCode={verifyPromoCode}
          handleRemovePromoCode={handleRemovePromoCode}
          errMsgPromoCode={errMsgPromoCode}
          appliedPromoCode={appliedPromoCode}
          initialValues={initialValues}
        ></PolicyDetailForm>
      </div>
      <VehicleSelectionModal
        vehicles={vehicles}
        visible={isVehSelectionVisible}
        onSubmit={handleSelection}
      />
    </>
  );
};
