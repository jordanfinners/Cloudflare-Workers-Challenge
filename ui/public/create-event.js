import {getFormJSON} from './forms.js';
class CreateEvent extends HTMLElement {
  constructor() {
    super();
    this._render();
  }

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(val) {
    this._isLoading = val;
    this._renderStatus();
  }

  get isError() {
    return this._isError;
  }

  set isError(val) {
    this._isError = val;
    this._renderStatus();
  }

  async submit(formData) {
    const response = await fetch(`https://cloudflare-challenge-api.finners.workers.dev`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      return Promise.reject(new Error(`Not valid ${response}`));
    }
    return Promise.resolve();
  }

  async handleSubmission(event) {
    event.preventDefault();
    this.isError = false;
    this.isLoading = true;
    try {
      const valid = this.form.reportValidity();
      if (valid) {
        const result = getFormJSON(this.form);
        await this.submit(result);
      }
    } catch (e) {
      this.isError = true;
    } finally {
      this.isLoading = false;
    }
  }

  get nameInput() {
    const label = document.createElement('label');
    label.textContent = 'What is the title of your event? \n This will be displayed publicly, please keep it PG.';

    const input = document.createElement('input');
    input.name = 'title';
    input.type = 'text';
    input.placeholder = 'e.g. Talking about Cloudflare Workers';
    input.required = true;

    label.appendChild(input);
    return label;
  }

  get descriptionInput() {
    const label = document.createElement('label');
    label.textContent = 'How would you describe your event?';

    const input = document.createElement('textarea');
    input.name = 'description';
    input.placeholder = 'e.g. A description about your event';
    input.required = true;

    label.appendChild(input);
    return label;
  }

  get dateInput() {
    const label = document.createElement('label');
    label.textContent = 'When will your event be held?';

    const input = document.createElement('input');
    input.name = 'date';
    input.type = 'date';
    input.placeholder = 'e.g. DD/MM/YYYY';
    input.required = true;

    label.appendChild(input);
    return label;
  }

  get timeInput() {
    const label = document.createElement('label');
    label.textContent = 'When will your event start?';

    const input = document.createElement('input');
    input.name = 'time';
    input.type = 'time';
    input.placeholder = 'e.g. HH:mm';
    input.required = true;

    label.appendChild(input);
    return label;
  }

  _renderStatus() {
    if (this.isLoading) {
      this.status.textContent = 'Saving your event...';
      return;
    }
    if (this.isError) {
      this.status.textContent = '😔 Fail, we weren\'t able to save your event.';
      return;
    }
    this.status.textContent = ''
    return;
  }

  _render() {
    this.childNodes.forEach((child) => this.removeChild(child));

    const form = document.createElement('form');
    form.id = 'event';
    form.addEventListener('submit', this.handleSubmission.bind(this));

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Save my event';

    const cancel = document.createElement('button');
    cancel.type = 'reset';
    cancel.textContent = 'Cancel';

    const status = document.createElement('p');
    status.className = 'status';

    form.appendChild(this.nameInput);
    form.appendChild(this.descriptionInput);
    form.appendChild(this.dateInput);
    form.appendChild(this.timeInput);
    form.appendChild(button);
    form.appendChild(cancel);
    form.appendChild(status);

    this.appendChild(form);
    this.form = form;
    this.status = status;
  }
}
window.customElements.define('create-event', CreateEvent);
