export * from './game-detail-page/game-details-page';
import * as gameDetailPage from './game-detail-page/game-details-page';
export * from './games';
import * as games from './games';
// export * from './browsepage/browsepage';
import * as browsePage from './browsepage/browsepage';
import * as homePage from './homepage/homepage';

const GameActions = {
  games: games,
  gameDetailPage: gameDetailPage,
  browsePage: browsePage,
  homePage: homePage,
};
export default GameActions;
