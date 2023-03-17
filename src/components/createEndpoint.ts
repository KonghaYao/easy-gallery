import type { Atom } from "@cn-ui/use";
export const createEndpoint = <T>(fn: (input: any) => T) => {
    let api = null as any as T;
    return (init = false) => {
        if (init) {
            api = fn(init);
        }
        return api;
    };
};
