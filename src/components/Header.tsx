"use client";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <Navbar className="bg-black">
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit">Mock Staking</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent>
        <NavbarItem>
          <Link className="text-white" href="/">
            Mint
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white" href="/stake">
            Stake
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white" href="/unstake">
            UnStake
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white" href="/claim">
            Claim Rewards
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
