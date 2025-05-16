'use client';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { Addon, Quote } from '@/libs/types/quote';
import { Drawer, Modal } from 'antd';
import { AddOnFormat } from './AddonDetail';
import { SecondaryButton } from '@/components/ui/buttons';
import { formatCurrency } from '@/libs/utils/utils';

interface Props {
  isShowPopupPremium: boolean;
  setIsShowPopupPremium: (isShowPopupPremium: boolean) => void;
  quoteInfo?: Quote;
  premiumWithGst: number;
  addonsFormatted: AddOnFormat[];
  dataSelectedAddOn: any;
  handleOkay: () => void;
  isPending: boolean;
  drivers: any[];
  addonAdditionalDriver?: Addon;
}

const ModalPremium = (props: Props) => {
  const {
    isShowPopupPremium,
    setIsShowPopupPremium,
    quoteInfo,
    addonsFormatted,
    dataSelectedAddOn,
    handleOkay,
    isPending,
    premiumWithGst,
    drivers,
    addonAdditionalDriver,
  } = props;
  const isMobile = useDeviceDetection();

  const _renderPremium = () => {
    const baseFee = addonAdditionalDriver?.options?.[0].premium_with_gst ?? 0;
    const totalFeeDriver = drivers.length ? baseFee * (drivers.length - 1) : 0;
    const discountRate = quoteInfo?.promo_code?.discount || 0;
    const tax = 1.09;
    const pricePlanMain = premiumWithGst / (1 - discountRate / 100) / tax;
    const couponDiscount = pricePlanMain * (discountRate / 100);

    const addonsSectionData = Object.entries(
      quoteInfo?.data.selected_addons || {},
    )
      .filter(([code, selectedValue]) => {
        const isHidden = ['CAR_COM_AJE', 'CAR_FNCD_AJE'].includes(code);
        return !isHidden && selectedValue !== 'NO';
      })
      .map(([code, selectedValue]) => {
        const addon = addonsFormatted.find((a) => a.code === code);
        const value =
          addon?.options?.find((opt: any) => opt.value === selectedValue)
            ?.value || selectedValue;

        return {
          title: addon?.title || code,
          value: value,
        };
      });

    const addOnTotal = addonsSectionData.reduce((acc, addon) => {
      const value = parseFloat(addon.value.replace(/[^\d.-]/g, '')) || 0;
      return acc + value;
    }, 0);

    const selectAddOnTotal = dataSelectedAddOn.reduce(
      (acc: any, addon: any) => {
        const value = addon.feeSelected || 0;
        return acc + value;
      },
      0,
    );

    const netPremium =
      pricePlanMain -
      couponDiscount +
      selectAddOnTotal / tax +
      totalFeeDriver / tax;
    const valueCalculatedGST = 9;
    const gst = (netPremium * valueCalculatedGST) / 100;

    return (
      <div className='flex flex-col gap-6'>
        <p className='text-xl font-semibold leading-[30px] text-[#171A1F]'>
          Premium Breakdown
        </p>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2 rounded-lg bg-[#81899414] px-4 py-2'>
            <div className='flex flex-row justify-between font-semibold '>
              <p>{quoteInfo?.data?.selected_plan ?? ''}</p>
              <p>{formatCurrency(pricePlanMain)}</p>
            </div>

            {quoteInfo?.promo_code && (
              <div className='flex flex-row justify-between text-sm font-bold text-[#00ADEF]'>
                <p>Coupon Discount</p>
                <p>-{formatCurrency(couponDiscount)}</p>
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2 rounded-lg bg-[#81899414] px-4 py-2 text-sm font-semibold text-[#303030]'>
            <p>Add-on:</p>
            <div>
              {dataSelectedAddOn.map((addon: any) => (
                <p key={addon.title} className='flex flex-row justify-between'>
                  {addon.title}:{' '}
                  <span>{formatCurrency(addon.feeSelected / tax)}</span>
                </p>
              ))}
              {drivers && drivers.length > 0 && (
                <div className='mt-4'>
                  <p className='text-sm font-semibold text-[#303030]'>
                    Additional Named Driver
                  </p>
                  {drivers.map((driver, index) => (
                    <div
                      key={index}
                      className='flex flex-row items-center justify-between text-sm text-[#636262]'
                    >
                      <p>{driver.name}</p>
                      <p>
                        {index === 0
                          ? 'Free'
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
            </div>
          </div>
          <div className='flex flex-col gap-2 rounded-lg bg-[#81899414] px-4 py-2'>
            <div className='flex flex-row justify-between text-sm font-semibold text-[#303030]'>
              <p>GST</p>
              <p>{formatCurrency(gst)}</p>
            </div>
            <div className='flex flex-row justify-between text-sm font-bold text-[#303030]'>
              <p>Net Premium</p>
              <p>{formatCurrency(netPremium)}</p>
            </div>
          </div>
        </div>
        <SecondaryButton
          className='w-full cursor-pointer rounded-lg bg-[#00ADEF] px-4 py-3 text-center text-base font-bold leading-[21px] text-white'
          onClick={() => handleOkay()}
          loading={isPending}
        >
          Okay
        </SecondaryButton>
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
          width={400}
          centered
        >
          <div>{_renderPremium()}</div>
        </Modal>
      )}
    </>
  );
};

export default ModalPremium;
