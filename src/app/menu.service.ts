import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class MenuItem {
  text: string;
  action: Function;
  icon?: string;
}

export class Menu {
  title: string;
  items: MenuItem[];
  buttons: MenuItem[];
}

// snatched from https://candordeveloper.com/2017/04/25/how-to-create-dynamic-menu-and-page-title-with-angular-material-and-cli/

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuData = new BehaviorSubject<Menu>(new Menu());
  private menuData$ = this.menuData.asObservable();

  constructor() {}

  setMenuData(menuData: Menu) {
    this.menuData.next(menuData);
  }

  getMenuData(): Observable<Menu> {
    return this.menuData$;
  }

}
