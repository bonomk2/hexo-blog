---
title: MacOS app, pkg 공증하기 (개정판)
date: 2019-08-23 18:00:00
updated: 2024-03-12 18:00:00
categories:
- dev
tags:
- os
- mac
- xcode
- codesign
- notarizing
- staple
cover: /dev/os/mac-notarizing/01.png
---

MacOS 10.15에서 보안 강화를 위해 공증(notarization)을 새로 도입했다. 방법을 알아보자.
2023년 11월 1일 이후 변경된 사항도 포함한다.

<!-- more -->

맥에서 새로이 DeveloperID 인증서 기반의 서명외에 공증(notarizing)이라는 새로운 것을 도입했다.
10.14부터 유효한데 기존까지는 빌드하고 app이나 pkg를 코드사인만 하면 동작에 지장이 없어 크게 신경 안 썼는데
10.15 베타를 사용해보고 헉 하여 급하게 작업을... -_-;;;;

다운받은 pkg 파일이 자신들이 모르는 경우 아래와 같은 알림이 뜬다.
(아직 베타이므로 바뀔수 있음. 베타2와 베타6에서의 메세지가 다르다.)

{% asset_img 01.png %}

기존에 코드사인은 개발자계정으로 발급받은 인증서를 통해서 실행파일이나 설치파일을 서명하는 과정이었으나,
거기서 한단계 더 발전하여 App Store가 아닌 다른 곳에서 다운받은 파일의 설치, 실행하려는 파일들을 모두 다 보려는듯하다.
애플을 원래 좋아하지 않았으나 이거보고 참 대단한 놈들이라 느꼈.... 그나마 막지 않은것을 감사하게 생각해야하는건가 싶을정도.. -_-;;

작업은 다음과 같은 순서로 진행한다.
그리고 참고로 회사에서 dmg로는 생성을 하지 않아 잘 모르겠음. 아마 비슷하지 않을까 생각한다.

```
build - codesign - packaging - codesign - notarization - staple
```

XCode를 통해서 하는 방법이 문서를 찾아보면 나와있는데 회사에서 코딩 이후 작업들은 hudson을 통해 shell script로 작업을 진행하다보니 
쉘 명령어로만 되어있으니 참고바람.. 참고로 난 C를 모르고 XCode를 쓸 줄 모른다..
(이런 글을 정리해서 올리는 나의 정체성은 무엇인가... 제길..)

# 작업에 앞서

## 앱암호 등록

https://appleid.apple.com 에 가서 로그인 후 보이는 화면에서 보안 항목을 보면 앱암호라는 항목이 보인다.
이곳을 통해서 사용할 ID와 암호를 생성한다. 적당히 하면 되는듯하다.

{% asset_img 02.png %}

등록을 하게되면 16자리로 된 코드값이 나오는데 한번 발급되면 끝이므로 반드시 다른곳에 메모하고 기억해둔다.
이후 공증을 할때마다 사용하게 된다.

이후 수정항목에서 발급목록을 보면 아래와 같이 목록들이 보이고 항목을 지우거나 전체를 무효화 할 수 있다.

{% asset_img 03.png %}

ID를 생성하면 생성되었다 확인 메일이 날아온다.

## iCloud 계정 등록

공증을 하기 위해서는 해당 PC에 애플 개발자 계정으로 iCloud 연동이 되어 있어야만 한다.

{% asset_img 04.png %}

iCloud를 사용하게 하기위한 고도의 전술이 정말 꼼꼼하고 치밀하다.. (개인의견)


## XCode 버전

공증을 위한 altool 이라는 녀석의 사용을 위해서는 MacOS는 10.13.6 이상이 필요하고, XCode 10버전 이상이 필요하다.
이런저런 사정으로 빌드서버를 이전중인데 기존 MacOS 10.9+XCode7로 돌던것을 MacOS 10.13.6+XCode8.3으로 올리고 공증을 위해 XCode10을 추가로 설치했다.
(빌드서버 이전한다고 미리 준비 안했으면 정말 지옥이 펼쳐지지 않았을까 싶은 생각이.. ㅠㅠ)

# codesign

기존에는 다운로드 이후 실제 클릭하여 실행되어지는 파일들(.app, .pkg등)에 대해서만 코드사인이 되면 웹에서
다운로드 후 동작에 문제가 없었다. 그러나 설치후 물려 돌아가는 library, 실행파일등이 모두 코드사인 되어야만 정상적으로 동작한다.

