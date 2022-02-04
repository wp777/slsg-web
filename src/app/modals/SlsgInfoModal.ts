import { SlsgInfo } from "../compute.service";
import { Modal } from "./Modal";

export class SlsgInfoModal extends Modal {
    
    constructor(info: SlsgInfo) {
        super(
            "Result",
            `
                <div class="main-message">
                    Status: <strong style="color: ${SlsgInfoModal.getSlsgStatusColor(info.status)}">${info.status}</strong><br />
                    Solving time: <strong>${info.solvingTime} s</strong><br />
                    Wall time: <strong>${info.wallTimeSec} s</strong><br />
                    SGSAT CPU time: <strong>${info.sgsatCpuTime} s</strong><br />
                    Memory used: <strong>${SlsgInfoModal.formatMemory(info.memUsed * 1024 * 1024)}</strong><br />
                    Peak memory used: <strong>${SlsgInfoModal.formatMemory(info.memUsedPeak * 1024 * 1024)}</strong><br />
                </div>
            `,
        );
    }
    
    private static getSlsgStatusColor(status: "SAT" | "UNSAT" | "UNKNOWN"): string {
        if (status === "SAT") {
            return "#00aa33";
        }
        else if (status === "UNSAT") {
            return "#aa0033";
        }
        else {
            return "#888";
        }
    }
    
    static formatMemory(bytes: number): string {
        if (bytes > 1024 * 1024 * 1024) {
            return `${this.roundBytes(bytes / (1024 * 1024 * 1024))} GiB`;
        }
        if (bytes > 1024 * 1024) {
            return `${this.roundBytes(bytes / (1024 * 1024))} MiB`;
        }
        if (bytes > 1024) {
            return `${this.roundBytes(bytes / (1024))} KiB`;
        }
        return `${this.roundBytes(bytes)} B`;
    }
    
    private static roundBytes(bytes: number): number {
        return Math.round(bytes * 100) / 100;
    }
    
}
