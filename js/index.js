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
  userCard.className = "student-card"
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
    const nextUrl = new URL(window.location.href)
    nextUrl.pathname = "/profile.html"
    nextUrl.searchParams.set('studentCI', ci)
    window.location.assign(nextUrl)
  })
  return userCard
}

function renderStudents() {
  const gallery = requireElementById('gallery-container')
  profiles.forEach((student) => {
    const studentCard = createStudentCard(student.ci, student.image_ext, student.name)
    gallery.appendChild(studentCard)
  })
}


setSimpleTextElement('search', 'search-button')
setPlaceholder2Element('name', 'search-input')
setSimpleTextElement('semester', 'main-title')
setSimpleTextElement('copyRight', 'copyright')
setTextElementByList('site', ['logo-text-0', 'logo-text-1', 'logo-text-2'])

renderStudents()
