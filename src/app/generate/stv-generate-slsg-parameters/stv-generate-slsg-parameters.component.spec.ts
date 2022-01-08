import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StvGenerateSlsgParametersComponent } from "./stv-generate-slsg-parameters.component";

describe("StvGenerateSlsgParametersComponent", () => {
    let component: StvGenerateSlsgParametersComponent;
    let fixture: ComponentFixture<StvGenerateSlsgParametersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StvGenerateSlsgParametersComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StvGenerateSlsgParametersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
