---
title: VMWareFusion에서 맥 디스크 확장
date: 2019-07-01 21:00:00
categories:
- dev
tags:
- os
- mac
- vmwarefusion
- diskutil
- fdisk
cover: /dev/os/mac-diskexpand/05.JPG
---

vmware fusion에서 부족한 하드디스크 크기를 늘려보자

<!-- more -->

vmware fusion에서 맥을 쓰다보면 기본 디스크 용량이 40GB로 설정되어 있어 디스크를 늘려야 하는 경우가 있다.

디스크를 늘리기 위해서는 스냅샷이 없는 상태를 우선 만들어야 하는 관계로 Create Full Clone를 실행하여 별도의 머신으로 만들어준다. 

이후에 다음과 같이 작업한다.

우선 가상머신 Setting 에서 HardDisk를 선택하여 크기를 원하는대로 늘려준다.
{% asset_img 00.JPG %}

적용버튼을 클릭하면 열심히 디스크를 늘리는중......
{% asset_img 01.JPG %}

디스크정보를 보면 디스크가 아직 커지지 않은 상태로 남아있다. 디스크는 커졌으나 파티션이 확장되지 않아 이렇게 보이게 되는것이다.
{% asset_img 02.JPG %}

10.10 이하의 버전이라면 다음과 같이 DiskUtil 에서 파란 파티션 영역을 하단으로 드래그만 하면 편하게 늘릴 수 있다.
{% asset_img 03-1.JPG %}

그런데 10.11 이상이라면 파티션이 확장되지를 않는다.
{% asset_img 03-2.JPG %}

youtube에 찾아보니 관련하여 diskutil 커맨드로 늘릴 수 있음을 알게 되었다는...
```sh
$ diskutil list
```

{% asset_img 04-1.JPG %}

disk0s2 파티션을 100기가로 늘린다.
```sh
$ diskutil resizeVolume /dev/disk0s2 100G
```
{% asset_img 04-2.JPG %}

diskutil 을 실행하여 확인해보면 아래와 같이 늘어났음을 알 수 있다.

{% asset_img 05.JPG %}


#### reference
  - https://www.youtube.com/watch?v=Afa-kA9bIAg
