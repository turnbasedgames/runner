import axios from 'axios';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
console.log(process.env.PORT);
console.log(DEFAULT_PORT);
export const BASE_URL = 'http://localhost:4100';

export const addPlayer = async () => {
  const { data } = await axios.post(`${BASE_URL}/player`);
  return data;
};

export const getState = async () => {
  const { data } = await axios.get(`${BASE_URL}/state`);
  return data;
};

export const makeMove = (player, move) => axios.post(`${BASE_URL}/player/${player.id}/move`, move);

export const resetState = async () => axios.delete(`${BASE_URL}/state`);

export const removePlayer = (player) => axios.delete(`${BASE_URL}/player/${player.id}`);

export const getPlayerInGameById = async (plrId) => {
  const { players } = await getState();
  return players.find((somePlr) => somePlr.id === plrId);
};
