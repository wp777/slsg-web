import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BisimulationModule } from "./bisimulation/bisimulation.module";
import { CommonModule } from "./common/common.module";
import { ReductionModule } from "./reduction/reduction.module";
import { StvMainComponent } from "./stv-main/stv-main.component";
import { StvModeSelectorComponent } from "./stv-mode-selector/stv-mode-selector.component";
import { StvSidebarComponent } from "./stv-sidebar/stv-sidebar.component";
import { StvViewSettingsComponent } from "./stv-view-settings/stv-view-settings.component";
import { VerificationModule } from "./verification/verification.module";
import { GenerateModule } from "./generate/generate.module";
import { ConfigProvider, configProviderFactory } from "./config.provider";

@NgModule({
    declarations: [
        AppComponent,
        StvMainComponent,
        StvModeSelectorComponent,
        StvSidebarComponent,
        StvViewSettingsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BisimulationModule,
        CommonModule,
        ReductionModule,
        VerificationModule,
        GenerateModule,
    ],
    providers: [
        ConfigProvider,
        { provide: APP_INITIALIZER, useFactory: configProviderFactory, deps: [ConfigProvider], multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
