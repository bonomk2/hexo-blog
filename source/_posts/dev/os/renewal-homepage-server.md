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

![](01.png)

{% asset_img 02.png %}

## 인스턴스 생성
기본적인 것들은 aws나 azure를 사용해보았다면 크게 문제는 없을듯하다.
퍼블릭IP를 하나씩 줄 수 있는데 aws와 다르게 재기동을 하더라도 ip가 변경되지는 않는다.
도메인 바로 물려도 잘 동작하니 참 맘에 든다는....

vpc 역할을 하는 vcn이라는 녀석과 기타 네트워크등등 네이밍을 뒤에 날짜를 붙이게 되는데 이게 좀 많이 거슬린다..
첨부터 만들때 잘 만들면 좋을듯하다.. (난 이미 생성하였으니 두번은 안하겠...)
완성하면 아래와 같이 목록을 확인 할 수 있다.

OS는 가장 익숙한 우분투 22.04 미니멀 버전을 설치하였다.

![](02.png)

{% asset_img 01.png %}

## Nginx 설치
우선 최신버전 우분투를 설치하였으니 apt 한번 돌려주고 시작
딱히 안해줘도 되는데 왠지 하고나면 기분이 상쾌(?)하다..
```sh
>> sudo apt update

>> sudo apt upgrade

>> sudo reboot -r now

>> sudo apt update
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
>> sudo apt install nginx
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  fontconfig-config fonts-dejavu-core libdeflate0 libfontconfig1 libgd3 libjbig0 libjpeg-turbo8 libjpeg8 libmaxminddb0 libnginx-mod-http-geoip2 libnginx-mod-http-image-filter
  libnginx-mod-http-xslt-filter libnginx-mod-mail libnginx-mod-stream libnginx-mod-stream-geoip2 libtiff5 libwebp7 libx11-6 libx11-data libxau6 libxcb1 libxdmcp6 libxpm4 libxslt1.1 nginx-common
  nginx-core
Suggested packages:
  libgd-tools mmdb-bin fcgiwrap nginx-doc ssl-cert
The following NEW packages will be installed:
  fontconfig-config fonts-dejavu-core libdeflate0 libfontconfig1 libgd3 libjbig0 libjpeg-turbo8 libjpeg8 libmaxminddb0 libnginx-mod-http-geoip2 libnginx-mod-http-image-filter
  libnginx-mod-http-xslt-filter libnginx-mod-mail libnginx-mod-stream libnginx-mod-stream-geoip2 libtiff5 libwebp7 libx11-6 libx11-data libxau6 libxcb1 libxdmcp6 libxpm4 libxslt1.1 nginx nginx-common
  nginx-core
0 upgraded, 27 newly installed, 0 to remove and 0 not upgraded.
Need to get 3735 kB of archives.
After this operation, 12.1 MB of additional disk space will be used.
Do you want to continue? [Y/n] 
Get:1 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libmaxminddb0 amd64 1.5.2-1build2 [24.7 kB]
Get:2 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libxau6 amd64 1:1.0.9-1build5 [7634 B]
Get:3 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libxdmcp6 amd64 1:1.1.3-0ubuntu5 [10.9 kB]
Get:4 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libxcb1 amd64 1.14-3ubuntu3 [49.0 kB]
Get:5 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libx11-data all 2:1.7.5-1ubuntu0.3 [120 kB]
Get:6 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libx11-6 amd64 2:1.7.5-1ubuntu0.3 [667 kB]
Get:7 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 fonts-dejavu-core all 2.37-2build1 [1041 kB]
Get:8 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 fontconfig-config all 2.13.1-4.2ubuntu5 [29.1 kB]
Get:9 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libdeflate0 amd64 1.10-2 [70.9 kB]
Get:10 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libfontconfig1 amd64 2.13.1-4.2ubuntu5 [131 kB]
Get:11 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libjpeg-turbo8 amd64 2.1.2-0ubuntu1 [134 kB]
Get:12 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libjpeg8 amd64 8c-2ubuntu10 [2264 B]
Get:13 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libjbig0 amd64 2.1-3.1ubuntu0.22.04.1 [29.2 kB]
Get:14 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libwebp7 amd64 1.2.2-2ubuntu0.22.04.2 [206 kB]
Get:15 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libtiff5 amd64 4.3.0-6ubuntu0.7 [185 kB]
Get:16 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libxpm4 amd64 1:3.5.12-1ubuntu0.22.04.2 [36.7 kB]
Get:17 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 libgd3 amd64 2.3.0-2ubuntu2 [129 kB]
Get:18 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 nginx-common all 1.18.0-6ubuntu14.4 [40.0 kB]
Get:19 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libnginx-mod-http-geoip2 amd64 1.18.0-6ubuntu14.4 [11.9 kB]
Get:20 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libnginx-mod-http-image-filter amd64 1.18.0-6ubuntu14.4 [15.4 kB]
Get:21 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libxslt1.1 amd64 1.1.34-4ubuntu0.22.04.1 [164 kB]
Get:22 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libnginx-mod-http-xslt-filter amd64 1.18.0-6ubuntu14.4 [13.7 kB]
Get:23 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libnginx-mod-mail amd64 1.18.0-6ubuntu14.4 [45.7 kB]
Get:24 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libnginx-mod-stream amd64 1.18.0-6ubuntu14.4 [72.9 kB]
Get:25 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 libnginx-mod-stream-geoip2 amd64 1.18.0-6ubuntu14.4 [10.1 kB]
Get:26 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 nginx-core amd64 1.18.0-6ubuntu14.4 [484 kB]
Get:27 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy-updates/main amd64 nginx amd64 1.18.0-6ubuntu14.4 [3872 B]                                                                         
Fetched 3735 kB in 7s (571 kB/s)                                                                                                                                                                            
debconf: delaying package configuration, since apt-utils is not installed
Selecting previously unselected package libmaxminddb0:amd64.
(Reading database ... 92359 files and directories currently installed.)
Preparing to unpack .../00-libmaxminddb0_1.5.2-1build2_amd64.deb ...
Unpacking libmaxminddb0:amd64 (1.5.2-1build2) ...
Selecting previously unselected package libxau6:amd64.
.......................................................
debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 78.)
debconf: falling back to frontend: Readline
Scanning processes...                                                                                                                                                                                        
Scanning linux images...                                                                                                                                                                                     
Running kernel seems to be up-to-date.
No services need to be restarted.
No containers need to be restarted.
No user sessions are running outdated binaries.
No VM guests are running outdated hypervisor (qemu) binaries on this host.
```


