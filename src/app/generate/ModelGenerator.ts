import { SlsgModals } from "../modals/SlsgModals";
import * as state from "../state";
import { Slsg } from "../state/models";
import { SlsgPlainParameters } from "../state/models/parameters";

type ItemState = "disabled" | "enabled" | "undefined";

export class ModelGenerator {
    
    constructor(
        protected model: Slsg,
        protected nodeClickCallback: (agentId: number, locStateId: number) => void,
        protected edgeClickCallback: (agentId: number, srcLocStateId: number, tgtLocStateId: number) => void,
    ) {
    }
    
    generateLocalModels(): void {
        const graphs: state.models.graph.Graph[] = [];
        const names: string[] = [];
        for (let agentId = 0; agentId < this.model.parameters.agents.length; ++agentId) {
            const res = this.generateLocalModel(agentId);
            names.push(res[0]);
            graphs.push(res[1]);
        }
        this.model.localModels = graphs;
        this.model.localModelNames = names;
    }
    
    protected generateLocalModel(agentId: number): [string, state.models.graph.Graph] {
        const agent = this.model.parameters.agents[agentId];
        const nodes: state.models.graph.Node[] = [];
        const edges: state.models.graph.Link[] = [];
        for (let i = 0; i < agent.numOfLocalStates; ++i) {
            nodes.push({
                id: i,
                bgn: i === 0 ? 1 : 0,
                win: 0,
                T: { "id": i },
            });
        }
        for (let i = 0; i < nodes.length; ++i) {
            for (let j = 0; j < nodes.length; ++j) {
                edges.push({
                    id: edges.length,
                    source: i,
                    target: j,
                    T: [],
                });
            }
        }
        const graph: state.models.graph.Graph = {
            id: `slsg-agent-${agentId}`,
            nodeClick: (id: number) => {
                const node = nodes[id];
                this.nodeClickCallback(agentId, node.id);
            },
            edgeClick: (id: number) => {
                const edge = edges[id];
                this.edgeClickCallback(agentId, edge.source, edge.target);
            },
            nodes: nodes,
            links: edges,
        };
        return [
            `Agent ${agentId}`,
            graph,
        ];
    }
    
    static async checkContradictions(model: Slsg, showContradictionModals: boolean = true, showDuplicateEntryModals: boolean = true): Promise<{ hasContradictions: boolean, hasDuplicateEntries: boolean }> {
        let hasContradictions = false;
        let hasDuplicateEntries = false;
        const { protocols, transitions, valuations } = model.parameters;
        for (let i = 0; i < protocols.length; ++i) {
            const p0 = protocols[i];
            for (let j = i + 1; j < protocols.length; ++j) {
                const p1 = protocols[j];
                if (p0.agentId === p1.agentId && p0.locActId === p1.locActId && p0.locStateId === p1.locStateId) {
                    const entryStr = `locStId=${p0.locStateId}, agId=${p0.agentId}, locActId=${p0.locActId}`;
                    if (p0.state === p1.state) {
                        hasDuplicateEntries = true;
                        if (showDuplicateEntryModals) {
                            await this.showDuplicateEntryWarning(entryStr);
                        }
                    }
                    else {
                        hasContradictions = true;
                        if (showContradictionModals) {
                            await this.showContradictionError(entryStr);
                        }
                    }
                    break;
                }
            }
        }
        for (let i = 0; i < transitions.length; ++i) {
            const t0 = transitions[i];
            for (let j = i + 1; j < transitions.length; ++j) {
                const t1 = transitions[j];
                if (t0.agentId === t1.agentId && t0.srcLocStateId === t1.srcLocStateId && t0.tgtLocStateId === t1.tgtLocStateId && t0.globActId === t1.globActId) {
                    const entryStr = `src=${t0.srcLocStateId}, tgt=${t0.tgtLocStateId}, agId=${t0.agentId}, globActId=${t0.globActId}`;
                    if (t0.state === t1.state) {
                        hasDuplicateEntries = true;
                        if (showDuplicateEntryModals) {
                            await this.showDuplicateEntryWarning(entryStr);
                        }
                    }
                    else {
                        hasContradictions = true;
                        if (showContradictionModals) {
                            await this.showContradictionError(entryStr);
                        }
                    }
                    break;
                }
            }
        }
        for (let i = 0; i < valuations.length; ++i) {
            const v0 = valuations[i];
            for (let j = i + 1; j < valuations.length; ++j) {
                const v1 = valuations[j];
                if (v0.agentId === v1.agentId && v0.locStateId === v1.locStateId && v0.locPropId === v1.locPropId) {
                    const entryStr = `locStId=${v0.locStateId}, agId=${v0.agentId}, locPropId=${v0.locPropId}`;
                    if (v0.state === v1.state) {
                        hasDuplicateEntries = true;
                        if (showDuplicateEntryModals) {
                            await this.showDuplicateEntryWarning(entryStr);
                        }
                    }
                    else {
                        hasContradictions = true;
                        if (showContradictionModals) {
                            await this.showContradictionError(entryStr);
                        }
                    }
                    break;
                }
            }
        }
        return { hasContradictions, hasDuplicateEntries };
    }
    
