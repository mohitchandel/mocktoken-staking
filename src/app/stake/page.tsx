"use client";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { walletClient, publicClient } from "@/utils/config";
import { BaseError, ContractFunctionRevertedError } from "viem";
import stakingAbi from "@/utils/abi/staking.json";
import erc20 from "@/utils/abi/erc20.json";

export default function Stake() {
  const contractAddress = "0x6701069044705dc3eB49D4807225c9d1a22fAe35";
  const tokenAddress = "0x3eac1e98dd13f76dc238dbbfe2f1a5e5672c14db";
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<bigint>();
  const [userAllowance, setUserAllowance] = useState<bigint>(BigInt(0));
  const [approved, setApprovedHash] = useState<any>();
  const [hash, setHash] = useState<any>();
  const [reciept, setReciept] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const { isConnected, address: walletAddress } = useAccount();

  /*
    Approve token spend
  */
  const approveSpend = async () => {
    const amount = BigInt(2 ** 256 / 2);
    const { request } = await publicClient.simulateContract({
      address: tokenAddress,
      abi: erc20,
      functionName: "approve",
      args: [contractAddress, amount],
      account: walletAddress,
    });
    const approveHash = await walletClient.writeContract(request);
    setStakeAmount(0);
    setIsApproving(true);
    if (approveHash) {
      setApprovedHash(approveHash);
    }
  };

  /*
    Handling staking of Mock Token
  */
  const handelStake = async () => {
    if (!stakeAmount) {
      toast.error("Please enter the amount");
      return;
    }
    if (stakeAmount > Number(userBalance)) {
      toast.error("Your amount is greater than your balance");
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
      const txhash = await walletClient.writeContract(request);
      if (txhash) {
        setIsLoading(true);
        setHash(txhash);
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

  /*
    Checking for user balance
  */
  useEffect(() => {
    const checkTokenBalance = async () => {
      if (walletAddress) {
        const { result } = await publicClient.simulateContract({
          address: tokenAddress,
          abi: erc20,
          functionName: "balanceOf",
          args: [walletAddress],
          account: walletAddress,
        });
        setUserBalance(result);
      }
    };
    checkTokenBalance();
  }, [isConnected, walletAddress, userBalance]);

  useEffect(() => {
    const checkForAllowance = async () => {
      const allowance: any = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20,
        args: [walletAddress, contractAddress],
        functionName: "allowance",
        account: walletAddress,
      });
      console.log(allowance);
      setUserAllowance(allowance);
    };
    checkForAllowance();
  }, []);

  useEffect(() => {
    (async () => {
      if (hash) {
        const txReciept = await publicClient.waitForTransactionReceipt({
          hash,
        });
        setReciept(txReciept);

        toast.success(
          <a href={`https://mumbai.polygonscan.com/tx/${hash}`}>
            <u>Staking Successfully : View Transaction</u>
          </a>
        );
      }
      setIsLoading(false);
    })();
  }, [hash]);

  useEffect(() => {
    (async () => {
      if (approved) {
        const txReciept = await publicClient.waitForTransactionReceipt({
          hash: approved,
        });
        setReciept(txReciept);

        toast.success(
          <a href={`https://mumbai.polygonscan.com/tx/${approved}`}>
            <u>Approved: View Transaction</u>
          </a>
        );
      }
      setIsApproving(false);
    })();
  }, [approved]);

  return (
    <div>
      <main className="flex flex-col items-center justify-between bg-[#fff] p-24">
        {isConnected ? (
          <>
            <h4 className="py-5">Stake Mock Token </h4>
            <div className="mx-auto flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
              <Input
                type="number"
                label="Enter Stake Amount"
                placeholder="e.g 100"
                value={stakeAmount.toString()}
                onChange={(e) => setStakeAmount(+e.target.value)}
              />
            </div>
            <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
              {userAllowance > BigInt(stakeAmount) ? (
                <Button
                  onPress={handelStake}
                  disabled={!stakeAmount}
                  className="mx-auto w-full"
                  color="success"
                  isDisabled={isLoading || isApproving}
                >
                  {isLoading || isApproving ? "Waiting..." : "Stake"}
                </Button>
              ) : (
                <Button
                  onPress={approveSpend}
                  className="mx-auto w-full"
                  color="primary"
                  isDisabled={isLoading || isApproving}
                >
                  {isLoading || isApproving ? "Waiting..." : "Approve"}
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
