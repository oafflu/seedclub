export function InvestmentIcon() {
  return (
    <div className="h-6 w-6 relative">
      <div className="absolute bottom-0 right-0 h-4 w-4 bg-yellow-400 rounded-md transform rotate-45"></div>
      <div className="absolute bottom-0 right-1 h-4 w-4 bg-orange-400 rounded-md transform rotate-45"></div>
      <div className="absolute bottom-1 right-0 h-4 w-4 bg-yellow-500 rounded-md transform rotate-45"></div>
      <div className="absolute top-0 right-1/2 h-3 w-1 bg-green-500 rounded-full"></div>
      <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2">
        <div className="h-2 w-3 bg-green-400 rounded-full transform rotate-45"></div>
      </div>
    </div>
  )
}