기존 XCode를 통해서 빌드시에 별다른 옵션 없이 코드사인 하는 경우에도 문제는 없었으나, 반드시 있어야 하는 옵션이 두가지가 있다.
공통적으로 적용되는것은 timestamp 옵션이고, 실행 가능한 파일의 경우에는 options=runtime, 폴더 내부에 복수개의 파일들을 서명 하는 파일인 경우 deep을 사용한다.

각자 상황이 다르고 난 이것들을 잘 모르므로 딱 가능한 수준으로만 옵션을..

```
# dylib인 경우
$ codesign --verbose --timestamp -s "[DeveloperID]" ~/test.dylib

# app인 경우 (shell에서 구동하는 실행파일도 동일)
$ codesign --verbose --timestamp -s "[DeveloperID]" --options=runtime ~/test.app

# framework인 경우
$ codesign --verbose --deep --timestamp -s "[DeveloperID]" --options=runtime ~/test.framework
```

deep 옵션의 경우 폴더 내부의 서명해야 할 녀석들을 알아서 해주는 옵션인데 빼서해도 차이는 잘 모르겠다. 그래도 안전하게 넣어두면 좋을듯..
hudson을 통해서 빌드를 하고 있는데 파일들 이동중에 framework 내부에 링크가 깨지는 경우들이 있으니 정상적인 링크 여부를
꼼꼼히 확인 해보는게 좋다.

패키징 이후에 productsign 에도 timestamp 옵션을 반드시 사용한다.

# notarization

pkg 파일은 단일 파일이므로 바로 공증을 실행 할 수 있으나, app 파일의 경우 폴더로 되어 있으므로 zip으로 압축하여 실행해야 한다.
공증을 실행하기 전 의심되는 파일들의 정상여부를 확인 할 수 있는데 codesign에 vvv strict 옵션으로 확인 가능하다.
이후의 내용은 2023년 11월 1일 이후 방법이 변경되어 수정하였다.

```sh
# 정상인 경우 (단일파일)
$ codesign -vvv --deep --strict ~/test.framework/Versions/A/test.dylib
test.framework/Versions/A/test.dylib: valid on disk
test.framework/Versions/A/test.dylib: satisfies its Designated Requirement

# 비정상인 경우 (폴더를 했을때)
$ codesign -vvv --deep --strict test.framework/
--prepared:/Users/user/test.framework/Versions/Current/test.dylib
--validated:/Users/user/test.framework/Versions/Current/test.dylib
--prepared:/Users/user/test.framework/Versions/Current/test2.dylib
test.framework/: main executable failed strict validation
In subcomponent: /Users/user/test.framework/Versions/Current/test2.dylib

# 해당파일을 확인
$ codesign -vvv --deep --strict test.framework/Versions/A/test2.dylib 
test.framework/Versions/A/test2.dylib: main executable failed strict validation
```

에러코드는 해당 dylib가 일반적이지 않아 발생하는 에러이긴 한데 정상적이라면 폴더 내부의 파일들을 모두 검증하여 결과를 알려준다.
정상임을 확인하면 아래와 같이 공증을 수행한다.

기존에는 altool을 사용하는 방법에서 notarytool 이라는 전용툴로 변경되어 아래와 같이 공증을 수행한다.
자세한 내용은 하단 링크들을 참고바람.

```sh
$ xcrun notarytool submit --file /Users/user/test.pkg --apple-id '[iCloud와 연동한 Developer계정]' --team-id '[팀아이디]' --password '[appleid에서발급한password]' --wait
Conducting pre-submission checks for test.pkg and initiating connection to the Apple notary service...
Submission ID received
  id: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
Successfully uploaded file
  id: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  path: /Users/user/test.pkg
Waiting for processing to complete.

Current status: In Progress...
Current status: In Progress....
Current status: In Progress.....
Current status: In Progress......
Current status: In Progress.......
Current status: Accepted........Processing complete
  id: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  status: Accepted
```

이전에는 등록한 파일 작업이 완료된 이후에는 애플에서 메일로 결과를 친절하게 알려줬으나 지금은 위와같이 작업이후에 결과값을 알려준다.
--wait 옵션을 사용하지 않는 경우도 있는데 이전방식보다 한결 편하여 이렇게 사용하고 있다.
성공인 경우 Accepted를 실패인 경우 Invalid라고 띨룽 나오게 되는데 자세한 내용 확인을 위해서는 아래와 같이 별도의 명령을 수행한다.

