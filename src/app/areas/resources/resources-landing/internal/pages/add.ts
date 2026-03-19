import { Component, signal } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { ResourceApiCreateModel } from '../types';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-resources-pages-add',
  imports: [PageLayout, FormField, FormRoot],
  template: `<app-ui-page title="Add a Link">
    <form [formRoot]="form">
      <div class="form-control p-4 ">
        <label class="label validator" for="title"
          ><span class="label-text font-medium">Title</span></label
        >
        <input
          class="input input-sm "
          [class.input-error]="
            form.title().invalid() && (form.title().dirty() || form.title().touched())
          "
          [formField]="form.title"
          id="title"
          type="text"
        />
        @if (form.title().invalid() && (form.title().dirty() || form.title().touched())) {
          @for (e of form.title().errors(); track e) {
            <p class="text-sm text-error ml-24 pt-4">{{ e.message }}</p>
          }
        }
      </div>
      <div class="form-control p-4">
        <label class="label validator" for="url"
          ><span class="label-text font-medium">URL</span></label
        >
        <input
          class="input input-sm "
          id="url"
          [formField]="form.url"
          type="text"
          [class.input-error]="form.url().invalid() && (form.url().dirty() || form.url().touched())"
        />
        @if (form.url().invalid() && (form.url().dirty() || form.url().touched())) {
          @for (e of form.url().errors(); track e) {
            <p class="text-sm text-error ml-24 pt-4">{{ e.message }}</p>
          }
        }
      </div>

      <div class="pt-4 ">
        <button class="btn btn-sm p-4 btn-primary" type="submit">Add Link</button>
      </div>
    </form>
  </app-ui-page>`,
  styles: `
    .form-control {
      label {
        padding-right: 2rem;
      }
    }
  `,
})
export class AddPage {
  #model = signal<ResourceApiCreateModel>({ title: '', url: '' });
  form = form(
    this.#model,
    (s) => {
      required(s.title, { message: 'We need a title for this link' });
      minLength(s.title, 3, { message: 'Title must be at least 3 characters long' });
      required(s.url, { message: 'We need a URL for this link' });
    },
    {
      submission: {
        action: async (form) => {
          const val = form().value();
          console.log(val);
        },
        onInvalid: (form) => {
          form().errorSummary()[0]?.fieldTree().focusBoundControl();
        },
      },
    },
  );
}
