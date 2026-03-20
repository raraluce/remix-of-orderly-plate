import { Skeleton } from "@/components/ui/skeleton";

const MenuCardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-full" />
    </div>
  </div>
);

export default MenuCardSkeleton;
