---
title: Ubuntu에서 VirtualBox 구동시 usb 마운트 안될때
date: 2019-07-03 18:00:00
categories:
- dev
tags:
- os
- ubuntu
- virtualbox
---

ubuntu에서 구동하는 virtualbox에서 usb가 연동 안되는 경우에는 root로 실행하거나 다음과 같이 한다.

<!-- more -->

ubuntu에서 구동하는 virtualbox에서 usb가 물리지 않는 경우에는 다음과 같이 한다.

1. [virtualbox 다운로드 페이지](https://www.virtualbox.org/wiki/Downloads)에서 extension pack을 다운받아 설치한다.

2. 리부팅

3. 확장팩 설치후에 방법이 두가지가 있는데 하나는 root로 실행하는것이고, 다른 하나는 유저를 vboxusers 그룹으로 gid값을 변경한다.

```sh
$ sudo usermod -g vboxusers {user}
```

4. 확인사살 리부팅

사실은 root로 실행하니 잘 되서 그냥 쓰고 있다..

유저계정으로 하고프면 자세한 내용은 아래의 링크를 참조하시길..

#### reference
  - https://blogger.pe.kr/523



