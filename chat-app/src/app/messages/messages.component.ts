import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Observable<any>;
  newMessage = '';
  group = '';

  constructor(
    private route: ActivatedRoute,
    private firebase: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.group = params.group;

      if (this.group) {
        this.messages = this.firebase
          .list('messages', ref =>
            ref.orderByChild('group').equalTo(this.group)
          )
          .valueChanges();
      }
    });
  }

  send() {
    if (this.newMessage) {
      const messages = this.firebase.list('messages');

      messages.push({
        group: this.group,
        text: this.newMessage
      });

      this.newMessage = '';
    }
  }
}
