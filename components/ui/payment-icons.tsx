// Compact payment icons component
export const PaymentIcons = ({ className = "", compact = false }: { className?: string; compact?: boolean }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    {/* Visa */}
    <div className="bg-white px-2 py-1 rounded border border-primary/10 shadow-sm">
      <span className="text-[#1434CB] font-bold text-[10px] tracking-wider">VISA</span>
    </div>
    {/* Mastercard */}
    <div className="bg-white px-1.5 py-1 rounded border border-primary/10 shadow-sm">
      <svg className="h-3 w-auto" viewBox="0 0 48 32" fill="none">
        <circle cx="16" cy="16" r="8" fill="#EB001B"/>
        <circle cx="32" cy="16" r="8" fill="#F79E1B" fillOpacity="0.8"/>
      </svg>
    </div>
    {/* PayPal */}
    <div className="bg-gradient-to-r from-[#003087] to-[#012169] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center shadow-sm">
      Pay<span className="text-[#009CDE]">Pal</span>
    </div>
    {/* Klarna */}
    <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">
      Klarna
    </div>
  </div>
)

export default PaymentIcons
