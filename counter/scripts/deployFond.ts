import { toNano } from '@ton/core';
import { Fond } from '../wrappers/Fond';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const fond = provider.open(await Fond.fromInit());

    await fond.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(fond.address);

    // run methods on `fond`
}
