import json
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from beaker.middleware import SessionMiddleware

class AppCookieData:
    def __init__(self):
        self.lang = 'ES'
        self.ci = None
        pass

    def get_data_from_session(self, session, key, default):
        if key in session:
            return session[key]
        else:
            return default

    def load_from_session(self, session):
        self.lang = self.get_data_from_session(session, 'lang', self.lang)
        self.ci = self.get_data_from_session(session, 'ci', self.ci)

    def load_to_session(self, session):
        session['lang'] = self.lang
        session['ci'] = self.ci

def get_lang_data(lang: str):
    data_path = Path('./static/conf/')
    lang_file = f"config{lang}.json"
    with open(data_path / lang_file, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data

def get_profiles_data():
    data_path = Path('./static/data/index.json')
    with open(data_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data

def render(data: AppCookieData):
    lang = get_lang_data(data.lang)
    profiles = get_profiles_data()
    return render_shell(data, render_index_page(lang, profiles), lang)

def handleIndexPage(environ, start_response):
    pass

def app(environ, start_response):
    session = environ['beaker.session']

    session_data = AppCookieData()
    session_data.load_from_session(session)

    if(environ['REQUEST_URI'].startswith('/index.py/set-lang')):
        url = f'https://somedomain.com{environ['REQUEST_URI']}'
        query_string = urlsplit(url).query
        lang = parse_qs(query_string)['lang'][0]

        session_data.lang = lang
        session_data.load_to_session(session)
        session.save()

        status = "200 OK"
        headers = [('Content-Type', 'text/html')]
        start_response(status, headers)
        return [lang.encode()]


    status = "200 OK"
    headers = [('Content-Type', 'text/html')]
    start_response(status, headers)
    html = render(session_data)
    binary_html = html.encode('utf-8')
    return [binary_html]

session_opts = {
        'session.type': 'cookie',
        'session.cookie_expires': True,
        'session.validate_key': 'put_a_long_random_secret_string_here',
}

application = SessionMiddleware(app, session_opts)

def render_shell(session_data: AppCookieData, content: str, lang):
    ci = session_data.ci
    if ci == None:
        ci = 'undefined'
    return f"""
<!DOCTYPE html>
<html>

<head>
  <title>ATI[UCV]Log 2026-1</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" sizes="32x32" href="/static/icon/cropped-logonuevo-32x32.png">
  <link rel="icon" sizes="192x192" href="/static/icon/cropped-logonuevo-192x192.png">
  <link rel="stylesheet" href="/static/css/style.css">
  <script src="/static/js/index.js" defer></script>
  <script>
    const lang = "{session_data.lang}"
    const ci = {ci}
  </script>
</head>

<body>
  <header class="unfolded" id="main-header">
    <div class="title-container">
      <a href="/" id="logo">
          <span id="logo-text-0">{lang['site'][0]}</span>
          <span id="logo-text-1" class="logo-small-subtext">{lang['site'][1]}</span>
          <span id="logo-text-2">{lang['site'][2]}</span>
      </a>

      <button class="nav-responsive-menu" id="nav-burger-button">
        <img src="/static/icon/menuIcon.svg">
      </button>
    </div>
    <form id="search-form">
      <input id="search-input" name="query" placeholder="{lang['name']}">
      <button id="search-button" type="submit">{lang['search']}</button>
    </form>
    <div class="profile-button">
      <button id="change-lang-EN">Ingles</button>
      <button id="change-lang-PT">Portugues</button>
      <button id="change-lang-ES">Español</button>
      <div class="user-icon">
        <img src="/static/icon/userIcon.svg">
      </div>
    </div>
  </header>
  {content}
</body>

</html>
"""


def render_profiles(lang, profiles):
    out = ""
    for profile in profiles:
        ci = profile['ci']
        imgExt = profile['image_ext']
        name = profile['name']
        out += f"""
    <a id="{ci}" class="student-card">
     <div class="student-card_img_container">
       <picture>
         <source media="(min-width: 768px)" srcset="/static/{ci}/{ci}Big{imgExt}">
         <img class="student-card_img" src="/static/{ci}/{ci}Small{imgExt}" alt="Imagen de perfil">
       </picture>
     </div>
     <div class="student-card_content">
       <p>{name}</p>
     </div>
    </a>
        """

    return out


def render_index_page(lang, profiles):
    profiles = render_profiles(lang, profiles)
    return f"""
  <section class="content">
    <h1 id="main-title">
      {lang['semester']}
    </h1>
    <div class="gallery" id="gallery-container">
    {profiles}
    </div>
  </section>
  <footer>
    <p id="copyright">
    {lang['copyRight']}
    </p>
  </footer>
"""
