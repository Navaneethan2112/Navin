export function Statistics() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Open Rates</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">45-60%</div>
            <div className="text-muted-foreground">Click Rates</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">2.6Bn+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">7%</div>
            <div className="text-muted-foreground">Engagement Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}