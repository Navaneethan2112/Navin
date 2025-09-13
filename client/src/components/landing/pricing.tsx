import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';
import { useLanguage } from '@/contexts/language-context';
import { useCurrency } from '@/contexts/currency-context';

const plans = [
  {
    name: "Free",
    description: "Get started with WhatsApp Business API for free",
    pricing: {
      USD: { amount: 0, symbol: "$" },
      AED: { amount: 0, symbol: "AED " },
      INR: { amount: 0, symbol: "₹" }
    },
    period: "/forever",
    features: [
      "Unlimited free service conversations",
      "Free WhatsApp Business API",
      "Free WhatsApp blue tick application",
      "$2 free conversation credit",
      "Upload & manage contacts",
      "Create template messages",
      "Live chat dashboard",
      "Up to 10 tags",
      "Up to 5 custom attributes",
      "Click-to-WhatsApp ads manager"
    ],
    popular: false
  },
  {
    name: "Basic",
    description: "Everything you need to get started with your business",
    pricing: {
      USD: { amount: 35, symbol: "$" },
      AED: { amount: 129, symbol: "AED " },
      INR: { amount: 2499, symbol: "₹" }
    },
    period: "/month",
    features: [
      "All features in Free Plan",
      "1 Owner + 5 FREE agents included",
      "Smart audience segregation",
      "Broadcasting & retargeting",
      "Template message APIs",
      "Multi-agent live chat",
      "Agent transfer & manager monitoring",
      "2400 messages/min",
      "Shopify & WooCommerce integrations",
      "Shared team inbox",
      "5 chatbot flows included"
    ],
    popular: false
  },
  {
    name: "Pro",
    description: "Highly recommended for advanced retargeting campaigns",
    pricing: {
      USD: { amount: 79, symbol: "$" },
      AED: { amount: 289, symbol: "AED " },
      INR: { amount: 5999, symbol: "₹" }
    },
    period: "/month",
    features: [
      "All features in Basic Plan",
      "Up to 100 tags",
      "Up to 20 custom attributes",
      "Campaign scheduler",
      "Campaign click tracking",
      "Smart agent routing",
      "Campaign budget analytics",
      "Project APIs",
      "Custom agent rules",
      "CSV campaign scheduler",
      "Google Sheets integration",
      "Birthday automation messages",
      "User access control",
      "Automatic failed message retry",
      "Unlimited chatbot flows"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    description: "Recommended for 500k+ messages per month",
    pricing: {
      USD: { amount: "Custom", symbol: "" },
      AED: { amount: "Custom", symbol: "" },
      INR: { amount: "Custom", symbol: "" }
    },
    period: "",
    features: [
      "All features in Pro Plan",
      "Recommended for 500k+ users",
      "Unlimited tags & attributes",
      "Downloadable reports",
      "Dedicated account manager",
      "Priority customer support",
      "Webhooks",
      "Higher messaging speed",
      "White-label solution",
      "Custom integrations",
      "SLA guarantees",
      "On-premise deployment option"
    ],
    popular: false
  }
];

export function Pricing() {
  const { t } = useLanguage();
  const { currency } = useCurrency();

  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t('pricingTitle')}</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('pricingDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-6 sm:p-8 rounded-2xl border hover-scale relative ${
                plan.popular 
                  ? 'bg-primary/5 border-2 border-primary' 
                  : 'bg-background border-border'
              }`}
              data-testid={`card-plan-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" data-testid={`text-price-${plan.name.toLowerCase()}`}>
                  {plan.pricing[currency as keyof typeof plan.pricing].symbol}
                  {plan.pricing[currency as keyof typeof plan.pricing].amount}
                </span>
                <span className="text-muted-foreground">
                  {plan.period === '/month' ? '/month' : 
                   plan.period === '/forever' ? ' forever' : 
                   plan.period}
                </span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="text-green-500 flex-shrink-0" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.name === 'Enterprise' ? "outline" : (plan.popular ? "default" : "outline")}
                className={`w-full ${
                  plan.name === 'Enterprise' ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' :
                  plan.popular 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                data-testid={`button-${plan.name === 'Enterprise' ? 'contact-sales' : 'get-started'}`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Request Demo'}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-muted/30 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">💰 Transparent Pricing with No Hidden Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-background p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">✅ Service Messages</h4>
                <p className="text-muted-foreground">FREE unlimited replies to customer messages</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">📱 Template Messages</h4>
                <p className="text-muted-foreground">Pay only for outbound campaigns (competitive WhatsApp rates)</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">🔥 Better Value</h4>
                <p className="text-muted-foreground">20% lower pricing than competitors with same features</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              * Template message rates vary by country. All plans include unlimited free service conversations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
