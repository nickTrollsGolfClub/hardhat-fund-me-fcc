const { getNamedAccounts, ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("0.09");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("Allows people to fund and withdraw", async function () {
              const fundResponse = await fundMe.fund({ value: sendValue });
              await fundResponse.wait(1);
              const fundedBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );

              const withdrawResponse = await fundMe.withdraw({
                  gasLimit: 2000000,
              });
              await withdrawResponse.wait(1);
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );

              assert.equal(fundedBalance.toString(), sendValue.toString());
              assert.equal(endingBalance.toString(), "0");
          });
      });
