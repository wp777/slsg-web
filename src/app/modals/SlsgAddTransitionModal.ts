import * as state from "../state";
import { Modal } from "./Modal";

export class SlsgAddTransitionModal extends Modal {
    
    protected promise: Promise<state.models.parameters.SlsgTransition | null>;
    protected promiseResolver?: (result: state.models.parameters.SlsgTransition | null) => void;
    
    constructor() {
        super(
            "Add transition",
            `
                <div class="main-message">
                    <div class="modal-form form form-wh">
                        <div>Agent ID:</div>
                        <input type="number" data-modal-form-input="agentId" value="0" />
                        <div>Source local state ID:</div>
                        <input type="number" data-modal-form-input="srcLocStateId" value="0" />
                        <div>Target local state ID:</div>
                        <input type="number" data-modal-form-input="tgtLocStateId" value="0" />
                        <div>Global action ID:</div>
                        <input type="number" data-modal-form-input="globActId" value="0" />
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
    
    getPromise(): Promise<state.models.parameters.SlsgTransition | null> {
        return this.promise;
    }
    
    protected getResult(): state.models.parameters.SlsgTransition {
        const $agentId = this.content.querySelector(`[data-modal-form-input="agentId"]`) as HTMLInputElement;
        const $srcLocStateId = this.content.querySelector(`[data-modal-form-input="srcLocStateId"]`) as HTMLInputElement;
        const $tgtLocStateId = this.content.querySelector(`[data-modal-form-input="tgtLocStateId"]`) as HTMLInputElement;
        const $globActId = this.content.querySelector(`[data-modal-form-input="globActId"]`) as HTMLInputElement;
        const $state = this.content.querySelector(`[data-modal-form-input="state"]`) as HTMLInputElement;
        const agentId = parseInt($agentId.value) || 0;
        const srcLocStateId = parseInt($srcLocStateId.value) || 0;
        const tgtLocStateId = parseInt($tgtLocStateId.value) || 0;
        const globActId = parseInt($globActId.value) || 0;
        const state = $state.checked ? "enabled" : "disabled";
        return {
            agentId,
            globActId,
            srcLocStateId,
            tgtLocStateId,
            state,
        };
    }
    
}
