---
title: 테스트 포스트
date: 2017-03-08 15:30:33
categories:
- test
- hexo
tags:
- test
- hexo
---

# 안녕 hexo
## hexo cool
### really?
- write
- content
- with
- markdown


# Front-matter

See front-matter for more information.

Setting	Description	Default
layout	Layout
title	Title	
date	Published date	File created date
update	Updated date	File updated date
comments	Enables comment feature for the post	true
tags	Tags (Not available for pages)	
categories	Categories (Not available for pages)	
permalink	Override the default permalink of the post	
toc	Display TOC button	true
comment	Display comment	true
notag	Do not generate Tags menu	false
top	Pin post on the top of the list


# table sample
<table>
    <tr>
        <td colspan='2' align='center'>Foo</td>
    </tr>
    <tr>
        <td>Foo</td>
		<td>Foo</td>
    </tr>
    <tr>
        <td>Foo</td>
		<td>Foo</td>
    </tr>
</table>


# pre tag
<pre>
이곳에 소스를 적는것인데 syntax highlight가 정상 동작하는지를 모르겠다는.. ㄷㄷㄷ
</pre>

```
이곳에 소스를 적는것인데 syntax highlight가 정상 동작하는지를 모르겠다는.. ㄷㄷㄷ
```

# Block Quote

* 인자없음
{% blockquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit lacus ut purus iaculis feugiat. Sed nec tempor elit, quis aliquam neque. Curabitur sed diam eget dolor fermentum semper at eu lorem.
{% endblockquote %}

* 책 인용
{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}

* 트위터 인용
{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}

* 웹게시물
{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}

# Code Block
* 기본
{% codeblock %}
alert('Hello World!');
{% endcodeblock %}

* 언어지정
{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}
{% codeblock lang:js %}
<script>
console.log('1111');
</script>
{% endcodeblock %}

* url, 제목 넣기
{% codeblock Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}
{% codeblock _.compact http://underscorejs.org/#compact Underscore.js %}
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
{% endcodeblock %}

* 간략표현

test.js
```js
/** comment **/
// comment2
console.log('1111');
alert('~~');

function testA(aa){
	console.log(aa);
}
testA('aaaa');
```

# jsFiddle
{% jsfiddle pgtkkLsc html,result %}

# Gist
{% gist 9a4aded78853db541ca2510d8d41e17f %}

# iframe
{% iframe http://www.iniline.co.kr 100% 300 %}

# YouTube

{% youtube AOMBPyOlFSE %}

# vimeo

{% vimeo 167976188 %}

# post 삽입
{% post_link hello-world 헬로월드 %}

# raw
{% raw %}
content
<javascript>alert('!!!');</script>
{% endraw %}


