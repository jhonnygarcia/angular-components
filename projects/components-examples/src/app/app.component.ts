import { Component, OnInit } from '@angular/core';
import { ComboboxItem, ConfigureCombobox, ComboboxResponse } from 'combobox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'components-examples';
  selected: ComboboxItem;
  elements: ComboboxItem[] = [
    new ComboboxItem({
      text: 'Bolivia',
      value: 'BO'
    }),
    new ComboboxItem({
      text: 'Argentina',
      value: 'AR'
    }),
    new ComboboxItem({
      text: 'España',
      value: 'ES'
    }),
    new ComboboxItem({
      text: 'Peru',
      value: 'PE'
    }),
    new ComboboxItem({
      text: 'Mádrid',
      value: 'MA'
    }),
    new ComboboxItem({
      text: 'Pingüino',
      value: 'PE'
    }),
    new ComboboxItem({
      text: 'Peru',
      value: 'PE'
    }),
    new ComboboxItem({
      text: 'Peru',
      value: 'PE'
    }),
    new ComboboxItem({
      text: 'Peru',
      value: 'PE'
    }),
    new ComboboxItem({
      text: 'Peru',
      value: 'PE'
    }),
    new ComboboxItem({
      text: 'Peru',
      value: 'PE'
    })
  ];
  configComboPais: ConfigureCombobox = new ConfigureCombobox({});
  ngOnInit(): void {
    this.configComboPais = new ConfigureCombobox({
      url: 'https://commons.desunir.net/api/v1/countries',
      perPage: 10,
      queryPage: 'index',
      querySearch: 'name',
      queryPerPage: 'count'
    });
  }
  onServerCountry(response: ComboboxResponse) {
    const countries = response.response.body as any[];
    const comboItems = countries.map((country) => new ComboboxItem({
      value: country.IsoCode,
      text: country.Name,
      data: country
    }));
    response.callback(comboItems);
  }
  show() {
    console.log(this.selected);
  }
  change() {
    this.selected = new ComboboxItem({
      text: 'Chile',
      value: 'CH'
    });
  }
}