## SSL인증서 발급
```sh
>> sudo snap install --classic certbot
certbot 2.8.0 from Certbot Project (certbot-eff✓) installed
>> sudo certbot --nginx
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
space separated) (Enter 'c' to cancel): test.bonobono.net
Requesting a certificate for test.bonobono.net

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/test.bonobono.net/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/test.bonobono.net/privkey.pem
This certificate expires on 2024-04-09.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for test.bonobono.net to /etc/nginx/sites-enabled/default
Congratulations! You have successfully enabled HTTPS on https://test.bonobono.net

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
>> sudo certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/test.bonobono.net.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Account registered.
Simulating renewal of an existing certificate for test.bonobono.net

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations, all simulated renewals succeeded: 
  /etc/letsencrypt/live/test.bonobono.net/fullchain.pem (success)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

## 기타
### 시간설정
list-times 서비스를 통하여 설정을 확인한다. UTC로 되어 있는게 보인다.
```sh
>> systemctl list-timers
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
>> timedatectl list-timezones |grep Seoul
Asia/Seoul
>> sudo timedatectl set-timezone Asia/Seoul
>> timedatectl
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
>> sudo apt install net-tools
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  net-tools
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 204 kB of archives.
After this operation, 819 kB of additional disk space will be used.
Get:1 http://ap-chuncheon-1-ad-1.clouds.archive.ubuntu.com/ubuntu jammy/main amd64 net-tools amd64 1.60+git20181103.0eebece-1ubuntu5 [204 kB]
Fetched 204 kB in 1s (137 kB/s)     
debconf: delaying package configuration, since apt-utils is not installed
Selecting previously unselected package net-tools.
(Reading database ... 92905 files and directories currently installed.)
Preparing to unpack .../net-tools_1.60+git20181103.0eebece-1ubuntu5_amd64.deb ...
Unpacking net-tools (1.60+git20181103.0eebece-1ubuntu5) ...
Setting up net-tools (1.60+git20181103.0eebece-1ubuntu5) ...
debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 78.)
debconf: falling back to frontend: Readline
Scanning processes...                                                                                                        
Scanning linux images...                                                                                                     
Running kernel seems to be up-to-date.
No services need to be restarted.
No containers need to be restarted.
No user sessions are running outdated binaries.
No VM guests are running outdated hypervisor (qemu) binaries on this host.
```

추가작업이 되는 것들은 여기에 추가로 기재하겠습니다.

> **Related Posts**
> [0. 홈페이지 개선하기](../renewal-homepage/)
> [1. 서버구성하기](../renewal-homepage-server/)

