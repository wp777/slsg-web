import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { CommonModule } from "../common/common.module";
import { StvGenerateSlsgParametersComponent } from "./stv-generate-slsg-parameters/stv-generate-slsg-parameters.component";
import { StvGenerateMainComponent } from "./stv-generate-main/stv-generate-main.component";
import { StvGenerateSidebarComponent } from "./stv-generate-sidebar/stv-generate-sidebar.component";
import { GenerateRoutingModule } from "./generate-routing.module";

@NgModule({
    declarations: [
        StvGenerateSlsgParametersComponent,
        StvGenerateSidebarComponent,
        StvGenerateMainComponent,
    ],
    exports: [
        StvGenerateSlsgParametersComponent,
        StvGenerateSidebarComponent,
        StvGenerateMainComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        GenerateRoutingModule,
    ],
})
export class GenerateModule {}
