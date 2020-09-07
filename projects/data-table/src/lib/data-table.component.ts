import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'unir-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>
      data-table works! Jhonny
    </p>
  `,
  styles: [
  ]
})
export class DataTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
