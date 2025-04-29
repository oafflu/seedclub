import { MarketingLayout } from "@/components/marketing-layout"
import { ProfitCalculator } from "@/components/profit-calculator"
import { Calculator, TrendingUp, Clock, Percent } from "lucide-react"

export default function CalculatorPage() {
  return (
    <MarketingLayout
      title="Investment Calculator"
      description="Calculate your potential returns with our investment calculator."
    >
      <div className="space-y-16">
        <section>
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Calculate Your Returns</h2>
              <p className="text-muted-foreground mb-6">
                Use our investment calculator to see how much your money could grow with Seed Club's guaranteed returns.
                Adjust the investment amount, term length, and see your potential earnings instantly.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Guaranteed Growth</h3>
                    <p className="text-sm text-muted-foreground">
                      Know exactly how much your investment will grow with our fixed APY rates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Choose Your Term</h3>
                    <p className="text-sm text-muted-foreground">
                      Select from 12, 24, or 36-month terms to match your financial goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Higher Returns for Longer Terms</h3>
                    <p className="text-sm text-muted-foreground">
                      Enjoy higher APY rates when you invest for longer periods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 p-6 rounded-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Return Calculator</h3>
              </div>
              <ProfitCalculator />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b">
        </section>

\
