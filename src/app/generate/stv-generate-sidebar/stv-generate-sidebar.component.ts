import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import * as state from "../../state";
import { Subscription, interval } from "rxjs";
import { debounce } from "rxjs/operators";
import { ModelGenerator } from "../ModelGenerator";
import { SlsgModals } from "src/app/modals/SlsgModals";

@Component({
    selector: "stv-generate-sidebar",
    templateUrl: "./stv-generate-sidebar.component.html",
    styleUrls: ["./stv-generate-sidebar.component.less"],
})
export class StvGenerateSidebarComponent implements OnInit, OnDestroy {
    
    _canRender: boolean = false;
    get canRender(): boolean { return this._canRender; }
    set canRender(canRender: boolean) { this._canRender = canRender; }
    
    _canGenerate: boolean = false;
    get canGenerate(): boolean { return this._canGenerate; }
    set canGenerate(canGenerate: boolean) { this._canGenerate = canGenerate; }
    
    formula: string | null = null;
    modelType: string = "";
    
    routerSubscription: Subscription;
    appStateSubscription: Subscription;
    
    constructor(private router: Router, public appState: state.AppState) {
        this.appState.action = new state.actions.Generate();
        
        this.routerSubscription = router.events.subscribe(value => {
            if (value instanceof NavigationEnd) {
                const path = router.getCurrentNavigation()?.finalUrl?.root.children.primary?.segments[1]?.path;
                if (path) {
                    this.modelType = path;
                }
            }
        });
        this.appStateSubscription = appState.state$
            .pipe(debounce(() => interval(10)))
            .subscribe(() => this.onAppStateChanged());
    }

    ngOnInit(): void {}
    
    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        this.appStateSubscription.unsubscribe();
    }
    
    onModelTypeChanged(value: string): void {
        this.router.navigate(["/generate",  value]);
    }
    
    async onRenderClick(): Promise<void> {
        await this.renderModel();
    }
    
    async onGenerateClick(): Promise<void> {
        await this.generateModel();
    }
    
    async renderModel(): Promise<void> {
        const mg = new ModelGenerator(
            this.getSlsgModel(),
            (agentId, locStateId) => {
                SlsgModals.askProtOrVal().then(result => {
                    if (result === "protocol") {
                        this.getSlsgModel().parameters.protocols.push({
                            agentId: agentId,
                            locStateId: locStateId,
                            locActId: 0,
                            state: "disabled",
                        });
                    }
                    else if (result === "valuation") {
                        this.getSlsgModel().parameters.valuations.push({
                            agentId: agentId,
                            locStateId: locStateId,
                            locPropId: 0,
                            state: "disabled",
                        });
                    }
                })
            },
            (agentId, srcLocStateId, tgtStateId) => {
                this.getSlsgModel().parameters.transitions.push({
                    agentId: agentId,
                    srcLocStateId: srcLocStateId,
                    globActId: 0,
                    tgtLocStateId: tgtStateId,
                    state: "disabled",
                });
            },
        );
        mg.generateLocalModels();
    }
    
    async generateModel(): Promise<void> {
        const model = this.getSlsgModel().parameters;
        const lines: string[] = [];
        
        lines.push("p cnf 1 1");
        lines.push("1 0");
        lines.push("");
        
        for (const agent of model.agents) {
            lines.push(`kagent ${agent.id} ${agent.numOfLocalStates} ${agent.numOfLocalActions} ${agent.numOfLocalProps}`);
        }
        lines.push("");
        
        for (const protocol of model.protocols) {
            if (protocol.state === "undefined") {
                continue;
            }
            lines.push(`kprot ${protocol.state === "enabled" ? "+" : "-"} ${protocol.agentId} ${protocol.locActId} ${protocol.locActId}`);
        }
        lines.push("");
        
        for (const transition of model.transitions) {
            if (transition.state === "undefined") {
                continue;
            }
            lines.push(`ktrans ${transition.state === "enabled" ? "+" : "-"} ${transition.agentId} ${transition.srcLocStateId} ${transition.globActId} ${transition.tgtLocStateId}`);
        }
        lines.push("");
        
        for (const valuation of model.valuations) {
            if (valuation.state === "undefined") {
                continue;
            }
            lines.push(`kval ${valuation.state === "enabled" ? "+" : "-"} ${valuation.agentId} ${valuation.locStateId} ${valuation.locPropId}`);
        }
        lines.push("");
        
        lines.push(`kslsg ${model.formula}`);
        lines.push("");
        
        const modelStr = lines.join("\n");
        console.log(modelStr);
        
        const element = document.createElement("a");
        element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(modelStr)}`);
        element.setAttribute("download", "slsg.txt");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    
    onAppStateChanged(): void {
        this.canRender = this.getGenerateState().canRenderModel();
        this.canGenerate = this.getGenerateState().canGenerateModel();
        this.formula = this.getGenerateState().model.formula;
    }
    
    private getGenerateState(): state.actions.Generate {
        return this.appState.action as state.actions.Generate;
    }
    
    private getSlsgModel(): state.models.Slsg {
        return this.getGenerateState().model as state.models.Slsg;
    }
    
}
