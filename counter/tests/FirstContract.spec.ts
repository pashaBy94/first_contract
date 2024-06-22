import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { FirstContract } from '../wrappers/FirstContract';
import '@ton/test-utils';
import { BulkAdder } from '../wrappers/BulkAdder';

describe('FirstContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let firstContract: SandboxContract<FirstContract>;
    let bulkContract: SandboxContract<BulkAdder>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        firstContract = blockchain.openContract(await FirstContract.fromInit(12981424n));
        bulkContract = blockchain.openContract(await BulkAdder.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResultFirst = await firstContract.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        expect(deployResultFirst.transactions).toHaveTransaction({
            from: deployer.address,
            to: firstContract.address,
            deploy: true,
            success: true,
        });
        const deployResultBulk = await bulkContract.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'Deploy',
                queryId: 1n,
            },
        );
        expect(deployResultBulk.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should increnment to target', async () => {
        const target = 3n;
        const increaseResult = await bulkContract.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            {
                $$type: 'Query',
                target,
                recipient: firstContract.address,
            },
        );
        const count = await firstContract.getCounter();

        expect(count).toEqual(target);
    });
});
