import { Lovelace, Lucid } from "lucid-cardano";
import env from "../configs/env";

export const formatCardanoAddress = (
  address: string | undefined,
): string | undefined => {
  if (address === undefined) return undefined;
  if (address.length < 20) {
    return address;
  }
  let firstPartEndIndex = 9;
  if (address.indexOf("test") >= 0) firstPartEndIndex += 5;
  const firstPart = address.substring(0, firstPartEndIndex);
  const lastPart = address.substring(address.length - 4, address.length);
  return `${firstPart}...${lastPart}`;
};

export const formatPolicyId = (policyId: string) => {
  return `${policyId.substring(0, 10)}...${policyId.substring(
    policyId.length - 10,
  )}`;
};

export const formatLovelace = (lovelace: Lovelace) => {
  const ada = Number(lovelace) / 1_000_000;
  return ada.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

export const getAddressKeyHashes = (
  lucid: Lucid,
  address: string,
): {
  paymentKeyHash: string | undefined;
  stakeKeyHash: string | undefined;
} => {
  const { paymentCredential, stakeCredential } =
    lucid.utils.getAddressDetails(address);

  return {
    paymentKeyHash: paymentCredential?.hash,
    stakeKeyHash: stakeCredential?.hash,
  };
};

/**
 * @returns Unix time of last block in milliseconds
 */
export const getLastBlockTime = async () => {
  const epochInfo = await fetch(
    env.REACT_APP_TESTNET
      ? `https://cardano-preprod.blockfrost.io/api/v0/epochs/latest`
      : `https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest`,
    {
      method: "GET",
      headers: {
        PROJECT_ID: env.REACT_APP_TESTNET
          ? (env.REACT_APP_BLOCKFROST_PROJECT_ID_PREPROD as string)
          : (env.REACT_APP_BLOCKFROST_PROJECT_ID_MAINNET as string),
      },
    },
  ).then((res) => res.json());
  return epochInfo.last_block_time * 1000;
};

export const processImage = (image: string) => {
  if (image.startsWith("ipfs://")) {
    const ipfsHash = image.substring("ipfs://".length);
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  return image;
};
