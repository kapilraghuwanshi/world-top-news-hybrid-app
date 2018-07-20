import { NgModule } from '@angular/core';
import { MyFilterPipe } from './my-filter/my-filter';
@NgModule({
	declarations: [MyFilterPipe],
	imports: [],
	exports: [MyFilterPipe]
})
export class PipesModule {}
