import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { ResourceApiItemModel } from '../types';
import { ExtractHostPipe } from '../../../util-pipes/extract-host';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-resources-pages-list',
  imports: [PageLayout, ExtractHostPipe, TitleCasePipe],
  template: `<app-ui-page title="Developer Resource List">
    @if (linksResource.isLoading()) {
      <span class="loading loading-spinner text-primary"></span>
    } @else {
      <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        @for (link of linksResource.value(); track link.id) {
          <div class="card bg-base-100 card-xs shadow-sm">
            <div class="card-body">
              <h2 class="card-title text-xl text-accent">{{ link.title }}</h2>
              <a class="btn btn-primary btn-xs" [href]="link.url" target="_blank"
                >Visit {{ link.url | extractHost | titlecase }}</a
              >
            </div>
          </div>
        } @empty {
          <div class="alert alert-error">No resources found.</div>
        }
      </div>
    }
  </app-ui-page>`,
  styles: ``,
})
export class ListPage {
  linksResource = httpResource<ResourceApiItemModel[]>(() => '/api/resources');
}
