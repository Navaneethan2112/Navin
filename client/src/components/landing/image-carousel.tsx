import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselItem {
  id: number;
  type: 'image' | 'gif';
  src: string;
  alt: string;
  title: string;
  description: string;
}

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Demo content with business communication images
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      alt: 'WhatsApp Business Dashboard',
      title: 'Professional Dashboard',
      description: 'Clean, intuitive interface designed for growing businesses'
    },
    {
      id: 2,
      type: 'image', 
      src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      alt: 'Team Collaboration',
      title: 'Team Collaboration',
      description: 'Work together to provide better customer service'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      alt: 'Mobile Communication',
      title: 'Mobile-First Experience', 
      description: 'Optimized for mobile-first customer engagement'
    },
    {
      id: 4,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      alt: 'Analytics Dashboard',
      title: 'Smart Analytics',
      description: 'Clear insights to help your business grow'
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      alt: 'Customer Support',
      title: 'Customer Support',
      description: 'Provide exceptional customer service at scale'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselItems.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-muted/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            See AaraConnect in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our platform helps growing businesses streamline their WhatsApp communication
          </p>
        </div>

        <div className="relative">
          {/* Main carousel container */}
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-card shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselItems.map((item, index) => (
                <div key={item.id} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    data-testid={`img-carousel-${index}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">{item.title}</h3>
                    <p className="text-lg lg:text-xl opacity-90 max-w-2xl">{item.description}</p>
                  </div>
                  
                  {/* Play button overlay for GIF items */}
                  {item.type === 'gif' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                        data-testid="button-play-gif"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Play Demo
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white z-10"
            onClick={goToPrevious}
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white z-10"
            onClick={goToNext}
            data-testid="button-carousel-next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dot indicators */}
          <div className="flex justify-center space-x-3 mt-6">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => goToSlide(index)}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-autoplay-toggle"
            >
              {isAutoPlaying ? 'Pause' : 'Play'} Slideshow
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}