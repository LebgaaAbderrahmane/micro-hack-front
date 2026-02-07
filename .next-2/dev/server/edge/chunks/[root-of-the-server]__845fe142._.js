(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__845fe142._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Documents/GitHub/micro-hack-front/src/locals/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"Common":{"welcome":"Welcome","login":"Login","logout":"Logout","settings":"Settings","profile":"Profile"},"Auth":{"loginTitle":"Login to PortFlow","email":"Email","password":"Password","submit":"Sign In"},"Dashboard":{"overview":"Overview","fleet":"Fleet","bookings":"Bookings","management":"Booking Management","terminals":"Terminals","users":"Users","accessRestricted":"Access Restricted","pleaseLogin":"Please log in to access the Intelligent Logistics Access Control System.","goToLogin":"Go to Login","liveTerminalMatrix":"Live Terminal Matrix","geospatialOrchestration":"Real-time geospatial node orchestration","activeNodes":"{count} Active Nodes","searchPlaceholder":"Search system...","vesselThroughput":"Vessel Throughput","gateEfficiency":"Gate Efficiency"},"Settings":{"title":"System Settings","accountIntegrity":"Account Integrity","primaryEmail":"Primary Email","recoveryPhone":"Recovery Phone","systemShield":"System Shield","securityKeys":"Security Keys","mfa":"Multi-Factor Auth","activityLogs":"Activity Logs","preferenceHub":"Preference Hub","nodeNotifications":"Node Notifications","neuralInterface":"Neural Interface (Dark)","standardInterface":"Standard Interface (Light)","telemetryRegion":"Telemetry Region","dangerZone":"Danger Zone","resetTerminal":"Reset Terminal Matrix","terminateSession":"Terminate Session","editProfile":"Edit Profile","mfaEnabled":"MFA Enabled","mfaDisabled":"MFA Disabled","notifyUpdated":"Notify settings updated","switchedTo":"Switched to {mode} mode"},"Users":{"title":"Access Control","subtitle":"Orchestrate system permissions and audit logs","addUser":"Add Operator","username":"Username","email":"Email","password":"Password","create":"Create Operator Account","noUsers":"No users found in organization.","identity":"User Identity","accessLevel":"Access Level","org":"Associated Org","actions":"Actions","independent":"Independent","success":"Success","added":"Operator added successfully","error":"Error"},"Theme":{"light":"Light","dark":"Dark","system":"System","toggle":"Toggle Theme","switchLocale":"Switch to {language}"},"AI":{"welcome":"Hello! I'm your ILACS AI assistant. How can I help you manage your terminal access or fleet today?","placeholder":"Ask the assistant...","title":"ILACS Assistant","online":"AI Online","promptCapacity":"Capacity North?","promptMaintenance":"Truck Maintenance","promptNextSlot":"Next Slot?","queryCapacity":"Check capacity North","queryMaintenance":"Maintenance schedule","queryNextSlot":"Next available slot"},"Login":{"title":"Access Gateway","subtitle":"Secure node entry & identity verification","admin":"Port Admin","adminDesc":"System-level node orchestration","operator":"Terminal Op","operatorDesc":"Yard & berth management","carrier":"Carrier Portal","carrierDesc":"Fleet sync & slot reservation","footer":"Protected by ILACS Quantum Encryption Node A-14"},"Sidebar":{"dashboard":"Dashboard","bookings":"Bookings","fleet":"Fleet Status","terminals":"Terminal Yards","users":"User Identity","profile":"My Profile","settings":"System Settings","logout":"Logout"}});}),
"[project]/Documents/GitHub/micro-hack-front/src/locals/fr.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"Common":{"welcome":"Bienvenue","login":"Connexion","logout":"Déconnexion","settings":"Paramètres","profile":"Profil"},"Auth":{"loginTitle":"Connexion à PortFlow","email":"Email","password":"Mot de passe","submit":"Se connecter"},"Dashboard":{"overview":"Vue d'ensemble","fleet":"Flotte","bookings":"Réservations","management":"Gestion des Réservations","terminals":"Terminaux","users":"Utilisateurs","accessRestricted":"Accès restreint","pleaseLogin":"Veuillez vous connecter pour accéder au système de contrôle d'accès logistique intelligent.","goToLogin":"Aller à la connexion","liveTerminalMatrix":"Matrice de terminaux en direct","geospatialOrchestration":"Orchestration des nœuds géospatiaux en temps réel","activeNodes":"{count} Nœuds actifs","searchPlaceholder":"Rechercher dans le système...","vesselThroughput":"Débit des Navires","gateEfficiency":"Efficacité des Portes"},"Settings":{"title":"Paramètres Système","accountIntegrity":"Intégrité du Compte","primaryEmail":"Email Principal","recoveryPhone":"Téléphone de Récupération","systemShield":"Bouclier Système","securityKeys":"Clés de Sécurité","mfa":"Authentification Multi-Facteurs","activityLogs":"Journaux d'Activité","preferenceHub":"Centre de Préférences","nodeNotifications":"Notifications de Nœuds","neuralInterface":"Interface Neuronale (Sombre)","standardInterface":"Interface Standard (Claire)","telemetryRegion":"Région de Télémétrie","dangerZone":"Zone de Danger","resetTerminal":"Réinitialiser la Matrice Terminale","terminateSession":"Terminer la Session","editProfile":"Modifier le Profil","mfaEnabled":"MFA Activé","mfaDisabled":"MFA Désactivé","notifyUpdated":"Paramètres de notification mis à jour","switchedTo":"Passé en mode {mode}"},"Users":{"title":"Contrôle d'Accès","subtitle":"Orchestration des permissions système et journaux d'audit","addUser":"Ajouter un Opérateur","username":"Nom d'utilisateur","email":"Email","password":"Mot de passe","create":"Créer le Compte Opérateur","noUsers":"Aucun utilisateur trouvé dans l'organisation.","identity":"Identité Utilisateur","accessLevel":"Niveau d'Accès","org":"Organisation Associée","actions":"Actions","independent":"Indépendant","success":"Succès","added":"Opérateur ajouté avec succès","error":"Erreur"},"Theme":{"light":"Clair","dark":"Sombre","system":"Système","toggle":"Changer le Thème","switchLocale":"Passer à l'{language}"},"AI":{"welcome":"Bonjour ! Je suis votre assistant IA ILACS. Comment puis-je vous aider à gérer vos accès au terminal ou votre flotte aujourd'hui ?","placeholder":"Posez une question...","title":"Assistant ILACS","online":"IA en ligne","promptCapacity":"Capacité Nord ?","promptMaintenance":"Maintenance Camions","promptNextSlot":"Prochain Créneau ?","queryCapacity":"Vérifier la capacité Nord","queryMaintenance":"Planning de maintenance","queryNextSlot":"Prochain créneau disponible"},"Login":{"title":"Portail d'Accès","subtitle":"Entrée sécurisée et vérification d'identité","admin":"Port Admin","adminDesc":"Orchestration système de haut niveau","operator":"Opérateur Terminal","operatorDesc":"Gestion de cour et de quai","carrier":"Portail Carrier","carrierDesc":"Synchro flotte et réservation de créneaux","footer":"Protégé par le nœud de cryptage quantique ILACS A-14"},"Sidebar":{"dashboard":"Tableau de bord","bookings":"Réservations","fleet":"État de la flotte","terminals":"Terminaux","users":"Identité Utilisateurs","profile":"Mon Profil","settings":"Paramètres Système","logout":"Déconnexion"}});}),
"[project]/Documents/GitHub/micro-hack-front/src/i18n/request.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/next-intl/dist/esm/development/server/react-server/getRequestConfig.js [middleware-edge] (ecmascript) <export default as getRequestConfig>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/src/i18n/routing.ts [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__["getRequestConfig"])(async ({ requestLocale })=>{
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;
    // Ensure that a valid locale is used
    if (!locale || !__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].locales.includes(locale)) {
        locale = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].defaultLocale;
    }
    return {
        locale,
        messages: (await __turbopack_context__.f({
            "../locals/en.json": {
                id: ()=>"[project]/Documents/GitHub/micro-hack-front/src/locals/en.json (json)",
                module: ()=>Promise.resolve().then(()=>__turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/src/locals/en.json (json)"))
            },
            "../locals/fr.json": {
                id: ()=>"[project]/Documents/GitHub/micro-hack-front/src/locals/fr.json (json)",
                module: ()=>Promise.resolve().then(()=>__turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/src/locals/fr.json (json)"))
            }
        }).import(`../locals/${locale}.json`)).default
    };
});
}),
"[project]/Documents/GitHub/micro-hack-front/src/i18n/routing.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "getPathname",
    ()=>getPathname,
    "redirect",
    ()=>redirect,
    "routing",
    ()=>routing,
    "usePathname",
    ()=>usePathname,
    "useRouter",
    ()=>useRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [middleware-edge] (ecmascript) <export default as defineRouting>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/next-intl/dist/esm/development/navigation/react-server/createNavigation.js [middleware-edge] (ecmascript) <export default as createNavigation>");
