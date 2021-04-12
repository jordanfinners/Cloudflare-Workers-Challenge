class EventsList extends HTMLElement {
  get isLoading() {
    return this._isLoading;
  }

  set isLoading(val) {
    this._isLoading = val;
    this._render();
  }

  get isError() {
    return this._isError;
  }

  set isError(val) {
    this._isError = val;
    this._render();
  }

  constructor() {
    super();
    this.loadEvents();
  }

  async loadEvents() {
    this.isError = false;
    this.isLoading = true;
    try {
      const response = await fetch('https://cloudflare-challenge-api.finners.workers.dev');
      if (!response.ok) {
        throw new Error(`Failed to load events ${response}`);
      }
      this.events = await response.json();
    } catch (e) {
      this.isError = true;
    } finally {
      this.isLoading = false;
    }
  }

  event(title, description, date, time) {
    const event = document.createElement('div');
    event.className = 'event';

    const nameElement = document.createElement('h3');
    nameElement.className = 'name';
    nameElement.textContent = title;

    const dateElement = document.createElement('p');
    dateElement.className = 'date';
    dateElement.textContent = `Held on ${new Date(date)}`;

    const timeElement = document.createElement('p');
    timeElement.className = 'time';
    timeElement.textContent = `Starting at ${time}`;

    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'description';
    descriptionElement.textContent = description;

    event.appendChild(nameElement);
    event.appendChild(dateElement);
    event.appendChild(timeElement);
    event.appendChild(descriptionElement);
    return event;
  }

  init() {
    const wrapper = document.createElement('div');
    wrapper.id = 'events';

    this.appendChild(wrapper);
    return wrapper;
  }

  _render() {
    this.childNodes.forEach((child) => this.removeChild(child));

    if (this.isLoading) {
      const status = document.createElement('p');
      status.className = 'status';
      status.textContent = 'Loading events near you...';
      this.appendChild(status);
      return;
    }
    if (this.isError) {
      const status = document.createElement('p');
      status.className = 'status';
      status.textContent = '😔 Fail, we weren\'t able to load any events.';
      this.appendChild(status);
      return;
    }
    const wrapper = this.init();

    if (!this.events) {
      return;
    }

    if (this.events.length === 0) {
      const status = document.createElement('p');
      status.className = 'status';
      status.textContent = 'There are no events near you yet, create your own below.';
      this.appendChild(status);
      return;
    }

    this.events.forEach((event) => {
      const element = this.event(event.title, event.description, event.date, event.time);
      wrapper.appendChild(element);
    });
    return;
  }
}
window.customElements.define('events-list', EventsList);
