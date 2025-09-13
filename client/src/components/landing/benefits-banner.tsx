export function BenefitsBanner() {
  const benefits = [
    "Free Green Tick Verification",
    "Free WhatsApp Business API", 
    "Free Onboarding",
    "Zero Setup fee",
    "Free Website Widget",
    "Free QR & Link"
  ];

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
      <div className="animate-scroll">
        <div className="flex gap-8 whitespace-nowrap">
          {[...benefits, ...benefits].map((benefit, index) => (
            <span key={index} className="text-sm font-medium">
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}