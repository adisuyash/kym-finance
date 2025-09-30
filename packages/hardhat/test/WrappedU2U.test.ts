import { expect } from "chai";
import { ethers } from "hardhat";
import { WrappedU2U } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("WrappedU2U", function () {
  let wrappedU2U: WrappedU2U;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const WrappedU2UFactory = await ethers.getContractFactory("WrappedU2U");
    wrappedU2U = await WrappedU2UFactory.deploy();
    await wrappedU2U.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct name and symbol", async function () {
      expect(await wrappedU2U.name()).to.equal("Wrapped U2U");
      expect(await wrappedU2U.symbol()).to.equal("wU2U");
    });

    it("Should have 18 decimals", async function () {
      expect(await wrappedU2U.decimals()).to.equal(18n);
    });

    it("Should start with zero total supply", async function () {
      expect(await wrappedU2U.totalSupply()).to.equal(0n);
    });
  });

  describe("Deposit", function () {
    it("Should mint wU2U tokens when depositing U2U", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      await wrappedU2U.connect(user1).deposit({ value: depositAmount });
      
      expect(await wrappedU2U.balanceOf(user1.address)).to.equal(depositAmount);
      expect(await wrappedU2U.totalSupply()).to.equal(depositAmount);
      expect(await wrappedU2U.totalU2UBacking()).to.equal(depositAmount);
    });

    it("Should emit Deposit event", async function () {
      const depositAmount = ethers.parseEther("0.5");
      
      await expect(wrappedU2U.connect(user1).deposit({ value: depositAmount }))
        .to.emit(wrappedU2U, "Deposit")
        .withArgs(user1.address, depositAmount);
    });

    it("Should revert when depositing zero U2U", async function () {
      await expect(wrappedU2U.connect(user1).deposit({ value: 0 }))
        .to.be.revertedWith("Must send U2U");
    });

    it("Should work with receive function", async function () {
      const depositAmount = ethers.parseEther("2.0");
      
      await user1.sendTransaction({
        to: await wrappedU2U.getAddress(),
        value: depositAmount
      });
      
      expect(await wrappedU2U.balanceOf(user1.address)).to.equal(depositAmount);
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      // Deposit some U2U first
      await wrappedU2U.connect(user1).deposit({ value: ethers.parseEther("2.0") });
    });

    it("Should burn wU2U and return U2U", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      const tx = await wrappedU2U.connect(user1).withdraw(withdrawAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      expect(await wrappedU2U.balanceOf(user1.address)).to.equal(ethers.parseEther("1.0"));
      expect(await wrappedU2U.totalSupply()).to.equal(ethers.parseEther("1.0"));
      
      const finalBalance = await ethers.provider.getBalance(user1.address);
      const expectedBalance = initialBalance + withdrawAmount - gasUsed;
      const tolerance = ethers.parseEther("0.001"); // Small tolerance for gas estimation
      expect(finalBalance).to.be.greaterThanOrEqual(expectedBalance - tolerance);
      expect(finalBalance).to.be.lessThanOrEqual(expectedBalance + tolerance);
    });

    it("Should emit Withdrawal event", async function () {
      const withdrawAmount = ethers.parseEther("0.5");
      
      await expect(wrappedU2U.connect(user1).withdraw(withdrawAmount))
        .to.emit(wrappedU2U, "Withdrawal")
        .withArgs(user1.address, withdrawAmount);
    });

    it("Should revert when withdrawing more than balance", async function () {
      const withdrawAmount = ethers.parseEther("3.0");
      
      await expect(wrappedU2U.connect(user1).withdraw(withdrawAmount))
        .to.be.revertedWith("Insufficient wU2U balance");
    });

    it("Should revert when withdrawing zero amount", async function () {
      await expect(wrappedU2U.connect(user1).withdraw(0))
        .to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Multiple users", function () {
    it("Should handle multiple users independently", async function () {
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("2.0");
      
      await wrappedU2U.connect(user1).deposit({ value: amount1 });
      await wrappedU2U.connect(user2).deposit({ value: amount2 });
      
      expect(await wrappedU2U.balanceOf(user1.address)).to.equal(amount1);
      expect(await wrappedU2U.balanceOf(user2.address)).to.equal(amount2);
      expect(await wrappedU2U.totalSupply()).to.equal(amount1 + amount2);
      expect(await wrappedU2U.totalU2UBacking()).to.equal(amount1 + amount2);
    });
  });
});
