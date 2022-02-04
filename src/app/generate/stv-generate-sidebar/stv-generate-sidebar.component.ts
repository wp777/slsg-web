import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import * as state from "../../state";
import { Subscription, interval } from "rxjs";
import { debounce } from "rxjs/operators";
import { ModelGenerator } from "../ModelGenerator";
import { SlsgModals } from "src/app/modals/SlsgModals";
import { ComputeService } from "src/app/compute.service";
import { StvGraphService } from "src/app/common/stv-graph/stv-graph.service";
import { SlsgExample, SlsgExamples } from "./Examples";

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
    
    constructor(private router: Router, public appState: state.AppState, private computeService: ComputeService, private graphService: StvGraphService) {
        this.appState.action = new state.actions.Generate();
        
        this.routerSubscription = router.events.subscribe(value => {
            if (value instanceof NavigationEnd) {
                const path = router.getCurrentNavigation()?.finalUrl?.root.children.primary?.segments[1]?.path;
                
                if (path) {
                    let example: SlsgExample | null = SlsgExamples[path];
                    if (example) {
                        const params = this.getSlsgModel().parameters;
                        params.agents = example.agents;
                        params.protocols = example.protocols;
                        params.transitions = example.transitions;
                        params.valuations = example.valuations;
                        params.formula = example.formula;
                    }
                }
                
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
        setTimeout(() => {
            const nAgents = this.getSlsgModel().parameters.agents.length;
            for (let i = 0; i < nAgents; ++i) {
                this.graphService.updateFromSlsgModel(i, this.getSlsgModel());
            }
        }, 250);
    }
    
    async onGenerateClick(): Promise<void> {
        this.showSpinner();
        
        try {
            const modelStr = await this.generateModel(false);
            if (modelStr !== null) {
                const result = await this.computeService.generateSlsgModel(modelStr);
                
                if (result) {
                    const model = this.getSlsgModel();
                    model.globalModel = result.globalModel;
                    model.localModels = result.localModels;
                    model.localModelNames = result.localModelNames;
                    
                    SlsgModals.showInfo(result.info);
                }
            }
        }
        catch {
        }
        
        this.hideSpinner();
    }
    
    private showSpinner(): void {
        this.hideSpinner();
        
        const spinner = document.createElement("div");
        spinner.classList.add("slsg-spinner");
        spinner.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        
        const curtain = document.createElement("div");
        curtain.classList.add("slsg-curtain");
        
        document.body.appendChild(curtain);
        document.body.appendChild(spinner);
    }
    
    private hideSpinner(): void {
        const spinner = document.querySelector(".slsg-spinner");
        const curtain = document.querySelector(".slsg-curtain");
        if (spinner) {
            spinner.remove();
        }
        if (curtain) {
            curtain.remove();
        }
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
                        this.graphService.updateFromSlsgModel(agentId, this.getSlsgModel());
                        ModelGenerator.checkContradictions(this.getSlsgModel());
                    }
                    else if (result === "valuation") {
                        this.getSlsgModel().parameters.valuations.push({
                            agentId: agentId,
                            locStateId: locStateId,
                            locPropId: 0,
                            state: "disabled",
                        });
                        this.graphService.updateFromSlsgModel(agentId, this.getSlsgModel());
                        ModelGenerator.checkContradictions(this.getSlsgModel());
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
                this.graphService.updateFromSlsgModel(agentId, this.getSlsgModel());
                ModelGenerator.checkContradictions(this.getSlsgModel());
            },
        );
        mg.generateLocalModels();
    }
    
    async generateModel(download: boolean = false): Promise<string | null> {
        const model = this.getSlsgModel();
        const res = await ModelGenerator.checkContradictions(this.getSlsgModel(), true, false);
        if (res.hasContradictions) {
            return null;
        }
        const params = model.parameters;
        const lines: string[] = [];
        
        lines.push("p cnf 1 1");
        lines.push("1 0");
        lines.push("");
        
        for (const agent of params.agents) {
            lines.push(`kagent ${agent.id} ${agent.numOfLocalStates} ${agent.numOfLocalActions} ${agent.numOfLocalProps}`);
        }
        lines.push("");
        
        for (const protocol of params.protocols) {
            if (protocol.state === "undefined") {
                continue;
            }
            lines.push(`kprot ${protocol.state === "enabled" ? "+" : "-"} ${protocol.agentId} ${protocol.locActId} ${protocol.locActId}`);
        }
        lines.push("");
        
        for (const transition of params.transitions) {
            if (transition.state === "undefined") {
                continue;
            }
            lines.push(`ktrans ${transition.state === "enabled" ? "+" : "-"} ${transition.agentId} ${transition.srcLocStateId} ${transition.globActId} ${transition.tgtLocStateId}`);
        }
        lines.push("");
        
        for (const valuation of params.valuations) {
            if (valuation.state === "undefined") {
                continue;
            }
            lines.push(`kval ${valuation.state === "enabled" ? "+" : "-"} ${valuation.agentId} ${valuation.locStateId} ${valuation.locPropId}`);
        }
        lines.push("");
        
        lines.push(`kslsg ${params.formula}`);
        lines.push("");
        
        const modelStr = lines.join("\n");
        console.log(modelStr);
        
        if (download) {
            const element = document.createElement("a");
            element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(modelStr)}`);
            element.setAttribute("download", "slsg.txt");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        
        return modelStr;
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
