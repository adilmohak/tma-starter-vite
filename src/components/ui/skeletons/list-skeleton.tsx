export default function ListSkeleton({ length = 5 }: { length?: number }) {
  const list = Array.from({ length }, (_, index) => ({ id: index }));
  return (
    <div className="flex flex-col justify-center items-center gap-2 animate-pulse">
      {list.map((itm) => (
        <div
          key={itm.id}
          className="w-full h-[46px] rounded-lg bg-background"
        ></div>
      ))}
    </div>
  );
}
