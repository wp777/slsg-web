import * as state from "../state";
import { Modal } from "./Modal";

export class SlsgAddProtocolModal extends Modal {
    
    protected promise: Promise<state.models.parameters.SlsgProtocol | null>;
    protected promiseResolver?: (result: state.models.parameters.SlsgProtocol | null) => void;
    
    constructor() {
        super(
            "Add protocol",
            `
                <div class="main-message">
                    <div class="modal-form form form-wh">
                        <div>Agent ID:</div>
                        <input type="number" data-modal-form-input="agentId" value="0" />
                        <div>Local state ID:</div>
                        <input type="number" data-modal-form-input="locStateId" value="0" />
                        <div>Local action ID:</div>
                        <input type="number" data-modal-form-input="locActId" value="0" />
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
    
    getPromise(): Promise<state.models.parameters.SlsgProtocol | null> {
        return this.promise;
    }
    
    protected getResult(): state.models.parameters.SlsgProtocol {
        const $agentId = this.content.querySelector(`[data-modal-form-input="agentId"]`) as HTMLInputElement;
        const $locStateId = this.content.querySelector(`[data-modal-form-input="locStateId"]`) as HTMLInputElement;
        const $locActId = this.content.querySelector(`[data-modal-form-input="locActId"]`) as HTMLInputElement;
        const $state = this.content.querySelector(`[data-modal-form-input="state"]`) as HTMLInputElement;
        const agentId = parseInt($agentId.value) || 0;
        const locStateId = parseInt($locStateId.value) || 0;
        const locActId = parseInt($locActId.value) || 0;
        const state = $state.checked ? "enabled" : "disabled";
        return {
            agentId,
            locActId,
            locStateId,
            state,
        };
    }
    
}
