import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StvGenerateSidebarComponent } from "./stv-generate-sidebar.component";

describe("StvGenerateSidebarComponent", () => {
    let component: StvGenerateSidebarComponent;
    let fixture: ComponentFixture<StvGenerateSidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StvGenerateSidebarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StvGenerateSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
