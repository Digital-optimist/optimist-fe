export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-200" />
          <div className="h-10 bg-gray-200 rounded-xl w-2/3 mx-auto mb-4" />
          <div className="h-4 bg-gray-100 rounded-lg w-1/4 mx-auto" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-3" />
              <div className="h-4 bg-gray-100 rounded-lg w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded-lg w-5/6 mb-2" />
              <div className="h-4 bg-gray-100 rounded-lg w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
