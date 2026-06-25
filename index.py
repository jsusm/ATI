from beaker.middleware import SessionMiddleware

def app(environ, start_response):
    session = environ['beaker.session']

    if 'count' in session:
        session['count'] += 1
    else:
        session['count'] = 0

    count = session['count']

    session.save()

    status = "200 OK"
    headers = [('Content-Type', 'text/html')]
    start_response(status, headers)
    return [b'hello world, count: %d' % count]

session_opts = {
        'session.type': 'cookie',
        'session.cookie_expires': True,
        'session.validate_key': 'put_a_long_random_secret_string_here',
}

application = SessionMiddleware(app, session_opts)
