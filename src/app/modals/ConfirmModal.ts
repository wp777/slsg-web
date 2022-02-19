import { Modal } from "./Modal";

export class ConfirmModal extends Modal {
    
    protected promise: Promise<boolean>;
    protected promiseResolver?: (result: boolean) => void;
    
    constructor(title: string, message: string) {
        super(
            title,
            `
                <div class="main-message">
                    ${message}
                    <div style="margin-top: 60px; display: flex; justify-content: space-evenly;">
                        <button data-button-result="yes">Yes</button>
                        <button data-button-result="no">No</button>
                    </div>
                </div>
            `,
        );
        this.content.querySelector('[data-button-result="yes"]')?.addEventListener("click", () => { this.promiseResolver!(true); this.close(); });
        this.content.querySelector('[data-button-result="no"]')?.addEventListener("click", () => { this.promiseResolver!(false); this.close(); });
        this.promise = new Promise(resolve => {
            this.promiseResolver = resolve;
        });
    }
    
    close(): void {
        super.close();
        this.promiseResolver!(false);
    }
    
    getPromise(): Promise<boolean> {
        return this.promise;
    }
    
}
