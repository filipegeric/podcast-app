import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PodcastTrack } from '../components/podcast-item/podcast-item.component';

export interface Tag {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPodcasts(searchTerm?: string) {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.append('q', searchTerm);
    }
    return this.http
      .get<PodcastTrack[]>(`${this.API_URL}/podcasts`, { params })
      .toPromise();
  }

  getTags() {
    return this.http.get<Tag[]>(`${this.API_URL}/tags`).toPromise();
  }
}
