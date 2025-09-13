import { 
  MessageSquare, 
  Bot, 
  BarChart3, 
  Send, 
  Shield, 
  Megaphone 
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: MessageSquare,
      titleKey: "businessApi",
      descriptionKey: "businessApiDesc",
      color: "text-primary"
    },
    {
      icon: Bot,
      titleKey: "aiChatbotsFeature",
      descriptionKey: "aiChatbotsDesc",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      titleKey: "analyticsBI",
      descriptionKey: "analyticsBIDesc",
      color: "text-green-500"
    },
    {
      icon: Send,
      titleKey: "bulkCampaigns",
      descriptionKey: "bulkCampaignsDesc",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      titleKey: "complianceSecurity",
      descriptionKey: "complianceSecurityDesc",
      color: "text-amber-500"
    },
    {
      icon: Megaphone,
      titleKey: "multiChannelIntegration",
      descriptionKey: "multiChannelDesc",
      color: "text-orange-500"
    }
  ];
  
  return (
    <section id="features" className="py-20 bg-card relative overflow-hidden">
      {/* Minimal decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/3 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-primary/2 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            {t('featuresTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('featuresDescription')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-card p-8 rounded-lg border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
                data-testid={`card-feature-${index}`}
                style={{
                  animationDelay: `${index * 200 + 600}ms`
                }}
              >
                <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <IconComponent className={`text-2xl text-primary group-hover:text-primary transition-colors duration-300`} size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}