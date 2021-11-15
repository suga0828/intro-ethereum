import { expect } from 'chai';
import { ethers } from 'hardhat';

import { Contract, ContractFactory } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

interface Ownable extends Contract {
  owner: () => Promise<string>;
}

describe('Ownable Contract', () => {
  let Ownable: ContractFactory;
  let ownable: Ownable;
  let signer1: SignerWithAddress, signer2: SignerWithAddress, signer3: SignerWithAddress;

  beforeEach(async () => {
    [signer1, signer2, signer3] = await ethers.getSigners();

    Ownable = await ethers.getContractFactory('Ownable');
    ownable = (await Ownable.deploy(signer2.address)) as Ownable;

    await ownable.deployed();
  });

  it('should have correct owner', async () => {
    const owner = await ownable.owner();

    expect(owner).to.equal(signer2.address);
  });

  it('should not allow non-owner to transfer ownership', async () => {
    await expect(ownable.transferOwnership(signer1.address)).to.be.reverted;
  });

  it('should emit OwnershipTransferred event', async () => {
    await expect(ownable.connect(signer2).transferOwnership(signer3.address))
      .to.be.emit(ownable, 'OwnershipTransferred')
      .withArgs(signer2.address, signer3.address);
  });
});
