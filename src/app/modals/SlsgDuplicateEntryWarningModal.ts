import { Modal } from "./Modal";

export class SlsgDuplicateEntryWarningModal extends Modal {
    
    protected promise: Promise<void>;
    protected promiseResolver?: () => void;
    
    constructor(entryStr: string) {
        super(
            "Warning",
            `
                <div class="main-message">
                    Duplicate entry: <code>${entryStr}</code>
                    <div style="margin-top: 60px; display: flex; justify-content: space-evenly;">
                        <button data-button="ok">Ok</button>
                    </div>
                </div>
            `,
        );
        this.content.querySelector('[data-button="ok"]')?.addEventListener("click", () => { this.promiseResolver!(); this.close(); });
        this.promise = new Promise(resolve => {
            this.promiseResolver = resolve;
        });
    }
    
    close(): void {
        super.close();
        this.promiseResolver!();
    }
    
    getPromise(): Promise<void> {
        return this.promise;
    }
    
}
