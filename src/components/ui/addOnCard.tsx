import { CheckCircle, Heart, Plus, Shield, Star, Umbrella } from 'lucide-react';
import { memo, useMemo } from 'react';

import { AddOn } from '@/libs/types/homeContents';
import { cn } from '@/libs/utils/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/cardNew';
import { Label } from '@/components/ui/label';

interface AddOnCardProps {
  addOn: AddOn;
  isSelected: boolean;
  selectedOption?: string;
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
  ({ addOn, isSelected, selectedOption, onToggle, onOptionChange }) => {
    // Dynamically get the icon component
    const IconComponent = useMemo(() => {
      return ICON_MAP[addOn.iconName as keyof typeof ICON_MAP] || Heart;
    }, [addOn.iconName]);

    // Calculate the display price based on selected option
    const displayPrice = useMemo(() => {
      if (addOn.hasOptions && selectedOption && addOn.options) {
        const selectedOptionData = addOn.options.find(
          (option) => option.value === selectedOption,
        );
        return selectedOptionData ? selectedOptionData.price : addOn.price;
      }
      return addOn.price;
    }, [addOn.hasOptions, addOn.options, addOn.price, selectedOption]);

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
            'relative shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg sm:h-[320px]',
            'overflow-hidden border-2 bg-white',
            isSelected
              ? 'border-[#02ADEF] shadow-lg ring-2 ring-[#02ADEF]/20'
              : 'border-gray-200 hover:border-gray-300',
          )}
        >
          <CardContent className='flex h-full flex-col p-5 pb-8'>
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
                  ${displayPrice.toFixed(0)}
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
            {addOn.hasOptions && addOn.options && isSelected ? (
              <div className='space-y-2'>
                <Label className='text-xs font-semibold text-gray-700'>
                  Select Coverage:
                </Label>
                <div className='flex gap-2'>
                  {addOn.options.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => onOptionChange?.(option.value)}
                      className={cn(
                        'border border-gray-300  transition-all duration-200',
                        'text-xs font-medium',
                        'touch-target min-h-[36px]',
                        'flex items-center justify-center rounded-md',
                        'flex-1', // Equal width distribution
                        selectedOption === option.value
                          ? 'border-[#02ADEF] bg-[#02ADEF] font-semibold text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex-grow'></div>
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
