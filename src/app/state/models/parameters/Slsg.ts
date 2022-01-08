import * as Types from "stv-types";
import { ModelParameters } from "./ModelParameters";

export interface SlsgAgent {
    id: number;
    numOfLocalStates: number;
    numOfLocalActions: number;
    numOfLocalProps: number;
}

export interface SlsgProtocol {
    agentId: number;
    locStateId: number;
    locActId: number;
    state: "disabled" | "enabled" | "undefined";
}

export interface SlsgTransition {
    agentId: number;
    srcLocStateId: number;
    globActId: number;
    tgtLocStateId: number;
    state: "disabled" | "enabled" | "undefined";
}

export interface SlsgValuation {
    agentId: number;
    locStateId: number;
    locPropId: number;
    state: "disabled" | "enabled" | "undefined";
}

export interface SlsgPlainParameters extends Types.models.parameters.ModelParameters {
    type: "slsg";
    agents: SlsgAgent[];
    protocols: SlsgProtocol[];
    transitions: SlsgTransition[];
    valuations: SlsgValuation[];
    formula: string;
}

export class Slsg extends ModelParameters<SlsgPlainParameters> {
    
    protected _agents: SlsgAgent[] = [];
    get agents(): SlsgAgent[] { return this._agents; }
    set agents(agents: SlsgAgent[]) { this.setParameter("agents", agents); }
    
    protected _protocols: SlsgProtocol[] = [];
    get protocols(): SlsgProtocol[] { return this._protocols; }
    set protocols(protocols: SlsgProtocol[]) { this.setParameter("protocols", protocols); }
    
    protected _transitions: SlsgTransition[] = [];
    get transitions(): SlsgTransition[] { return this._transitions; }
    set transitions(transitions: SlsgTransition[]) { this.setParameter("transitions", transitions); }
    
    protected _valuations: SlsgValuation[] = [];
    get valuations(): SlsgValuation[] { return this._valuations; }
    set valuations(valuations: SlsgValuation[]) { this.setParameter("valuations", valuations); }
    
    protected _formula: string = "[E s1] [E s2] <s1, 0> <s2, 1> F (0.0 AND 1.0)";
    get formula(): string { return this._formula; }
    set formula(formula: string) { this.setParameter("formula", formula); }
    
    constructor() {
        super();
    }
    
    getPlainModelParameters(): SlsgPlainParameters {
        return {
            type: "slsg",
            agents: this.agents,
            protocols: this.protocols,
            transitions: this.transitions,
            valuations: this.valuations,
            formula: this.formula,
        };
    }
    
    areModelParametersValid(): boolean {
        if (!this.agents || !this.protocols || !this.transitions || !this.valuations || !this.formula) {
            return false;
        }
        if (this.agents.length === 0) {
            return false;
        }
        if (this.formula.length === 0) {
            return false;
        }
        return true;
    }
    
}
