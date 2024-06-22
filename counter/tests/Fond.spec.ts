import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Fond } from '../wrappers/Fond';
import '@ton/test-utils';

describe('Fond', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fond: SandboxContract<Fond>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        fond = blockchain.openContract(await Fond.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await fond.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fond.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fond are ready to use
    });
});
