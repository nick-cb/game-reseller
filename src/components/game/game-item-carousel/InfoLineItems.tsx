import { FBySlug } from '@/actions/game/select';
import { Game } from '@/database/models';

type InfoLineItemsProps = {
  game: FBySlug;
};
export function InfoLineItems(props: InfoLineItemsProps) {
  const { game } = props;

  return (
    <div className="text-sm text-white">
      <div className="flex items-center justify-between border-b border-white/20 py-2">
        <p className="text-white/60">Developer</p>
        <p className="text-white_primary">{game.developer}</p>
      </div>
      <div className="flex items-center justify-between border-b border-white/20 py-2">
        <p className="text-white/60">Publisher</p>
        <p className="text-white_primary">{game.publisher}</p>
      </div>
      <div className="flex items-center justify-between border-b border-white/20 py-2">
        <p className="text-white/60">Release Date</p>
        <p className="text-white_primary">{new Date(game.release_date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center justify-between border-b border-white/20 py-2">
        <p className="text-white/60">Platform</p>
        <div className="flex items-center gap-2 text-white_primary">
          {game.systems.some((s) => s.os?.toLowerCase()?.includes('window')) ? (
            <div title="Windows">
              <svg width={24} height={24} fill="white">
                <use xlinkHref="/svg/sprites/actions.svg#window" />
              </svg>
            </div>
          ) : null}
          {game.systems.some((s) => s.os?.toLowerCase()?.includes('mac')) ? (
            <div title="Mac os">
              <svg width={24} height={24} fill="white">
                <use width={24} height={24} xlinkHref="/svg/sprites/actions.svg#mac" />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
