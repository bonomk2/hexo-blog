---
title: Django Tutorial 1
date: 2017-04-05 20:30:35
categories:
- python
- django
tags:
- python
- django
---

홈페이지를 몇개 만들일이 있어서 요즘 이것저것 찾아보고 있다..
서버쪽은 Spring4, nodejs+express 를 봤는데... 아직까지 뭔가 맘에 안들어 python도 좀 봐야 할듯..
회사에서도 조만간 쓸일이 있을듯하니 겸사겸사 한번 짚고 넘어가는것이 좋을것 같다.

python은 hudson 돌리면서 텍스트 변경하고 하는것들이 해본것의 전부라서
제대로 익히려면 시간이 좀 걸릴거 같다... ES6도 아직 제대로 안 익힌 마당에 다 까먹겠... -_-;;

기본적인 튜토리얼은 장고걸스( https://tutorial.djangogirls.org/ko )를 기초로 작성하였고,
서버에 대한 내용만 쭉 작성할 예정이다.. 화면은 별도 포스팅으로...

이번 포스팅은 파이썬 설치, 장고 설치, 프로젝트 생성해서 서버기동까지..


# Python 설치
설치는 그냥 설치하자.... 회사에서 작업하다보니 나중에 우분투로 옮길것도 감안해야하는데..
우선은 기능 테스트만 몇가지 정도 해보면 되니까... 자세한 내용은 패스~!!

# Django 설치

## 가상환경 설정

가상환경(virtualenv)을 왜 만들고 어디다 써먹는지는 나중에 자세히 알아보련다..
우선은 튜토리얼에 있는대로 진행....

* 가상환경을 생성

```
~/workspace/django$ python -m venv myvenv
```

실행하면 django 폴더내에 myvenv 라는 폴더가 생성되고 거기에 기본 정보들이 셋팅된다..

* 가상환경 실행

```
~/workspace/django$ myvenv/Scripts/activate
(myenv)~/workspace/django$
```

생성한 가상환경을 activate 시키는것 같은데... 여튼 실행하면 앞에 생성한 가상환경 명이 붙는다.


## 장고 설치

pip를 이용해서 장고를 설치..

```
(myenv)~/workspace/django$ pip install django
...
(myenv)~/workspace/django$
```

# 프로젝트 생성

## 프로젝트 생성하기

django-admin을 사용하여 mysite라는 프로젝트를 생성한다. 

```
(myenv)~/workspace/django$ django-admin startproject mysite .
```

동작후에는 mysite라는 폴더가 생성되고 거기에 설정들이 들어가 있음..

## 프로젝트 설정 변경

mysite/setting.py 파일을 수정하여 TIME_ZONE을 수정하고, Static 경로를 최하단에 추가로 설정한다.
데이터베이스는 기본으로 sqlite3가 설정되어 있다는 DATABASES 값을 참고..

```
TIME_ZONE = 'Asia/Seoul'
...
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
```

이후에 변경된 설정을 migrate 시킴

```
(myenv)~/workspace/django$ python manage.py migrate
```

# 서버 기동

서버를 실행

```
(myenv)~/workspace/django$ python manage.py runserver
System check identified no issues (0 silenced).
April 05, 2017 - 21:14:31
Django version 1.11, using settings 'mysite.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

실행후 브라우저 확인
{% asset_img 01_run.png %}


첫 포스팅이니까.. 오늘은 여기까지... 잇힝~!!


