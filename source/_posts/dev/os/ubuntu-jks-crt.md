---
title: SSL인증서를 톰캣, 아파치 상호 변환하기
date: 2022-11-15 18:00:00
categories:
- dev
tags:
- os
- ubuntu
- cert
- apache
- tomcat
---

SSL인증서 타입이 다른 톰캣, 아파치용 인증서를 서로 변환한다.

<!-- more -->

SSL 인증서를 사용하려면 서버에 맞춰 인증서를 설정해야하는데 톰캣에서 사용하던 인증서를 아파치에 사용해야 할때가 있다.
그 반대의 경우도 물론 있게되고.. 작업을 한줄 요약하자면 crt 인증서 <=> pfx 인증서 <=> jks 인증서 로 전환을 하면 된다.
당연한 이야기이지만 비밀번호는 알고 있어야만 한다.

## 아파치 -> 톰캣 (crt to jks)

1. crt -> pfx
```sh
$ openssl pkcs12 -inkey incert.key -in incert.crt.pem -certfile incert.chainca.crt -export -out outcert.pfx
```

2. pfx -> jks
```sh
$ keytool -importkeystore -srckeystore outcert.pfx -srcstoretype pkcs12 -destkeystore outcert.jks -deststoretype jks
```

3. 확인
```sh
$ keytool -list -keystore outcert.jks -rfc
```

## 톰캣 -> 아파치 (jks to crt)

1. jks -> pfx
```sh
$ keytool -importkeystore -srckeystore incert.jks -srcstoretype jks -destkeystore outcert.pfx -deststoretype pkcs12
```

2. pfx -> cert
```sh
$ openssl pkcs12 -in outcert.pfx -clcerts -nokeys -out outcert.crt
```

3. pfx -> key
```sh
$ openssl pkcs12 -in outcert.pfx -nocerts -nodes -out outcert.key
```

4. pfx -> chaincrt
jks 인증서에서 alias name이라는 값을 확인하고 alias로 연결(?)된 인증서를 출력한다.
tomcat이라는 이름을 예로 들면 아래처럼 진행한다.
체인인증서가 2개를 갖는다면 아래처럼 [1], [2] 하는식으로 쭉 출력된다.
```sh
$ keytool -list -v -keystore incert.jks | grep Alias
Enter keystore password:  ********
Alias name: tomcat
.........

$ keytool -list -alias tomcat -keystore outcert.pfx -rfc
Enter keystore password:  
Alias name: tomcat
Creation date: Nov 15, 2022
Entry type: PrivateKeyEntry
Certificate chain length: 2
Certificate[1]:
-----BEGIN CERTIFICATE-----
MIIGazCCBVO....
-----END CERTIFICATE-----
Certificate[2]:
-----BEGIN CERTIFICATE-----
MIIEiTCCA3Gg....
-----END CERTIFICATE-----
```

5. chaincrt 생성
앞에 생성된 인증서 리스트를 별도의 텍스트 파일로 생성한다.
중간에 Certificate[1]: 같은것들은 모두 지우고 -----BEGIN CERTIFICATE----- ~ -----END CERTIFICATE-----
인증서들을 쭉 붙여준다.
```sh
$ vi outcert.chainca.crt
-----BEGIN CERTIFICATE-----
MIIGazCCBVO....
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIEiTCCA3Gg....
-----END CERTIFICATE-----
```

아래 스택오버플로 댓글에 보면 배치짜서 해도 될듯한데 그게 더 귀찮.....
이런것들은 쉽게 가자..


#### reference
  - https://requireme.tistory.com/entry/ssl인증서-포멧-변경하기-IISfpx-apachecrt
  - https://www.sslcert.co.kr/guides/SSL-Certificate-Convert-Format
  - https://stackoverflow.com/questions/30091942/how-to-export-the-all-intermediate-certs-including-root-certificates-using-keyto






