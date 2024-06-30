---
layout: technical
title: C Compiling Basics For Those Who Feel Lost
last_update: 08/02/23
tags: C, build systems
---

Note: This writing is copied from my blog and it's not in the best format tbh. It will be reformatted soon.

If you are not a C developer and need to compile a C code base, you might see some weird stuff like `make`, `cmake` and `gcc`. Assuming you are some other kind of a developer, `gcc` probably feels the most familiar: It's the compiler. Although you can compile every C code base with just a compiler in theory, it's practically not possible. So, people created some tools to compile a C program apart from the compiler. And this is my guide to compile a C program.

All of this tutorial can be applied to C++ as well. Although, you better off using a C++ compiler.

## C Compilation Basics

### The Compiler

What compiles a language to machine code? A compiler. So how do we get the C compiler? Should I go to C website and grab it from there? Umm... There is no standard C compiler nor a C website. So take a little bit of a history, I guess: When [some guy](https://en.wikipedia.org/wiki/Dennis_Ritchie) from 70's creating the C language, he didn't create the "standard" C compiler. But with the rise of Unix, C became popular and people created their own C compilers. Today however, we don't have that kind of chaos and have very strong choices like `gcc` and `clang`. You might also surprise by this: Standard language features are not governed by the guys who created the language but the international organizations like ISO[^1]. And there is just another little thingy: They don't write the standard library, but some other guys. Don't worry though, we don't need to know about any of this. I just wanted you to piss of more (don't blame me, blame the language).

As I said, today we have `gcc` and `clang` as compilers and they are free. But apart from x86 and x86_64, there are other proprietary compilers which aren't free. They mostly target specific use cases and you probably don't have to worry about them. But it is good to know in case you need to deal with any of that specific use cases.

People mostly prefer `gcc` as the compiler. But you will probably be safe by compiling any code base with a different compiler that it's not intended one because there are standards. But if the code base has some kind of low level stuff (like hardware interrupt handling), there is a high chance that it is dependent on the compiler it's developed with. That's because C standard is mostly independent from CPU architecture and compilers sometimes implement those architecture specific features. If in doubt, just grab the same compiler with the project.

Installing the compilers however, some other story. In Linux, you probably have `gcc` installed. If it's not, just search `gcc` from the package manager. Beware of this though: If you are using some old LTS distro like Ubuntu 20.04, your compiler will be old too and won't have support for new standards like C++ 20 (I came across this before, more on this below). But in Windows, oh boy have fun with that. Back in the day, I tried to install `gcc` to my friend's Windows laptop, and it was painful. Firstly, `gcc` is not natively supported on Windows. So some other guys ported `gcc` to Windows and called it MinGW[^2]. If you search it on the internet, you will most likely see SourceForge links at the top of the page. What? I get that there was no official C website but this is too much. At least put the binaries in Github or something. When I first visited that site, I thought it was a virus site and leave. After some searching, I gave up and downloaded it from there. Luckily, it was not a virus. But the torture was not yet over and I am not going to give you spoilers. If you are a freshman, have fun spending the rest of your day figuring out how to install the thing properly. Fortunately, there are some better ways to install a C compiler in Windows today. Because I don't use Windows and MacOS, I can't give you the exact instructions for these platforms. But I guess WSL for Windows and XCode for MacOS will help a little.

Last but not least, if you are trying to cross compile you need a different compiler than your host compiler. They might have prefixes or suffixes on their names. One example is `arm-none-eabi-gcc`. This compiler is basically `gcc` but targets bare metal (no operating system) arm processors. So, you should use the same compiler with the target project if you are cross compiling and don't want any headaches.

### Source Files

We have 2 kinds of source files: .c and .h. The files with .c suffix includes the main code and compiler compiles those files to some kind of binary format. These binary files include function definitions, mostly. .h files in the other hand, includes declarations. Those declarations just help the compiler and not gets put into the binary, again mostly. Let me explain this by an example: We need to create a program that accepts a number as an input and outputs times 2 of itself. This is a very basic example that can only be written with one .c file. But for the sake of this post, let's divide it into 3 pieces: main.c that calls everything, input.c that takes the input from user and finally, calculate.c that calculates the output. This little example's source code, will roughly look like this:

main.c:

```c
int main()
{
    int input = get_input();
    calculate(input);

    return 0;
}
```

input.c:

```c
#include <stdio.h>

int get_input()
{
   int input;
   scanf("%d", &input);
   return input;
}
```

calculate.c:

```c
#include <stdio.h>

void calculate(int input)
{
    printf("%d * 2: %d\n", input, input * 2);
}
```

If we give all of the these files to compiler, compiler will produce a binary but still complain. Here is an example:

```bash
main.c: In function ‘main’:
main.c:3:17: warning: implicit declaration of function ‘get_input’ [-Wimplicit-function-declaration]
    3 |     int input = get_input();
      |                 ^~~~~~~~~
main.c:4:5: warning: implicit declaration of function ‘calculate’ [-Wimplicit-function-declaration]
    4 |     calculate(input);
      |     ^~~~~~~~~
```

You can link completely independent C sources into one binary. Because of that, compiler wants to know if there is a function that you are trying to call. If there is not, compilation will be failed. So don't worry, your program won't crash in production because of this (looking at you scripting languages).

So, here comes the header files on stage. When we create some .c file, we better off creating a .h file with the same name and put public declarations in the .h file. In this way, compiler won't complain and compile just fine. This also helps other developers to use your code. So, let's add these 2 header files to our little project:

input.h:

```c
int get_input();
```

calculate.h:

```c
void calculate(int input);
```

We didn't create the main.h file because no other .c file uses any function or variable from main.c.

Finally, we need to include these 2 headers to where they are called:

main.c:

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

There are no warnings anymore. In real world examples, you might see some weird stuff in header files, like `#ifndef _INPUT_H`. They are some weird workarounds for the language design, I am afraid. If you are interested, they are called [include guards](https://en.wikipedia.org/wiki/Include_guard). If you see something like this, don't touch it and go on with your life please.

## Compiling, Finally

If we take the last example, our project contains these files:

```bash
├── calculate.c
├── calculate.h
├── input.c
├── input.h
└── main.c
```

Assuming our C compiler is `gcc`, we can compile everything with one of these commands:

```bash
gcc calculate.c input.c main.c
# Or
gcc *.c
```

Either way, compile command will get very long with a bigger project. And there is a huge problem: We are compiling every source file in each iteration even we changed only one source file.

We can compile every .c file separately and link them later. In this way, if we changed contents of one file, we won't need to compile rest of the program and our compilation speed will increase dramatically. We can do this by using these commands:

```bash
gcc -c calculate.c
gcc -c input.c
gcc -c main.c
gcc *.o
```

The `-c` flag will compile the source file but does not link to an executable (creates a .o file). Linking all the .o files together, is way faster than compiling everything over and over again. But let's say we are working on a bigger project with more source files and many more sub-directories. Are we really going to find all the source files and compile one by one? Maybe writing a script would do the trick, eh? But a simple script won't keep track of the changed files and will compile everything again. And there are so many other compilation specific stuff that you don't want to keep track of. Any easy way to deal with this? Yes, let's invent multiple different build systems!

## Build Systems

Lazy people who don't want to deal with this compilation turmoil, created build systems. Again, there is no standard, so every lazy person decided that previous build system sucked and created a new one. So we have a handful of build systems now. Some of the I know of are:

* Make
* Cmake
* Autotools
* Ninja
* Meson
* Some IDE specific ones (like Code::Blocks)

The most popular is probably the `make`. And I can say, it is a pain in the ass to write an useful `Makefile` (which is the `make` "recipe"). When I start a new C project, I spend my first day only to create a `Makefile` and it mostly sucked. Some other people thought this a lot I assume, they created a higher level build system that creates `Makefile`'s. `cmake` and `autotools` are the 2 examples of this. The same story can be applied to rest, I assume.

The point of these build systems is: Let the developer worry about the code and not on compiling it. And I have to say, they fail. I mean, I didn't use `ninja` or `meson` and used `cmake` just a little bit. But when I look at Rust, `cargo` just solves so many unnecessary issues that C introduces. I don't have to deal with third party library compilation, compile time definitions or header files. I just run `cargo` on root directory and `cargo` will just compile stuff. I am not sure this is because of C's design or build systems, but there is an obvious problem.

One of my colleague (had little to none experience on C/C++ before) needed to just compile an open source C++ project which uses `cmake` as the build system. The compilation was failing and she had no clue why. When I looked at it, I saw that project includes a C++ 20 standard library header and her compiler (`g++` on Ubuntu 20.04) wasn't supported that standard. So, she tried to upgrade `cmake` naturally, as she thought it was the compiler. This made me realize, compiling a C/C++ program is unnecessarily complex and cumbersome. I mean she is a software engineer and she compiled and used some other projects in different languages but with C/C++, it was another story. So many people think C is an ancient language that needs to die, and they don't even know this build system hell hole. Guess what they will think of this after that. But we can't do anything for this, can we? Unless someone brave enough comes up and creates "the better" build system.

![Relevant xkcd: Standards https://xkcd.com/927/](/assets/img/posts/c_compiling_basics_for_those_who_feel_lost/standards.png)

## Problems With Build Systems

Note: I only know `make` and just a little bit `cmake` and `autotools`.

Maybe you think the hardest part of writing a software with C is the language itself. You are 100% wrong: It's the build systems. When I first started to learn C, I just used `gcc` on cli to compile my source codes. This was OK for a little while. When I learned more and more about C, I looked at some bigger open source projects. That's where I first saw `make`. Everyone said `make` is important for a C project and everyone should use it. So, I learned it a bit. But I should say: I struggled more learning `make` and writing `Makefile`'s than learning C and writing programs with it. I mean the documentation is good but it is huge. So as a beginner, I used some beginner friendly websites. At the end of the day (literally) I successfully wrote a `Makefile` for my little project.

After 4 years with C, I guess I wrote more than 5 `Makefile`'s. Each of them was a bit different and powerful than its predecessor. But they all have some unique problems. The most common and important problem was with the header files. C has a thing called `#define`. This thing is consumed by the compiler, and it helps configuring the project, defining constants and defining little functions (well, not real functions but I don't know what to call them) to improve performance. But one must be cautious using this preprocessor directive: Let's assume a .c file uses a definition in a .h file. If we change that definition in .h file, we **must** compile every .c file that uses that definition. But with the `Makefile`'s that I wrote, changes on .h files don't trigger recompilation. Why? Because I just couldn't write one that good enough (it is hard, OK?). So your build system must track these kind of things too if you don't want to go insane. This kind of things can be avoided if I did write better code and avoided `#define` like directives as much as possible. But we are all humans and sometimes do these kind of things without knowing.

Finally, there is this portability thing. Some people say `make` is not portable enough (might work on Linux but not on Windows, etc.). What? I spent days to learn and write a `Makefile` and now you are telling me to don't use it? Man, *?!&% this. Anyway, they also say `cmake` is easier to write and it's more portable. OK, you win. I will learn it.

## Conclusion

We can say all the build systems for every language have their own problems and quirks. But with C, there is little to none official documentation and smaller communities on YouTube like sites is a problem for outsiders and newbies. If you are in those categories, I hope this post will help you understand some of the compilation concepts that C/C++ has.

C is everywhere and the whole world probably collapse without it. If we need to use those important software, first we need to compile them. Fortunately, not all people nor developers need to compile a C program. For those who need to compile one, good luck.

## Sources

[^1]: [https://en.wikipedia.org/wiki/C_(programming_language)#ANSI_C_and_ISO_C](https://en.wikipedia.org/wiki/C_(programming_language)#ANSI_C_and_ISO_C)
[^2]: [https://en.wikipedia.org/wiki/MinGW](https://en.wikipedia.org/wiki/MinGW)
