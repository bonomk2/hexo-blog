---
title: Chocolatey 사용하기
date: 2021-09-06 16:00:00
categories:
- dev
tags:
- os
- win
- chocolatey
- application
cover: /dev/os/win-chocolatey/logo-square.svg
---

개발관련 프로그램 깔기 너무 귀찮다 싶을때 패키지매니저를 사용해보자.

<!-- more -->

chocolatey는 MacOS에서 많이 사용하는 Homebrew나 Linux에서 사용하는 apt 같이 패키지를 관리하기 위한 툴이다.
사무실에서는 필요할때 깔아서 사용하다보니 쓸일이 거의 없었는데 집에서 새PC에 필요한것들 설치하려니 귀찮은게 이만저만이 아니네..
필수 어플들을 설치하기 위해서 평소에는 크롬에 다운받는곳들을 모두 북마크해서 관리해왔는데, 이게 시간이 지날수록 관리가 안된다.

개발자를 위한 내용이 아닌 일반 유저들을 대상으로 간단하게 chocolatey GUI를 사용해서 설치 프로그램 관리를 해보자.

## chocolatey 사이트 접속
{% asset_img 01.png %}

https://chocolatey.org/install 에 접속하여 step2 부터 시작한다.
환경은 다음과 같다.

```
- Windows 7 / Windows Server 2003 이상
- PowerShell v3 이상
- .NET Framework 4.5 이상
```
요즘은 대부분 https 접속이 TLS1.2 이상이므로 위정도의 사양은 되어야 동작이 가능하다.
파워쉘 스크립트를 1도 모르는 관계로 이런게 있나보다 정도로 넘어간다.. ㅋ

## 관리자 모드로 powershell 실행
관리자권한으로 파워쉘을 실행한다.

관리자 모드가 불가한 경우에는 https://docs.chocolatey.org/en-us/choco/setup#non-administrative-install 문서를 참고한다.
파워쉘을 설치해야 하는 경우 https://community.chocolatey.org/courses/installation/installing?method=install-from-powershell-v3 를 참고한다.

## ps 스크립트를 실행
아래의 스크립트를 실행한다.
```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
0.11.1의 예
생각하는것보다 시간이 오래 걸린다.
```
PS C:\WINDOWS\system32> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))                                                                     Forcing web requests to allow TLS v1.2 (Required for requests to Chocolatey.org)
Getting latest version of the Chocolatey package for download.
Not using proxy.
Getting Chocolatey from https://community.chocolatey.org/api/v2/package/chocolatey/0.11.1.
Downloading https://community.chocolatey.org/api/v2/package/chocolatey/0.11.1 to C:\Users\user\AppData\Local\Temp\chocolatey\chocoInstall\chocolatey.zip
Not using proxy.
Extracting C:\Users\user\AppData\Local\Temp\chocolatey\chocoInstall\chocolatey.zip to C:\Users\user\AppData\Local\Temp\chocolatey\chocoInstall
Installing Chocolatey on the local machine
Creating ChocolateyInstall as an environment variable (targeting 'Machine')
  Setting ChocolateyInstall to 'C:\ProgramData\chocolatey'
WARNING: It's very likely you will need to close and reopen your shell
  before you can use choco.
Restricting write permissions to Administrators
We are setting up the Chocolatey package repository.
The packages themselves go to 'C:\ProgramData\chocolatey\lib'
  (i.e. C:\ProgramData\chocolatey\lib\yourPackageName).
A shim file for the command line goes to 'C:\ProgramData\chocolatey\bin'
  and points to an executable in 'C:\ProgramData\chocolatey\lib\yourPackageName'.

Creating Chocolatey folders if they do not already exist.

WARNING: You can safely ignore errors related to missing log files when
  upgrading from a version of Chocolatey less than 0.9.9.
  'Batch file could not be found' is also safe to ignore.
  'The system cannot find the file specified' - also safe.
chocolatey.nupkg file not installed in lib.
 Attempting to locate it from bootstrapper.
경고: Not setting tab completion: Profile file does not exist at
'C:\Users\user\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1'.
Chocolatey (choco.exe) is now ready.
You can call choco from anywhere, command line or powershell by typing choco.
Run choco /? for a list of functions.
You may need to shut down and restart powershell and/or consoles
 first prior to using choco.
Ensuring Chocolatey commands are on the path
Ensuring chocolatey.nupkg is in the lib folder
```

3. 설치 완료
설치가 완료 되었다면 커맨드 choco를 사용하여 chocolatey를 사용 할 수 있다.
```sh
PS C:\WINDOWS\system32> choco list --localonly
Chocolatey v0.11.1
chocolatey 0.11.1
1 packages installed.
```

4. 커맨드
https://docs.chocolatey.org/en-us/choco/commands/ 페이지를 통해 관련 명령들을 확인 할 수 있다.
homebrew나 apt와 비슷하므로 자세한 내용은 생략한다.

5. chocolatet GUI 설치
집에서 쉽게 사용할거니까 커맨드 따위 필요없다. 화면에서 좀 편하게 쓰면 안될까 싶을때 GUI를 사용하면 쉽게 사용이 가능하다.
다음과 같이 chocolategui 패키지를 설치한다.
```sh
choco install chocolateygui
```
설치 완료 후 윈도우키를 눌러보면 아래와 같이 아이콘이 생겼다.
{% asset_img 02.png %}
클릭해보면 아래와 같이 실행 화면을 볼 수 있다.
{% asset_img 03.png %}
좌측 메뉴에 ThisPC 메뉴는 현재 설치되어 있는 프로그램 목록을 뜻하고 하단에 chocolatey는 검색 가능한 패키지 리파지토리를 표시한다.
검색창에 mp3를 입력하는 경우 아래와 같이 mp3 플레이어를 볼 수 있고, 우클릭하면 설치가 가능하다.
{% asset_img 04.png %}
더블클릭하면 상세 내용을 볼 수 있고, 우측 하단에 있는 install 버튼을 클릭하여 설치도 가능하다.
{% asset_img 05.png %}
{% asset_img 06.png %}
설치가 완료되면 내PC 목록에 설치한 프로그램이 표시된다.
{% asset_img 07.png %}

6. 삭제
C:\ProgramData\chocolatey 폴더를 삭제한다.
[고급시스템 설정] - [환경변수]에 있는 ChocolateyInstall, path에 있는 C:\ProgramData\chocolatey\bin 를 삭제한다.

#### reference
  - https://docs.chocolatey.org/en-us/
  - https://chocolatey.org/install
  - https://docs.chocolatey.org/en-us/choco/setup
  - https://docs.chocolatey.org/en-us/choco/commands/
  