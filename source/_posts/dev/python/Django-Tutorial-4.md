---
title: Django Tutorial 4
date: 2017-04-07 16:00:00
categories:
- python
- django
tags:
- python
- django
---

view에 사용되는 템플릿에 대하여 자세히 보자.


# 정적파일 처리

css, js 등의 정적파일을 처리하는 부분이다..
그냥 인클루드하면 되는게 아니었...

static 파일들은 blog 폴더 아래 static 폴더를 생성하고 그 안에 넣는다.
css/blog.css 라는 파일을 생성하고자 한다면 blog/static/css/blog.css 를 생성
시험을 위해 임의로 한개만 작성해본다.

* blog/static/css/blog.css

```css
h1 a {
    color: #FCA205;
}
```

앞서 만든 템플릿파일에 적용하기 위해서 post_list.html 파일 상단에 다음과 같이 추가하고 css 파일을 추가

* blog/templates/blog/post_list.html


```html
{% load staticfiles %}
<html>
<head>
	<link rel="stylesheet" href="{% static 'css/blog.css' %}">
</head>
<body>
    <h1><a href="/">Django Girls Blog</a></h1>
	{% for post in posts %}
		<div>
			<p>published: {{ post.published_date }}</p>
			<h1><a href="">{{ post.title }}</a></h1>
			<p>{{ post.text|linebreaksbr }}</p>
		</div>
	{% endfor %}
</body>
</html>
```


페이지를 확인해보면 아래와 같이 CSS가 적용되어 보이게 된다.

{% asset_img 01_static.png %}

페이지 소스보기를 해 보면 /static/css/blog.css가 인클루드 되어 있다는...
blog 자체가 루트부터 먹어 들어가니 이렇게 되어 있는거 같긴 한데..
다른 App을 만들어보지 않았으니 확실히는 모르겠다.. 그냥 코딩해도 될거 같긴 한데 말이지..

{% asset_img 02_source.png %}


# 템플릿 확장

JSP에서 인클루드 하듯이 여기도 템플릿을 통해서 구성이 가능한거 같다..
근데 구조는 반대라는..

방금 만든 post_list.html 의 알맹이부분을 남기고 남은 부분을 확장하여 사용 가능하다.
예를 들면..

껍데기 파일을 새로 base.html 이라는 녀석을 만들고 아래와 같이 작성한다.

* blog/templates/blog/post_list.html

```html
{% load staticfiles %}
<html>
<head>
	<link rel="stylesheet" href="{% static 'css/blog.css' %}">
</head>
<body>
<div>
    <h1><a href="/">Django Girls Blog</a></h1>
</div>
	{% block content %}
	{% endblock %}
</body>
</html>
```

기존 post_list.html 파일은 아래와 같이 작성

* blog/templates/blog/post_list.html

```html
{% extends 'blog/base.html' %}

{% block content %}
	{% for post in posts %}
		<div>
			<p>published: {{ post.published_date }}</p>
			<h1><a href="">{{ post.title }}</a></h1>
			<p>{{ post.text|linebreaksbr }}</p>
		</div>
	{% endfor %}
{% endblock %}
```

앞서 만들었던 페이지와 동일한 결과가 보이게 된다.

{% asset_img 01_static.png %}


여기에 남은 내용들 다 때려 넣으려 했는데.. 다음으로 넘겨야겠네..
문서를 볼수록 음... 뭔가 계속 어색하다.....;;;;;
