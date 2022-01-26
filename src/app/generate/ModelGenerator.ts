import { SlsgModals } from "../modals/SlsgModals";
import * as state from "../state";
import { Slsg } from "../state/models";

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
    
}
