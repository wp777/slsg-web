import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as state from "src/app/state";
import { StvGraphComponent } from "../stv-graph/stv-graph.component";
import { StvGraphService } from "../stv-graph/stv-graph.service"
import { StvTabsComponent } from "../stv-tabs/stv-tabs.component";


@Component({
    selector: "stv-model-tabs",
    templateUrl: "./stv-model-tabs.component.html",
    styleUrls: ["./stv-model-tabs.component.less"],
})
export class StvModelTabsComponent implements OnInit, AfterViewInit {
    
    static readonly GLOBAL_MODEL_TAB_ID: string = "global";
    static readonly REDUCED_MODEL_TAB_ID: string = "reduced";
    static readonly LOCAL_MODEL_TAB_ID_PREFIX: string = "local-";
    
    @ViewChild("tabs")
    tabsRef?: ElementRef<StvTabsComponent>;
    
    get tabs(): StvTabsComponent {
        return this.tabsRef! as unknown as StvTabsComponent;
    }
    
    renderedTabs: { [id: string]: string } = {};
    
    private model: state.models.SomeModel | null = null;
    
    // @todo fix graphService instance reference to be binded with component
    constructor(private componentFactoryResolver: ComponentFactoryResolver, private graphService: StvGraphService) {
    }
    
    ngOnInit(): void { }
    
    ngAfterViewInit(): void {
        this.resetTabs();
    }
    
    setModel(model: state.models.SomeModel): void {
        const needsInvalidating = !!this.model;
        this.model = model;
        const hasGlobalModel = model.globalModel !== null;
        const hasReducedModel = model.reducedModel !== null;
        const hasLocalModels = model.localModels !== null && model.localModels.length > 0;
        const localModelNames = model.localModelNames || [];
        if (!hasGlobalModel && !hasReducedModel && !hasLocalModels) {
            this.resetTabs();
            return;
        }
        else {
            let addedLocalTab: boolean = false;
            let addedGlobalTab: boolean = false;
            let addedReducedTab: boolean = false;
            for (let localModelId in localModelNames) {
                const localModelName = localModelNames[localModelId];
                if (this.addTab(StvModelTabsComponent.LOCAL_MODEL_TAB_ID_PREFIX + localModelId, localModelName)) {
                    if (!hasGlobalModel && !addedLocalTab) {
                        this.activateTab(StvModelTabsComponent.LOCAL_MODEL_TAB_ID_PREFIX + localModelId);
                    }
                    addedLocalTab = true;
                }
            }
            if (hasGlobalModel) {
                if (this.addTab(StvModelTabsComponent.GLOBAL_MODEL_TAB_ID, "Global model")) {
                    addedGlobalTab = true;
                }
            }
            if (hasReducedModel) {
                if (this.addTab(StvModelTabsComponent.REDUCED_MODEL_TAB_ID, "Reduced model")) {
                    addedReducedTab = true;
                }
            }
            if (addedReducedTab) {
                this.activateTab(StvModelTabsComponent.REDUCED_MODEL_TAB_ID);
            }
            else if (addedGlobalTab) {
                this.activateTab(StvModelTabsComponent.GLOBAL_MODEL_TAB_ID);
            }
        }
        if (needsInvalidating) {
            this.invalidateTabs();
        }
    }
    
    onTabActivated(event: { tabHeader: HTMLElement, tabContent: HTMLElement }): void {
        const tabId = event.tabHeader.dataset["tabId"];
        const model = this.model;
        if (event.tabContent.classList.contains("not-rendered") && model) {
            let graph: state.models.graph.Graph | null = null;
            if (tabId === StvModelTabsComponent.GLOBAL_MODEL_TAB_ID) {
                graph = model.globalModel;
            }
            else if (tabId === StvModelTabsComponent.REDUCED_MODEL_TAB_ID) {
                graph = model.reducedModel;
            }
            else if (tabId?.startsWith(StvModelTabsComponent.LOCAL_MODEL_TAB_ID_PREFIX)) {
                const localModelIndex = parseInt(tabId.substr(StvModelTabsComponent.LOCAL_MODEL_TAB_ID_PREFIX.length));
                graph = model.localModels ? model.localModels[localModelIndex] : null;
            }
            if (graph) {
                this.renderGraph(graph, event.tabContent);
            }
        }
    }
    
    // @todo temporary fix
    renderGraph(graph: state.models.graph.Graph, graphContainer: HTMLElement): void {
        const graphComponentFactory = this.componentFactoryResolver.resolveComponentFactory(StvGraphComponent);
        const graphComponentRef = this.tabs.contentRef!.createComponent(graphComponentFactory);
        
        this.graphService.render(graph, graphComponentRef.location.nativeElement.children[0] as HTMLDivElement);
        
        graphContainer.innerHTML = "";
        graphContainer.append(graphComponentRef.location.nativeElement);
        graphContainer.classList.remove("not-rendered");
    }
    
    invalidateTabs(): void {
        const tabsComponent = this.tabsRef as unknown as StvTabsComponent;
        const els = tabsComponent.content?.querySelectorAll(".graph-container")!;
        els.forEach((el: Element) => {
            el.classList.add("not-rendered");
        });
        const id = tabsComponent.getActiveTabId();
        if (id >= 0) {
            this.onTabActivated({ tabContent: tabsComponent.selectedContent!, tabHeader: tabsComponent.selectedHeader! });
        }
    }
    
    resetTabs(): void {
        this.renderedTabs = {};
        this.tabs.clearTabs();
    }
    
    // @todo tab content should match stv-graph-component.html?
    // @todo multiple instances of .graph-container
    addTab(tabId: string, tabHeader: string): boolean {
        if (tabId in this.renderedTabs) {
            return false;
        }
        this.renderedTabs[tabId] = tabHeader;
        const header = document.createElement("div");
        header.innerText = tabHeader;
        header.dataset["tabId"] = tabId;
        const content = document.createElement("div");
        content.classList.add("graph-container");
        content.classList.add("not-rendered");
        this.tabs.addTab(header, content);
        return true;
    }
    
    activateTab(tabId: string): void {
        const tabsComponent = this.tabsRef as unknown as StvTabsComponent;
        tabsComponent.selectTabByCallback(tabHeader => {
            const _tabId = tabHeader.dataset["tabId"];
            return _tabId === tabId;
        });
    }
    
}
