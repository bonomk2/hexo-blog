---
title: Django Tutorial 2
date: 2017-04-06 16:00:00
categories:
- python
- django
tags:
- python
- django
---

Model 을 구성하고 실행하여 Database에 테이블을 생성하고 Admin 페이지에서 생성된것을 확인 해 본다.


# Model

데이터베이스의 스키마를 정의하고 테이블을 생성한 후, 외부에서 정의한 인터페이스로 데이터를
주고 받도록 하는 역할로 추측됨..
추후 동작에 대한 머릿속 정리가 되면 내용을 수정할 예정.. 내가 써놓고도 이해가 안감..

## 어플리케이션 생성

python manage.py startapp [AppName] 의 형태로 어플리케이션을 생성한다.

```sh
(myenv)~/workspace/django$ python manage.py startapp blog
```

mysite/setting.py를 열어 INSTALLED_APPS 항목에 blog를 추가하여 APP을 알려준다.

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',
]
```

## 모델 정의

blog/models.py 파일을 아래와 같이 작성한다.

```python
from django.db import models
from django.utils import timezone

class Post(models.Model):
	author = models.ForeignKey('auth.User')
	title = models.CharField(max_length=200)
	text = models.TextField()
	create_date = models.DateTimeField(default=timezone.now)
	publish_date = models.DateTimeField(blank=True, null=True)
	
	def publish(self):
		self.published_date = timezone.now()
		self.save()
		
	def __str__(self):
		return self.title
```

유의할점은 Post는 첫글자를 대문자로..
models.Model 값은 장고 모델임을 의미한단다..
자세한 내용은 Document ( https://docs.djangoproject.com/en/1.11/ref/models/ )를 참고

## 테이블 만들기

python manage.py makemigrations [AppName] 를 사용하여 정의한 모델을 생성

```
(myenv)~/workspace/django$ python manage.py makemigrations blog
Migrations for 'blog':
  blog\migrations\0001_initial.py
    - Create model Post
```

python manage.py migrate [AppName] 을 사용하여 마이그레이션..

```
(myenv)~/workspace/django$ python manage.py migrate blog
Operations to perform:
  Apply all migrations: blog
Running migrations:
  Applying blog.0001_initial... OK
```

실행하면 디비테이블이 생성된다고 한다..
눈에 보이는게 없으니..... 답답하구나.....

# Admin

## 관리자 구동

앞서 생성한 모델(?)을 admin에 등록해야 하는듯...
blog/admin.py 파일에 아래와 같이 작성한다.

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

파일 작성후 서버를 구동하고 브라우저로 접속

```
(myenv)~/workspace/django$ python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).
April 06, 2017 - 16:53:09
Django version 1.11, using settings 'mysite.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

http://127.0.0.1:8000/admin 으로 접속

{% asset_img 01_run.png %}

근데 계정을 모른다... 슈퍼유저를 새로 생성한다..
작업 순서가 오째 나와는 좀 안맞.... -_-;;

```
(myenv)~/workspace/django$ python manage.py createsuperuser
Username (leave blank to use 'bonobono'): bonobono
Email address: me@bonobono.net
Password:
Password (again):
Superuser created successfully.
```

다시 접속하여 ID/PASS 를 입력하면 로그인이 된다.

{% asset_img 02_admin.png %}

오... 신기신기..

관리자에 생성된 Posts를 클릭하여 글을 작성하고 수정해본다..

{% asset_img 03_posting.png %}

admin과 관련한 내용은 https://docs.djangoproject.com/en/1.11/ref/contrib/admin/ 를 참고


지금까지 한 내용을 쭉 따라 왔다면 지금 내가 느끼는 감정과 동일할거라 생각한다..
Admin은 뭐하는 놈이고.. 그래서 어떻게 개발해서 동작하는건데.. 라는.. 
강좌를 더 보다보면 답이 나오겠지... -_-;;;;
