import hre from 'hardhat';
const { waffle } = hre;

import { AnteMultiStaking__factory, AnteMultiStaking } from '../../typechain';

import { evmSnapshot, evmRevert } from '../helpers';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';

const USDC_TEST_ADDRESS = '0x5f3555Febf9bF4930ad581dB008f8b0F6239C6Fc';
const USDT_TEST_ADDRESS = '0xFc2Bd420ae071a812Ea238C5916198024E00fE33';

describe('AnteMultiStaking', function () {
    let test: AnteMultiStaking;
    let globalSnapshotId: string;
    let USDCDeployedContract: Contract;
    let USDTDeployedContract: Contract;

    before(async () => {
        globalSnapshotId = await evmSnapshot();

        const [deployer] = waffle.provider.getWallets();
        const factory = (await hre.ethers.getContractFactory('AnteMultiStaking', deployer)) as AnteMultiStaking__factory;

        test = await factory.deploy();
        
        await test.deployed();

        // Create a smart contract object for the USDC and USDT contract
        USDCDeployedContract = await hre.ethers.getContractAt('AntePool', USDC_TEST_ADDRESS);
        USDTDeployedContract = await hre.ethers.getContractAt('AntePool', USDT_TEST_ADDRESS);
    });

    after(async () => {
        await evmRevert(globalSnapshotId);
    });

    it('should always be true', async () => {
        expect(await test.alwaysTrue()).to.be.true;
    });

    it('stake should increase by 1', async () => {
        const addresses = [USDC_TEST_ADDRESS];

        // Capture initial stake on contract
        const initialStake = (await USDCDeployedContract.getTotalStaked() as BigNumber);  
        
        await test.multiStake(addresses, false, { value: hre.ethers.utils.parseEther('1') });

        // Capture new stake on contract
        const newStake = (await USDCDeployedContract.getTotalStaked() as BigNumber);

        // Check that new stake is greater than initial stake by 1
        // Safe to convert to a normal number as the difference should be 1.
        // If not, that results in the unit test failing regardless.
        const difference = (newStake.sub(initialStake)).div(BigNumber.from(10).pow(BigNumber.from(18))).toNumber();
        
        expect(difference).to.equal(1);
    });

    it('stake should increase by 0.5', async () => {
        const addresses = [USDC_TEST_ADDRESS, USDT_TEST_ADDRESS];

        // Capture initial stake on contract
        const initialStakeUSDC = (await USDCDeployedContract.getTotalStaked() as BigNumber);
        const initialStakeUSDT = (await USDTDeployedContract.getTotalStaked() as BigNumber);

        await test.multiStake(addresses, false, { value: hre.ethers.utils.parseEther('1') });

        // Capture new stake on contracts
        const newStakeUSDC = (await USDCDeployedContract.getTotalStaked() as BigNumber);
        const newStakeUSDT = (await USDTDeployedContract.getTotalStaked() as BigNumber);

        // Check that new stake is greater than initial stake by 0.5
        // Safe to convert to a normal number as the difference should be 0.5.
        // If not, that results in the unit test failing regardless.
        // 
        // Using 17 instead of 18 because BigNumber doens't support floating point numbers.
        const differenceUSDC = (newStakeUSDC.sub(initialStakeUSDC)).div(BigNumber.from(10).pow(BigNumber.from(17)));
        const differenceUSDT = (newStakeUSDT.sub(initialStakeUSDT)).div(BigNumber.from(10).pow(BigNumber.from(17)));

        expect(differenceUSDC).to.equal('5');
        expect(differenceUSDT).to.equal('5');
    });

    it('stake should increase then return to original after unstaking', async () => {
        const addresses = [USDC_TEST_ADDRESS, USDT_TEST_ADDRESS];

        // Capture initial stake on contract
        const initialStakeUSDC = (await USDCDeployedContract.getTotalStaked() as BigNumber);
        const initialStakeUSDT = (await USDTDeployedContract.getTotalStaked() as BigNumber);

        await test.multiStake(addresses, false, { value: hre.ethers.utils.parseEther('1') });

        // Capture new stake on contracts
        const newStakeUSDC = (await USDCDeployedContract.getTotalStaked() as BigNumber);
        const newStakeUSDT = (await USDTDeployedContract.getTotalStaked() as BigNumber);

        // Check that new stake is greater than initial stake by 0.5
        const differenceUSDC = (newStakeUSDC.sub(initialStakeUSDC)).div(BigNumber.from(10).pow(BigNumber.from(17)));
        const differenceUSDT = (newStakeUSDT.sub(initialStakeUSDT)).div(BigNumber.from(10).pow(BigNumber.from(17)));

        expect(differenceUSDC).to.equal('5');
        expect(differenceUSDT).to.equal('5');

        // Withdraw from contract
        await test.unstake(false);

        // Capture new stake on contracts
        const thirdRoundStakeUSDC = (await USDCDeployedContract.getTotalStaked() as BigNumber);
        const thirdRoundStakeUSDT = (await USDTDeployedContract.getTotalStaked() as BigNumber);

        // Check that thirdRound and initial stake are equal
        expect(thirdRoundStakeUSDC.eq(initialStakeUSDC));
    });

    it('should revert after trying to double unstake', async () => {
        const addresses = [USDC_TEST_ADDRESS, USDT_TEST_ADDRESS];

        await test.multiStake(addresses, false, { value: hre.ethers.utils.parseEther('1') });

        // Withdraw from contract
        await test.unstake(false);

        // Withdraw again
        await expect(test.unstake(false)).to.be.revertedWith('ANTE: Nothing to unstake');
    });
});