import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatService } from '@app/services/chat.service';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export default class ChatPage {
  chatService = inject(ChatService);
  messages = signal<string[]>([]);
  showLoading = signal(false);
  textareaCtrl = new FormControl('', { nonNullable: true });

  constructor() {
    addIcons({ send });
  }

  sendMessage() {
    const message = this.textareaCtrl.value;
    this.textareaCtrl.setValue('');
    this.messages.update((messages) => [...messages, message]);
    this.showLoading.update((state) => !state);
    this.chatService
      .sendMessage(message)
      .subscribe((newMessage) => {
        this.messages.update((messages) => [...messages, newMessage]);
        this.showLoading.update((state) => !state);
      });
  }
}
