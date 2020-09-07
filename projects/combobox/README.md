# @unir/combobox


Widget angular construido desde cero utilizando solo Bootstrap 4 CSS con API diseñadas para el ecosistema Angular. No depende de JavaScript de terceros.


## Dependencias

Las unicas dos dependencias son Rxjs y Bootstrap

|  Angular | Bootstrap CSS |     Rxjs |
|---------:|--------------:|---------:|
| >= 8.0.0 |      >= 4.0.0 | >= 6.0.0 |

## Instalación

* ```npm i --S --registry https://npm.preunir.net @unir/combobox```

* ```import module```

```typescript
    import { ComboboxModule } from '@unir/combobox';

    @NgModule({
    declarations: [
        ...
    ],
    imports: [
        ...
        ComboboxModule
    ]
    })
  ],
```

## Ejemplo 1 

```html
<unir-combobox [serverSide]="false" 
    [elements]="list" 
    [(ngModel)]="selected">
</unir-combobox>
```
```typescript
    selected: ComboboxItem;
    list: ComboboxItem[] = [
    new ComboboxItem({
      text: 'Bolivia',
      value: 'BO'
    }),
    new ComboboxItem({
      text: 'Argentina',
      value: 'AR'
    })
  ];
```
## Ejemplo 2

```html
<unir-combobox [serverSide]="true" 
    [(ngModel)]="selected" 
    [config]="configCountry" 
    (onServerData)="onServerCountry($event)">
</unir-combobox>
```
```typescript
    selected: ComboboxItem;
    configCountry = new ConfigureCombobox({
      url: 'https://commons.desunir.net/api/v1/countries',
      perPage: 10,
      queryPage: 'index',
      querySearch: 'name',
      queryPerPage: 'count'
    });

    onServerCountry(response: ComboboxResponse) {
    const countries = response.response.body as any[];
    const comboItems = countries.map((country) => new ComboboxItem({
      value: country.IsoCode,
      text: country.Name,
      data: country
    }));
    response.callback(comboItems);
  }

```
