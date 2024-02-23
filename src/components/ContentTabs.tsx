"use client";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";
import { useAccount } from "wagmi";
import stakingAbi from "@/utils/abi/staking.json";
import { walletClient, publicClient } from "@/utils/config";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BaseError, ContractFunctionRevertedError } from "viem";

export default function ContentTabs() {
  const [stakeAmount, setStakeAmount] = useState<number>();
  const [stakerStatus, seStakerStatus] = useState<boolean>();
  const [stakerAmount, setStakerAmount] = useState<BigInt>();
  const [stakerUnclaimedReward, setStakerUnclaimedReward] = useState<BigInt>();
  const { isConnected, address: walletAddress } = useAccount();
  const contractAddress = "0x6701069044705dc3eB49D4807225c9d1a22fAe35";

  const handelStake = async () => {
    if (!stakeAmount) {
      toast.error("Please enter the amount");
      return;
    }
    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: stakingAbi.abi,
        functionName: "stake",
        args: [stakeAmount * 10 ** 6],
        account: walletAddress,
      });
      const hash = await walletClient.writeContract(request);
      if (hash) {
        toast.success(
          <a href={`https://mumbai.polygonscan.com/tx/${hash}`}>
            <u>Staking Successfully : View Transaction</u>
          </a>,
        );
      }
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          const errorMessage = revertError.data?.args;
          errorMessage
            ? toast.error(`Error: ${errorMessage[0]}`)
            : toast.error("Error: Something Went Wrong");
        }
      }
    }
  };

  const handelUnStake = async () => {
    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: stakingAbi.abi,
        functionName: "unstake",
        account: walletAddress,
      });
      const hash = await walletClient.writeContract(request);
      if (hash) {
        toast.success(
          <a href={`https://mumbai.polygonscan.com/tx/${hash}`}>
            <u>UnStaking Successfully : View Transaction</u>
          </a>,
        );
      }
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          const errorMessage = revertError.data?.args;
          errorMessage
            ? toast.error(`Error: ${errorMessage[0]}`)
            : toast.error("Error: Something Went Wrong");
        }
      }
    }
  };

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
          </a>,
        );
      }
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          const errorMessage = revertError.data?.args;
          errorMessage
            ? toast.error(`${errorName}: ${errorMessage[0]}`)
            : toast.error(`${errorName}: Something Went Wrong`);
        }
      }
    }
  };

  useEffect(() => {
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
    const returnStakerDetails = async () => {
      const details = await getStakerDetails();
      if (details) {
        seStakerStatus(details[0]);
        setStakerAmount(details[1]);
        setStakerUnclaimedReward(details[2]);
      }
      console.log(details);
    };
    returnStakerDetails();
  }, [isConnected, walletAddress]);

  return (
    <div className="flex w-full flex-col">
      <Tabs radius="full" color="success" aria-label="Options">
        <Tab key="stake" title="Stake">
          <Card>
            <CardBody className="h-100 py-16 text-center">
              {isConnected ? (
                <>
                  <h4 className="py-5">Stake Mock Token </h4>
                  <div className="mx-auto flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
                    <Input
                      type="number"
                      label="Enter Stake Amount"
                      placeholder="e.g 100"
                      onChange={(e) => setStakeAmount(+e.target.value)}
                    />
                  </div>
                  <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
                    <Button
                      onPress={handelStake}
                      className="mx-auto w-full"
                      color="success"
                    >
                      Stake
                    </Button>
                  </div>
                </>
              ) : (
                <h4 className="py-5">Connect Your Wallet</h4>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab key="unstake" title="Unstake">
          <Card>
            <CardBody className="h-100 py-16 text-center">
              {isConnected ? (
                <>
                  <h4 className="py-5">
                    {stakerStatus
                      ? "Unstake Mock Token"
                      : "No stake data found, Please stake first"}
                  </h4>
                  <h4>
                    {stakerAmount
                      ? `Staked Amount is ${Number(stakerAmount) / 10 ** 6}`
                      : ""}
                  </h4>
                  <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
                    <Button
                      onPress={handelUnStake}
                      className="mx-auto w-full"
                      color="danger"
                      disabled={stakerStatus}
                    >
                      UnStake
                    </Button>
                  </div>
                </>
              ) : (
                <h4 className="py-5">Connect Your Wallet</h4>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab key="claim" title="Claim Reward">
          <Card>
            <CardBody className="h-100 py-16 text-center">
              {isConnected ? (
                <>
                  <h4 className="py-5">
                    {stakerStatus
                      ? "Claim Your Reward"
                      : "No stake data found, Please stake first"}
                  </h4>
                  <h4>
                    {stakerUnclaimedReward
                      ? `Your Unclaimed Reward Amount is ${Number(stakerUnclaimedReward) / 10 ** 6}`
                      : "You Don't have any reward"}
                  </h4>
                  <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
                    <Button
                      onPress={handelClaimReward}
                      className="mx-auto w-full"
                      color="primary"
                      disabled={stakerStatus}
                    >
                      Claim
                    </Button>
                  </div>
                </>
              ) : (
                <h4 className="py-5">Connect Your Wallet</h4>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
