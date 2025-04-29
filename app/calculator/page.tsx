import { MarketingLayout } from "@/components/marketing-layout"
import { ProfitCalculator } from "@/components/profit-calculator"

export default function CalculatorPage() {
  return (
    <MarketingLayout
      title="Investment Calculator"
      description="Calculate your potential returns with our investment calculator."
    >
      <div className="max-w-3xl mx-auto">
        <ProfitCalculator />
      </div>
    </MarketingLayout>
  )
}
