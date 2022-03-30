import { SlsgAgent, SlsgProtocol, SlsgTransition, SlsgValuation } from "src/app/state/models/parameters";
import { ModelGenerator } from "../ModelGenerator";

export interface SlsgObjectExample {
    type: "object";
    name: string;
    agents: SlsgAgent[];
    protocols: SlsgProtocol[];
    transitions: SlsgTransition[];
    valuations: SlsgValuation[];
    formula: string;
}

export interface SlsgStringExample {
    type: "string";
    name: string;
    modelStr: string;
}

export type SlsgExample = SlsgObjectExample | SlsgStringExample;

export function convertStringExampleToObjectExample(stringExample: SlsgStringExample): SlsgObjectExample | null {
    const model = ModelGenerator.parseModel(stringExample.modelStr);
    if (!model) {
        return null;
    }
    return {
        agents: model.agents,
        formula: model.formula,
        name: stringExample.name,
        protocols: model.protocols,
        transitions: model.transitions,
        type: "object",
        valuations: model.valuations,
    };
}

export const SlsgExamples: { [id: string]: SlsgExample } = {
    "slsg": {
        type: "object",
        name: "Custom SLSG",
        agents: [],
        protocols: [],
        transitions: [],
        valuations: [],
        formula: "[E s1] [E s2] <s1, 0> <s2, 1> F (0.0 AND 1.0)",
    },
    "mcmas-kr21": {
        type: "string",
        name: "MCMAS KR21",
        modelStr: `p cnf 1 1
1 0
c przyklad z pracy KR21
c kagent agentId numOfLocalStates numOfLocActions numOfLocalProps
kagent 0 3 2 1
kagent 1 2 2 1
c
c prop0=out, prop1=in, prop2=collision
c kval      +/-     agentId     locStateId      locPropId
kval - 0 0 0
kval + 0 1 0
kval - 0 2 0
kval - 1 0 0
kval + 1 1 0
c
c p to 0.0, q to 1.0
c
c kprot     +/-     agentId     locStateId  locActId
kprot + 0 0 0
kprot - 0 0 1
kprot + 0 1 0
kprot - 0 1 1
kprot + 0 2 0
kprot + 0 2 1
kprot + 1 0 0
kprot + 1 0 1
kprot + 1 1 1
kprot - 1 1 0
c
c
c ktrans    +/-     agentId     srcLocStateId   globActId   tgtLocStateId
ktrans + 0 0 0 1
ktrans + 0 0 1 2
ktrans + 0 2 2 0
ktrans + 0 1 0 2
ktrans + 0 1 1 2
ktrans + 0 2 0 1
ktrans + 0 2 1 1
ktrans + 0 2 3 1
ktrans + 1 0 0 0
ktrans + 1 0 2 0
ktrans + 1 0 1 1
ktrans + 1 0 3 1
ktrans + 1 1 1 1
ktrans + 1 1 3 1
c
c
c
c na razie problem z agniezdzeniem prop -1 kslsg [E s1] [E s2] <s1, 0> <s2, 1> F [E s1] [E s2] <s1, 0> <s2, 1> F (0.1 & (! 1.1 & ! 1.0))
kslsg [A s1] [A s2] <s1, 0> <s2, 1> ( !0.0 &  !1.0) X X ( 0.0 &  1.0)`,
    },
    "example1": {
        type: "object",
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
