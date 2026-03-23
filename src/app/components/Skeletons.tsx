import { motion } from 'motion/react';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white/5 animate-pulse rounded-sm ${className}`} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-brand-secondary border border-white/5 p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-12 h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      <td className="px-8 py-6"><Skeleton className="h-3 w-16" /></td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      </td>
      <td className="px-8 py-6"><Skeleton className="h-3 w-20" /></td>
      <td className="px-8 py-6"><Skeleton className="h-4 w-16" /></td>
      <td className="px-8 py-6 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
    </tr>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <StatSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}
