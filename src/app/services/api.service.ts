import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';

const API_URL = 'https://video.tradingcentral.com/playlists/';
@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }
    public defaultHeaders: HttpHeaders = new HttpHeaders();
    public getVideoFeeds(feed: string): Observable<Object> {
        return this.http
            .get(API_URL + feed, { responseType: 'text' });
    }

}

