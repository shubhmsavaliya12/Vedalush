import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-[#E6DED2] flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-44 sm:h-64 md:h-80 w-full bg-[#E6DED2]/50"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="h-4 bg-[#E6DED2]/70 rounded w-3/4 mb-3"></div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3 bg-[#E6DED2]/70 rounded w-16"></div>
        </div>
        <div className="mt-auto pt-4 border-t border-[#F8F4EC]">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-[#E6DED2]/70 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-4 bg-[#E6DED2]/70 rounded w-32 mb-2"></div>
          <div className="flex space-x-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-[#E6DED2]/70 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="h-3 bg-[#E6DED2]/70 rounded w-16"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-[#E6DED2]/70 rounded w-full"></div>
        <div className="h-4 bg-[#E6DED2]/70 rounded w-5/6"></div>
      </div>

      <div className="flex items-center space-x-3 text-nature-600 border-t border-nature-100 pt-3">
        <div className="w-10 h-10 bg-[#E6DED2]/70 rounded-lg"></div>
        <div>
          <div className="h-3 bg-[#E6DED2]/70 rounded w-24 mb-1"></div>
          <div className="h-3 bg-[#E6DED2]/70 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-full min-w-0 animate-pulse">
      {/* Left Column Skeleton: Main Image */}
      <div className="flex flex-col md:flex-row gap-4 w-full items-start">
        <div className="w-full bg-[#E6DED2]/50 rounded-2xl aspect-[4/5] md:aspect-square lg:aspect-[4/5]"></div>
      </div>

      {/* Right Column Skeleton: Details */}
      <div className="flex flex-col h-full mt-4 md:mt-0">
        <div className="h-5 bg-[#E6DED2]/70 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-[#E6DED2]/70 rounded w-3/4 mb-4"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-5 bg-[#E6DED2]/70 rounded"></div>
        </div>
        <div className="h-8 bg-[#E6DED2]/70 rounded w-1/3 mb-8"></div>
        <div className="space-y-3 mb-10">
          <div className="h-4 bg-[#E6DED2]/70 rounded w-full"></div>
          <div className="h-4 bg-[#E6DED2]/70 rounded w-full"></div>
          <div className="h-4 bg-[#E6DED2]/70 rounded w-5/6"></div>
          <div className="h-4 bg-[#E6DED2]/70 rounded w-4/6"></div>
        </div>
        
        <div className="flex gap-4 mb-8">
          <div className="w-32 h-14 bg-[#E6DED2]/70 rounded-full"></div>
          <div className="flex-1 h-14 bg-[#E6DED2]/70 rounded-full"></div>
        </div>

        <div className="space-y-4 pt-8 border-t border-[#E6DED2]/50">
          <div className="h-5 bg-[#E6DED2]/70 rounded w-1/2"></div>
          <div className="h-5 bg-[#E6DED2]/70 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};
