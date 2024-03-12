---
title: 서버구성하기
date: 2024-02-20 19:00:00
categories:
- dev
tags:
- cloud
- oci
- ubuntu
- nginx
- ssl
cover: /dev/os/renewal-homepage-server/00.png
---

OCI에 인스턴스를 생성하고 도메인을 연결하자!!

<!-- more -->

## OCI 가입 관련
Oracle Cloud를 회원가입부터 하기에는 가입한지 좀 되어 무리가 있어보여 패스..
가입시에 프리티어 권한으로 사용하게 되는데 기간이 만료되더라도 계속 유지가 가능하다.
aws나 azure처럼 가입시 카드등록하고 그런건 있으나 유료 서비스 사용을 위해서는 업그레이드가 필요하다.
프리티어 기간이 지난 후 유료서비스인 경우 친절하게 알려준다.

![](02.png)

## 인스턴스 생성
기본적인 것들은 aws나 azure를 사용해보았다면 크게 문제는 없을듯하다.
vpc 역할을 하는 vcn이라는 녀석과 기타 네트워크등등 네이밍을 뒤에 날짜를 붙이게 되는데 이게 좀 많이 거슬린다..
첨부터 만들때 잘 만들면 좋을듯하다.. (난 이미 생성하였으니 두번은 안하겠...)
완성하면 아래와 같이 목록을 확인 할 수 있다.

OS는 가장 익숙한 우분투 22.04 미니멀 버전을 설치하였다.

![](01.png)

## Nginx 설치
우선 최신버전 우분투를 설치하였으니 apt 한번 돌려주고 시작
딱히 안해줘도 되는데 왠지 하고나면 기분이 상쾌(?)하다..
```sh
$ sudo apt update

$ sudo apt upgrade

$ sudo reboot -r now

$ sudo apt update
Hit:1 http://security.ubuntu.com/ubuntu jammy-security InRelease
Hit:2 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy InRelease
Hit:3 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates InRelease
Hit:4 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-backports InRelease
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
All packages are up to date.
```

nginx를 설치
```sh
$ sudo apt install nginx
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
...
0 upgraded, 27 newly installed, 0 to remove and 0 not upgraded.
Need to get 3735 kB of archives.
After this operation, 12.1 MB of additional disk space will be used.
Do you want to continue? [Y/n]
Get:1 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libmaxminddb0 amd64 1.5.2-1build2 [24.7 kB]
Get:2 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libxau6 amd64 1:1.0.9-1build5 [7634 B]
Get:3 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libxdmcp6 amd64 1:1.1.3-0ubuntu5 [10.9 kB]
...
```


## SSL인증서 발급
```sh
$ sudo snap install --classic certbot
certbot 2.8.0 from Certbot Project (certbot-eff✓) installed
$ sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel): ******@bonobono.net

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.3-September-21-2022.pdf. You must
agree in order to register with the ACME server. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing, once your first certificate is successfully issued, to
share your email address with the Electronic Frontier Foundation, a founding
partner of the Let's Encrypt project and the non-profit organization that
develops Certbot? We'd like to send you email about our work encrypting the web,
EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y
Account registered.
Please enter the domain name(s) you would like on your certificate (comma and/or
space separated) (Enter 'c' to cancel): www.bonobono.net
Requesting a certificate for www.bonobono.net
...
```

## 기타
### 시간설정
list-times 서비스를 통하여 설정을 확인한다. UTC로 되어 있는게 보인다.
```sh
$ systemctl list-timers
NEXT                        LEFT          LAST                        PASSED       UNIT                           ACTIVATES                       
Wed 2024-01-10 14:06:00 UTC 3h 45min left n/a                         n/a          snap.certbot.renew.timer       snap.certbot.renew.service
Wed 2024-01-10 22:19:06 UTC 11h left      Wed 2024-01-10 04:34:45 UTC 5h 45min ago motd-news.timer                motd-news.service
Thu 2024-01-11 00:00:00 UTC 13h left      Wed 2024-01-10 00:00:09 UTC 10h ago      dpkg-db-backup.timer           dpkg-db-backup.service
Thu 2024-01-11 00:54:56 UTC 14h left      Wed 2024-01-10 06:47:45 UTC 3h 32min ago fwupd-refresh.timer            fwupd-refresh.service
Thu 2024-01-11 04:56:39 UTC 18h left      Wed 2024-01-10 09:28:01 UTC 52min ago    apt-daily.timer                apt-daily.service
Thu 2024-01-11 06:16:27 UTC 19h left      Wed 2024-01-10 06:40:30 UTC 3h 39min ago apt-daily-upgrade.timer        apt-daily-upgrade.service
Thu 2024-01-11 08:32:28 UTC 22h left      Wed 2024-01-10 08:32:28 UTC 1h 47min ago update-notifier-download.timer update-notifier-download.service
Thu 2024-01-11 08:42:28 UTC 22h left      Wed 2024-01-10 08:42:28 UTC 1h 37min ago systemd-tmpfiles-clean.timer   systemd-tmpfiles-clean.service
Sun 2024-01-14 03:10:29 UTC 3 days left   Tue 2024-01-09 05:31:34 UTC 1 day 4h ago e2scrub_all.timer              e2scrub_all.service
Mon 2024-01-15 00:47:18 UTC 4 days left   Tue 2024-01-09 06:14:52 UTC 1 day 4h ago fstrim.timer                   fstrim.service
Mon 2024-01-15 13:26:35 UTC 5 days left   Wed 2024-01-10 09:28:01 UTC 52min ago    update-notifier-motd.timer     update-notifier-motd.service

11 timers listed.
Pass --all to see loaded but inactive timers, too.
```

서울로 설정하기 위해서 타임존을 확인하고 타임존을 셋팅한다.
```sh
$ timedatectl list-timezones |grep Seoul
Asia/Seoul
$ sudo timedatectl set-timezone Asia/Seoul
$ timedatectl
               Local time: Wed 2024-01-10 20:34:12 KST
           Universal time: Wed 2024-01-10 11:34:12 UTC
                 RTC time: Wed 2024-01-10 11:34:12
                Time zone: Asia/Seoul (KST, +0900)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
          
```

### net-tools 설치
netstat, ifconfig 사용을 위하여 net-tools를 설치한다.
```sh
$ sudo apt install net-tools
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  net-tools
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
...
```

추가작업이 되는 것들은 여기에 추가로 기재하겠습니다.

> **Related Posts**
> [0. 홈페이지 개선하기](../renewal-homepage/)
> [1. 서버구성하기](../renewal-homepage-server/)
