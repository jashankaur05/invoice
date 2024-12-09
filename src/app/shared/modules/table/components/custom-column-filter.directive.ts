import { Directive, Host, Optional, Self } from '@angular/core';
import { ColumnFilter } from 'primeng/table';

@Directive({
  selector: '[customColumnFilter]',
  standalone: true
})
export class CustomColumnFilterDirective {

  constructor(@Host() @Self() @Optional() public filter: ColumnFilter) {

    filter.hide = (): void => {
      filter.overlayVisible = false;
      filter.dt.cd.markForCheck();
    };
  }

}
