"use client";

import { isNil } from "lodash";
import { images } from "~/public/images";
import { WalletType } from "~/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const window: any;

export const wallets: WalletType[] = [
    {
        name: "Eternl",
        image: images.eternl,
        version: "",
        enable: async function () {
            return window.cardano.eternl.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.eternl) {
                return await window.cardano.eternl.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined") {
                return !isNil(await window.cardano?.eternl);
            }
            return false;
        },
        downloadApi: "https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka",
    },
    {
        name: "Lace",
        version: "",
        image: images.lace,
        enable: async function () {
            return await window.cardano.lace.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.lace) {
                return await window.cardano.lace.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined") {
                return !isNil(await window.cardano?.lace);
            }
            return false;
        },
        downloadApi: "https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk",
    },
    {
        name: "Nami",
        version: "",
        image: images.nami,
        enable: async function () {
            return await window.cardano.nami.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.nami) {
                return await window.cardano.nami.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined") {
                return !isNil(await window.cardano?.nami);
            }
            return false;
        },
        downloadApi: "https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo",
    },
    {
        name: "Flint",
        version: "",
        image: images.flint,
        enable: async function () {
            return await window.cardano.flint.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.flint) {
                return await window.cardano.flint.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined") {
                return !isNil(await window.cardano?.flint);
            }
            return false;
        },
        downloadApi: "https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj",
    },

    {
        name: "Gero",
        version: "",
        image: images.gero,
        enable: async function () {
            return await window.cardano.gero.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.gero) {
                return await window.cardano.gero.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined" ) {
                return !isNil(await window.cardano?.gero);
            }
            return false;
        },
        downloadApi: "https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe",
    },
    {
        name: "Typhon",
        version: "",
        image: images.typhon,
        enable: async function () {
            return await window.cardano.typhon.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.typhon) {
                return await window.cardano.typhon.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined" ) {
                return !isNil(await window.cardano?.typhon);
            }
            return false;
        },
        downloadApi: "https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh",
    },
    {
        name: "Vespr",
        image: images.vespr,
        version: "",
        enable: async function () {
            return await window.cardano.vespr.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.vespr) {
                return await window.cardano.vespr.isEnabled();
            }
            return false;
        },

        isDownload: async function () {
            if (typeof window !== "undefined" ) {
                return !isNil(await window.cardano?.vespr);
            }
            return false;
        },
        downloadApi: "https://play.google.com/store/apps/details?id=art.nft_craze.gallery.main",
    },
    {
        name: "Yoroi",
        version: "",
        image: images.yoroi,
        enable: async function () {
            return await window.cardano.yoroi.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.yoroi) {
                return await window.cardano.yoroi.isEnabled();
            }
            return false;
        },
        isDownload: async function () {
            if (typeof window !== "undefined") {
                return !isNil(await window.cardano?.yoroi);
            }
            return false;
        },
        downloadApi: "https://chromewebstore.google.com/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb",
    },
    {
        name: "Nufi",
        version: "",
        image: images.nufi,
        enable: async function () {
            return await window.cardano.nufi.enable();
        },
        isEnable: async function () {
            if (typeof window !== "undefined" && window.cardano?.nufi) {
                return await window.cardano.nufi.isEnabled();
            }
            return false;
        },

        isDownload: async function () {
            if (typeof window !== "undefined") {
                return !isNil(await window.cardano?.nufi);
            }
            return false;
        },
        downloadApi: "https://chromewebstore.google.com/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca",
    },
];

export default wallets;
