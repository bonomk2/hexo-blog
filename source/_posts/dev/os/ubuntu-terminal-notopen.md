---
title: VirtualBox 7.0에서 우분투 설치시 터미널 안 열릴때
date: 2023-04-11 18:00:00
categories:
- dev
tags:
- os
- ubuntu
- virtualbox
---

virtualbox에서 ubuntu를 설치하고 터미널을 열었는데 반응이 없다..

<!-- more -->

virtualbox에서 ubuntu를 설치하고 터미널을 열었는데 반응이 없는 경우 locale에 문제가 있어 그렇다.

/etc/default/locale 파일을 변경하고 재기동을 하면 된다고는 하는데

언어설정을 아무거나 한번만 바꿔주면 잘 열림..

{% asset_img 01.PNG %}


#### reference
  - https://superuser.com/questions/1749837/cant-open-a-terminal-in-ubuntu-22-04-running-in-virtualbox-7-0-on-a-windows-11



