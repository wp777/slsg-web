import { AfterViewInit, Component, Directive, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";

@Directive({selector: '[slot=header]'})
export class Pane {
}

@Component({
    selector: "stv-tabs",
    templateUrl: "./stv-tabs.component.html",
    styleUrls: ["./stv-tabs.component.less"],
})
export class StvTabsComponent implements OnInit, AfterViewInit {
    
    @Output()
    tabActivated = new EventEmitter<{ tabHeader: HTMLElement, tabContent: HTMLElement }>();
    
    @ViewChild("header", { read: ViewContainerRef })
    headerRef?: ViewContainerRef;
    
    @ViewChild("content", { read: ViewContainerRef })
    contentRef?: ViewContainerRef;
    
    get header(): HTMLDivElement | null | undefined {
        return this.headerRef?.element.nativeElement;
    }
    
    get content(): HTMLDivElement | null | undefined {
        return this.contentRef?.element.nativeElement;
    }
    
    get selectedHeader(): HTMLDivElement | null | undefined {
        return this.header?.querySelector(".active");
    }
    
    get selectedContent(): HTMLDivElement | null | undefined {
        return this.content?.querySelector(".active");
    }
    
    constructor() {}
    
    ngOnInit(): void {}
    
    ngAfterViewInit(): void {
        this.ensureAnyTabActive();
    }
    
    getActiveTabId(): number {
        const headerElements = this.header?.childNodes as NodeListOf<HTMLElement> | [];
        let i = 0;
        let idx = -1;
        headerElements.forEach((el: any) => {
            if (el.classList.contains("active")) {
                idx = i;
            }
            ++i;
        });
        return idx;
    }
    
    onTabsHeaderClick(event: MouseEvent): void {
        if (!(event.target instanceof HTMLElement) || !event.target || event.target.parentElement !== this.header) {
            return;
        }
        const nodes = event.target.parentElement?.childNodes;
        const index = Array.prototype.indexOf.call(nodes, event.target);
        this.selectNthTab(index);
    }
    
    ensureAnyTabActive(): void {
        const selectedHeader = this.selectedHeader;
        if (!selectedHeader) {
            this.selectFirst();
        }
    }
    
    selectFirst(): void {
        this.selectNthTab(0);
    }
    
    selectTabByCallback(callback: (tabHeader: HTMLElement, tabContent: HTMLElement, index: number) => boolean): void {
        const headerElements = this.header?.childNodes as NodeListOf<HTMLElement> | undefined;
        const contentElements = this.content?.childNodes as NodeListOf<HTMLElement> | undefined;
        if (!headerElements || !contentElements) {
            return;
        }
        let lastFoundIndex: number = -1;
        headerElements.forEach((header, index) => {
            const content = contentElements.item(index);
            if (callback(header, content, index)) {
                lastFoundIndex = index;
            }
        });
        if (lastFoundIndex >= 0) {
            this.selectNthTab(lastFoundIndex);
        }
    }
    
    selectNthTab(tabIndex: number, force: boolean = false): void {
        const selectedHeader = this.selectedHeader;
        const selectedContent = this.selectedContent;
        const header = this.header?.childNodes[tabIndex] as HTMLElement | undefined;
        const content = this.content?.childNodes[tabIndex] as HTMLElement | undefined;
        if (!header || !content || (!force && (header == selectedHeader || content == selectedContent))) {
            return;
        }
        if (selectedHeader) {
            selectedHeader.classList.remove("active");
        }
        if (selectedContent) {
            selectedContent.classList.remove("active");
        }
        header.classList.add("active");
        content.classList.add("active");
        this.emitTabActivated(header, content);
    }
    
    addTab(header: HTMLDivElement, content: HTMLDivElement, allowTabActivation: boolean = false): void {
        header.setAttribute("slot", "header");
        content.setAttribute("slot", "content");
        this.header?.appendChild(header);
        this.content?.appendChild(content);
        if (allowTabActivation) {
            this.ensureAnyTabActive();
        }
    }
    
    clearTabs(): void {
        this.header!.innerHTML = "";
        this.content!.innerHTML = "";
    }
    
    private emitTabActivated(tabHeader: HTMLElement, tabContent: HTMLElement): void {
        this.tabActivated.emit({ tabHeader, tabContent });
    }
    
}
