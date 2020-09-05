import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlayerComponent } from './components/player/player.component';
import { PodcastItemComponent } from './components/podcast-item/podcast-item.component';
import { DurationPipe } from './pipes/duration.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    PlayerComponent,
    PodcastItemComponent,
    DurationPipe,
    TruncatePipe,
  ],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [PodcastItemComponent, PlayerComponent, DurationPipe, TruncatePipe],
})
export class SharedModule {}
