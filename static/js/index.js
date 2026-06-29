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

function setElementProfileText(profile, profileKey, elementId) {
  let content = profile[profileKey]
  if (Array.isArray(content)) {
    content = content.join(', ')
  }
  setElementProperty(
    requireElementById(elementId),
    'innerText',
    content
  )
}

function setSingularPlurarTextElement(confKey, elementId, nvalues) {
  let plural = nvalues > 1 ? 0 : 1
  setElementProperty(
    requireElementById(elementId),
    'innerText',
    config[confKey][plural]
  )
}

function setTextElementByList(confKey, elementIds) {
  elementIds.forEach((elementId, idx) => {
    setElementProperty(requireElementById(elementId), 'innerText', config[confKey][idx])
  })
}

function setUpProfileImg(ci, imgExt) {
  const imgContainer = requireElementById('img-container')
  imgContainer.innerHTML = `
      <picture>
        <source media="(min-width: 768px)" srcset="/static/${ci}/${ci}Big${imgExt}">
        <img src="/static/${ci}/${ci}Small${imgExt}" alt="Imagen de perfil">
      </picture>
  `
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

function renderStudents(query = '') {
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

async function loadStudentProfile(ci) {
  const url = new URL(window.location.origin + `/static/${ci}/profile.json`)

  const profile = await fetch(url).then(res => res.json())

  return profile
}

function setUpLangButton() {
  const langButtons = ['EN', 'ES', 'PT']
  langButtons.forEach(btn => {
    document.getElementById(`change-lang-${btn}`)
      .addEventListener('click', () => {
        changeLanguage(btn).then(populatePage)
      })
  })
}

async function setCi(_ci) {
  const setCIUrl = new URL(window.location.origin + `/index.py/set-ci`)
  setCIUrl.searchParams.set('ci', _ci)
  await fetch(setCIUrl)
  ci = _ci == "null" ? undefined : Number(_ci)
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
    setCi('null').then(setIndexContent).then(() => renderStudents(query)).then(setUpStudentProfiles)
  })
}

function setUpLogoLink() {
  document.getElementById('logo').addEventListener('click', () => {
    setCi('null').then(setIndexContent)
  })
}

function setUpStudentProfiles() {
  Array.from(document.getElementsByClassName('student-card')).forEach(e => {
    e.addEventListener('click', () => {
      setCi(e.id).then(setProfileContent)
    })
  })
}

function setIndexContent() {
  document.getElementById('main').innerHTML = `
    <section class="content">
    <h1 id="main-title">
    </h1>
    <div class="gallery" id="gallery-container">
    </div>
  </section>
  `
  populatePage()
}
function setProfileContent() {
  document.getElementById('main').innerHTML= `
  <section class="user-profile">
    <div class="user-profile_img_container" id="img-container">
    </div>

    <div class="user-profile_content">
      <h1 id="student-name"></h1>
      <p id="student-description" class="user-profile_content_description">
      </p>
      <table>
        <tbody>
          <tr>
            <td class="user-profile_content_qualities-keys" id="favorite-color-key">
            </td>
            <td id="favorite-color-value">
            </td>
          </tr>
          <tr>
            <td class="user-profile_content_qualities-keys" id="favorite-book-key">
            </td>
            <td id="favorite-book-value">
            </td>
          </tr>
          <tr>
            <td class="user-profile_content_qualities-keys" id="favorite-music-key">
            </td>
            <td id="favorite-music-value">
            </td>
          </tr>
          <tr>
            <td class="user-profile_content_qualities-keys" id="favorite-game-key">
            </td>
            <td id="favorite-game-value">
            </td>
          </tr>
          <tr>
            <td class="user-profile_content_qualities-keys" id="learned-languages-key">
            </td>
            <td id="learned-languages-value">
            </td>
          </tr>
          <tr>
            <td class="user-profile_content_qualities-keys" id="gender-key">
            </td>
            <td id="gender-value">
            </td>
          </tr>
          <tr>
            <td class="user-profile_content_qualities-keys" id="birth_date-key">
            </td>
            <td id="birth_date-value">
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <span id="contact-copy"></span>
        <a id="contact-anchor"></a>
      </p>
    </div>
  </section>
  `
  populatePage()
}


setUpLangButton()
setUpSearchForm()
setUpResponsiveNavButton()
setUpLogoLink()
setUpStudentProfiles()


loadProfiles()
loadLangConfig(lang)

function populateShell() {
  setSimpleTextElement('search', 'search-button')
  setPlaceholder2Element('name', 'search-input')
  setSimpleTextElement('copyRight', 'copyright')
  setTextElementByList('site', ['logo-text-0', 'logo-text-1', 'logo-text-2'])
}

function populatePage() {
  populateShell()

  if (ci) {
    populateProfile()
  } else {
    setSimpleTextElement('semester', 'main-title')
    renderStudents()
    setUpStudentProfiles()
  }
}

async function populateProfile() {
  const profile = await loadStudentProfile(ci)
  setUpProfileImg(ci, profile.image_ext)
  // load profile text

  setElementProfileText(profile, 'name', 'student-name')
  setElementProfileText(profile, 'description', 'student-description')

  setSimpleTextElement('color', 'favorite-color-key')
  setElementProfileText(profile, 'color', 'favorite-color-value')

  setSingularPlurarTextElement('book', 'favorite-book-key')
  setElementProfileText(profile, 'book', 'favorite-book-value')

  setSingularPlurarTextElement('music', 'favorite-music-key')
  setElementProfileText(profile, 'music', 'favorite-music-value')

  setSingularPlurarTextElement('video_game', 'favorite-game-key')
  setElementProfileText(profile, 'video_game', 'favorite-game-value')

  setSimpleTextElement('language', 'learned-languages-key')
  setElementProfileText(profile, 'language', 'learned-languages-value')

  setSimpleTextElement('email', 'contact-copy')
  setElementProperty(requireElementById('contact-anchor'), 'href', `mailto:${profile['email']}`)
  setElementProfileText(profile, 'email', 'contact-anchor')
}
