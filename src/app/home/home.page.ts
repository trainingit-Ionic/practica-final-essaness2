import { Component } from '@angular/core';
import { ModalController, IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';

import { DbServiceService } from '../service/db-service.service';

import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private item: Item;
  searchQuery = '';
  items = new Array();
  itemsFiltered: any;

  @ViewChild('mySearchbar', { static: false }) mySearchbar: IonSearchbar;

  constructor(
    public modalController: ModalController,
    private dbService: DbServiceService,
    public platform: Platform
  ) {
    this.platform.resume.subscribe(() => {
      this.dbService.restoreState().then(eltos => {
        const aux = eltos as Array<any>;
        this.items = aux;
      });
    });

    this.platform.ready().then(() => {
      this.dbService.restoreState().then(eltos => {
        const aux = eltos as Array<any>;
        this.items = aux;
      });
    });
  }

  addItem() {
    console.log('Add item ' + this.searchQuery);
    if (this.searchQuery !== '') {
      this.pushItem(this.searchQuery);
    }
  }

  private pushItem(textItem) {
    if (textItem !== '') {
      this.item = {
        index: this.randomID(),
        text: textItem,
        isChecked: false,
        isDeleted: false
      };
      this.items.push(this.item);
      this.dbService.addItem(this.item.index, this.item);
      this.cleanSearchFields();
    }
  }

  private cleanSearchFields() {
    this.mySearchbar.value = '';
    this.searchQuery = '';
    this.itemsFiltered = new Array();
  }
  checkItem(event, index) {
    console.log('check item ' + event.target.checked + ' for index ' + index);
    this.marcarCheck(event.target.checked, index);
    this.printItems();
  }
  private marcarCheck(estado, indice) {
    for (const i of this.items) {
      if (i.index === indice) {
        i.isChecked = estado;
        this.dbService.updateItem(indice, i);
      }
    }
  }
  private printItems() {
    for (const i of this.items) {
      console.log(i.text + ' ' + i.isChecked + ' ' + i.isDeleted);
    }
  }

  triggerInput(event) {
    this.searchQuery = event.target.value;
    console.log('triggerInput [' + event.target.value + ']');
    if (this.searchQuery !== '') {
      this.itemsFiltered = new Array();
      this.dbService.getAllItemsFilter(this.searchQuery).then(items => {
        console.log(items);
        if (items !== undefined) {
          this.itemsFiltered = items;
          console.log(this.itemsFiltered);
        }
      });
    } else {
      this.cleanSearchFields();
    }
  }

  clearSearch() {
    this.cleanSearchFields();
  }
  addFilterItem(itemText) {
    this.pushItem(itemText);
  }

  deleteItem(item) {
    console.log(item.index);
    this.dbService.deleteItem(item.index, item);

    const index = this.items.findIndex((itemSearch, i) => {
      return itemSearch.index === item.index;
    });
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this.printItems();
  }

  async cleanList() {
    console.log('acción de botón para limpiar la lista');
    this.items.forEach((item, i) => {
      console.log(
        'acción de botón para limpiar la lista ' + item.index + item.text
      );
      this.dbService.deleteItem(item.index, item);
    });
    this.items = new Array();
  }

  private randomID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
}