    private static async showDuplicateEntryWarning(entryStr: string): Promise<void> {
        await SlsgModals.showDuplicateEntryWarning(entryStr);
    }
    
    private static async showContradictionError(entryStr: string): Promise<void> {
        await SlsgModals.showContradictionError(entryStr);
    }
    
    static async getModelText(appState: state.AppState): Promise<string | null> {
        const action = appState.action as state.actions.Generate;
        const model = action.model as state.models.Slsg;
        const res = await ModelGenerator.checkContradictions(model, true, false);
        if (res.hasContradictions) {
            return null;
        }
        const params = model.parameters;
        const lines: string[] = [];
        
        lines.push("p cnf 1 1");
        lines.push("1 0");
        lines.push("");
        
        for (const agent of params.agents) {
            lines.push(`kagent ${agent.id} ${agent.numOfLocalStates} ${agent.numOfLocalActions} ${agent.numOfLocalProps}`);
        }
        lines.push("");
        
        for (const protocol of params.protocols) {
            if (protocol.state === "undefined") {
                continue;
            }
            lines.push(`kprot ${protocol.state === "enabled" ? "+" : "-"} ${protocol.agentId} ${protocol.locStateId} ${protocol.locActId}`);
        }
        lines.push("");
        
        for (const transition of params.transitions) {
            if (transition.state === "undefined") {
                continue;
            }
            lines.push(`ktrans ${transition.state === "enabled" ? "+" : "-"} ${transition.agentId} ${transition.srcLocStateId} ${transition.globActId} ${transition.tgtLocStateId}`);
        }
        lines.push("");
        
        for (const valuation of params.valuations) {
            if (valuation.state === "undefined") {
                continue;
            }
            lines.push(`kval ${valuation.state === "enabled" ? "+" : "-"} ${valuation.agentId} ${valuation.locStateId} ${valuation.locPropId}`);
        }
        lines.push("");
        
        lines.push(`kslsg ${params.formula}`);
        lines.push("");
        
        const modelStr = lines.join("\n");
        return modelStr;
    }
    
    static parseModel(modelStr: string): SlsgPlainParameters | null {
        modelStr = modelStr.replace(/\r/g, "");
        const lines = modelStr
            .split("\n")
            .map(line => line.trim().replace(/\s+/g, " "))
            .filter(line => line.length > 0);
        let agents: state.models.parameters.SlsgAgent[] = [];
        let protocols: state.models.parameters.SlsgProtocol[] = [];
        let transitions: state.models.parameters.SlsgTransition[] = [];
        let valuations: state.models.parameters.SlsgValuation[] = [];
        let formula: string = "";
        for (const line of lines) {
            if (line.startsWith("kagent")) {
                const [, agentId, numOfLocalStates, numOfLocalActions, numOfLocalProps] = line.split(" ").map(x => parseInt(x));
                agents.push({ id: agentId, numOfLocalStates, numOfLocalActions, numOfLocalProps });
            }
            else if (line.startsWith("kprot")) {
                const [, state, agentId, locStateId, locActId] = line.split(" ").map(x => this.parseIntOrState(x)) as [any, ItemState, number, number, number];
                protocols.push({ state, agentId, locStateId, locActId });
            }
            else if (line.startsWith("ktrans")) {
                const [, state, agentId, srcLocStateId, globActId, tgtLocStateId] = line.split(" ").map(x => this.parseIntOrState(x)) as [any, ItemState, number, number, number, number];
                transitions.push({ state, agentId, srcLocStateId, globActId, tgtLocStateId });
            }
            else if (line.startsWith("kval")) {
                const [, state, agentId, locStateId, locPropId] = line.split(" ").map(x => this.parseIntOrState(x)) as [any, ItemState, number, number, number];
                valuations.push({ state, agentId, locStateId, locPropId });
            }
            else if (line.startsWith("kslsg")) {
                formula = line.substr("kslsg ".length)
            }
        }
        return {
            type: "slsg",
            agents,
            protocols,
            transitions,
            valuations,
            formula,
        };
    }
    
    static parseAndLoadModel(appState: state.AppState, modelStr: string): void {
        const parsed = this.parseModel(modelStr);
        if (!parsed) {
            return;
        }
        const action = appState.action as state.actions.Generate;
        const model = action.model as state.models.Slsg;
        const params = model.parameters;
        params.agents.splice(0, params.agents.length, ...JSON.parse(JSON.stringify(parsed.agents)));
        params.protocols.splice(0, params.protocols.length, ...JSON.parse(JSON.stringify(parsed.protocols)));
        params.transitions.splice(0, params.transitions.length, ...JSON.parse(JSON.stringify(parsed.transitions)));
        params.valuations.splice(0, params.valuations.length, ...JSON.parse(JSON.stringify(parsed.valuations)));
        params.formula = parsed.formula;
    }
    
    static modelStrFromJsonStr(json: string): string {
        const data = JSON.parse(json);
        const modelStr = data.modelStr.replace(/\{\{NL\}\}/g, "\n");
        return modelStr;
    }
    
    private static parseIntOrState(text: string): number | ItemState {
        if (text === "+") {
            return "enabled";
        }
        if (text === "-") {
            return "disabled";
        }
        return parseInt(text);
    }
    
}
