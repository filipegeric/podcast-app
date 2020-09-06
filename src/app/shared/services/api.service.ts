import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PodcastTrack } from '../components/podcast-item/podcast-item.component';

export interface Tag {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private get apiUrl() {
    return environment.apiUrl;
  }

  getPodcasts(searchTerm?: string, tag?: Tag) {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.append('q', searchTerm);
    }
    if (tag?.id) {
      params = params.append('tag', tag.id.toString());
    }
    return this.http
      .get<PodcastTrack[]>(`${this.apiUrl}/podcasts`, { params })
      .toPromise();
  }

  getTags() {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`).toPromise();
  }
}
