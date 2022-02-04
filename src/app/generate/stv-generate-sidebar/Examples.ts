import { SlsgAgent, SlsgProtocol, SlsgTransition, SlsgValuation } from "src/app/state/models/parameters";

export interface SlsgExample {
    name: string;
    agents: SlsgAgent[];
    protocols: SlsgProtocol[];
    transitions: SlsgTransition[];
    valuations: SlsgValuation[];
    formula: string;
}

export const SlsgExamples: { [id: string]: SlsgExample } = {
    "slsg": {
        name: "Custom SLSG",
        agents: [],
        protocols: [],
        transitions: [],
        valuations: [],
        formula: "[E s1] [E s2] <s1, 0> <s2, 1> F (0.0 AND 1.0)",
    },
    "example1": {
        name: "Example 1",
        agents: [
            { id: 0, numOfLocalStates: 3, numOfLocalActions: 2, numOfLocalProps: 1 },
            { id: 1, numOfLocalStates: 2, numOfLocalActions: 2, numOfLocalProps: 1 },
        ],
        protocols: [
            { locStateId: 2, agentId: 0, locActId: 1, state: "enabled" },
            { locStateId: 1, agentId: 0, locActId: 0, state: "disabled" },
        ],
        transitions: [
            { srcLocStateId: 2, tgtLocStateId: 0, agentId: 0, globActId: 1, state: "disabled" },
            { srcLocStateId: 0, tgtLocStateId: 2, agentId: 0, globActId: 2, state: "enabled" },
        ],
        valuations: [
            { locStateId: 0, agentId: 0, locPropId: 0, state: "enabled" },
            { locStateId: 2, agentId: 0, locPropId: 1, state: "disabled" },
        ],
        formula: "qwoijkdgnfdfg",
    },
};
