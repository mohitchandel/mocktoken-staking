"use client";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { walletClient, publicClient } from "@/utils/config";
import { BaseError, ContractFunctionRevertedError } from "viem";
import stakingAbi from "@/utils/abi/staking.json";
import { useEffect, useState } from "react";

export default function Claim() {
  const [rewardToken, setRewardToken] = useState<string>();
  const [claimedDelay, setClaimedDelay] = useState<any>();
  const [stakerStatus, seStakerStatus] = useState<boolean>();
  const [stakerAmount, setStakerAmount] = useState<BigInt>();

  const [stakerUnclaimedReward, setStakerUnclaimedReward] = useState<BigInt>();
  const { isConnected, address: walletAddress } = useAccount();
  const contractAddress = "0x6701069044705dc3eB49D4807225c9d1a22fAe35";

  useEffect(() => {
    // Getting staker info
    const getStakerDetails = async () => {
      if (isConnected && walletAddress) {
        const { result } = await publicClient.simulateContract({
          address: contractAddress,
          abi: stakingAbi.abi,
          args: [walletAddress],
          functionName: "getStakerInfo",
          account: walletAddress,
        });
        return result;
      }
      return undefined;
    };

    // Getting Main Details
    const getDetails = async () => {
      if (isConnected && walletAddress) {
        const { result } = await publicClient.simulateContract({
          address: contractAddress,
          abi: stakingAbi.abi,
          functionName: "getDetails",
          account: walletAddress,
        });
        return result;
      }
      return undefined;
    };

    // Setting Staker Details
    const returnStakerDetails = async () => {
      const stakerDetails = await getStakerDetails();
      if (stakerDetails) {
        seStakerStatus(stakerDetails[0]);
        setStakerAmount(stakerDetails[1]);
        setStakerUnclaimedReward(stakerDetails[2]);
      }
      const mainDetails = await getDetails();
      if (mainDetails) {
        setRewardToken(mainDetails[3]);
        setClaimedDelay(mainDetails[6]);
      }
    };
    returnStakerDetails();
  }, [isConnected, walletAddress]);
  /*
    Handling claim Reward of Mock Token
  */
  const handelClaimReward = async () => {
    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: stakingAbi.abi,
        functionName: "claimRewards",
        account: walletAddress,
      });
      const hash = await walletClient.writeContract(request);
      if (hash) {
        toast.success(
          <a href={`https://mumbai.polygonscan.com/tx/${hash}`}>
            <u>Staking Successfully : View Transaction</u>
          </a>
        );
      }
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          const errorMessage = revertError.data?.args;
          errorMessage: toast.error(
            `${errorName}: Something Went Wrong! Please get back when you claim delay is over`
          );
        }
      }
    }
  };

  return (
    <div>
      <main className="flex flex-col items-center justify-between bg-[#fff] p-24">
        {isConnected ? (
          <>
            <h4 className="py-5">
              {stakerStatus
                ? "Claim Your Reward"
                : "No stake data found, Please stake first"}
            </h4>
            <h4 className="py-5">
              {rewardToken ? (
                <a
                  href={`https://mumbai.polygonscan.com/address/${rewardToken}`}
                >
                  Reward Token: {rewardToken}
                </a>
              ) : (
                ""
              )}
            </h4>
            <h4>
              {stakerUnclaimedReward
                ? `Your Unclaimed Reward Amount is ${
                    Number(stakerUnclaimedReward) / 10 ** 6
                  }`
                : "You Don't have any reward"}
            </h4>
            <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
              <Button
                onPress={handelClaimReward}
                className="mx-auto w-full"
                color="primary"
                disabled={!stakerStatus}
              >
                Claim
              </Button>
            </div>
          </>
        ) : (
          <h4 className="py-5">Connect Your Wallet</h4>
        )}
      </main>
    </div>
  );
}
