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
    
}
