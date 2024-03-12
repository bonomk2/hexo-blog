---
title: Test Asset
date: 2017-03-09 13:47:53
categories:
- dev
tags:
- test
- hexo
thumbnail: /images/test_04.jpg
sage: true
---
<p>
path : test_01
{% asset_path test_01.jpg %}
<p>
asset_img : test_02
{% asset_img test_02.jpg %}
<p>
asset_img : /images/test_04
{% asset_img test_04.jpg %}
<p>
test_03
<br>
link : test_03
<br>
{% asset_link test_03.jpg %}
<p>
절대경로 : test_04
<br>
![](/images/test_04.jpg)
<p>
asset 절대경로 : test_05
<br>test_05 -> fail
<br>{% asset_img /images/test_05.jpg %}
<p>
fail시 처리 : test_06
<br>![fail image](/images/test_08.jpg)

<p>

