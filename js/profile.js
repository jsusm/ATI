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

function setElementProfileText(profileKey, elementId) {
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

function setSimpleTextElement(confKey, elementId) {
  setElementProperty(requireElementById(elementId), 'innerText', config[confKey])
}

function setPlaceholder2Element(confKey, elementId) {
  setElementProperty(requireElementById(elementId), 'placeholder', config[confKey])
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
        <source media="(min-width: 768px)" srcset="/${ci}/${ci}Big${imgExt}">
        <img src="/${ci}/${ci}Small${imgExt}" alt="Imagen de perfil">
      </picture>
  `
}

function loadStudentProfile() {
  const url = new URL(window.location.href)

  const studentCI = url.searchParams.get("studentCI")

  const script = document.createElement('script')
  script.src = `/${studentCI}/profile.json`
  script.type = "text/javascript"
  document.head.appendChild(script)

  return new Promise((resolve) => {
    script.addEventListener('load', resolve)
  })
}

function loadLanguageConfig() {
  const url = new URL(window.location.href)

  let lang = url.searchParams.get("lang") ?? "ES"

  const script = document.createElement('script')
  script.src = `/conf/config${lang}.json`
  script.type = "text/javascript"
  document.head.appendChild(script)

  return new Promise((resolve) => {
    script.addEventListener('load', resolve)
  })
}

Promise.all([loadStudentProfile(), loadLanguageConfig()]).then(() => {
  // load general text
  setSimpleTextElement('search', 'search-button')
  setPlaceholder2Element('name', 'search-input')
  setSimpleTextElement('copyRight', 'copyright')
  setTextElementByList('site', ['logo-text-0', 'logo-text-1', 'logo-text-2'])

  // load profile text
  setUpProfileImg(profile['ci'], profile['image_ext'])

  setElementProfileText('name', 'student-name')
  setElementProfileText('description', 'student-description')

  setSimpleTextElement('color', 'favorite-color-key')
  setElementProfileText('color', 'favorite-color-value')

  setSingularPlurarTextElement('book', 'favorite-book-key')
  setElementProfileText('book', 'favorite-book-value')

  setSingularPlurarTextElement('music', 'favorite-music-key')
  setElementProfileText('music', 'favorite-music-value')

  setSingularPlurarTextElement('video_game', 'favorite-game-key')
  setElementProfileText('video_game', 'favorite-game-value')

  setSimpleTextElement('language', 'learned-languages-key')
  setElementProfileText('language', 'learned-languages-value')

  setSimpleTextElement('gender', 'gender-key')
  setElementProfileText('gender', 'gender-value')

  setSimpleTextElement('birth_date', 'birth_date-key')
  setElementProfileText('birth_date', 'birth_date-value')

  setSimpleTextElement('email', 'contact-copy')
  setElementProperty(requireElementById('contact-anchor'), 'href', `mailto:${profile['email']}`)
  setElementProfileText('email', 'contact-anchor')
})
