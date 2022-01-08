import { Modal } from "./Modal";

export class SlsgProtOrValModal extends Modal {
    
    protected promise: Promise<"protocol" | "valuation" | false>;
    protected promiseResolver?: (result: "protocol" | "valuation" | false) => void;
    
    constructor() {
        super(
            "Adding new element",
            `
                <div class="main-message">
                    Do you want to create a protocol or a valuation?
                    <div style="margin-top: 60px; display: flex; justify-content: space-evenly;">
                        <button data-button-result="protocol">Protocol</button>
                        <button data-button-result="valuation">Valuation</button>
                    </div>
                </div>
            `,
        );
        this.content.querySelector('[data-button-result="protocol"]')?.addEventListener("click", () => { this.promiseResolver!("protocol"); this.close(); });
        this.content.querySelector('[data-button-result="valuation"]')?.addEventListener("click", () => { this.promiseResolver!("valuation"); this.close(); });
        this.promise = new Promise(resolve => {
            this.promiseResolver = resolve;
        });
    }
    
    close(): void {
        super.close();
        this.promiseResolver!(false);
    }
    
    getPromise(): Promise<"protocol" | "valuation" | false> {
        return this.promise;
    }
    
}
