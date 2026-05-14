export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-xl w-1/3 mb-6" />
          <div className="h-5 bg-gray-100 rounded-lg w-2/3 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 h-96" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
