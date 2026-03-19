import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { BooksApiItemModel } from '../types';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-books-pages-list',
  imports: [PageLayout, JsonPipe],
  template: `<app-ui-page title="List">
    <pre>{{ booksResource.value() | json }}</pre>
  </app-ui-page>`,
  styles: ``,
})
export class ListPage {
  booksResource = httpResource<BooksApiItemModel[]>(() => '/api/books');
}
