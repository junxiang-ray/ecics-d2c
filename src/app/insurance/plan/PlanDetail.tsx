'use client';

import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Plan } from '@/libs/types/quote';
import { PrimaryButton } from '@/components/ui/buttons';
import { ROUTES } from '@/constants/routes';
import { useGetQuote, useSaveQuote } from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import PlanCardDesktop from './components/PlanCardDesktop';
import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';
// import HeaderVehicleInfo from './components/HeaderVehicleInfo';
// import HeaderVehicleInfoMobile from './components/HeaderVehicleInfoMobile';
import { current } from '@reduxjs/toolkit';
import { UserStep } from '@/libs/enums/processBarEnums';

export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
}
function PlanDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';

  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);
  const { data: quoteInfo, isLoading } = useGetQuote(key);
  const {
    mutateAsync: saveQuote,
    isPending: isSaving,
    isSuccess,
  } = useSaveQuote();

  const plans = quoteInfo?.data?.plans ?? [];
  // const plans = [
  //   {
  //     "id": 4,
  //     "code": "FNCD",
  //     "title": "Comprehensive Plan with Family NCD Builder",
  //     "addons": [
  //       {
  //         "id": 15,
  //         "code": "CAR_FNCD_ANW",
  //         "type": "checkbox",
  //         "title": "Any Workshops",
  //         "key_map": "workshop_if_selected",
  //         "options": [
  //           {
  //             "id": 36,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "fncd_workshop_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 2181.95
  //           },
  //           {
  //             "id": 37,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Repair your car at any workshop of your choice.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 16,
  //         "code": "CAR_FNCD_AJE",
  //         "type": "checkbox",
  //         "title": "Adjustable Excess",
  //         "key_map": "fncd_adjustable_excess_selected",
  //         "options": [],
  //         "sub_title": null,
  //         "is_display": false,
  //         "description": "Extend the coverage to standard driver you choose to name under your policy. First standard named driver is included at no extra cost; each additional driver will incur a fee of $60 plus GST",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": "SGD 750.00",
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 17,
  //         "code": "CAR_FNCD_AND",
  //         "type": "checkbox",
  //         "title": "Add Additional Named Driver(s)",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 38,
  //             "label": "Experienced drivers age between 26 to 65",
  //             "value": "drivers_age_from_27_to_70",
  //             "key_map": "fncd_additional_name_driver_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 65.4
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Extend the coverage to standard driver you choose to name under your policy. First standard named driver is included at no extra cost; each additional driver will incur a fee of $60 plus GST",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 18,
  //         "code": "CAR_FNCD_BUN",
  //         "type": "checkbox",
  //         "title": "50% Buy Up NCD",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 39,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [
  //               {
  //                 "key_map": "fncd_buy_up_ncd_if_any_workshop_not_selected",
  //                 "conditions": [
  //                   {
  //                     "addon": {
  //                       "id": 15,
  //                       "code": "CAR_FNCD_ANW",
  //                       "title": "Any Workshops"
  //                     },
  //                     "value": "NO"
  //                   }
  //                 ],
  //                 "premium_bef_gst": 0,
  //                 "premium_with_gst": 2902.45
  //               },
  //               {
  //                 "key_map": "fncd_buy_up_ncd_if_any_workshop_selected",
  //                 "conditions": [
  //                   {
  //                     "addon": {
  //                       "id": 15,
  //                       "code": "CAR_FNCD_ANW",
  //                       "title": "Any Workshops"
  //                     },
  //                     "value": "YES"
  //                   }
  //                 ],
  //                 "premium_bef_gst": 0,
  //                 "premium_with_gst": 3993.42
  //               }
  //             ],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 40,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Boost your NCD to 50%.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 19,
  //         "code": "CAR_FNCD_LOU",
  //         "type": "select",
  //         "title": "Loss Of Use",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 41,
  //             "label": "Transport Allowance",
  //             "value": "YES",
  //             "key_map": "fncd_transport_allowance_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 42,
  //             "label": "Courtesy Car 1,600cc",
  //             "value": "YES (up to 1,600cc)",
  //             "key_map": "fncd_courtesy_car_up_to_1600cc_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 43,
  //             "label": "Courtesy Car 2,000cc",
  //             "value": "YES (up to 2,000cc)",
  //             "key_map": "fncd_courtesy_car_up_to_2000cc_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": false,
  //         "description": "Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 20,
  //         "code": "CAR_FNCD_PAC",
  //         "type": "select",
  //         "title": "Personal Accident+",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 46,
  //             "label": "+$100,000",
  //             "value": "+SGD 100K",
  //             "key_map": "fncd_personal_accident_plus_100K_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 109
  //           },
  //           {
  //             "id": 44,
  //             "label": "+$30,000",
  //             "value": "+SGD 30K",
  //             "key_map": "fncd_personal_accident_plus_30K_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 32.7
  //           },
  //           {
  //             "id": 45,
  //             "label": "+$60,000",
  //             "value": "+SGD 60K",
  //             "key_map": "fncd_personal_accident_plus_60K_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 65.4
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident. You may enjoy additional coverage by selecting one of the options.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 21,
  //         "code": "CAR_FNCD_RSA",
  //         "type": "checkbox",
  //         "title": "24x7 Roadside Assistance",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 47,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "fncd_roadside_assistance_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 48,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": "",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": false,
  //         "description": "Receive roadside assistance support to fix minor car breakdown problems anywhere in Singapore.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 22,
  //         "code": "CAR_FNCD_KRC",
  //         "type": "select",
  //         "title": "Key Replacement Cover",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 50,
  //             "label": "$500 Cover",
  //             "value": "YES (SGD 500)",
  //             "key_map": "fncd_key_replacement_cover_500_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 49,
  //             "label": "$300 Cover",
  //             "value": "YES (SGD 300)",
  //             "key_map": "fncd_key_replacement_cover_300_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": false,
  //         "description": "Enjoy reimbursement on the replacement of your motor car keys which are lost as a result of Theft, Robbery or an Accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 23,
  //         "code": "CAR_FNCD_NOR",
  //         "type": "checkbox",
  //         "title": "New for Old ReplacementNew for Old Replacement",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 52,
  //             "label": "No",
  //             "value": "No",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 51,
  //             "label": "Yes",
  //             "value": "YES",
  //             "key_map": "fncd_new_for_old_replacement_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 87.2
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 24,
  //         "code": "CAR_FNCD_MDE",
  //         "type": "select",
  //         "title": "Medical Expenses",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 53,
  //             "label": "+$1,700",
  //             "value": "YES (+SGD 1700)",
  //             "key_map": "fncd_medical_expenses_1700_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 109
  //           },
  //           {
  //             "id": 54,
  //             "label": "+$700",
  //             "value": "YES (+SGD 700)",
  //             "key_map": "fncd_medical_expenses_700_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 54.5
  //           },
  //           {
  //             "id": 55,
  //             "label": "+$200",
  //             "value": "YES (+SGD 200)",
  //             "key_map": "fncd_medical_expenses_200_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 27.25
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident. You may enjoy additional coverage by selecting one of the options.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       }
  //     ],
  //     "key_map": "plan_premium_with_gst",
  //     "benefits": [
  //       {
  //         "id": 17,
  //         "name": "Build Family NCD Builder (FNB) discounts for your Named Drivers",
  //         "order": 17,
  //         "is_active": true
  //       },
  //       {
  //         "id": 18,
  //         "name": "24/7 Roadside Assistance",
  //         "order": 18,
  //         "is_active": true
  //       },
  //       {
  //         "id": 19,
  //         "name": "Courtesy Car (Up to 1,600cc)",
  //         "order": 19,
  //         "is_active": true
  //       },
  //       {
  //         "id": 20,
  //         "name": "Key Replacement Cover (SGD300)",
  //         "order": 20,
  //         "is_active": true
  //       },
  //       {
  //         "id": 21,
  //         "name": "Family Personal Accident (SGD80,000)",
  //         "order": 21,
  //         "is_active": true
  //       },
  //       {
  //         "id": 22,
  //         "name": "Child Seat Cover (SGD300)",
  //         "order": 22,
  //         "is_active": true
  //       }
  //     ],
  //     "sub_title": null,
  //     "created_at": "2025-05-15T02:06:02.170Z",
  //     "updated_at": "2025-05-15T02:06:02.170Z",
  //     "product_type": { "id": 1, "name": "car" },
  //     "is_recommended": true,
  //     "premium_bef_gst": 0,
  //     "premium_with_gst": 5804.89,
  //     "add_ons_included_in_this_plan": [
  //       {
  //         "add_on_id": "lou",
  //         "add_on_desc": "Courtesy Car (Up to 1,600cc)",
  //         "add_on_name": "Courtesy Car"
  //       },
  //       {
  //         "add_on_id": "ra_24",
  //         "add_on_desc": "24/7 Roadside Assistance",
  //         "add_on_name": "24/7 Roadside Assistance"
  //       },
  //       {
  //         "add_on_id": "krc",
  //         "add_on_desc": "Key Replacement Cover (Sum Insured: S$300.00)",
  //         "add_on_name": "Key Replacement Cover (Sum Insured: S$300.00)"
  //       },
  //       {
  //         "add_on_id": "familyPA",
  //         "add_on_desc": "Family Personal Accident (Sum Insured: S$80,000.00)",
  //         "add_on_name": "Family Personal Accident (Sum Insured: S$80,000.00)"
  //       },
  //       {
  //         "add_on_id": "childseat",
  //         "add_on_desc": "Child Seat Cover (Sum Insured: S$300.00)",
  //         "add_on_name": "Child Seat Cover (Sum Insured: S$300.00)"
  //       }
  //     ]
  //   },
  //   {
  //     "id": 1,
  //     "code": "COM",
  //     "title": "Comprehensive",
  //     "addons": [
  //       {
  //         "id": 1,
  //         "code": "CAR_COM_ANW",
  //         "type": "checkbox",
  //         "title": "Any Workshops",
  //         "key_map": "workshop_if_selected",
  //         "options": [
  //           {
  //             "id": 2,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 1,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "workshop_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 2181.96
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Repair your car at any workshop of your choice.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 2,
  //         "code": "CAR_COM_AJE",
  //         "type": "checkbox",
  //         "title": "Adjustable Excess",
  //         "key_map": "com_adjustable_excess_selected",
  //         "options": [],
  //         "sub_title": null,
  //         "is_display": false,
  //         "description": "Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": "SGD 750.00",
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 3,
  //         "code": "CAR_COM_AND",
  //         "type": "checkbox",
  //         "title": "Add Additional Named Driver(s)",
  //         "key_map": "",
  //         "options": [
  //           {
  //             "id": 9,
  //             "label": "Experienced drivers age between 26 to 65",
  //             "value": "drivers_age_from_27_to_70",
  //             "key_map": "com_additional_name_driver_if_selected",
  //             "description": "river(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 65.4
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Extend the coverage to standard driver you choose to name under your policy. First standard named driver is included at no extra cost; each additional driver will incur a fee of $60 plus GST",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 4,
  //         "code": "CAR_COM_BUN",
  //         "type": "checkbox",
  //         "title": "50% Buy Up NCD",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 11,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [
  //               {
  //                 "key_map": "buy_up_ncd_if_any_workshop_not_selected",
  //                 "conditions": [
  //                   {
  //                     "addon": {
  //                       "id": 1,
  //                       "code": "CAR_COM_ANW",
  //                       "title": "Any Workshops"
  //                     },
  //                     "value": "NO"
  //                   }
  //                 ],
  //                 "premium_bef_gst": 0,
  //                 "premium_with_gst": 2727.45
  //               },
  //               {
  //                 "key_map": "buy_up_ncd_if_any_workshop_selected",
  //                 "conditions": [
  //                   {
  //                     "addon": {
  //                       "id": 1,
  //                       "code": "CAR_COM_ANW",
  //                       "title": "Any Workshops"
  //                     },
  //                     "value": "YES"
  //                   }
  //                 ],
  //                 "premium_bef_gst": 0,
  //                 "premium_with_gst": 3818.42
  //               }
  //             ],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 35,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Boost your NCD to 50%.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 5,
  //         "code": "CAR_COM_LOU",
  //         "type": "select",
  //         "title": "Loss Of Use",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 12,
  //             "label": "Transport Allowance",
  //             "value": "YES",
  //             "key_map": "transport_allowance_if_selected",
  //             "description": "Compensates you with S$50 per day (for up to 10 days) when your car is being repaired due to accident.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 54.5
  //           },
  //           {
  //             "id": 13,
  //             "label": "Courtesy Car 1,600cc",
  //             "value": "YES (up to 1,600cc)",
  //             "key_map": "courtesy_car_up_to_1600cc_if_selected",
  //             "description": "Compensates with a Rental car up to 1,600cc provided for up to 10 days from the commencement of accident repair.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 98.1
  //           },
  //           {
  //             "id": 14,
  //             "label": "Courtesy Car 2,000cc",
  //             "value": "YES (up to 2,000cc)",
  //             "key_map": "courtesy_car_up_to_2000cc_if_selected",
  //             "description": "Compensates with a Rental car up to 2,000cc provided for up to 10 days from the commencement of accident repair.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 130.8
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 6,
  //         "code": "CAR_COM_PAC",
  //         "type": "select",
  //         "title": "Personal Accident+",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 15,
  //             "label": "+$30,000",
  //             "value": "+SGD 30K",
  //             "key_map": "personal_accident_plus_30K_if_selected",
  //             "description": "Increase the coverage up to S$80,000.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 32.7
  //           },
  //           {
  //             "id": 16,
  //             "label": "+$60,000",
  //             "value": "+SGD 60K",
  //             "key_map": "personal_accident_plus_60K_if_selected",
  //             "description": "Increase the coverage up to S$110,000.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 65.4
  //           },
  //           {
  //             "id": 17,
  //             "label": "+$100,000",
  //             "value": "+SGD 100K",
  //             "key_map": "personal_accident_plus_100K_if_selected",
  //             "description": "Increase the coverage up to S$150,000.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 109
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident. You may enjoy additional coverage by selecting one of the options.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 7,
  //         "code": "CAR_COM_MDE",
  //         "type": "select",
  //         "title": "Medical Expenses",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 18,
  //             "label": "+$200",
  //             "value": "YES (+SGD 200)",
  //             "key_map": "medical_expenses_200_if_selected",
  //             "description": "Increase the coverage up to S$700.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 27.25
  //           },
  //           {
  //             "id": 19,
  //             "label": "+$700",
  //             "value": "YES (+SGD 700)",
  //             "key_map": "medical_expenses_700_if_selected",
  //             "description": "Increase the coverage up to S$1,200.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 54.5
  //           },
  //           {
  //             "id": 20,
  //             "label": "+$1,700",
  //             "value": "YES (+SGD 1700)",
  //             "key_map": "medical_expenses_1700_if_selected",
  //             "description": "Increase the coverage up to S$2,200.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 109
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident. You may enjoy additional coverage by selecting one of the options.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 8,
  //         "code": "CAR_COM_RSA",
  //         "type": "checkbox",
  //         "title": "24x7 Roadside Assistance",
  //         "key_map": "roadside_assistance_if_selected",
  //         "options": [
  //           {
  //             "id": 28,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           },
  //           {
  //             "id": 27,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "roadside_assistance_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 43.6
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Receive roadside assistance support to fix minor car breakdown problems anywhere in Singapore.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 9,
  //         "code": "CAR_COM_KRC",
  //         "type": "select",
  //         "title": "Key Replacement Cover",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 21,
  //             "label": "$300 Cover",
  //             "value": "YES (SGD 300)",
  //             "key_map": "key_replacement_cover_300_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 27.25
  //           },
  //           {
  //             "id": 22,
  //             "label": "$500 Cover",
  //             "value": "YES (SGD 500)",
  //             "key_map": "key_replacement_cover_500_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 43.6
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Enjoy reimbursement on the replacement of your motor car keys which are lost as a result of Theft, Robbery or an Accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 10,
  //         "code": "CAR_COM_NOR",
  //         "type": "checkbox",
  //         "title": "New for Old Replacement",
  //         "key_map": "new_for_old_replacement_if_selected",
  //         "options": [
  //           {
  //             "id": 29,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "new_for_old_replacement_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 87.2
  //           },
  //           {
  //             "id": 30,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       }
  //     ],
  //     "key_map": "plan_premium_with_gst",
  //     "benefits": [
  //       {
  //         "id": 1,
  //         "name": "Third-Party liability coverage relating to vehicle charging",
  //         "order": 1,
  //         "is_active": true
  //       },
  //       {
  //         "id": 2,
  //         "name": "Free NCD Protector (from 10%) & Waiver of Excess",
  //         "order": 2,
  //         "is_active": true
  //       },
  //       {
  //         "id": 4,
  //         "name": "Complete Vehicle Coverage",
  //         "order": 4,
  //         "is_active": true
  //       },
  //       {
  //         "id": 5,
  //         "name": "Policy excess: SGD750 for non-EV & BYD & Tesla Standard models & SGD1,500 for Tesla Performance models.",
  //         "order": 5,
  //         "is_active": true
  //       },
  //       {
  //         "id": 3,
  //         "name": "Up to SGD50,000 complimentary Personal Accident coverage",
  //         "order": 3,
  //         "is_active": true
  //       }
  //     ],
  //     "sub_title": null,
  //     "created_at": "2025-05-01T00:10:25.982Z",
  //     "updated_at": "2025-05-04T10:28:43.842Z",
  //     "product_type": { "id": 1, "name": "car" },
  //     "is_recommended": false,
  //     "premium_bef_gst": 0,
  //     "premium_with_gst": 5454.89,
  //     "add_ons_included_in_this_plan": []
  //   },
  //   {
  //     "id": 2,
  //     "code": "TPFT",
  //     "title": "Third Party, Fire & Theft",
  //     "addons": [
  //       {
  //         "id": 11,
  //         "code": "CAR_TPFT_AND",
  //         "type": "select",
  //         "title": "Add Additional Named Driver(s)",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 23,
  //             "label": "Experienced drivers age between 26 to 65",
  //             "value": "drivers_age_from_27_to_70",
  //             "key_map": "tpft_drivers_age_from_27_to_70_if_selected",
  //             "description": "river(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 65.4
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Extend the coverage to standard driver you choose to name under your policy. First standard named driver is included at no extra cost; each additional driver will incur a fee of $60 plus GST",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 12,
  //         "code": "CAR_TPFT_BUN",
  //         "type": "checkbox",
  //         "title": "50% Buy Up NCD",
  //         "key_map": "tpft_buy_up_ncd_if_selected",
  //         "options": [
  //           {
  //             "id": 31,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "tpft_buy_up_ncd_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 2454.7
  //           },
  //           {
  //             "id": 32,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Boost your NCD to 50%.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       }
  //     ],
  //     "key_map": "plan_premium_with_gst",
  //     "benefits": [
  //       {
  //         "id": 6,
  //         "name": "Third-Party liability coverage relating to vehicle charging",
  //         "order": 6,
  //         "is_active": true
  //       },
  //       {
  //         "id": 8,
  //         "name": "Protection against loss/damage to third party, by fire or theft",
  //         "order": 8,
  //         "is_active": true
  //       },
  //       {
  //         "id": 9,
  //         "name": "Complete Vehicle Coverage",
  //         "order": 9,
  //         "is_active": false
  //       },
  //       {
  //         "id": 10,
  //         "name": "Policy excess: SGD750 for non-EV & BYD & Tesla Standard models & SGD1,500 for Tesla Performance models.",
  //         "order": 10,
  //         "is_active": false
  //       }
  //     ],
  //     "sub_title": null,
  //     "created_at": "2025-05-02T15:03:16.636Z",
  //     "updated_at": "2025-05-04T10:28:43.841Z",
  //     "product_type": { "id": 1, "name": "car" },
  //     "is_recommended": false,
  //     "premium_bef_gst": 0,
  //     "premium_with_gst": 4909.39,
  //     "add_ons_included_in_this_plan": []
  //   },
  //   {
  //     "id": 3,
  //     "code": "TPO",
  //     "title": "Third Party Only",
  //     "addons": [
  //       {
  //         "id": 13,
  //         "code": "CAR_TPO_AND",
  //         "type": "select",
  //         "title": "Add Additional Named Driver(s)",
  //         "key_map": null,
  //         "options": [
  //           {
  //             "id": 25,
  //             "label": "Experienced drivers age between 26 to 65",
  //             "value": "drivers_age_from_27_to_70",
  //             "key_map": "tpo_drivers_age_from_27_to_70_if_selected",
  //             "description": "river(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 65.4
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Extend the coverage to standard driver you choose to name under your policy. First standard named driver is included at no extra cost; each additional driver will incur a fee of $60 plus GST",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       },
  //       {
  //         "id": 14,
  //         "code": "CAR_TPO_BUN",
  //         "type": "checkbox",
  //         "title": "50% Buy Up NCD",
  //         "key_map": "tpo_buy_up_ncd_if_selected",
  //         "options": [
  //           {
  //             "id": 33,
  //             "label": "YES",
  //             "value": "YES",
  //             "key_map": "tpo_buy_up_ncd_if_selected",
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 2181.96
  //           },
  //           {
  //             "id": 34,
  //             "label": "NO",
  //             "value": "NO",
  //             "key_map": null,
  //             "description": "",
  //             "dependencies": [],
  //             "premium_bef_gst": 0,
  //             "premium_with_gst": 0
  //           }
  //         ],
  //         "sub_title": null,
  //         "is_display": true,
  //         "description": "Boost your NCD to 50%.",
  //         "is_recommended": false,
  //         "premium_bef_gst": 0,
  //         "premium_with_gst": 0,
  //         "default_option_id": null
  //       }
  //     ],
  //     "key_map": "plan_premium_with_gst",
  //     "benefits": [
  //       {
  //         "id": 11,
  //         "name": "Third-Party liability coverage relating to vehicle charging",
  //         "order": 11,
  //         "is_active": true
  //       },
  //       {
  //         "id": 14,
  //         "name": "Protection against loss/damage to third party, by fire or theft",
  //         "order": 14,
  //         "is_active": false
  //       },
  //       {
  //         "id": 15,
  //         "name": "Complete Vehicle Coverage",
  //         "order": 15,
  //         "is_active": false
  //       },
  //       {
  //         "id": 16,
  //         "name": "Policy excess: SGD750 for non-EV & BYD & Tesla Standard models & SGD1,500 for Tesla Performance models.",
  //         "order": 16,
  //         "is_active": false
  //       }
  //     ],
  //     "sub_title": null,
  //     "created_at": "2025-05-04T00:27:40.708Z",
  //     "updated_at": "2025-05-04T10:28:43.841Z",
  //     "product_type": { "id": 1, "name": "car" },
  //     "is_recommended": false,
  //     "premium_bef_gst": 0,
  //     "premium_with_gst": 4363.91,
  //     "add_ons_included_in_this_plan": []
  //   }
  // ]

  useEffect(() => {
    onSaveRegister(() => {
      const data = {
        ...quoteInfo?.data,
        current_step: UserStep.SELECT_PLAN,
        selected_plan: selectedPlan?.title,
        key: key,
      };
      return data;
    });
  }, [selectedPlan]);

  const plansFormatted: FormatPlan[] = plans.map((plan) => ({
    ...plan,
    discount: quoteInfo?.promo_code?.discount ?? 0,
    currentPrice:
      plan.premium_with_gst /
      (1 - (quoteInfo?.promo_code?.discount ?? 0) / 100),
  }));

  useEffect(() => {
    if (!plansFormatted.length) return;
    if (quoteInfo?.data?.selected_plan) {
      const selectedPlan = plansFormatted.find(
        (plan) => plan.title === quoteInfo?.data?.selected_plan,
      );
      if (selectedPlan) {
        setSelectedPlan(selectedPlan);
        return;
      }
    }
    const recommendedPlan = plansFormatted.find((plan) => plan.is_recommended);
    if (recommendedPlan) {
      setSelectedPlan(recommendedPlan);
      return;
    }
  }, [plans]);

  const choicePlan = (plan: FormatPlan | null) => {
    const data = {
      ...quoteInfo?.data,
      selected_plan: plan?.title,
      key: key,
    };
    saveQuote({ key, data, is_sending_email: false }).then((res) => {
      router.push(ROUTES.INSURANCE.ADD_ON);
    });
    setShowConfirmDeclaration(false);
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col justify-center'>
      {/* hidden for now */}
      {/* <div className='py-4 md:hidden'>
        <HeaderVehicleInfoMobile
          vehicleInfo={quoteInfo?.data.vehicle_info_selected}
        />
      </div> */}
      <div className='flex flex-col items-center justify-center'>
        <div className='max-w-[1280px]'>
          {/* hidden for now */}
          {/* <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4'>
            <HeaderVehicleInfo
              vehicleInfo={quoteInfo?.data.vehicle_info_selected}
              insuranceAdditionalInfo={
                quoteInfo?.data.insurance_additional_info
              }
            />
          </div> */}
          {/* UI for Mobile */}
          <div className='mx-4 pb-20 lg:hidden'>
            <PlanCardMobile
              plans={plansFormatted}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          </div>

          {/* UI for Desktop */}
          <div className='hidden py-4 lg:block'>
            <PlanCardDesktop
              plans={plansFormatted}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          </div>
        </div>
      </div>

      <div className='mt-4 w-full border !border-[#F7F7F9] bg-[#FFFEFF] shadow-md md:flex md:flex-row md:justify-center'>
        <div className='fixed bottom-0 left-1/2 z-10 w-full -translate-x-1/2 transform shadow-gray-300 md:static md:bottom-auto md:left-0 md:z-auto md:max-w-[800px] md:translate-x-0 md:rounded-md md:border-none'>
          <div className='flex w-full justify-between border-t-2 bg-white p-4 py-2 md:border-none md:py-4 '>
            <div className='gap-2 md:flex md:items-center md:gap-4'>
              <p>
                <span className='text-lg font-semibold text-[#323743] md:text-3xl md:font-bold md:text-[#1B223C]'>
                  SGD {selectedPlan?.premium_with_gst.toFixed(2)}
                </span>
                {!!selectedPlan?.discount && (
                  <span className='ps-4 text-lg font-normal text-[#FF0004] line-through decoration-1 md:text-2xl md:text-[#EF0000]'>
                    SGD {selectedPlan?.currentPrice.toFixed(2)}
                  </span>
                )}
              </p>
              <p className='font-semibold text-[#323743]'>(inclusive of GST)</p>
            </div>
            <PrimaryButton
              onClick={() => setShowConfirmDeclaration(true)}
              className='md:w-40'
              disabled={!selectedPlan?.id}
              loading={isSaving}
            >
              Continue
            </PrimaryButton>
          </div>
        </div>
      </div>

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => choicePlan(selectedPlan)}
        onCancel={() => setShowConfirmDeclaration(false)}
      />
    </div>
  );
}

export default PlanDetail;
