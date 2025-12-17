import { CheckCircle, Heart, Plus, Shield, Star, Umbrella } from 'lucide-react';
import { memo, useMemo } from 'react';

import { AddOn } from '@/libs/types/homeContents';
import { cn } from '@/libs/utils/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/cardNew';
import { Label } from '@/components/ui/label';
import { OptionSelector } from './optionSelector';
import { Select } from '@/components/ui/select';

interface AddOnCardProps {
  addOn: AddOn;
  isSelected: boolean;
  selectedOption?: string;
  displayPrice: number;
  onToggle: () => void;
  onOptionChange?: (option: string) => void;
}

// Icon mapping - only loads the icons actually used
const ICON_MAP = {
  Heart,
  Shield,
  Umbrella,
} as const;

export const AddOnCard = memo<AddOnCardProps>(
  ({
    addOn,
    isSelected,
    selectedOption,
    onToggle,
    onOptionChange,
    displayPrice,
  }) => {
    // Dynamically get the icon component
    const IconComponent = useMemo(() => {
      return ICON_MAP[addOn.iconName as keyof typeof ICON_MAP] || Heart;
    }, [addOn.iconName]);

    // Calculate the display price based on selected option
    // const displayPrice = useMemo(() => {
    //   if ((addOn.hasOptions || addOn.hasList) && selectedOption && addOn.options) {
    //     console.log(selectedOption);
    //     const selectedOptionData = addOn.options.find(
    //       (option) => option.value === selectedOption || option.label === selectedOption,
    //     );
    //     return selectedOptionData ? selectedOptionData.price : addOn.price;
    //   }
    //   return addOn.price;
    // }, [addOn.hasOptions, addOn.options, addOn.price, selectedOption]);

    return (
      <div className='group relative'>
        {/* Popular Badge */}
        {addOn.popular && (
          <div className='absolute -top-3 left-1/2 z-20 -translate-x-1/2 transform'>
            <Badge className='bg-[#f49d00] px-3 py-1 text-xs font-bold text-white shadow-lg'>
              <Star className='mr-1 size-3' />
              {addOn.savings || 'POPULAR'}
            </Badge>
          </div>
        )}

        <Card
          className={cn(
            'relative shadow-md transition-all duration-1000 ease-in-out group-hover:-translate-y-1 group-hover:shadow-lg',
            'border-2 bg-white',
            isSelected
              ? 'max-h-[1000px] border-[#02ADEF] shadow-lg ring-2 ring-[#02ADEF]/20'
              : 'max-h-[320px] border-gray-200 hover:border-gray-300',
          )}
        >
          <CardContent className='flex flex-col p-5 pb-8'>
            {/* Header */}
            <div className='mb-3 flex items-start justify-between'>
              <div className='flex min-w-0 flex-1 items-center gap-3'>
                <div className='flex-shrink-0 p-2'>
                  <IconComponent className='size-5' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='text-base font-bold leading-tight text-gray-900'>
                    {addOn.name}
                  </h3>
                </div>
              </div>
              <div className='ml-2 flex-shrink-0 text-right'>
                <span className='text-lg font-bold text-[#02ADEF]'>
                  {displayPrice !== 0 && `$${displayPrice.toFixed(2)}`}
                  {displayPrice === 0 && '$ - '}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className='mb-3 flex-1'>
              <p className='mb-2 line-clamp-2 text-xs leading-relaxed text-gray-600'>
                {addOn.description}
              </p>

              <div className='rounded-lg border border-gray-100 bg-gray-50 p-2'>
                <p className='line-clamp-2 text-[12px] leading-relaxed text-gray-500'>
                  {addOn.details}
                </p>
              </div>
            </div>

            {/* Options Section */}
            {isSelected && addOn.options?.length && (
              <>
                {/* BUTTON OPTIONS */}
                {addOn.hasOptions && !addOn.hasList && (
                  <div className='space-y-2'>
                    <Label className='text-xs font-semibold text-gray-700'>
                      Select Coverage:
                    </Label>

                    <div className='flex gap-2 pb-2'>
                      {addOn.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => onOptionChange?.(option.value)}
                          className={cn(
                            'border border-gray-300 transition-all duration-200',
                            'touch-target h-14 text-xs font-medium',
                            'flex flex-1 items-center justify-center rounded-md',
                            selectedOption === option.value
                              ? 'border-[#02ADEF] bg-[#02ADEF] text-lg font-semibold text-white shadow-md'
                              : 'bg-white text-base text-gray-700 hover:bg-gray-50 active:bg-gray-100',
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* DROPDOWN LIST */}
                {addOn.hasList && (
                  <div className='space-y-2 '>
                    {/* <OptionSelector
                      // labelIcon={<Building className='size-5 text-[#02ADEF]' />}
                      required={true}
                      label='Select Coverage'
                      selected={selectedOption}
                      options={addOn.options}
                      onChange={(option) => onOptionChange?.(option)}
                      className='col-span-1 space-y-4 lg:col-span-2'
                    ></OptionSelector> */}
                    <Label className='text-xs font-semibold text-gray-700'>
                      Select Coverage:
                    </Label>
                    <Select
                      defaultValue={selectedOption}
                      placeholder='Select Coverage'
                      onChange={(option) => {
                        console.log(option);
                        onOptionChange?.(option);
                      }}
                      options={
                        addOn.options.map((o) => o.label) as readonly string[]
                      }
                      className=''
                    />
                  </div>
                )}
              </>
            )}

            {/* <div className='mb-3 flex-1'></div> */}
            {/* Action Button */}
            <div className='mt-4 flex justify-center'>
              <Button
                onClick={onToggle}
                className={cn(
                  'flex h-8 w-full items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300',
                  isSelected
                    ? 'bg-[#52c41a] text-white hover:bg-[#45a615]'
                    : 'bg-[#02ADEF] text-white hover:bg-[#0198d4]',
                )}
              >
                {isSelected ? (
                  <>
                    <CheckCircle className='size-4' />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className='size-4' />
                    <span>Add to Plan</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

AddOnCard.displayName = 'AddOnCard';
