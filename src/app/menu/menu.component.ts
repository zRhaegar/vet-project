import { Component, OnInit } from '@angular/core';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})
export class MenuComponent implements OnInit {
  email: string | null = null;

  constructor(private avatarService: AvatarService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.avatarService.getUserProfile()
      .then((data) => {
        if (data) {
          this.email = data.email; // Atribuindo o e-mail ao atributo
        }
      })
      .catch((err: unknown) => {
        console.error('Error loading user profile:', err);
      });
  }
}
