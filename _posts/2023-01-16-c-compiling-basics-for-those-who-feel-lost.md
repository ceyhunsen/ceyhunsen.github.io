---
layout: post
title: C Compiling Basics For Those Who Feel Lost
last_update: 16/01/23
---

If you are not a `C` developer and need to compile a `C` code base, you might see some weird stuff like `make`, `cmake` and `gcc`. Assuming you are some other kind of a developer, `gcc` probably feels familiar: It's the compiler. Although you can compile every `C` code base with just a compiler in theory, it's pratically not possible. So, people created some tools to help compilation. In order to understand why we need external tools, let's look at `C` compilation basics first.

> All of this tutorial can be applied to `C++` as well. Although, you better of using some `C++` compiler.

## `C` Compilation Basics

### The Compiler

What compiles a language to machine code? A compiler. So how do we get the `C` compiler? Should I go to `C` website and grab it from there? Umm... There is no standard `C` compiler nor a `C` website. So take a little bit of a history, I guess: When [some guy](https://en.wikipedia.org/wiki/Dennis_Ritchie) from 70's creating the `C` language, he didn't create a standard `C` compiler. But with the rise of `Unix`, `C` became popular and people created their own `C` compilers. Today however, we don't have that kinda chaos and have very strong choices like `gcc` and `clang`. You might also surprise but the standard language features are not governed by the guys who created the language but the international organizations like ISO[^1]. But there is just a little thingy: They don't write a compiler or standard library but some other guys. Don't worry though, we don't need to know about any of this. I just wanted to tell you to piss of you more (don't blame me, blame the language).

People mostly prefer `gcc` as the compiler. But you will probably be safe by compiling any code base with a different compiler that it's not intended one because there are standards. But if the code base has some kind of a low level stuff (like hardware interrupt handling), there is a high chance that it is dependent on the compiler it's developed with. That's because `C` standard is mostly independent from CPU architectures and compilers must implement those features. If in doubt, just grab the same compiler with the project.

Installing the compilers however, some another story. In linux, you probably have `gcc` installed so that's a relief. But in Windows, oh boy have fun with that. Back in the day, I tried to install `gcc` to my friend's Windows laptop and it was painful. Firstly, `gcc` is not natively supported on Windows. So some other guys ported `gcc` to Windows and called it `MinGW`[^2]. If you search it on internet, you will most likely see SourceForge links at the top of the page. What? I get that there were no official `C` website but this is too much. At least put the binaries in Github or something. When I first visited that site, I thought it was a virus site and leave. After some searching I gave up and downloaded it from there. Luckily it was not virus. But the torture was not yet over and I am not going to give you spoilers. If you are a freshman, have fun spending the rest of your day to figure out how to install the thing properly. Fortunately, there are some better ways to install a `C` compiler in Windows today. You are free to look up. Oh, on MacOS? Installing XCode also installs the `C` compiler, I guess. I don't have a Mac, sorry.

Last but not least, if you are trying to cross compile you need a different compiler than your host compiler. They might have prefixes or suffixes. One example is `arm-none-eabi-gcc`. This compiler basically is `gcc` but targets bare metal (no operating system) arm processors. So, you should use same compiler with target project if you are cross compiling and don't want any headaches.

### Source Files

We have 2 kind of source files: `.c` and `.h`. The files with `.c` suffix includes the main code and compiler compiles those files to some kind of binary format. These binary files include function definitions, mostly. `.h` files in the other hand, includes declarations. Those declarations just helps the compiler and not gets compiled, again mostly. Let me explain this by an example: We need to create a program that accepts a number as an input and outputs times 2 of itself. This is a very basic example that can only be written with 1 `.c` file but for the sake of this post, let's divide it in to 3 pieces: `main.c` that calls everything, `input.c` that takes the input from user and finally, `calculate.c` that calculates the output. This little example's source code will roughly look like this:

`main.c`:

```c
int main()
{
    int input = get_input();
    calculate(input);

    return 0;
}
```

`input.c`:

```c
#include <stdio.h>

int get_input()
{
   int input;
   scanf("%d", &input);
   return input;
}
```

`calculate.c`:

```c
#include <stdio.h>

void calculate(int input)
{
    printf("%d * 2: %d\n", input, input * 2);
}
```

If we give all of the three files to compiler, compiler will produce a binary but still probably complain. Here is an example:

```bash
main.c: In function ‘main’:
main.c:3:17: warning: implicit declaration of function ‘get_input’ [-Wimplicit-function-declaration]
    3 |     int input = get_input();
      |                 ^~~~~~~~~
main.c:4:5: warning: implicit declaration of function ‘calculate’ [-Wimplicit-function-declaration]
    4 |     calculate(input);
      |     ^~~~~~~~~
```

You can link completely independent `C` sources in to one binary. Because of that, compiler wants to know if there is a function that you are trying to call. If there is not, compilation will be failed. So don't worry, your program won't crash in production because of this (looking at you scripting languages).

So, here comes the header files. When we create some `.c` file, we better of creating a `.h` file with same name and put public declarations in the `.h` file. In this way, compiler won't complain and compile just fine. This also helps other developers. So let's add these 2 header files to our little project:

`input.h`:

```c
int get_input();
```

`calculate.h`:

```c
void calculate(int input);
```

Finally, we need to include these 2 to where they are called:

`main.c`:

```c
#include "input.h"
#include "calculate.h"

int main()
{
    int input = get_input();
    calculate(input);

    return 0;
}
```

See, there are no warnings anymore. In real world examples, you might see some weird stuff in header files, like `#ifndef _INPUT_H`. They are some weird workarounds for the language design, I am afraid. If you are interested, they are called [include guards](https://en.wikipedia.org/wiki/Include_guard). If you see something like this, don't touch it and go on with your life please.

## Compiling, Finally

If we take the last example, our project contains these files:

```bash
├── calculate.c
├── calculate.h
├── input.c
├── input.h
└── main.c
```

Assuming our `C` compiler is `gcc`, we can compile everyting with this command:

```bash
gcc calculate.c input.c main.c
# Or
gcc *.c
```

Either way, compile command will get very long with a bigger project. And there is a huge problem: We are compiling every source file in each iteration even we changed only one source file.

We can compile every `.c` file separately and link them later. In this way, if we changed contents of only one file, we won't need to compile rest of the program and our compilation speed will increase dramatically. We can do this by using these commands:

```bash
gcc -c calculate.c
gcc -c input.c
gcc -c main.c
gcc *.o
```

The `-c` flag will compile the source file but does not link to an executable (crates a `.o` file). Linking all the `.o` files together is fairly faster than compiling everything over and over. But let's say we are working a bigger project with more source files and many more sub-directories. Are we really going to find all the source files and compile one by one? Maybe writing a script would do the trick, eh? But a simple `bash` script won't keep track of the changed files and will compile everything again. And there are so many other compilation specific stuff that you don't want to keep track of. Any easy way to deal with this? Yes, let's invent multiple different build systems!

## Build Systems

Lazy people who don't want to deal with this compilation turmoil, created build systems. Again, there is no standard so every lazy people decided that previous build system sucked and created a new one. So we have handful of build systems now. Some of the I know of are:

* Make
* Cmake
* Autotools
* Ninja
* Meson
* Some IDE specific ones (like Code::Blocks)

The most popular is probably the `make`. And I can say, it is a pain in ass to write an useful `Makefile`. When I start a new `C` project, I spend my first day only to create a `Makefile` and it mostly sucks. Some other people thinked this a lot I assume, they created a higher level build system that creates `Makefile`'s. `cmake` and `autotools` are the 2 examples of this. The same story can be applied to rest, I assume.

Point of these build systems are: Let the developer worry about code and not on compiling it. And I have to say, they fail. I mean, I didn't used `ninja` or `meson` and used `cmake` just a little bit, but when I look at `Rust`, `cargo` just solves so many unnecessary issues. I don't have to deal with third party library compilation, compile time definitions or header files. I just say use this source file in any of the source files, and `cargo` will just grab it compile it. I am not sure this is because of `C`'s design or build systems, but there is an obvious problem.

One of my colleague (had little to none experience on `C/C++` before) needed just to compile an open source `C++` project which uses `cmake` as the build system. The compilation was failing and she had no clue why. When I look at it, I saw that project includes a `C++20` header and her compiler wasn't support that standard. So, she tried to upgrade `cmake` naturally as she thought it was the compiler. This made me realize, compiling a `C/C++` program is unnecessarily complex and cumbersome. I mean she is a software engineer and she compiled or used some other projects in different languages but with `C/C++`, it was another story. So many people think `C` is an ancient language that needs to die and they didn't even know this build system hell hole. Guess what they will think of this after that. But we can't do anything for this haven't we? Unless someone brave enough comes up and creates "the better" build system.

![Relevant xkcd](https://imgs.xkcd.com/comics/standards.png)

## Conclusion

We can say all the build systems have their own problems and quirks. But with `C`, there are little to none official documentation and smaller communities on YouTube like sites is a problem for outsiders and newbies. If you are in those categories and don't need to code in `C/C++` but compile one project with it, I hope this post will help you understand some of the compilation stuff.

`C` is everywhere and whole world probably collapse without it. If we need to use those important software, first we need to compile them. Forunately, not all people nor developers need to compile a `C` program. For those who need to compile one, good luck.

## Sources

[^1]: [https://en.wikipedia.org/wiki/C_(programming_language)#ANSI_C_and_ISO_C](https://en.wikipedia.org/wiki/C_(programming_language)#ANSI_C_and_ISO_C)
[^2]: [https://en.wikipedia.org/wiki/MinGW](https://en.wikipedia.org/wiki/MinGW)
