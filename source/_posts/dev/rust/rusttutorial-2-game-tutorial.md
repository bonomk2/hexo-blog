---
title: "[RustTutorial] 추리게임 만들기"
date: 2019-07-05 15:00:00
categories:
- dev
tags:
- rusttutorial
- rust
- cargo
- crates
---

숫자맞추기 게임을 통해 기본 내용을 코딩해보고 외부 Crate를 써보자..

<!-- more -->
내용이 많이 길긴한데, npm을 사용해 봤다면 크게 어렵지 않을거라 생각한다.

## 프로젝트 생성
```sh
$ cargo new guessing_game --bin
$ cd guessing_game
```

## 숫자맞추기 게임
우선 최종 소스부터 놓고 시작을.... 경로는 프로젝트 루트를 기준으로 한다.

```rust [source] src/main.rs
extern crate rand;

use std::io;
use std::cmp::Ordering;
use rand::Rng;

fn main() {
    println!("Guess the number!!");
    let secret_number = rand::thread_rng().gen_range(1, 101);
    println!("........The secret number is: {}", secret_number);
    
    loop {
        println!("Please input your guess.");
        let mut guess = String::new();
        io::stdin().read_line(&mut guess)
            .expect("Fail to read line");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please type a number");
                continue;
            }
        };
        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less      => println!("Too Small"),
            Ordering::Greater   => println!("Too Big"),
            Ordering::Equal     => {
                println!("You Win!!!");
                break;
            }
        }
    }
}
```

추가되는 Crate 설정을 위해 Cargo.toml에 dependencies를 추가한다. Crate는 아래에서 설명을..

```sh [cargo] Cargo.toml
[package]
name = "guessing_game"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
edition = "2018"

[dependencies]
rand = "^0.3.0"
```

cargo run을 실행하면 아래와 같이 결과가 나온다.

```sh
> Executing task: cargo run <

    Finished dev [unoptimized + debuginfo] target(s) in 0.19s
     Running `target\debug\guessing_game.exe`
Guess the number!!
........The secret number is: 45
Please input your guess.
40
You guessed: 40
Too Small
Please input your guess.
50
You guessed: 50
Too Big
Please input your guess.
abcd
Please type a number
Please input your guess.
45
You guessed: 45
You Win!!!
```

어렸을때 많이 하던 숫자맞추기 게임이다.
상대가 정한것보다 숫자가 높으면 Too Big을 낮으면 Too Small을 출력하고
숫자가 아니면 에러처리를하고 맞으면 프로그램을 끝낸다.

## 조각조각

### crate
nodejs에 npm이 있는것처럼 Rust에는 cargo가 있는가보다.
Cargo.toml 내에 dependencies 항목에 원하는 패키지와 버전을 명기하면 build시에 필요한놈 들을 원격지 저장소에서
땡겨와서 설치를 진행한다. 이 패키지를 Crate라 부르고 node에 [npmjs.com](https://www.npmjs.com/) 가 있는것처럼 [crates.io](https://crates.io/) 라는
Crate들을 모아놓은 사이트에서 기본적으로 지원이 되는듯하다.

```sh Cargo.toml
[dependencies]
rand = "0.3.0"
```
원문에는 Cargo.toml에 대한 뭔가 설명이 긴데 위와 같이 적었다면 rand 0.3.x 버전과 호환되는 최신의 Crate를 crates.io에서
내려받아 프로젝트에 설치를 진행한다는 뜻이다.
참고로 버전 룰은 [Semantic Versioning](https://semver.org/)을 따른다.
[crate.io](https://crates.io)에 가서 rand를 검색하면 아래와 같은 화면을 볼 수가 있다.
{% asset_img 01.PNG %}

사이트에 접속하면 최신버전은 0.7.0이고 이전버전은 화면 우측에 Versions 항목에서 정보를 찾을 수 있다.
설정 후 cargo build를 실행하면
```sh
> Executing task: cargo build <

   Compiling winapi v0.3.7
   Compiling libc v0.2.58
   Compiling rand v0.4.6                                                                   
   Compiling rand v0.3.23                                                                  
   Compiling guessing_game v0.1.0 (D:\Projects\rust-sample\guessing_game)                  
    Finished dev [unoptimized + debuginfo] target(s) in 4.76s 
```
dependency가 엮인 Cargo들을 내려받게 된다.
내려받은 Crate의 API 정보를 알고자 한다면 사이트에서 확인도 가능하겠지만, cargo에 doc 옵션을 통해서도 가능하다.

```sh
$ cargo doc --open
    Checking winapi v0.3.7
 Documenting winapi v0.3.7
 Documenting libc v0.2.58
    Checking libc v0.2.58
    Checking rand v0.4.6                                                                   
    Checking rand v0.3.23                                                                  
 Documenting rand v0.4.6                                                                   
 Documenting rand v0.3.23                                                                  
 Documenting guessing_game v0.1.0 (D:\Projects\rust-sample\guessing_game)                  
    Finished dev [unoptimized + debuginfo] target(s) in 17.25s                             
     Opening D:\Projects\rust-sample\guessing_game\target\doc\guessing_game\index.html 
```
위와 같이 실행하면 로컬에 API document를 생성하고 브라우저로 열어준다.

{% asset_img 02.PNG %}

추가한 라이브러리인 rand와 관련한 API도 볼 수 있다.

{% asset_img 03.PNG %}

### crate


















> **Reference**
> - 추리게임 튜토리얼 : https://rinthel.github.io/rust-lang-book-ko/ch02-00-guessing-game-tutorial.html
> - crate.io : https://crates.io
> - crate 버전룰 : https://semver.org/
> **Sample Code**
> - https://github.com/bonomk2/rust-sample/
> **Related Posts**
> [0. 시작하기전에](../rusttutorial-0-start/)
> [1. Hello World](../rusttutorial-1-env/)
> [2. 추리게임 만들기](../rusttutorial-2-game-tutorial/)
