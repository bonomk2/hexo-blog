---
title: "[RustTutorial] Hello World"
date: 2019-07-02 15:00:00
categories:
- dev
tags:
- rusttutorial
- rust
- cargo
- install
- enviroment
cover: /dev/rust/rust-env/01.JPG
---

Rust를 실행하기 위한 환경을 구성하고 Hello World를 만들어보자.

<!-- more -->
Rust를 사용하기 위한 환경을 구성하고 hello world를 출력해보자...
에디터기는 IntelliJ가 갑이라고 하는데, 나는 Code를 사랑하니까 어떻게는 Code에서 작업하련다.

## 설치

### 다운로드
[Rust-lang 다운로드](https://www.rust-lang.org/tools/install) 페이지에가서 rustup-init 파일을 다운로드 후 설치한다.
설치 후 %USERPROFILE%\.cargo\bin 을 path 잡아준다.

정상 설치 확인
```sh
$ rustc --version
rustc 1.35.0 (3c235d560 2019-05-20)
$ cargo --version
cargo 1.35.0 (6f3e9c367 2019-04-04)
```

로컬에 Visual Studio 2013이상의 버전(이하 VS)이 설치되어 있지 않다면 VS도 설치한다. [설치하기](https://visualstudio.microsoft.com/ko/downloads/)
VS2019 pro 버전으로 설치하였는데, 다른 옵션 없이 C++를 사용한 데스크톱 개발 항목만 체크하고 설치했다.
기준 VS2017 설치시와는 항목들이 많이 다르고 세부적이라 머리아프니 기본으로만 설치한다.

{% asset_img 01.JPG %}

VS가 아닌 MinGW 환경을 사용 할 수도 있는것 같은데 hello world도 모르는데 고민하지 말고 그냥 진행..
rustup 설정하고 뭐 이런저런거 하는것 같은데 우선은 쉽게 간다. rustup은 뭐하는놈인지 아직 나도 모른다.. ㅋㅋ

### VSCode 구성
확장기능들을 무엇에 쓰는 물건인지는 모르나 rust build시에 편하다 해서 3개 설치했음.
[Rust(rls)](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust), [Rust](https://marketplace.visualstudio.com/items?itemName=kalitaalexey.vscode-rust), [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
다른 extension들은 무시해주시길..

{% asset_img 02.PNG %}

## Hello, World!!!
hello_world.rs 라는 파일을 생성하여 아래와 같이 코딩한다.
```rust
fn main() {
    println!("Hello, world!");
}
```
컴파일 후 실행해보자.
```sh
$ rustc hello_world.rs

$ hello_world
Hello, World!

$ dir /a /b
hello_world.exe
hello_world.pdb
hello_world.rs
```
컴파일 후에 파일을보면 pdb 파일과 exe 파일이 생성되어 있다.
언어 포맷은 나중에 어딘가에 나오겠지. 그냥 패스~

## Hello, Cargo!!!
잘은 모르겠으나 nodejs의 npm 같은 놈인듯하다. 빌드하고 의존성을 관리해준단다.
자세한건 써보면 알게 되겠지...

폴더를 새로 만들고 프로젝트 생성한다.
```sh
$ cargo new hello_cargo --bin
```
--bin 옵션은 실행가능한 어플리케이션으로 만들어준다고 하는데 옵션 빼고 해봐도 실행파일이 생성된다..
자세한건 나중에 알 수 있지 않을까 싶다는...

프로젝트를 생성하면 아래와 같이 파일들이 생성되는데, 
```sh
$ dir /a/b/s  
~\hello_cargo\.git
~\hello_cargo\.gitignore
~\hello_cargo\Cargo.lock
~\hello_cargo\Cargo.toml
~\hello_cargo\src
```
필요한것은 소스가 담기는 src 폴더이고 빌드를 실행하면 target 폴더가 생성되게 된다.

build를 실행 해본다.
결과물은 target/debug에 생성된다.
```sh
$ cargo build
   Compiling hello_cargo v0.1.0 (D:\Projects\rust-sample\hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.49s
```

빌드 후 실행이 되도록 run을 해본다.
```sh
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.01s
     Running `target\debug\hello_cargo.exe`
Hello, Cargo!!!
```

check를 해본다. check는 빌드가 잘 되는지 확인하는 용도이고, 속도가 빠르다고 하는데 hello world로는 전혀 와닿지 않는다.
```sh
$ cargo check
    Checking hello_cargo v0.1.0 (D:\Projects\rust-sample\hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.09s
```

release build를 해본다. 릴리즈는 말그대로 릴리즈 빌드이다.
결과물은 target/release에 생성된다.
```sh
$ cargo build --release
   Compiling hello_cargo v0.1.0 (D:\Projects\rust-sample\hello_cargo)
    Finished release [optimized] target(s) in 0.38s
```

rustc와 동일한 일을 한다고 하는데 아무래도 소스의 양이 많아지고 복잡해지면 효과를 볼 수 있다고 문서에 나와있다..
hello world 만 써봐서는 하나도 와닿지 않음.. ㅋㅋ

## 번외편 VSCode 셋팅
Code를 잘 쓰지는 못하지만 작업하면서 얻은 팁들은 함께 공유하려한다.
앞서 Code extension을 깐 덕분에 Code에서 Ctrl+Shift+B를 누르면 빌드를 수행하게 되는데 아래와 같이 선택하는 화면이 나오게 된다.
{% asset_img 03.PNG %}
즉시 실행을 위해서 프로젝트 루트에 .vscode\tasks.json 파일을 생성하여 아래와 같이 작성해보자.
```js
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "hello cargo build",
            "type": "shell",
            "command": "cargo",
            "args": [
                "run"
                //"build"
            ],
            "group":{
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": [
                "$rustc"
            ]
        }
    ]
}
```
이후에 Ctrl+Shift+B 를 클릭하면 즉시 빌드 후 실행이 동작하게 된다.
Ctrl+Shift+P를 클릭후에
{% asset_img 04.PNG %}
Run Task를 선택하면 hello cargo build 라는 항목이 추가된것이 보일것이다.
{% asset_img 05.PNG %}

> **Reference**
> - rust stable guide book : https://doc.rust-lang.org/stable/book/index.html
> - rust getting started : https://rinthel.github.io/rust-lang-book-ko/ch01-00-getting-started.html
> - visual studio code setting : https://yonomi.tistory.com/387
> **Sample Code**
> - https://github.com/bonomk2/rust-sample/
> **Related Posts**
> [0. 시작하기전에](../rusttutorial-0-start/)
> [1. Hello World](../rusttutorial-1-env/)
> [2. 추리게임 만들기](../rusttutorial-2-game-tutorial/)