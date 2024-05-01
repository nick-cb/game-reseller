export * from './game-detail-page/game-details-page';
import * as gameDetailPage from './game-detail-page/game-details-page';
export * from './games';
import * as games from './games';
export * from './browsepage/browsepage';
import * as browsePage from './browsepage/browsepage';

const GameActions = { games: games, gameDetailPage: gameDetailPage, browsePage: browsePage };
export default GameActions;
