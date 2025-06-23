const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
  let Escrow, escrow;
  let depositor, arbiter, beneficiary, other;
  const depositAmount = ethers.utils.parseEther("1"); // 1 ETH
  const durationSeconds = 60;

  beforeEach(async function () {
    [depositor, arbiter, beneficiary, other] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.connect(depositor).deploy(
      arbiter.address,
      beneficiary.address,
      durationSeconds,
      { value: depositAmount }
    );
    await escrow.deployed();
  });

  it("Should deploy with correct data", async function () {
    expect(await escrow.depositor()).to.equal(depositor.address);
    expect(await escrow.arbiter()).to.equal(arbiter.address);
    expect(await escrow.beneficiary()).to.equal(beneficiary.address);
    expect(await escrow.originalDeposit()).to.equal(depositAmount);
  });

  it("Should allow arbiter to approve and emit event", async function () {
  // Ejecutamos la transacción
  const tx = await escrow.connect(arbiter).approve();
  const receipt = await tx.wait();

  // Obtenemos el timestamp del bloque minado
  const block = await ethers.provider.getBlock(receipt.blockNumber);

  // Comprobamos que se emitió el evento con los args correctos
  await expect(tx)
    .to.emit(escrow, "Approved")
    .withArgs(
      depositAmount, 
      block.timestamp
    );

  // Verificamos los cambios en el estado del contrato
  expect(await escrow.isApproved()).to.be.true;
  expect(await escrow.isCancelled()).to.be.false;
});

  it("Should not allow non-arbiter to approve", async function () {
    await expect(escrow.connect(other).approve()).to.be.revertedWith(
      "Only arbiter can call this"
    );
  });

  it("Should allow arbiter to cancel and emit event", async function () {
  // Ejecutamos la transacción
  const tx = await escrow.connect(arbiter).cancel();
  const receipt = await tx.wait();

  // Obtenemos el timestamp del bloque minado
  const block = await ethers.provider.getBlock(receipt.blockNumber);

  // Comprobamos que emitió el evento con los args correctos
  await expect(tx)
    .to.emit(escrow, "Cancelled")
    .withArgs(
      depositAmount, 
      block.timestamp
    );

  // Verificamos el estado del contrato
  expect(await escrow.isCancelled()).to.be.true;
  expect(await escrow.isApproved()).to.be.false;
});


  it("Should not allow double cancellation or approval", async function () {
    await escrow.connect(arbiter).cancel();
    await expect(escrow.connect(arbiter).approve()).to.be.revertedWith(
      "Escrow already completed"
    );
  });

  it("Should respect expiration time for approval", async function () {
    // Avanzar el tiempo en la red virtual
    await ethers.provider.send("evm_increaseTime", [durationSeconds + 1]);
    await ethers.provider.send("evm_mine"); // minar el bloque

    await expect(escrow.connect(arbiter).approve()).to.be.revertedWith(
      "Escrow has expired"
    );
  });

  it("getInfo() returns expected data", async function () {
    const info = await escrow.getInfo();
    expect(info._depositor).to.equal(depositor.address);
    expect(info._arbiter).to.equal(arbiter.address);
    expect(info._beneficiary).to.equal(beneficiary.address);
    expect(info._isApproved).to.be.false;
    expect(info._isCancelled).to.be.false;
  });
});