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
  const userCard = document.createElement('a')

  const nextUrl = new URL(window.location.href)
  nextUrl.pathname = "/profile.html"
  nextUrl.searchParams.set('studentCI', ci)

  userCard.className = "student-card"
  userCard.href = nextUrl;
  userCard.innerHTML = `
    <div class="student-card_img">
      <picture>
        <source media="(min-width: 768px)" srcset="./${ci}/${ci}Big${imgExt}">
        <img src="./${ci}/${ci}Small${imgExt}" alt="Imagen de perfil">
      </picture>
    </div>
    <div class="student-card_content">
      <p>${name}</p>
    </div>
  `

  userCard.addEventListener("click", (e) => {
    e.preventDefault()
    window.location.assign(nextUrl)
  })
  return userCard
}

function renderStudents() {
  const gallery = requireElementById('gallery-container')

  const url = new URL(window.location.href)
  const query = url.searchParams.get('query') ?? ''
  let filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(query))

  if(filteredProfiles.length == 0) {
    gallery.innerHTML = `
    <p class="gallery-fallback-message">${config['gallery-fallback-message'].replace('[query]', query)}</p>
    `
    gallery.className = ""
  }

  filteredProfiles.forEach((student) => {
    const studentCard = createStudentCard(student.ci, student.image_ext, student.name)
    gallery.appendChild(studentCard)
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

function setUpResponsiveNavButton() {
  const button = document.getElementById('nav-burger-button')
  const header = document.getElementById('main-header')
  button.addEventListener('click', () => {
    console.log("toggle")
    header.classList.toggle('unfolded')
  })
}

setUpResponsiveNavButton()

function setUpSearchForm() {
  const form = document.getElementById("search-form")

  const query = new URL(window.location.href).searchParams.get('query')
  if(query) {
    const input = document.getElementById('search-input')
    input.value = query
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const query = formData.get('query')
    const nextUrl = new URL(window.location.href)
    nextUrl.pathname = '/'
    nextUrl.searchParams.set('query', query)
    window.location.assign(nextUrl)
  })
}

setUpSearchForm()

loadLanguageConfig().then(() => {
  setSimpleTextElement('search', 'search-button')
  setPlaceholder2Element('name', 'search-input')
  setSimpleTextElement('semester', 'main-title')
  setSimpleTextElement('copyRight', 'copyright')
  setTextElementByList('site', ['logo-text-0', 'logo-text-1', 'logo-text-2'])

  renderStudents()
})

