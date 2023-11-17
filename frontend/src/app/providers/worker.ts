import * as aleoSDK from "@aleohq/sdk";

onmessage = (async (event) => {
    try {
        console.log(event.data)

        const {
            nfcData,
            aleo
        } = event.data.args;

        const keyProvider = new aleoSDK.AleoKeyProvider();
        keyProvider.useCache(true);

        const account = new aleoSDK.Account({
            privateKey: aleo.privateKey
        });

        const networkClient = new aleoSDK.AleoNetworkClient("https://api.explorer.aleo.org/v1");
        const recordProvider = new aleoSDK.NetworkRecordProvider(account, networkClient);

        const programManager = new aleoSDK.ProgramManager(
            "https://api.explorer.aleo.org/v1",
            keyProvider,
            recordProvider
        );
        programManager.setAccount(account);

        const functionName = "update_score";
        const keySearchParams = {
            cacheKey: `aleo_nfc_chip_v2.aleo:${functionName}`,
        };

        const txId = await programManager.execute(
            "aleo_nfc_chip_v2.aleo",
            'register',
            1,
            false,
            [
                `{finger_print: ${nfcData.id}u128, id: ${nfcData.id}u128, kind: 1u128}`,
                aleo?.address,
            ],
        );
        
        console.log("🚀 ~ updateScore ~ txId:", txId);

        if (txId instanceof Error) throw txId;

        const message = {
            id: event.data.id,
            data: txId,
        };

        postMessage(message);
    } catch (error) {
        console.error("Worker Error:", error);
    }
});