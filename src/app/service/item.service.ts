import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    private items: Item[] = [];
    private searchTerms: string[] = [];


    constructor(private storage: Storage) { }


    addItem(item: Item) {
        this.items.push(item);
        this.persistItems();
        this.addSearchTerms(item.text);
    }

    updateItem(item: Item) {
        this.items.map((it) => {
            if (it.text === item.text) {
                it.isChecked = item.isChecked;
            }
        });
        this.persistItems();
    }

    deleteItem(item: Item) {
        this.items = this.items.filter((it) => { it.text != item.text });
        this.persistItems();
    }

    cleanList() {
        this.items = [];
        this.persistItems();
    }
    private persistItems() {
        this.storage.set('items', this.items);
    }
    private addSearchTerms(text) {
        this.searchTerms.push(text);
    }

    private persistSearchTerms() {
        this.storage.set('searchTerms', this.searchTerms);
    }

    restoreState() {
        return new Promise((resolve, reject) => {         
          this.storage.get('items').then((items) => {
           this.items = items;
          });
          resolve (this.items);
        });
      }

}