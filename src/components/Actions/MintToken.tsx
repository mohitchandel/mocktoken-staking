"use client";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { walletClient, publicClient } from "@/utils/config";
import erc20 from "@/utils/abi/erc20.json";

export const MintToken = () => {
  const tokenAddress = "0x3eac1e98dd13f76dc238dbbfe2f1a5e5672c14db";
  const [mintAmount, setMintAmount] = useState<number>();
  const { isConnected, address: walletAddress } = useAccount();

  /*
    Minting Tokens
  */
  const mintMockTokens = async () => {
    if (!mintAmount) {
      toast.error("Please enter mint amount");
      return;
    }
    const { request } = await publicClient.simulateContract({
      address: tokenAddress,
      abi: erc20,
      functionName: "mint",
      args: [walletAddress, mintAmount * 10 ** 6],
      account: walletAddress,
    });
    const hash = await walletClient.writeContract(request);
    if (hash) {
      toast.success(
        <a href={`https://mumbai.polygonscan.com/tx/${hash}`}>
          <u>Tokens Minted Successfully : View Transaction</u>
        </a>,
      );
    }
  };

  return (
    <Card>
      <CardBody className="h-100 py-16 text-center">
        {isConnected ? (
          <>
            <h4 className="py-5">Mint Mock Tokens.</h4>
            <div className="mx-auto flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
              <Input
                type="number"
                label="Enter Amount"
                placeholder="e.g 10000"
                onChange={(e) => setMintAmount(+e.target.value)}
              />
            </div>
            <div className="mx-auto mt-5 flex w-2/5 flex-wrap gap-4 md:flex-nowrap">
              <Button
                onPress={mintMockTokens}
                className="mx-auto w-full"
                color="success"
              >
                Mint
              </Button>
            </div>
          </>
        ) : (
          <h4 className="py-5">Connect Your Wallet</h4>
        )}
      </CardBody>
    </Card>
  );
};
