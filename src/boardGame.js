const CREATOR_EDITABLE_FIELDS = ['joinable', 'finished', 'state'];
const CREATOR_VIEWABLE_FIELDS = [...CREATOR_EDITABLE_FIELDS, 'version', 'players'];

function filterBoardGame(state) {
  return CREATOR_VIEWABLE_FIELDS.reduce(
    (newState, key) => ({
      ...newState,
      [key]: state[key],
    }),
    {},
  );
}

function applyBoardGameResult(state, result) {
  return Object.keys(result).reduce((newState, key) => {
    if (CREATOR_EDITABLE_FIELDS.includes(key)) {
      return { ...newState, [key]: result[key] };
    }
    throw new Error(`key "${key}" is not editable`);
  }, { ...state, version: state.version + 1 });
}

function newBoardGame(backendModule) {
  const boardGame = {
    joinable: true,
    finished: false,
    players: [],
    version: -1,
    // Used to generate unique user ids with a simple counter. No new user will have the same id
    playerIdCounter: 0,
  };
  return applyBoardGameResult(boardGame, backendModule.onRoomStart());
}

function getPlayerById(id, boardGame) {
  return boardGame.players.find((plr) => plr.id === id);
}

function removePlayerById(id, boardGame) {
  return { ...boardGame, players: boardGame.players.filter((p) => p.id !== id) };
}

module.exports = {
  CREATOR_EDITABLE_FIELDS,
  CREATOR_VIEWABLE_FIELDS,
  newBoardGame,
  applyBoardGameResult,
  filterBoardGame,
  getPlayerById,
  removePlayerById,
};
