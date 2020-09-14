import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ComboboxItem, ConfigureCombobox, ComboboxResponse } from './models';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
  selector: 'unir-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ComboboxComponent),
    multi: true
  }]
})
export class ComboboxComponent implements OnInit, ControlValueAccessor {

  loading = false;
  expanded: boolean;
  currentPage: number;
  changeSearch: string;
  searchSubscription: Subscription = null;
  filtered: ComboboxItem[] = [];

  input: FormControl = new FormControl('');
  onChange = Function.prototype;
  onTouched = Function.prototype;
  isDisabled: boolean;
  currentValue: ComboboxItem = null;
  @ViewChild('search', { static: false }) inputChild: ElementRef;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() readonly onServerData = new EventEmitter<ComboboxResponse>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() readonly outComponent = new EventEmitter<ComboboxComponent>();

  @Input() elements: ComboboxItem[] = [];
  @Input() config: ConfigureCombobox;
  @Input() serverSide = true;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef) {
    this.expanded = false;
    this.currentPage = 1;
  }
  public get hasValueInput(): boolean {
    const text: string = this.input.value;
    return text.length > 0;
  }
  writeValue(value: ComboboxItem | null): void {
    this.currentValue = value;
  }
  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
  setDisabledState?(state: boolean): void {
    this.isDisabled = state;
  }

  ngOnInit() {
    this.outComponent.emit(this);
    if (this.config == null) {
      this.config = new ConfigureCombobox({});
    }
    if (this.serverSide) {
      this.elements = [];
    }
    if (this.serverSide) {
      this.input.valueChanges
        .pipe(filter((value: string) => value.length >= this.config.minLength))
        .pipe(debounceTime(700)).subscribe(_ => {
          this.elements = [];
          this.currentPage = 1;
          this.serverData();
        });
    } else {
      this.input.valueChanges.pipe(debounceTime(0)).subscribe((value: string) => {
        if (value.length > 0) {
          this.serverClient();
        }
      });
    }
  }

  expandCollapse(event): void {
    if (event.srcElement.tagName === 'I' &&
      event.srcElement.className === 'fas fa-times') {
      return;
    }
    this.expanded = !this.expanded;
    if (this.expanded) {
      setTimeout(() => {
        if (this.inputChild != null) {
          this.inputChild.nativeElement.focus();
        }
        if (!this.serverSide) {
          return;
        }
        const search: string = this.input.value;
        if (this.changeSearch !== search ||
          this.elements.length === 0) {
          this.currentPage = 1;
          this.elements = [];
          this.serverData();
        }
      }, 100);
    }
  }
  clickItem(item: ComboboxItem): void {
    const oldValue = { ...this.currentValue?.value };
    this.expanded = false;
    if (oldValue !== item.value) {
      this.writeValue(item);
      this.onChange(this.currentValue);
      this.onTouched();
    }
  }
  serverClient() {
    const search: string = this.input.value;
    let term: string;
    this.filtered = this.elements.filter((elem) => {
      term = this.stripSpecialChars(search).toLowerCase();
      return this.stripSpecialChars(elem.text).toLowerCase().includes(term);
    });
  }
  private stripSpecialChars(text: string): string {
    text = text == null ? '' : text;
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  serverData(): void {
    if (!this.serverSide || this.config.cancelServerData) {
      this.serverClient();
      return;
    }
    const method = this.config.method.toUpperCase();
    // tslint:disable-next-line: ban-types
    let request: Observable<HttpResponse<Object>> = null;
    const queries: string[] = [];
    if (this.config.querySearch !== '') {
      const search: string = this.input.value;
      queries.push(`${this.config.querySearch}=${search}`);
    }
    if (this.config.queryPage !== '') {
      queries.push(`${this.config.queryPage}=${this.currentPage}`);
    }
    if (this.config.queryPerPage !== '') {
      queries.push(`${this.config.queryPerPage}=${this.config.perPage}`);
    }
    if (this.config.queryAsc !== '') {
      queries.push(`${this.config.queryAsc}=${String(this.config.asc).toLowerCase()}`);
    }
    let queryString = '';
    if (queries.length > 0) {
      queryString = (this.config.url.includes('?') ? '&' : '?') + `${queries.join('&')}`;
    }
    let payload = {};
    if (this.config.data != null) {
      const search: string = this.input.value;
      const json = JSON.stringify(this.config.data)
        .replace('#SEARCH', search)
        .replace('"#ASC"', String(this.config.asc).toLowerCase())
        .replace('"#PER_PAGE"', this.config.perPage.toString())
        .replace('"#PAGE"', this.currentPage.toString());
      payload = JSON.parse(json);
    }
    switch (method) {
      case 'GET':
        request = this.http.get(`${this.config.url}${queryString}`, { observe: 'response' });
        break;
      case 'POST':
        request = this.http.post(`${this.config.url}${queryString}`, payload, { observe: 'response' });
        break;
      case 'PUT':
        request = this.http.put(`${this.config.url}${queryString}`, payload, { observe: 'response' });
        break;
    }
    if (request != null) {
      this.loading = true;
      this.searchSubscription = request
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe(response => {
          const search: string = this.input.value;
          this.changeSearch = search;
          const data: ComboboxResponse = {
            response,
            callback: (items: ComboboxItem[]) => {
              items.forEach((value) => {
                this.elements.push(value);
              });
            }
          };
          this.onServerData.emit(data);
        });
    }
  }

  scroll(event) {
    if (!this.serverSide) {
      return;
    }
    const offsetHeight: number = event.srcElement.offsetHeight;
    const scrollTop: number = event.srcElement.scrollTop;
    const scrollHeight: number = event.srcElement.scrollHeight;
    if (offsetHeight + scrollTop >= scrollHeight) {
      this.currentPage = this.currentPage + 1;
      this.serverData();
    }
  }
  clearSelected(event: Event) {
    event.preventDefault();

    this.writeValue(null);
    this.onChange(this.currentValue);
    this.onTouched();
  }
  empty() {
    this.elements = [];
    this.input.setValue('');

    this.writeValue(null);
    this.onChange(this.currentValue);
    this.onTouched();
  }
  onBlur(event) {
    if (event.sourceCapabilities == null) {
      if (this.expanded) {
        this.expanded = false;
      }
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.elementRef.nativeElement.contains(event.target)) {
    } else {
      this.expanded = false;
    }
  }
}
