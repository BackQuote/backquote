import 'whatwg-fetch';

const baseUrl = 'http://localhost:5000';
const optionsDefaults = {
  credentials: 'same-origin',
};

class api {
  constructor(base = '', options) {
    this.base = base;
    this.options = options || {};
  }

  get(path, options) {
    return this.fetch('get', path, options);
  }

  post(path, options) {
    return this.fetch('post', path, options);
  }

  fetch(method, path = '', options) {
    const url = `${this.base}/${path}`;
    options = Object.assign({}, optionsDefaults, this.options, options || {});
    options.method = method;

    return fetch(url, options).then(response => {
      if (response.ok) {
        return response.json();
      }
      let error = new Error(`Error ${response.status}: ${response.statusText}`);
      error.response = response;
      throw error;
    }).then((json) => {
      return json;
    }).catch((error) => {
      return Promise.reject(error);
    });
  }
}

export default new api(baseUrl, optionsDefaults);