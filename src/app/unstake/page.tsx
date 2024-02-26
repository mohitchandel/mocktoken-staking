"use client";
import { Button } from "@nextui-org/react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { walletClient, publicClient } from "@/utils/config";
import { BaseError, ContractFunctionRevertedError } from "viem";
import stakingAbi from "@/utils/abi/staking.json";
import { useEffect, useState } from "react";

export default function Unstake() {
  const [stakerStatus, setStakerStatus] = useState<boolean>();
  const [stakerAmount, setStakerAmount] = useState<BigInt>();
  const contractAddress = "0x6701069044705dc3eB49D4807225c9d1a22fAe35";
  const { isConnected, address: walletAddress } = useAccount();

  /*
    Handling Unstaking of Mock Token
  */
  const handelUnStake = async () => {
    if (!stakerStatus) {
      toast.error("You need to stake first");
      return;
    }
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
          errorMessage
            ? toast.error(`Error: ${errorMessage[0]}`)
            : toast.error("Error: Something Went Wrong");
        }
      }
    }
  };

  useEffect(() => {
    const getStakerDetails = async () => {
      const result: any = await publicClient.readContract({
        address: contractAddress,
        abi: stakingAbi.abi,
        args: [walletAddress],
        functionName: "getStakerInfo",
        account: walletAddress,
      });
      setStakerStatus(result[0] as boolean);
      setStakerAmount(result[1] as BigInt);
    };
    getStakerDetails();
  }, []);

  return (
    <div>
      <main className="flex flex-col items-center justify-between bg-[#fff] p-24">
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
            <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 text-center md:flex-nowrap">
              {stakerStatus ? (
                <Button
                  onPress={handelUnStake}
                  className="mx-auto w-full"
                  color="danger"
                >
                  UnStake
                </Button>
              ) : (
                <Button className="mx-auto w-full" color="danger">
                  You need to stake first
                </Button>
              )}
            </div>
          </>
        ) : (
          <h4 className="py-5">Connect Your Wallet</h4>
        )}
      </main>
    </div>
  );
}
