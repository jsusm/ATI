FROM ubuntu/apache2

RUN apt-get update

## remove neovim later
RUN apt-get install apache2 apache2-utils ssl-cert libapache2-mod-wsgi-py3 python3 python3-pip python3-venv neovim -y

COPY . /var/www/html/

RUN a2enmod wsgi

COPY apacheConf/mod-wsgi.conf /etc/apache2/conf-available/

RUN a2enconf mod-wsgi.conf

WORKDIR /var/www/html

RUN python3 -m venv .venv

RUN .venv/bin/pip install -r requirements.txt
