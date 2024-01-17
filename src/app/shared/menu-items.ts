import {Injectable} from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  role: string;
}

const MENU_ITEMS = [
  {state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'dashboard', role: ''},
  {state: 'category', name: 'Manage Category', type: 'link', icon: 'category', role: 'admin'},
  {state: 'product', name: 'Manage Product', type: 'link', icon: 'inventory', role: 'admin'}
];

@Injectable({
  providedIn: 'root'
})
export class MenuItems {
  public getItemsMenu() {
    return MENU_ITEMS;
  }
}
