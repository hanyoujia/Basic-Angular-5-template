import {
  Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit,
  QueryList, ViewEncapsulation, ViewChildren
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { XML2JsonService } from '../../services/xml2Json.service';
import { Video } from '../../shared/entities/video';
import { ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Lang2Playlists } from '../../shared/constants/lang2Playlists';
import { MultipleLineEllipsisDirective } from '../../shared/directives/multipleLineEllipsisDirective';
@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.css'],
  // styles: [require('./tv.component.css').toString()],
  encapsulation: ViewEncapsulation.None
})
export class TVComponent implements OnInit, AfterViewInit {
  public videoData: Video[] = [];
  public selectedItem: Video = new Video();
  private jQuery: any = require('jquery');
  @ViewChild('webTVDiv') webTVDiv: ElementRef;
  @ViewChild('viewMobileDetail') viewMobileDetail: ElementRef;
  @ViewChild('viewDesktopDetail') viewDesktopDetail: ElementRef;
  @ViewChildren(MultipleLineEllipsisDirective) dirs: QueryList<MultipleLineEllipsisDirective>;
  public rightPanelListHeight: Number;
  public sublistFooterHeight: Number;
  public displayDiscription: Boolean = false;
  public videoHeight: String = '';
  private aspectRatio = 0.562;
  constructor(private route: ActivatedRoute, private apiService: ApiService, private xmlParser: XML2JsonService) {

  }

  public ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const lang = params.get('lang');
      const partnerId = params.get('partnerId');
      const feed = Lang2Playlists.getFeedId(lang);

      if (params.keys.length === 0) {
        return;
      }
      if (feed) {
        this.apiService.getVideoFeeds(feed).subscribe(repsonse => {
          const json: string = this.xmlParser.parseXML(repsonse.toString());
          const videos: any = json['videos']['video'];
          for (let i = 0; i < videos.length; i++) {
            const v: Video = Video.formatVideo(videos[i]);
            if (i === 0) {
              this.selectedItem = v;
            }
            this.videoData.push(v);
          }
        });
      }
    });
  }

  public ngAfterViewInit() {
    // Calcluate the sublist height until angular fully rendered.
    setTimeout(() => {
      this.rightPanelListHeight = this.webTVDiv.nativeElement.offsetWidth * this.aspectRatio;
      this.reCalSubListHeight();
    }, 300);
  }

  private reCalSubListHeight(): void {
    setTimeout(() => {
      const windowHeight = window.innerHeight;
      const videoHeight = this.webTVDiv.nativeElement.offsetWidth * this.aspectRatio;
      const viewDetailHeight = (this.viewMobileDetail.nativeElement.offsetHeight === 0 ?
        this.viewDesktopDetail.nativeElement.offsetHeight + parseInt(this.jQuery('.tc-large-view-detail').css('margin-top')
          + this.jQuery('.tc-large-view-detail').css('margin-bottom'), 0)
        : this.viewMobileDetail.nativeElement.offsetHeight) + parseInt(this.jQuery('.tc-view-detail').css('margin-top')
          + this.jQuery('.tc-view-detail').css('margin-bottom'), 0);
      this.sublistFooterHeight = windowHeight - viewDetailHeight - videoHeight - 10;
    }, 100);

  }
  public onClick(video: any): void {
    this.jQuery(this.webTVDiv.nativeElement).attr('autoplay', true);
    this.selectedItem = video;
    this.videoHeight = this.webTVDiv.nativeElement.offsetHeight + 'px';
    this.reCalSubListHeight();
  }

  public toggle(): void {
    this.displayDiscription = !this.displayDiscription;
    this.reCalSubListHeight();
  }

  @HostListener('window:resize') onResize() {
    this.rightPanelListHeight = this.webTVDiv.nativeElement.offsetHeight;
    this.videoHeight = 'auto';
    this.reCalSubListHeight();
  }

  public hover(): void {
    // Display the video control when use hover over the video
    this.jQuery(this.webTVDiv.nativeElement).attr('controls', true);
  }

  public hideControls(): void {
    this.jQuery(this.webTVDiv.nativeElement).attr('controls', false);
  }

  public onResponsiveStateChange(viewMode): void {
    // Whenever the view mode change, recall the truncate method
    // for each directive, because the min and max view mode in browser
    // won't trigger onresize
    if (this.dirs) {
      this.dirs.forEach((item) => {
        item.reTruncate();
      });
    }
  }

  public playVideo(): void {
    this.webTVDiv.nativeElement.play();
  }
}
