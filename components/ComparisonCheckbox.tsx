import { useComparison } from './ComparisonContext';
import { Check } from 'lucide-react';

interface ComparisonCheckboxProps {
  productId: string;
  productName: string;
}

export function ComparisonCheckbox({ productId, productName }: ComparisonCheckboxProps) {
  const { toggleProduct, isSelected, canAddMore } = useComparison();
  const selected = isSelected(productId);
  
  return (
    <label className="flex items-center space-x-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleProduct(productId)}
        disabled={!selected && !canAddMore}
        className="sr-only"
        aria-label={`Vergelijk ${productName}`}
      />
      <div className={`
        w-5 h-5 rounded border-2 transition-all flex items-center justify-center
        ${selected 
          ? 'bg-blue-600 border-blue-600' 
          : 'border-gray-300 group-hover:border-gray-400'
        }
        ${!selected && !canAddMore ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="text-sm text-gray-600">Vergelijk</span>
    </label>
  );
}