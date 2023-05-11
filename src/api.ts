import axios from "axios";
import _ from "lodash";
import { Dao, Proposal, ProposalResults, RawVotes, VotingPower } from "types";
import { Logger, parseVotes } from "utils";
import moment from "moment";
import { LAST_FETCH_UPDATE_LIMIT, IS_DEV } from "config";
const baseURL =
  IS_DEV
    ? "https://dev-ton-vote-cache.herokuapp.com"
    : "https://ton-vote-cache.herokuapp.com/";

const axiosInstance = axios.create({
  baseURL,
});

const getDaos = async (signal?: AbortSignal): Promise<Dao[]> => {
  return (await axiosInstance.get(`/daos`, { signal })).data;
};

const getAllNftHolders = async (
  proposalAddress: string,
  signal?: AbortSignal
): Promise<{ [key: string]: number }> => {
  const res = await axiosInstance.get(
    `/proposalNftHolders/${proposalAddress}`,
    {
      signal,
    }
  );    
  return res.data;
};

const getProposal = async (
  proposalAddress: string,
  signal?: AbortSignal
): Promise<Proposal> => {
  Logger(`Fetching proposal from api ${proposalAddress}`);

  const [result, maxLt] = await Promise.all([
    axiosInstance.get(`/proposal/${proposalAddress}`, {
      signal,
    }),
    getMaxLt(proposalAddress, signal),
  ]);

  return {
    ...result.data,
    votes: parseVotes(result.data.votes, result.data.votingPower),
    maxLt,
  };
};

const getMaxLt = async (
  proposalAddress: string,
  signal?: AbortSignal
): Promise<string> => {
  return (await axiosInstance.get(`/maxLt/${proposalAddress}`, { signal }))
    .data;
};

const getDao = async (
  daoAddress: string,
  signal?: AbortSignal
): Promise<Dao | undefined> => {
  return (await axiosInstance.get(`/dao/${daoAddress}`, { signal })).data;
};

const validateServerLastUpdate = async (
  signal?: AbortSignal
): Promise<boolean> => {
  const serverLastUpdate = (await axiosInstance.get("/updateTime", { signal }))
    .data;
  return moment().valueOf() - serverLastUpdate < LAST_FETCH_UPDATE_LIMIT;
};


const getUpdateTime = async (): Promise<number> => {
  const res = await axiosInstance.get("/updateTime")
  return res.data
}

export const api = {
  getDaos,
  getProposal,
  getMaxLt,
  validateServerLastUpdate,
  getDao,
  getAllNftHolders,
  getUpdateTime,
};

export interface GetStateApiPayload {
  votes: RawVotes;
  votingPower: VotingPower;
  results: ProposalResults;
  maxLt: string;
}