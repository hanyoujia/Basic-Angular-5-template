import { WebTVRoutingModule } from './modules/webtv-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TVComponent } from './components/TV/tv.component';
import { ApiService } from './services/api.service';
import { XML2JsonService } from './services/xml2Json.service';
import { HttpClientModule } from '@angular/common/http';
import { MultipleLineEllipsisDirective } from './shared/directives/multipleLineEllipsisDirective';
import { ResponsiveContentDirective } from './shared/directives/responsive-content.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
@NgModule({
  declarations: [
    TVComponent,
    MultipleLineEllipsisDirective,
    ResponsiveContentDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    WebTVRoutingModule,
    PerfectScrollbarModule
  ],
  providers: [ApiService, XML2JsonService],
  bootstrap: [TVComponent]
})
export class AppModule { }
