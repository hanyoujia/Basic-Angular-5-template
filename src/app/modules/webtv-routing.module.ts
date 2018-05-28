import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TVComponent } from '../components/TV/tv.component';

const webTVRoutes: Routes = [
    { path: '', component: TVComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(webTVRoutes, { useHash: false })
    ],
    exports: [
        RouterModule
    ]
})
export class WebTVRoutingModule { }
