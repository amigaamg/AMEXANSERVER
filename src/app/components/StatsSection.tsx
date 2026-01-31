export function StatsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Healthcare Providers</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">98.7%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Patient Satisfaction</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">$0</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Setup Fee</div>
        </div>
      </div>
    </section>
  )
}