;
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    // A list of all locales that are supported
    locales: [
        'en',
        'fr'
    ],
    // Used when no locale matches
    defaultLocale: 'en'
});
const { Link, redirect, usePathname, useRouter, getPathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(routing);
}),
"[project]/Documents/GitHub/micro-hack-front/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/src/i18n/routing.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/micro-hack-front/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
;
;
;
;
async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    // 1. Handle i18n routing first
    const handleI18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"]);
    let response = handleI18n(request);
    // 2. Setup Supabase client
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "http://127.0.0.1:54321"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"), {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options })=>{
                    request.cookies.set(name, value);
                });
                // Re-generate response to include fresh cookies if needed
                // Some versions of next-intl middleware might benefit from this
                response = handleI18n(request);
                cookiesToSet.forEach(({ name, value, options })=>{
                    response.cookies.set(name, value, options);
                });
            }
        }
    });
    // 3. Get user session (refreshes if needed)
    const { data: { user } } = await supabase.auth.getUser();
    // Define public paths (login, register, and auth callback)
    const isAuthPage = /\/(login|register|auth\/callback)/.test(pathname);
    // 4. Protection Logic
    if (!user && !isAuthPage) {
        // Redirect unauthenticated users to login
        const locale = pathname.split('/')[1];
        const finalLocale = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].locales.includes(locale) ? locale : __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].defaultLocale;
        const redirectUrl = new URL(`/${finalLocale}/login`, request.url);
        const redirectResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        // Crucial: Copy cookies and headers from the base modified response (e.g. session tokens, locale headers)
        response.cookies.getAll().forEach((cookie)=>{
            redirectResponse.cookies.set(cookie);
        });
        response.headers.forEach((value, key)=>{
            redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
    }
    if (user) {
        // Prevent authenticated users from accessing login/register
        if (isAuthPage && !pathname.includes('auth/callback')) {
            const locale = pathname.split('/')[1];
            const finalLocale = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].locales.includes(locale) ? locale : __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].defaultLocale;
            const redirectUrl = new URL(`/${finalLocale}`, request.url);
            const redirectResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
            response.cookies.getAll().forEach((cookie)=>{
                redirectResponse.cookies.set(cookie);
            });
            response.headers.forEach((value, key)=>{
                redirectResponse.headers.set(key, value);
            });
            return redirectResponse;
        }
        // Role-based protection
        const isAdminRoute = /\/(terminals|users)/.test(pathname);
        if (isAdminRoute) {
            const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
            if (profile?.role !== "ADMIN") {
                console.warn(`[Middleware] Non-admin user ${user.id} attempted to access ${pathname}`);
                const locale = pathname.split('/')[1];
                const finalLocale = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].locales.includes(locale) ? locale : __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].defaultLocale;
                const redirectUrl = new URL(`/${finalLocale}`, request.url);
                const redirectResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$micro$2d$hack$2d$front$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
                response.cookies.getAll().forEach((cookie)=>{
                    redirectResponse.cookies.set(cookie);
                });
                response.headers.forEach((value, key)=>{
                    redirectResponse.headers.set(key, value);
                });
                return redirectResponse;
            }
        }
    }
    return response;
}
const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__845fe142._.js.map