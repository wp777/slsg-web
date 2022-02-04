import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StvGenerateSlsgParametersComponent } from "./stv-generate-slsg-parameters/stv-generate-slsg-parameters.component";
import { StvGenerateMainComponent } from "./stv-generate-main/stv-generate-main.component";
import { StvGenerateSidebarComponent } from "./stv-generate-sidebar/stv-generate-sidebar.component";

const generateMainComponentRoute = {
    path: "",
    pathMatch: "full",
    component: StvGenerateMainComponent,
};

const generateParametersComponentRoute = {
    path: "",
    pathMatch: "full",
    component: StvGenerateSidebarComponent,
    outlet: "sidebar-parameters",
};

const createModelParametersComponentRoute = (modelType: string, component: any) => ({
    path: modelType,
    children: [
        { ...generateMainComponentRoute },
        {
            ...generateParametersComponentRoute,
            children: [
                {
                    path: "",
                    pathMatch: "full",
                    component: component,
                    outlet: "generate-model-parameters",
                },
            ],
        },
    ],
});

const routes: Routes = [
    {
        path: "generate",
        pathMatch: "full",
        redirectTo: "generate/slsg",
    },
    {
        path: "generate",
        children: [
            { ...generateMainComponentRoute },
            { ...generateParametersComponentRoute },
            createModelParametersComponentRoute("slsg", StvGenerateSlsgParametersComponent),
            createModelParametersComponentRoute("example1", StvGenerateSlsgParametersComponent),
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GenerateRoutingModule {}
