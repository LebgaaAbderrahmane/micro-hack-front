(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/micro-hack-front/src/mocks/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initMocks",
    ()=>initMocks
]);
async function initMocks() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { worker } = await __turbopack_context__.A("[project]/Documents/GitHub/micro-hack-front/src/mocks/browser.ts [app-client] (ecmascript, async loader)");
        await worker.start({
            onUnhandledRequest: "bypass"
        });
    }
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_GitHub_micro-hack-front_src_mocks_index_ts_c96e0d84._.js.map