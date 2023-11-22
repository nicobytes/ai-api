import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);

  sendMessage(message: string) {
    return this.http.post<string>(`${environment.API_URL}/chat/llama`, {
      message,
    });
  }
}
