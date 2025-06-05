'use client';

import { Button, Drawer, Modal } from 'antd';

import { Addon, AddOnIncludedInPlan, Quote } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface Props {
  isShowPopupPremium: boolean;
  setIsShowPopupPremium: (isShowPopupPremium: boolean) => void;
  quoteInfo?: Quote;
  dataSelectedAddOn: any;
  drivers: any[];
  addonAdditionalDriver?: Addon;
  pricePlanMain: number;
  couponDiscount: number;
  tax: number;
  gst: number;
  netPremium: number;
  addonsIncluded?: AddOnIncludedInPlan[];
}

const ModalPremium = (props: Props) => {
  const {
    isShowPopupPremium,
    setIsShowPopupPremium,
    quoteInfo,
    dataSelectedAddOn,
    drivers,
    addonAdditionalDriver,
    pricePlanMain,
    couponDiscount,
    tax,
    gst,
    netPremium,
    addonsIncluded,
  } = props;
  const isMobile = useDeviceDetection();
  const _renderPremium = () => {
    return (
      <div className='flex max-h-[70svh] flex-col gap-4 overflow-y-auto'>
        <p className='text-xl font-semibold leading-[30px] text-[#171A1F]'>
          Premium Breakdown
        </p>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-base font-bold text-[#303030]'>Plan</p>
            <div className='flex flex-row justify-between text-sm font-normal text-[#303030]'>
              <p>{quoteInfo?.data?.selected_plan ?? ''}</p>
              <p>{formatCurrency(pricePlanMain)}</p>
            </div>
            {quoteInfo?.promo_code && (
              <div className='flex flex-row justify-between text-sm font-semibold text-[#00ADEF]'>
                <p>Coupon Discount</p>
                <p>-{formatCurrency(couponDiscount)}</p>
              </div>
            )}
          </div>

          <div className='flex flex-col gap-2 rounded-lg py-2 text-sm font-semibold text-[#303030]'>
            <p className='text-base font-bold text-[#303030]'>Add-on:</p>
            <div>
              <div className='flex flex-col gap-3'>
                {dataSelectedAddOn?.map((addon: any) => (
                  <p
                    key={addon.title}
                    className='flex flex-row items-center justify-between gap-10 font-normal text-[#303030]'
                  >
                    <p className='flex flex-col'>
                      {addon.title}
                      {addon.optionLabel !== 'YES' && (
                        <span className='ml-2 flex flex-row items-center gap-2'>
                          <p className='h-[4px] w-[4px] rounded-full bg-[#303030]'></p>
                          {addon.optionLabel} Coverage
                        </span>
                      )}
                    </p>
                    <span>{formatCurrency(addon.feeSelected / tax)}</span>
                  </p>
                ))}
              </div>
              {drivers && drivers.length > 0 && (
                <div className='mt-4'>
                  <p className='text-sm font-semibold text-[#303030]'>
                    Additional Named Driver(s)
                  </p>
                  {drivers.map((driver, index) => (
                    <div
                      key={index}
                      className='flex flex-row items-center justify-between font-normal text-[#303030]'
                    >
                      <p>{driver.name}</p>
                      <p>
                        {index === 0
                          ? 'FREE'
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
              {addonsIncluded && addonsIncluded.length > 0 && (
                <div className='mt-4 flex flex-col gap-2'>
                  {addonsIncluded.map((item, index) => (
                    <div key={index} className='flex flex-row justify-between'>
                      <span>{item.add_on_name}</span>
                      <span>INCLUDED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-1 rounded-lg py-2'>
            <div className='flex flex-row justify-between text-base font-bold text-[#303030]'>
              <p>Sub-Total</p>
              <p>{formatCurrency(netPremium)}</p>
            </div>
            <div className='flex flex-row justify-between text-base font-normal text-[#303030]'>
              <p>GST</p>
              <p>{formatCurrency(gst)}</p>
            </div>
            <div className='flex flex-row justify-between text-base font-bold text-[#303030]'>
              <p>Total Premium</p>
              <p>{formatCurrency(netPremium + gst)}</p>
            </div>
          </div>
        </div>
        <Button
          className='w-full rounded-none border border-[#00ADEF] bg-white py-6 text-center text-base font-bold !text-[#00ADEF]'
          onClick={() => setIsShowPopupPremium(false)}
        >
          Close Breakdown
        </Button>
      </div>
    );
  };

  return (
    <>
      {isMobile.isMobile ? (
        <Drawer
          placement='bottom'
          open={isShowPopupPremium}
          onClose={() => setIsShowPopupPremium(false)}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          {_renderPremium()}
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
          {_renderPremium()}
        </Modal>
      )}
    </>
  );
};

export default ModalPremium;
