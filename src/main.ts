import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerWebPlugin } from '@capacitor/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { MusicPlayerWeb } from './plugins/music-player';

registerWebPlugin(new MusicPlayerWeb());

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
