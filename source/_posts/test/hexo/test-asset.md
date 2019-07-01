---
title: Test Asset
date: 2017-03-09 13:47:53
categories:
- test
- hexo
tags:
- test
- hexo
thumbnail: /images/test_04.jpg
---
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
link : test_03
{% asset_link test_03.jpg %}
절대경로 : test_04
![](/images/test_04.jpg)
asset 절대경로 : test_05
test_05 -> fail
{% asset_img /images/test_05.jpg %}
fail시 처리 : test_06
![fail image](/images/test_08.jpg)
