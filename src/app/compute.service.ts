import * as Types from "stv-types";
import { Injectable } from "@angular/core";
import * as state from "./state";
import { ErrorModals } from "./modals/ErrorModals";
import { Graph } from "./state/models/graph";

interface SuccessResponse {
    status: "success";
    data: string;
}

interface ErrorResponse {
    status: "error";
    error: string;
}

type Response = SuccessResponse | ErrorResponse;

type RawApproximationResult = ["0" | "1", number, string];

type RawDominoDfsResult = ["0" | "1", string];

export type VerificationEngine = "mcmas" | "stv";

interface RawBisimulationCheckingResult {
    bisimulation_result: boolean;
    coalition: string[];
    mapping: Array<[number[], number[]]>;
    model1: string;
    model2: string;
}

export interface ApproximationDoesNotHaveToHoldResult {
    type: "approximationDoesNotHaveToHold";
    numStatesWhereFormulaHolds: number;
    strategyObjectiveString: string;
}

export interface ApproximationDoesNotHoldResult {
    type: "approximationDoesNotHold";
    numStatesWhereFormulaMightHold: number;
    strategyObjectiveString: string;
}

export interface ApproximationHoldsResult {
    type: "approximationHolds";
    numStatesWhereFormulaHolds: number;
    strategyObjectiveString: string;
}

export interface ApproximationMightHoldResult {
    type: "approximationMightHold";
    numStatesWhereFormulaMightHold: number;
    strategyObjectiveString: string;
}

export type ApproximationResult = ApproximationDoesNotHaveToHoldResult | ApproximationDoesNotHoldResult | ApproximationHoldsResult | ApproximationMightHoldResult;

export interface DominoDfsResult {
    strategyFound: boolean;
    strategyObjectiveString: string;
}

export interface BisimulationCheckingResult {
    modelsAreABisimilar: boolean;
    coalition: string[];
}


export interface RawSlsgNode {
    id: number;
    label: string;
    props: (number| string)[];
    bgn?: number;
    win?: number;
}
export interface RawSlsgLink {
    id: number;
    source: number;
    target: number;
    label: string;
    props: (number| string)[];
}
export interface RawSlsgGraph {
    label: string;
    links: RawSlsgLink[];
    nodes: RawSlsgNode[];
}
export interface SlsgInfo {
    memUsed: number;
    memUsedPeak: number;
    sgsatCpuTime: number;
    solvingTime: number;
    status: "SAT" | "UNSAT" | "UNKNOWN" | "ERROR";
    wallTimeSec: number;
    message?: string;
}
export interface RawSlsgModel {
    info: SlsgInfo;
    models: RawSlsgGraph[];
}
export interface SlsgModel {
    info: SlsgInfo;
    globalModel: Graph | null;
    localModels: Graph[];
    localModelNames: string[];
}

@Injectable({
    providedIn: "root",
})
export class ComputeService {
    
    constructor() {}
    
    async generateSlsgModel(modelStr: string, engine: VerificationEngine, preparedResponseJson: string | null = null): Promise<{ slsgModel: SlsgModel, json: string } | null> {
        const { response: raw, json } = (preparedResponseJson ? { response: JSON.parse(preparedResponseJson), json: preparedResponseJson } : (await this.requestSlsg(modelStr, engine))) as { response: RawSlsgModel, json: string };
        try {
            if (raw.info.status === "ERROR") {
                throw raw.info.message;
            }
        }
        catch (e) {
            ErrorModals.showForServerError(`${e}`);
            return null;
        }
        const globalModel = raw.models.find(x => x.label === "Global model");
        const model: SlsgModel = {
            info: { ...raw.info },
            globalModel: globalModel ? this.convertRawSlsgGraphToGraph(globalModel, "slsg-globalModel") : null,
            localModels: raw.models.filter(x => x.label !== "Global model").map((x, idx) => this.convertRawSlsgGraphToGraph(x, `slsg-localModel-${idx}`)),
            localModelNames: raw.models.filter(x => x.label !== "Global model").map(x => x.label) as string[],
        };
        return { slsgModel: model, json: json };
    }
    
    private convertRawSlsgGraphToGraph(g0: RawSlsgGraph, graphId: string): Graph {
        return {
            id: graphId,
            links: g0.links.map(x => ({
                id: x.id,
                source: x.source,
                target: x.target,
                T: [x.label, ...(x.props ? x.props.map(y => y.toString()) : [])],
                // labelStr: `{ ${x.id}${x.label ? ", " + x.label : ""}${(x.props && x.props.length > 0 ? ["", ...x.props.map(y => "p" + y.toString())] : []).join(", ")} }`,
            })),
            nodes: g0.nodes.map(x => ({
                id: x.id,
                bgn: x.bgn ? 1 : 0,
                win: x.win ? 1 : 0,
                T: [x.label, ...(x.props ? x.props.map(y => y.toString()) : [])],
                labelStr: `{ ${x.id}${x.label ? ", " + x.label : ""}${(x.props && x.props.length > 0 ? ["", ...x.props.map(y => "p" + y.toString())] : []).join(", ")} }`,
            })),
        };
    }
    
    async generateModel(model: state.models.SomeModel, reduced: boolean): Promise<void> {
        const modelParameters: Types.models.parameters.SomeParameters = <any>model.parameters.getPlainModelParameters();
        const action: Types.actions.ModelGeneration = {
            type: "modelGeneration",
            modelParameters: modelParameters,
            reduced: reduced,
        };
        const result = await this.requestCompute<Types.actions.ModelGeneration, any>(action);
        if (result.nodes && result.links) {
            model.globalModel = result;
        }
        else {
            if (result.formula) {
                model.formula = result.formula;
            }
            if (result.globalModel && !reduced) {
                model.globalModel = JSON.parse(result.globalModel);
            }
            if (result.reducedModel) {
                model.reducedModel = JSON.parse(result.reducedModel);
            }
            if (result.localModels) {
                model.localModels = result.localModels.map((localModelStr: string) => JSON.parse(localModelStr));
            }
            if (result.localModelNames) {
                model.localModelNames = result.localModelNames;
            }
        }
    }
    
