import * as models from "../models";
import { Action } from "./Action";

interface GenerateObservableProperties {
    model: unknown;
    dominoDfsHeuristic: unknown;
}

export class Generate extends Action<GenerateObservableProperties> {
    
    protected _model: models.Slsg = this.createObservedChild(new models.Slsg());
    get model(): models.Slsg { return this._model; }
    set model(model: models.Slsg) { this.setParameter("model", model); }
    
    canGenerateModel(): boolean {
        return this.model.parameters.areModelParametersValid();
    }
    
    canRenderModel(): boolean {
        return this.model.parameters.agents && this.model.parameters.agents.length > 0;
    }
    
    canVerifyModel(): boolean {
        return this.model.globalModel !== null;
    }
    
    canExportModelToTxt(): boolean {
        return this.model.parameters.agents && this.model.parameters.agents.length > 0;
    }
    
}
