import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  groups: Observable<any>;

  constructor(private firebase: AngularFireDatabase) {}

  ngOnInit() {
    this.groups = this.firebase.list('groups').valueChanges();
  }
}
