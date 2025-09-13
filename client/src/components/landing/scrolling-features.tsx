import { useState, useEffect } from 'react';
import { MessageSquare, Bot, BarChart3, Users, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface ScrollingFeature {
  icon: typeof MessageSquare;
  titleKey: string;
  descriptionKey: string;
  image: string;
  color: string;
}

export function ScrollingFeatures() {
  const { t } = useLanguage();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features: ScrollingFeature[] = [
    {
      icon: MessageSquare,
      titleKey: 'businessApi',
      descriptionKey: 'businessApiDesc',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      color: 'text-blue-500'
    },
    {
      icon: Bot,
      titleKey: 'aiChatbotsFeature', 
      descriptionKey: 'aiChatbotsDesc',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      titleKey: 'analyticsBI',
      descriptionKey: 'analyticsBIDesc', 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      color: 'text-green-500'
    },
    {
      icon: Users,
      titleKey: 'bulkCampaigns',
      descriptionKey: 'bulkCampaignsDesc',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      color: 'text-orange-500'
    },
    {
      icon: Shield,
      titleKey: 'complianceSecurity',
      descriptionKey: 'complianceSecurityDesc',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      color: 'text-amber-500'
    },
    {
      icon: Zap,
      titleKey: 'multiChannelIntegration',
      descriptionKey: 'multiChannelDesc',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      color: 'text-indigo-500'
    }
  ];

  // Auto-scroll through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Everything Your Growing Business Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Professional tools that scale with your business, designed to help you build stronger customer relationships
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = index === currentFeature;
              
              return (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-500 ${
                    isActive 
                      ? 'bg-primary/5 border-l-4 border-primary transform translate-x-2' 
                      : 'hover:bg-muted/50 border-l-4 border-transparent hover:border-primary/20'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                  data-testid={`feature-item-${index}`}
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        isActive ? 'bg-primary/20 scale-110' : 'bg-muted/50'
                      }`}>
                        <IconComponent 
                          className={`h-6 w-6 transition-colors duration-300 ${
                            isActive ? 'text-primary' : feature.color
                          }`} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl lg:text-2xl font-semibold mb-3 transition-colors duration-300 ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {t(feature.titleKey)}
                        </h3>
                        <p className={`leading-relaxed transition-colors duration-300 ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {t(feature.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scrolling Image Display */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 z-10"></div>
              
              {/* Images */}
              <div className="relative h-full">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentFeature 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={feature.image}
                      alt={t(feature.titleKey)}
                      className="w-full h-full object-cover"
                      data-testid={`img-feature-${index}`}
                    />
                  </div>
                ))}
              </div>

              {/* Overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black/80 to-transparent z-20">
                <div className="text-white">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                    {t(features[currentFeature].titleKey)}
                  </h3>
                  <p className="text-lg opacity-90">
                    {t(features[currentFeature].descriptionKey)}
                  </p>
                </div>
              </div>

              {/* Progress indicators */}
              <div className="absolute top-4 right-4 flex space-x-2 z-20">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-8 rounded-full transition-all duration-300 ${
                      index === currentFeature 
                        ? 'bg-white' 
                        : 'bg-white/30'
                    }`}
                    data-testid={`progress-bar-${index}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Bottom navigation dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {features.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentFeature 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentFeature(index)}
              data-testid={`nav-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}