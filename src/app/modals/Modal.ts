export abstract class Modal {
    
    private curtain: HTMLDivElement | null = null;
    private modalContainer: HTMLDivElement | null = null;
    private modal: HTMLDivElement | null = null;
    private title: string;
    protected content: HTMLElement;
    
    constructor(title: string, content: HTMLElement | string) {
        this.title = title;
        if (content instanceof HTMLElement) {
            this.content = content;
        }
        else {
            this.content = document.createElement("div");
            this.content.innerHTML = content;
        }
    }
    
    show(): void {
        if (this.modalContainer !== null || this.modal !== null || this.curtain !== null)  {
            return;
        }
        
        this.curtain = document.createElement("div");
        this.curtain.classList.add("modal-curtain");
        document.body.appendChild(this.curtain);
        
        this.modalContainer = document.createElement("div");
        this.modalContainer.classList.add("modal-container");
        document.body.appendChild(this.modalContainer);
        
        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal.innerHTML = `
            <div class="modal-top-bar">
                <span class="modal-title"></span>
                <button class="modal-close-button theme" data-role="close-modal"><i class="fa fa-times"></i></button>
            </div>
            <div class="modal-content-container"></div>
        `;
        this.modal.querySelector(".modal-content-container")!.appendChild(this.content);
        this.modal.querySelector<HTMLDivElement>(".modal-title")!.innerText = this.title;
        this.modalContainer.appendChild(this.modal);
        
        this.curtain.addEventListener("click", () => { this.close(); });
        this.modalContainer.addEventListener("click", event => {
            const target = event.target as HTMLElement;
            if (target.closest("[data-role=close-modal]")) {
                this.close();
            }
        });
    }
    
    close(): void {
        if (this.modalContainer === null || this.modal === null || this.curtain === null) {
            return;
        }
        this.modalContainer.remove();
        this.curtain.remove();
        this.modalContainer = null;
        this.modal = null;
        this.curtain = null;
    }
    
}
