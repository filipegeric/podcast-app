import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlayerComponent } from './components/player/player.component';
import { PodcastItemComponent } from './components/podcast-item/podcast-item.component';

@NgModule({
  declarations: [PlayerComponent, PodcastItemComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [PodcastItemComponent, PlayerComponent],
})
export class SharedModule {}
