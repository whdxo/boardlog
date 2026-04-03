import GameCard from "./GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Game } from "@/types";

interface GameGridProps {
  games: Game[];
  loading?: boolean;
  className?: string;
}

export default function GameGrid({ games, loading, className }: GameGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="w-full aspect-[3/4] rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6", className)}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
