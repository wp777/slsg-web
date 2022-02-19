import * as state from "../state";
import { Modal } from "./Modal";

export class SlsgAddValuationModal extends Modal {
    
    protected promise: Promise<state.models.parameters.SlsgValuation | null>;
    protected promiseResolver?: (result: state.models.parameters.SlsgValuation | null) => void;
    
    constructor() {
        super(
            "Add valuation",
            `
                <div class="main-message">
                    <div class="modal-form form form-wh">
                        <div>Agent ID:</div>
                        <input type="number" data-modal-form-input="agentId" value="0" />
                        <div>Local state ID:</div>
                        <input type="number" data-modal-form-input="locStateId" value="0" />
                        <div>Local property ID:</div>
                        <input type="number" data-modal-form-input="locPropId" value="0" />
                        <div>Enabled/disabled:</div>
                        <input type="checkbox" data-modal-form-input="state" style="margin-top: 5px;" />
                    </div>
                    <div style="margin-top: 60px; display: flex; justify-content: space-evenly;">
                        <button data-button-result="add">Add</button>
                        <button data-button-result="cancel">Cancel</button>
                    </div>
                </div>
            `,
        );
        this.content.querySelector('[data-button-result="add"]')?.addEventListener("click", () => { this.promiseResolver!(this.getResult()); this.close(); });
        this.content.querySelector('[data-button-result="cancel"]')?.addEventListener("click", () => { this.promiseResolver!(null); this.close(); });
        this.promise = new Promise(resolve => {
            this.promiseResolver = resolve;
        });
    }
    
    close(): void {
        super.close();
        this.promiseResolver!(null);
    }
    
    getPromise(): Promise<state.models.parameters.SlsgValuation | null> {
        return this.promise;
    }
    
    protected getResult(): state.models.parameters.SlsgValuation {
        const $agentId = this.content.querySelector(`[data-modal-form-input="agentId"]`) as HTMLInputElement;
        const $locStateId = this.content.querySelector(`[data-modal-form-input="locStateId"]`) as HTMLInputElement;
        const $locPropId = this.content.querySelector(`[data-modal-form-input="locPropId"]`) as HTMLInputElement;
        const $state = this.content.querySelector(`[data-modal-form-input="state"]`) as HTMLInputElement;
        const agentId = parseInt($agentId.value) || 0;
        const locStateId = parseInt($locStateId.value) || 0;
        const locPropId = parseInt($locPropId.value) || 0;
        const state = $state.checked ? "enabled" : "disabled";
        return {
            agentId,
            locPropId,
            locStateId,
            state,
        };
    }
    
}
