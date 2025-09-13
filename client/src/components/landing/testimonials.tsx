import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "Aara Connect transformed our customer service. We now handle 3x more inquiries with automated responses while maintaining personal touch.",
    author: "Rajesh Kumar",
    role: "CEO, TechStart Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    content: "The analytics dashboard gives us incredible insights into customer behavior. Our conversion rates improved by 40% in just 3 months.",
    author: "Priya Sharma",
    role: "Marketing Director, Fashion Hub",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    content: "Seamless integration with our existing systems. The bulk messaging feature helped us reach 10,000 customers in minutes during our sale.",
    author: "Amit Patel",
    role: "Founder, Local Market Co",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  }
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Leading Businesses</h2>
          <p className="text-xl text-muted-foreground">
            See what our customers say about transforming their business communication.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-2xl border border-border"
              data-testid={`card-testimonial-${index}`}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={`${testimonial.author} testimonial`}
                  className="w-12 h-12 rounded-full mr-4"
                  data-testid={`img-testimonial-avatar-${index}`}
                />
                <div>
                  <div className="font-semibold" data-testid={`text-testimonial-author-${index}`}>
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
