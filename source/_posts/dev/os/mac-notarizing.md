---
title: MacOS app, pkg 공증하기
date: 2019-08-23 18:00:00
categories:
- dev
tags:
- os
- mac
- xcode
- notarizing
- staple
cover: /dev/os/mac-notarizing/01.png
---

MacOS 10.15에서 보안 강화를 위해 공증(notarization)을 새로 도입했다. 방법을 알아보자.

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
정상임을 확인하면 아래와 같이 공증을 수행한다. altool의 자세한 옵션은 구글링하시길..

```sh
$ xcrun altool --notarize-app --primary-bundle-id "[appleid에서발급한ID]" --username "[iCloud와 연동한 Developer계정]" --password "[appleid에서발급한password]" --file ~/test.pkg
2019-xx-xx xx:xx:xx.xxx altool[73035:10852694] No errors uploading '~/test.pkg'.
RequestUUID = aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
```

등록한 파일 작업이 완료된 이후에는 애플에서 메일로 결과를 친절하게 알려준다.
메일은 성공인 경우 실패인 경우로 나뉘는데 실패했다고 로그를 주는건 아니고 위에 나온 RequestUUID라는 32자리 값을 가지고
상세 내용을 조회 해야만한다. (저~~ㅇ말 친절해.. 고마워 애플...)

```sh
$ xcrun altool --notarization-info [발급된 RequestUUID] --username "[iCloud와 연동한 Developer계정]" --password "[appleid에서발급한password]"

# 성공한경우 응답
2019-08-23 19:03:47.567 altool[1111:22222222] No errors getting notarization info.

   RequestUUID: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
          Date: 2019-08-23 08:38:49 +0000
        Status: success
    LogFileURL: https://osxapps-ssl.itunes.apple.com/itunes-assets/~~~~~
   Status Code: 0
Status Message: Package Approved

# 실패한경우 응답
2019-08-23 19:03:03.277 altool[1111:22222222] No errors getting notarization info.

   RequestUUID: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
          Date: 2019-08-20 04:19:09 +0000
        Status: invalid
    LogFileURL: https://osxapps-ssl.itunes.apple.com/itunes-assets~~~~~   Status Code: 2
Status Message: Package Invalid
```

LogFileURL 라는 값에 작업에 대한 로깅을 제공하는데 접속해보면 사유를 상세하게 알려준다.
말이 상세지 에러내용은 다 검색해야한다. 대표적인 것들은 [다음](https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution/resolving_common_notarization_issues) 페이지에서 참고는 가능하다. 근데 도움이 별로 안됨.. -_-;;
JSON에 status 값이 성공인 경우 Accepted, 실패한 경우 Invalid로 표시되고 실패시 issues 항목에 나온 파일들을 확인하면 된다.

```json
# 성공인경우
{
  "logFormatVersion": 1,
  "jobId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  "status": "Accepted",
  "statusSummary": "Ready for distribution",
  "statusCode": 0,
  "archiveFilename": "test.pkg",
  "uploadDate": "2019-08-23T08:38:49Z",
  "sha256": "9dfab97a106123123q2werwerzzzzzzjjjjjjf85b086e6e2a3ea1abb7eaef2b4",
  "ticketContents": [
    {
      "path": "test.pkg",
      "digestAlgorithm": "SHA-1",
      "cdhash": "aaaaaaaabbbbbbbbcccccccceeeeeeeeffffffff"
    },
    {
      "path": "test.pkg/test.pkg Contents/Payload/Applications/test/test.app",
      "digestAlgorithm": "SHA-256",
      "cdhash": "aaaaaaaabbbbbbbbcccccccceeeeeeeeffffffff",
      "arch": "x86_64"
    },
    {
      "path": "test.pkg/test.pkg Contents/Scripts/test.zip/test",
      "digestAlgorithm": "SHA-256",
      "cdhash": "aaaaaaaabbbbbbbbcccccccceeeeeeeeffffffff",
      "arch": "x86_64"
    },
    {
      "path": "test.pkg/test.pkg Contents/Scripts/test.zip/test.dylib",
      "digestAlgorithm": "SHA-256",
      "cdhash": "aaaaaaaabbbbbbbbcccccccceeeeeeeeffffffff",
      "arch": "x86_64"
    }
  ],
  "issues": null

# 에러인경우
{
  "logFormatVersion": 1,
  "jobId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  "status": "Invalid",
  "statusSummary": "Archive contains critical validation errors",
  "statusCode": 4000,
  "archiveFilename": "test.pkg",
  "uploadDate": "2019-08-20T04:19:09Z",
  "sha256": "9dfab97a106123123q2werwerzzzzzzjjjjjjf85b086e6e2a3ea1abb7eaef2b4",
  "ticketContents": null,
  "issues": [
    {
      "severity": "error",
      "code": null,
      "path": "test.pkg/test.pkg Contents/Payload/Library/test.framework/Versions/A/test",
      "message": "The signature of the binary is invalid.",
      "docUrl": null,
      "architecture": "x86_64"
    },
    {
      "severity": "error",
      "code": null,
      "path": "test.pkg/test.pkg Contents/Payload/Library/test.framework/Versions/A/test2.dylib",
      "message": "The signature of the binary is invalid.",
      "docUrl": null,
      "architecture": "x86_64"
    }
  ]
}
```

성공인 경우 업로드 한 ticketContents 값에 검증한 파일 목록들이 표시되고, 실패인 경우 issues 값에 실패한 파일이 표시된다.

참고로 10.15부터 32비트 앱의 지원이 중단되었다. ([관련글](https://www.macrumors.com/guide/32-bit-mac-apps/))
64비트로 빌드한 바이너리만 등록 가능하다는 이야기....

# staple

파일을 앱스토어에 올려 정상적으로 검증이 되었다고 끝이 아니고 검증한 파일에 확인사살까지 해 줘야 한다.

```sh
$ xcrun stapler staple ~/test.pkg
Processing: ~/test.pkg
The staple and validate action worked!
```

# 기타
참고로 공증 시도했던 내역을 조회 할 수도 있다.

```sh
$ xcrun altool --notarization-history 0 --username "[iCloud와 연동한 Developer계정]" --password "[appleid에서발급한password]"

Notarization History - page 0

Date                      RequestUUID                          Status  Status Code Status Message   
------------------------- ------------------------------------ ------- ----------- ---------------- 
2019-08-23 08:38:49 +0000 aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee success 0           Package Approved 
2019-08-22 08:36:10 +0000 aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee success 0           Package Approved
2019-08-22 08:29:01 +0000 aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee success 2           Package Invalid
2019-08-22 08:36:10 +0000 aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee success 0           Package Approved
...
...
```

애플 문서만 봐도 왠만한건 다 작업 가능하다.
아래 주소들 참고해서 보시길..

#### reference
  - https://appleid.apple.com
  - https://developer.apple.com/kr/developer-id/
  - https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution
  - https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution/resolving_common_notarization_issues
  - https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution/customizing_the_notarization_workflow

  - https://derflounder.wordpress.com/2019/04/10/notarizing-automator-applications/
  - https://www.macrumors.com/guide/32-bit-mac-apps/
