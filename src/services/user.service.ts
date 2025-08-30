"use server";

import { isNil } from "lodash";
import { generateNonce } from "@meshsdk/core";
import { parseError } from "~/utils/error/parse-error";

export const getNonceAddress = async (address: string) => {
    try {
        if (isNil(address)) {
            throw new Error("Stake address is required");
        }

        if (!/^[a-z0-9_]+$/.test(address)) {
            throw new Error("Invalid address");
        }
        const nonce = generateNonce("Signin with Hydra Tipjar");
        return {
            data: nonce,
            result: true,
            message: "Nonce generated successfully",
        };
    } catch (e) {
        return {
            data: null,
            result: false,
            message: parseError(e),
        };
    }
};
