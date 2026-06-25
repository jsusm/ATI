let profiles = []
let config = {}

function requireElementById(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id ${elementId} does not exists.`)
  }
  return element
}

function setElementProperty(element, property, value) {
  element[property] = value
}

function setSimpleTextElement(confKey, elementId) {
  setElementProperty(requireElementById(elementId), 'innerText', config[confKey])
}

function setPlaceholder2Element(confKey, elementId) {
  setElementProperty(requireElementById(elementId), 'placeholder', config[confKey])
}

function setTextElementByList(confKey, elementIds) {
  elementIds.forEach((elementId, idx) => {
    setElementProperty(requireElementById(elementId), 'innerText', config[confKey][idx])
  })
}

function createStudentCard(ci, imgExt, name) {
  // const userCard = document.createElement('a')
  //
  const nextUrl = new URL(window.location.href)
  nextUrl.pathname = "/profile.html"
  nextUrl.searchParams.set('studentCI', ci)
  return `
    <a id="${ci}" class="student-card">
     <div class="student-card_img_container">
       <picture>
         <source media="(min-width: 768px)" srcset="/static/${ci}/${ci}Big${imgExt}">
         <img class="student-card_img" src="/static/${ci}/${ci}Small${imgExt}" alt="Imagen de perfil">
       </picture>
     </div>
     <div class="student-card_content">
       <p>${name}</p>
     </div>
    </a>
  `
}

function renderStudents(query='') {
  const gallery = requireElementById('gallery-container')

  let filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(query))

  if (filteredProfiles.length == 0) {
    gallery.innerHTML = `
    <p class="gallery-fallback-message">${config['gallery-fallback-message'].replace('[query]', query)}</p>
    `
    gallery.className = ""
  }

  const studentCards = filteredProfiles.map(student => createStudentCard(student.ci, student.image_ext, student.name)).join("\n")
  gallery.innerHTML = studentCards
}

async function changeLanguage(language) {
  await loadLangConfig(language)
  await loadProfiles()

  const setLangUrl = new URL(window.location.origin + '/index.py/set-lang')
  setLangUrl.searchParams.set('lang', language)

  await fetch(setLangUrl)
}

async function loadLangConfig(language) {
  const langConfigUrl = new URL(window.location.origin + `/static/conf/config${language}.json`)
  config = await fetch(langConfigUrl).then(res => res.json())
}

async function loadProfiles() {
  const profilesUrl = new URL(window.location.origin + '/static/data/index.json')
  profiles = await fetch(profilesUrl).then(res => res.json())
}

function setUpLangButton() {
  const langButtons = ['EN', 'ES', 'PT']
  langButtons.forEach(btn => {
    document.getElementById(`change-lang-${btn}`)
      .addEventListener('click', () => {
        changeLanguage(btn).then(populateLanguage)
      })
  })
}

function setUpResponsiveNavButton() {
  const button = document.getElementById('nav-burger-button')
  const header = document.getElementById('main-header')
  button.addEventListener('click', () => {
    header.classList.toggle('unfolded')
  })
}

function setUpSearchForm() {
  const form = document.getElementById("search-form")

  const query = new URL(window.location.href).searchParams.get('query')
  if (query) {
    const input = document.getElementById('search-input')
    input.value = query
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const query = formData.get('query')
    renderStudents(query)
  })
}

setUpLangButton()
setUpSearchForm()
setUpResponsiveNavButton()

loadProfiles()
loadLangConfig(lang)

function populateLanguage() {
  setSimpleTextElement('search', 'search-button')
  setPlaceholder2Element('name', 'search-input')
  setSimpleTextElement('semester', 'main-title')
  setSimpleTextElement('copyRight', 'copyright')
  setTextElementByList('site', ['logo-text-0', 'logo-text-1', 'logo-text-2'])

  renderStudents()
}
