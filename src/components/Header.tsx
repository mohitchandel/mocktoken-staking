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
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit">Mock Staking</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
