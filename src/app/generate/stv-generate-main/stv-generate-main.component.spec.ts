import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StvGenerateMainComponent } from "./stv-generate-main.component";

describe("StvGenerateMainComponent", () => {
    let component: StvGenerateMainComponent;
    let fixture: ComponentFixture<StvGenerateMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StvGenerateMainComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StvGenerateMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
