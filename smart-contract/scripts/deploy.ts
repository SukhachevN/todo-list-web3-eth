import { ethers } from 'hardhat';

async function main() {
    const TodoNFT = await ethers.getContractFactory('TodoNFT');
    const TodoList = await ethers.getContractFactory('TodoList');

    const todoNFT = await TodoNFT.deploy();

    const todoList = await TodoList.deploy(todoNFT.address);

    console.log(todoNFT.address);
    console.log(todoList.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
