---
title: MacOS app, pkg 공증하기2 - 3rd파티 lib 연동
date: 2019-09-20 18:00:00
categories:
- dev
tags:
- os
- mac
- xcode
- notarizing
- codesign
#cover: /dev/os/mac-notarizing/01.png
---

뭐든 한방에 끝나는것은 없다. 3rd파티 라이브러리 연동시 코드사인을 알아보자.

<!-- more -->

한방에 잘 된줄 알고 좋아서 룰루랄라 테스트를 진행하던중 우리가 코드사인한 모듈과 연동되는 다른 제품에서 동작되지 않는 증상이 발생했다.
콘솔을 확인해보니 아래와 같이 한줄 메세지가 나오면서 프로세스가 그냥 죽어버림.

```
Library Validation failed: Rejecting '/Library/Frameworks/AAA.framework/Versions/A/BBB.dylib' (Team ID: CCCC, platform: no) for process 'SSSS(1234)' (Team ID: DDDD, platform: no), reason: mapping process and mapped file (non-platform) have different Team IDs
```

SSSS 프로세스와 연동되는 BBBB 라이브러리가 동작을 하려 하는데 코드사인 한 주체가 달라 로딩시 검증 실패가 되어 그냥 떨어진것이다.
대부분의 문서들 보면 자기가 만든것들을 자기가 코드사인하니까 동작에 문제가 없겠으나,
다른 라이브러리를 연동하는 경우에는 얘기가 달라지는듯.. 윈도우는 이정도는 아닌데.... -_-;;;

pkg 파일 공증시에 해당 부분을 내부에 코드사인이 다른 녀석이 있으면 알려주면 좋겠으나,
그렇게 친절할리는 만무한것 같고.. 뭔가 회피를 해야만 하는 상황..

해당 에러 메세지로 구글링을 해보니 Hardened Runtime Entitlements 설정을 보란다.
근데 entitlements가 뭐지....? [설명이 있는 페이지](https://developer.apple.com/documentation/security/hardened_runtime_entitlements)에 가보니 아래와 같이 설정이 가능하다고 나온다.

{% asset_img 01.png %}

XCode상에서 위와 같은 화면에서 설정이 있다고 한다.
[Disable Library Validation Entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_cs_disable-library-validation) 라고 로딩되는 라이브러리의 검증을 패스 하는 옵션이 있는데,
중요한것은 내 개발 환경은 XCode8이라는것..... 이전까지 없다가 xcode10.1에서 추가된듯하다.(어딘가에서 보긴 했는데 버전이 불확실)

그럼 나는 어찌 하라는 말인가.....
난 클라이언트 개발자가 아님.. XCode 전혀 모름..
소스를 개발한 양반은 이미 회사에 없음.. 이 소스들을 XCode10에서 빌드하면 무슨 일이 생길지 나도 모름..
테스트는 생각만해도 개끔찍함..

개발이 완료된 소스의 빌드는 hudson을 이용해서 svn에서 소스를 내려받아 xcodebuild를 구동하는데,
내 환경에서는 보이지도 않는 옵션을 어디다 구겨 넣어야 하는것일까라는 고민을 계속..
뭔가 있을거야.. 뭔가 있을거야... 라는 생각으로 며칠간 구글링.... (정말 미치는줄)
딱 답이 나온곳은 찾지 못했으나 코드사인과 연관된 부분이라는것을 알게 되었다.

codesign --help 로는 딱히 보이는건 없고 man으로 찾아보니 아래와 같이 옵션이 있다.

```
     --entitlements path
             When signing, take the file at the given path and embed its contents in the signature as entitlement data. If the data at path does not already begin with a
             suitable binary ("blob") header, one is attached automatically.
             When displaying a signature, extract any entitlement data from the signature and write it to the path given. Use "-" to write to standard output.  By
             default, the binary "blob" header is returned intact; prefix the path with a colon ":" to automatically strip it off.  If the signature has no entitlement
             data, nothing is written (this is not an error).
```

찾으라 열릴것이다... 인건가....
그래서 아래와 같이 작성하고 테스트..

```sh
codesign --verbose --timestamp --options runtime -s "[apple developerID cert]" ./[실행파일] --entitlements ./codesign.plist
```

codesign.plist는 아래와 같이 작성했다.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.cs.disable-library-validation</key>
	<true/>
</dict>
</plist>
```

옵션이 먹었는지 확인을 하려면 아래와 같이 확인 가능하다.

```sh
codesign -d -v --entitlements – [실행파일]
```

[실행결과]
```sh
$ codesign -d -v --entitlements - SSSS
Executable=/Users/AAAA/Build/SSSS
Identifier=SSSS
Format=Mach-O thin (x86_64)
CodeDirectory v=20500 size=12345 flags=0x10000(runtime) hashes=601+5 location=embedded
Signature size=9016
Timestamp=30 Aug 2019 at 1:01:01 PM
Info.plist=not bound
TeamIdentifier=DDDD
Runtime Version=10.12.0
Sealed Resources=none
Internal requirements count=1 size=176
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>com.apple.security.cs.disable-library-validation</key>
        <true/>
</dict>
```
정말 운 좋게 얻어걸렸음..
Mac App 개발을 공부 해야하는건가 싶은 생각이 자꾸만 들지만 나는 js 개발자이다..
앞으로 별일 없기를 기도하는 수 밖에...... ㅠㅠ

적고보니 한풀이가 절반이네.. ㅋㅋㅋㅋ

#### reference
  - https://developer.apple.com/documentation/security/hardened_runtime_entitlements
  - https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_cs_disable-library-validation

