export default function DocListSkeleton() {
  return (
    <div className="group relative flex items-center justify-between border-b-2 border-white/20 py-6 animate-pulse">
      <div className="flex-1">
        <div className="h-8 w-1/2 bg-gray-600 rounded shimmer mb-2" />
        <div className="flex items-center gap-4 mb-2">
          <div className="h-5 w-1/6 bg-gray-600 rounded shimmer" />
          <div className="h-5 w-1/8 bg-gray-600 rounded shimmer" />
        </div>
        <div className="h-4 w-3/4 bg-gray-600 rounded shimmer mb-2" />
        <div className="flex items-center gap-4 mt-3">
          <div className="h-4 w-1/6 bg-gray-600 rounded shimmer" />
          <div className="h-4 w-1/8 bg-gray-600 rounded shimmer" />
          <div className="h-4 w-1/8 bg-gray-600 rounded shimmer" />
          <div className="h-4 w-1/6 bg-gray-600 rounded shimmer" />
        </div>
      </div>
     
    </div>
  );
} 