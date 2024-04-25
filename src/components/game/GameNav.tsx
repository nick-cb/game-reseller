import Link from 'next/link';

type GameNavProps = {
  type: 'add-ons' | 'base';
  slug: string;
};
export function GameNav(props: GameNavProps) {
  const { slug, type } = props;
  return (
    <nav id="game-nav">
      <ul className="flex items-center gap-4">
        <li>
          <h2 className={'text-lg ' + (type === 'base' ? 'active-link' : '')}>
            <Link href={'/' + slug} className={'text-white_primary/60 '}>
              Overview
            </Link>
          </h2>
        </li>
        <li>
          <h2 className={'text-lg ' + (type === 'add-ons' ? 'active-link' : '')}>
            <Link href={slug + '/add-ons'} className={'text-white_primary/60 '}>
              Add-Ons
            </Link>
          </h2>
        </li>
      </ul>
    </nav>
  );
}
