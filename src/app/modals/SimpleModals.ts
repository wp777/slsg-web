import { ConfirmModal } from "./ConfirmModal";

export class SimpleModals {
    
    static async confirm(title: string, message: string): Promise<boolean> {
        const modal = new ConfirmModal(title, message);
        modal.show();
        return modal.getPromise();
    }
    
}
