"use client";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";
import { useAccount } from "wagmi";
import stakingAbi from "@/utils/abi/staking.json";
import { walletClient, publicClient } from "@/utils/config";
import { useEffect, useState } from "react";
import { Staking } from "@/components/Actions/Staking";
import { Unstaking } from "@/components/Actions/Unstake";
import { ClaimReward } from "./Actions/ClaimRewards";
import { MintToken } from "./Actions/MintToken";

export default function ContentTabs() {
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

  return (
    <div className="flex w-full flex-col">
      <Tabs radius="full" color="success" aria-label="Options">
        <Tab key="mint" title="Mint Tokens">
          <MintToken />
        </Tab>
        <Tab key="stake" title="Stake">
          <Staking />
        </Tab>
        <Tab key="unstake" title="Unstake">
          <Unstaking />
        </Tab>
        <Tab key="claim" title="Claim Reward">
          <ClaimReward
            stakerStatus={stakerStatus}
            stakerAmount={Number(stakerAmount)}
            stakerUnclaimedReward={Number(stakerUnclaimedReward)}
            rewardToken={rewardToken || ""}
            claimedDelay={claimedDelay}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
