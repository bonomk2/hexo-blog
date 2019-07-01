---
title: Django Tutorial 3
date: 2017-04-06 17:50:00
categories:
- dev
tags:
- python
- django
---

이번편은 배포와 View 생성에 대해서 정리한다.
배포는 뜬금포로 나오는데 자세한건 생략하고 앞에서 모델을 구성하였으니 urls, View를 설정한다.


# 배포

자세한 내용은 생략한다.
생략하는 이유는 로컬의 소스를 git으로 올리고.. 이것을 다시 외부서버에 올려서 그것을 오픈하는 내용인데
나와는 상관 없는것도 있고.. 일반적이지는 않은거 같다...

여튼 해당 내용은 패스...
다만 static 파일을 별도로 꺼내오는 부분이 있어 이 부분만 잠깐 언급하자면..

## 정적파일 모으기

정적인 파일을 별도의 static 폴더로 뺄 수 있는 기능인듯하다..

python manage.py collectstatic 으로 동작

<pre>
(myenv)~/workspace/django$ python manage.py collectstatic
</pre>

실행하면 정적 파일들을 static 폴더에 쭉 뽑아낸다..
웹서버로 보내기 위한 용도인거 같은데 자세한건 나중에 보면 알겠지..


# urls

mysite/urls.py를 열어서 원하는 경로를 추가한다.
mysite가 가장 기본이되는 곳이므로 이곳으로부터 출발하게 되는것 같다.

url은 regex를 사용하여도 되는데 유의할점은 regex 앞에 r을 추가해줘야 한다는거..
문자열 안에 특수문자가 있다는걸 알려주는 용도이다.

* mysite/urls.py

```python
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
	url(r'', include('blog.urls')),
]
```

모든거에 대해서 blog 밑에 있는 urls를 담겠다는 뜻인듯하고..
이후에 blog 폴더밑에 urls.py를 생성하여 아래와 같이 추가

* blog/urls.py

```python
from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.post_list, name='post_list'),
]
```

^$ 라고 정의하면 아무것도 매칭되지 않는다는 뜻이니 루트로 접속한 경우에 post_list 라는 녀석을 보여라라는 뜻이된다.


## View

경로를 정의했으면 이에 매핑되는 뷰를 생성한다.
모델에서 정보를 받아와서 결과를 템플릿에 전달하는 역할을 하게 되는데 blog/views.py에서 정의 해준다.

* blog/views.py

```python
from django.shortcuts import render

def post_list(request):
	return render(request, 'blog/post_list.html', {})
```

blog/post_list.html 이라는 녀석이 있어야 하는데 이 파일은 blog/templates/blog 폴더를 생성하고 post_list.html을 작성하도록 한다.

* blog/templates/blog/post_list.html

```html
Hello post_list.html
```

{% asset_img 01_views.png %}

Post에 있는 데이터를 가져오는 쿼리셋을 추가
쿼리셋은 별도로 뒤에 다룰거다.. 지금은 동작 맛보기이므로 패스~~

* blog/views.py

```python
from django.shortcuts import render
from django.utils import timezone
from .models import Post


def post_list(request):
	posts = Post.objects.filter(create_date__lte=timezone.now()).order_by('-create_date')
	return render(request, 'blog/post_list.html', {'posts': posts})
```

디비에서 posts라는 딕셔너리로 값을 담아서 html에 전달하면 html에서는 해당 값을 꺼내 쓴다.

* blog/templates/blog/post_list.html

```html
<div>
    <h1><a href="/">Django Girls Blog</a></h1>
</div>

{% for post in posts %}
    <div>
        <p>published: {{ post.published_date }}</p>
        <h1><a href="">{{ post.title }}</a></h1>
        <p>{{ post.text|linebreaksbr }}</p>
    </div>
{% endfor %}
```

다시 페이지 접속하면 목록이 create_date 역순으로 출력되었다.

{% asset_img 02_list.png %}
