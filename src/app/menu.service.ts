import { Injectable } from '@angular/core';

export class MenuItem {
  path: string;
  title: string;
  icon?: string;
}

// snatched from https://candordeveloper.com/2017/04/25/how-to-create-dynamic-menu-and-page-title-with-angular-material-and-cli/

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public title: string;

}
