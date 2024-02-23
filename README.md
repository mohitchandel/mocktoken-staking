# Staking Content Tabs

This repository contains FE designed for staking functionality. It enables users to stake, unstake, and claim rewards on MOCK tokens using a connected wallet.

## Functionality

The `ContentTabs` component provides the following functionality:

- **Stake**: Allows users to stake a specified amount of Mock Tokens.
- **Unstake**: Enables users to unstake their previously staked tokens.
- **Claim Reward**: Allows users to claim rewards for their staked tokens.

## Dependencies

### External Libraries

- **NextUI**: Provides UI components such as Tabs, Card, Input, and Button.
- **Wagmi**: Provides account management functionality including checking account connection.
- **React**: JavaScript library for building user interfaces.
- **React-Hot-Toast**: Used for displaying toast notifications.
- **Viem**: Handles error management.

### Other Dependencies

- **@/utils/abi/staking.json**: ABI file for the staking contract.
- **@/utils/config**: Configuration files containing client information.