운이 좋았던(?) 덕분인지 코드사인 인증서를 교체한지 얼마 지나지 않은덕에 아래와 같이 실패시 메세지들을 확인 할 수 있었다.. -_-;;;;;;
인증서가 정상적으로 valid되지 않은 상태에서 코드서명 후 공증을 태워 에러가 발생하였을때의 로그이다.
에러별 자세한 내용은 해당 링크를 클릭하면 확인 할 수 있다.

```sh
$ xcrun notarytool log aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee --apple-id '[iCloud와 연동한 Developer계정]' --team-id '[팀아이디]' --password '[appleid에서발급한password]' outlog.json
Successfully downloaded submission log
  id: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  location: /Users/user/outlog.json
$ cat outlog.json
{
  "logFormatVersion": 1,
  "jobId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  "status": "Invalid",
  "statusSummary": "Archive contains critical validation errors",
  "statusCode": 4000,
  "archiveFilename": "test.pkg",
  "uploadDate": "2024-01-11T01:11:11.111Z",
  "sha256": "ssssssssssssssssssssssssssssssss",
  "ticketContents": null,
  "issues": [
    {
      "severity": "error",
      "code": null,
      "path": "test.pkg/test",
      "message": "The signature of the binary is invalid.",
      "docUrl": "https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues#3087735",
      "architecture": "x86_64"
    },
    {
      "severity": "error",
      "code": null,
      "path": "test.pkg/test",
      "message": "The signature does not include a secure timestamp.",
      "docUrl": "https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues#3087733",
      "architecture": "x86_64"
    }
  ]
}
```

참고로 10.15부터 32비트 앱의 지원이 중단되었다. ([관련글](https://www.macrumors.com/guide/32-bit-mac-apps/))
64비트로 빌드한 바이너리만 등록 가능하며 notarytool은 XCode13 이상의 환경에서 지원한다.

# staple

파일을 앱스토어에 올려 정상적으로 검증이 되었다고 끝이 아니고 검증한 파일에 확인사살까지 해 줘야 한다.

```sh
$ xcrun stapler staple ~/test.pkg
Processing: ~/test.pkg
The staple and validate action worked!
```

# 기타
참고로 공증 시도했던 내역을 아래와 같이 조회 할 수 있다.

```sh
$ xcrun notarytool history --apple-id '[iCloud와 연동한 Developer계정]' --team-id '[팀아이디]' --password '[appleid에서발급한password]'
Successfully received submission history.
  history
    --------------------------------------------------
    createdDate: 2024-01-11T01:15:11.111Z
    id: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
    name: test.pkg
    status: Accepted
    --------------------------------------------------
    createdDate: 2024-01-11T01:12:11.111Z
    id: aaaaaaaa-bbbb-cccc-dddd-ffffffffffff
    name: test.pkg
    status: Accepted
    --------------------------------------------------
    createdDate: 2024-01-11T01:11:11.111Z
    id: aaaaaaaa-bbbb-cccc-dddd-gggggggggggg
    name: test.pkg
    status: Invalid
    ...
    ...
```

애플 문서만 봐도 왠만한건 다 작업 가능하다.
아래 주소들 참고해서 보시길..

# 변경된사항
2023년 11월 1일자로 공증방식이 변경되어 일부 내용을 수정 반영하였다.

> **reference**
> - https://appleid.apple.com
> - https://developer.apple.com/kr/developer-id/
> - https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution
> - https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution/resolving_common_notarization_issues
> - https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution/customizing_the_notarization_workflow
> 
> - https://derflounder.wordpress.com/2019/04/10/notarizing-automator-applications/
> - https://www.macrumors.com/guide/32-bit-mac-apps/

> **2023년 11월 이후 변경사항 reference**
> - https://developer.apple.com/documentation/technotes/tn3147-migrating-to-the-latest-notarization-tool?changes=_3_3
> - https://forums.developer.apple.com/forums/thread/705839

> **Related Posts**
> [1. 코드서명, 공증하기](../mac-notarizing/)
> [2. 3rd파티 라이브러리 포함한 공증](../mac-notarizing2/)