    async verifyModelUsingLowerApproximation(model: state.models.SomeModel, reduced: boolean): Promise<ApproximationResult> {
        const modelParameters: Types.models.parameters.SomeParameters = <any>model.parameters.getPlainModelParameters();
        const action: Types.actions.LowerApproximation = {
            type: "lowerApproximation",
            modelParameters: modelParameters,
            reduced: reduced,
        };
        const rawResult = await this.requestCompute<Types.actions.LowerApproximation, RawApproximationResult>(action);
        if (rawResult[0] === "1") {
            return <ApproximationHoldsResult>{
                type: "approximationHolds",
                numStatesWhereFormulaHolds: rawResult[1],
                strategyObjectiveString: rawResult[2],
            };
        }
        else if (rawResult[0] === "0") {
            return <ApproximationDoesNotHaveToHoldResult>{
                type: "approximationDoesNotHaveToHold",
                numStatesWhereFormulaHolds: rawResult[1],
                strategyObjectiveString: rawResult[2],
            };
        }
        else {
            throw new Error("Unexpected approximation result");
        }
    }
    
    async verifyModelUsingUpperApproximation(model: state.models.SomeModel, reduced: boolean): Promise<ApproximationResult> {
        const modelParameters: Types.models.parameters.SomeParameters = <any>model.parameters.getPlainModelParameters();
        const action: Types.actions.UpperApproximation = {
            type: "upperApproximation",
            modelParameters: modelParameters,
            reduced: reduced,
        };
        const rawResult = await this.requestCompute<Types.actions.UpperApproximation, RawApproximationResult>(action);
        if (rawResult[0] === "1") {
            return <ApproximationMightHoldResult>{
                type: "approximationMightHold",
                numStatesWhereFormulaMightHold: rawResult[1],
                strategyObjectiveString: rawResult[2],
            };
        }
        else if (rawResult[0] === "0") {
            return <ApproximationDoesNotHoldResult>{
                type: "approximationDoesNotHold",
                numStatesWhereFormulaMightHold: rawResult[1],
                strategyObjectiveString: rawResult[2],
            };
        }
        else {
            throw new Error("Unexpected approximation result");
        }
    }
    
    async verifyModelUsingDominoDfs(model: state.models.SomeModel, reduced: boolean, heuristic: Types.actions.DominoDfsHeuristic): Promise<DominoDfsResult> {
        const modelParameters: Types.models.parameters.SomeParameters = <any>model.parameters.getPlainModelParameters();
        const action: Types.actions.DominoDfs = {
            type: "dominoDfs",
            modelParameters: modelParameters,
            reduced: reduced,
            heuristic: heuristic,
        };
        const rawResult = await this.requestCompute<Types.actions.DominoDfs, RawDominoDfsResult>(action);
        return this.convertRawResultToDominoDfsResult(rawResult);
    }
    
    async checkBisimulation(model1: state.models.File, model2: state.models.File, specificationModel: state.models.parameters.File): Promise<BisimulationCheckingResult> {
        const model1Parameters: Types.models.parameters.File = model1.parameters.getPlainModelParameters();
        const model2Parameters: Types.models.parameters.File = model2.parameters.getPlainModelParameters();
        const specification: Types.models.parameters.File = specificationModel.getPlainModelParameters();
        const action: Types.actions.BisimulationChecking = {
            type: "bisimulationChecking",
            model1Parameters: model1Parameters,
            model2Parameters: model2Parameters,
            specification: specification,
        };
        const rawResult = await this.requestCompute<Types.actions.BisimulationChecking, RawBisimulationCheckingResult>(action);
        return {
            modelsAreABisimilar: rawResult.bisimulation_result,
            coalition: rawResult.coalition,
        };
    }
    
    private convertRawResultToDominoDfsResult(result: RawDominoDfsResult): DominoDfsResult {
        return {
            strategyFound: result[0] === "1",
            strategyObjectiveString: result[1],
        };
    }
    
    async requestCompute<TRequest extends Types.actions.Action, TResponse>(requestObject: TRequest): Promise<TResponse> {
        return (await this.requestJson<any, TResponse>("POST", "compute", requestObject)).response;
    }
    
    async requestSlsg<TResponse>(modelStr: string, engine: VerificationEngine): Promise<{ response: TResponse, json: string }> {
        return (await this.requestJson<any, TResponse>("POST", "slsg", { modelStr, engine }));
    }
    
    async requestComputeLimitsConfig(): Promise<Types.config.Config> {
        return (await this.requestJson<any, Types.config.Config>("GET", "computation-limits-config")).response;
    }
    
    async requestJson<TRequest, TResponse>(method: "GET"| "POST", path: string, requestObject?: TRequest): Promise<{ response: TResponse, json: string }> {
        const response = await fetch(
            `/${path}`,
            {
                method: method,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: requestObject ? JSON.stringify(requestObject) : undefined,
            },
        );
        const responseObject = await response.json() as Response;
        if (responseObject.status === "error") {
            ErrorModals.showForServerError(responseObject.error);
            console.error(responseObject.error);
            throw new Error("Server error");
        }
        return { response: JSON.parse(responseObject.data), json: responseObject.data };
    }
    
}
