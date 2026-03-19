import { Component, signal } from '@angular/core';
import { form, required, minLength, FormField, FormRoot } from '@angular/forms/signals';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { ResourceApiCreateModel } from '../types';
import { FormInputComponent } from '@ht/shared/ui-common/forms/inputs/form-input';

@Component({
  selector: 'app-resources-pages-add-2',
  imports: [PageLayout, FormField, FormRoot, FormInputComponent],
  template: `<app-ui-page title="An Alternative Add Link Form">
    @if (form().invalid() && submittedWithErrors()) {
      <div class="alert alert-soft p-8 rounded-lg">
        <div class="flex flex-col gap-2">
          <p class="text-2xl text-yellow-300">
            Please fix the errors in the form before submitting.
          </p>
          @for (e of form().errorSummary(); track e) {
            <p class="text-yellow-600 ml-10">- {{ e.message }}</p>
          }
        </div>
      </div>
    }
    <form [formRoot]="form">
      <app-ui-form-input
        [formField]="form.title"
        id="title"
        label="Title"
        hint="A brief title for the link you want to share"
      />
      <app-ui-form-input
        [formField]="form.url"
        id="url"
        label="URL"
        hint="The URL for the resource you want to share"
      />
      <div class="pt-4 ">
        <button class="btn btn-sm p-4 btn-primary" type="submit">Add Link</button>
      </div>
    </form>
  </app-ui-page>`,
  styles: ``,
})
export class Add2Page {
  #model = signal<ResourceApiCreateModel>({ title: '', url: '' });
  submittedWithErrors = signal(false);
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
          this.submittedWithErrors.set(true);
        },
      },
    },
  );
}
