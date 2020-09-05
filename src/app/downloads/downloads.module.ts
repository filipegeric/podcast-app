import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { DownloadsPageRoutingModule } from './downloads-routing.module';
import { DownloadsPage } from './downloads.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadsPageRoutingModule,
    SharedModule,
  ],
  declarations: [DownloadsPage],
})
export class DownloadsPageModule {}
