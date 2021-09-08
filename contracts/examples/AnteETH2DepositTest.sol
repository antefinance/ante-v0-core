// SPDX-License-Identifier: GPL-3.0-only

// ┏━━━┓━━━━━┏┓━━━━━━━━━┏━━━┓━━━━━━━━━━━━━━━━━━━━━━━
// ┃┏━┓┃━━━━┏┛┗┓━━━━━━━━┃┏━━┛━━━━━━━━━━━━━━━━━━━━━━━
// ┃┗━┛┃┏━┓━┗┓┏┛┏━━┓━━━━┃┗━━┓┏┓┏━┓━┏━━┓━┏━┓━┏━━┓┏━━┓
// ┃┏━┓┃┃┏┓┓━┃┃━┃┏┓┃━━━━┃┏━━┛┣┫┃┏┓┓┗━┓┃━┃┏┓┓┃┏━┛┃┏┓┃
// ┃┃ ┃┃┃┃┃┃━┃┗┓┃┃━┫━┏┓━┃┃━━━┃┃┃┃┃┃┃┗┛┗┓┃┃┃┃┃┗━┓┃┃━┫
// ┗┛ ┗┛┗┛┗┛━┗━┛┗━━┛━┗┛━┗┛━━━┗┛┗┛┗┛┗━━━┛┗┛┗┛┗━━┛┗━━┛
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pragma solidity ^0.7.0;

import "../AnteTest.sol";

// Ante Test to check that ETH2 beacon, depositcontract.eth doesn't lose 99.99% of
// it's ETH (as of May 2021)
contract AnteETH2DepositTest is AnteTest("ETH2 beacon depositcontract doesn't lose 99.99% of its ETH") {
    // depositcontract.eth, verified on https://ethereum.org/en/eth2/deposit-contract/
    // https://etherscan.io/address/0x00000000219ab540356cBB839Cbe05303d7705Fa
    address public constant depositContractAddr = 0x00000000219ab540356cBB839Cbe05303d7705Fa;

    // As of 20210524 with 4.88m ETH deposited, 500 ETH represents a ~ -99.99% drop
    uint256 public constant THRESHOLD_BALANCE = 500 * 1e18; //500 ETH

    constructor() {
        testedContracts = [depositContractAddr];
    }

    function checkTestPasses() public view override returns (bool) {
        return (depositContractAddr.balance >= THRESHOLD_BALANCE);
    }
}
