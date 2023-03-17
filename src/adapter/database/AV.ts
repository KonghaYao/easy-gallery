import AV from "leancloud-storage";

export const { Query, User } = AV;
AV.init({
    appId: "AEec4v7UyZ3TUZpUUowVtyn9-MdYXbMMI",
    appKey: "TATFGl08GHDskHO1NYFHbAuh",
    serverURL: "https://close-rook-48.deno.dev",
});
export { AV };
