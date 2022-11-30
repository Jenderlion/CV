import { Languages } from "../../data.js";

class Language {
  constructor() {
  }

  _initProps() {
    this.allLang = ['en', 'ru']
    this.select = document.querySelector('#lang')
    this.langContainer = document.querySelector('.language-block');
    this.projectDescription = document.querySelector('.description__text')
  }

  changeUrlLang() {
    let lang = this.select.value;
    location.href = `${window.location.pathname}#${lang}`
    location.reload()
    this.select.value = lang;
  }

  changeLanguage() {
    let hash = window.location.hash.substr(1);
    if (!this.allLang.includes(hash)) {
      location.href = `${window.location.pathname}#en`
      location.reload();
    }
    this.select.value = hash;

    //page//
    for (let key in Languages.page) {
      let elem = document.querySelector('.lng-' + key);
      if (elem) elem.innerText = Languages.page[key][hash]
    }
  }

  init() {
    this._initProps()
    this.changeLanguage()
    this.langContainer.addEventListener('change', this.changeUrlLang.bind(this))
  }
}


export { Language };
