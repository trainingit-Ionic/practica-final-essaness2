import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {
  constructor(private storage: Storage) { }

  addItem(index, value) {
    this.storage.set(index, value);
  }

  updateItem(index, value) {
    this.storage.remove(index);
    this.storage.set(index, value);
  }

  deleteItem(index, item) {
    this.existItemByText(item.text).then ((value) => {
      console.log('delete item ' + index + item.text );
      if (value) {
        this.storage.remove(index);
      } else {
        item.isDeleted = true;
        this.updateItem(index, item);
      }
    });
  }

  getItem(index) {
    return this.storage.get(index);
  }

  getItemsNotDeleted() {
    //  return this.storage.forEach()
  
  }
  getAllItemsFilter(filter) {
    return new Promise((resolve, reject) => {
      const items = [];
      let itemsFilter = [];
      this.storage.forEach((value, key) => {
        items.push(value);
      }).then(() => {
        itemsFilter = items.filter((item) => {
          if (item !== null) {
            return (item.text.toLowerCase().indexOf(filter.toLowerCase()) > -1);
          }
        });
        console.log(itemsFilter);
        resolve(itemsFilter);
      });
    });
  }

  restoreState() {
    return new Promise((resolve, reject) => {
      const items = new Array();
      this.storage.forEach((value, key) => {
        if (value.isDeleted === false) {
          items.push(value);
        }
      });
      resolve (items);
    });
  }

  private existItemByText(textItem) {
    return new Promise((resolve, reject) => {
    let exists = false;
    this.getAllItemsFilter(textItem).then(items => {
      const aux = items as Array<any>;
      console.log('existItemByText ' + aux.length);
      if (aux.length <= 1) {
        exists =  false;
      } else  {
        exists = true;
      }
      console.log('Item ' + textItem + ' exists ' + exists);
      resolve(exists);
    });
   
  });
  }
}
