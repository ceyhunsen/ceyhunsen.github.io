---
title: C Compiling Basics
description: A basic introduction to compiling C programs
date: 2023/01/16
---

Compiling a C program is a bit confusing for newbies since it doesn't have a
central place that you can download "the C compiler" or read the language
documentation. Don't you worry though, there is a language reference, from ISO.
But it isn't free. So, maybe worry a little?

With lack of the central authority and the wide adoption of the language
resulted community driven compilers/libraries to emerge. Meaning there is no
so-called default compiler but community driven and hugely populer
compilers/libraries.

This article tries to address what are `make`, `cmake`, `clang`, `gcc` or
`mingw` means and how do people use them to write C programs.

Most of the things that are written here also applies to C++ with some minor
differences.

## Steps and Toolset

C is no different than current programming languages when steps and toolset is
considered. But there is a caveat: You need to do some of the steps manually,
while other "modern" languages do them for you.

Let's say we need to compile a basic C program with standard library with
operating system support. These are the possible steps required to be done by
the programmer:

1. Give include directory as a flag to compiler
2. Give target source file to compiler for creating object files
3. Do these steps for every source file
4. Give object files to compiler for creating final binary

Actually steps 2 and 4 can be combined. But it is not a sane thing to do and
will be explained why, later.

If you don't want operating system defaults, want to do custom things or don't
have an operating system underneath your program, you may need to follow these
steps also:

- Write a linker file
- Give a custom standard library path to compiler
- Write required low level libraries yourself

Please note that, these steps are not necessary if you are not writing low level
software.

## The Compiler

As I said before, there is no official compiler. 2 of the most popular community
driven and open source compilers are called `gcc` and `clang`. There are other
open source and priprioraty compilers out there but these 2 will be the focus of
this article.

They are completly different compilers and developed by completely different
teams. But they function the same and used the same for the developer. Examples
will be based on `gcc` simply because I use that as my main C compiler.

They follow the standards developed by international organizations like ISO[^1].

For bare-metal targets, you mostly will need another compiler for your target
architecture. For example: You want to compile your code to ARM CPU's without
an operating system, `arm-none-eabi-gcc` is the way to go. It's basically `gcc`
but for the ARM architecture.

There is another caveat for targetting bare metal environments: Low level stuff
(like hardware interrupt handling) highly dependent on the compiler it's
developed with. That's because C standard mostly independent from CPU
architecture and compilers implement those architecture specific features
however they like. If in doubt, just grab the same compiler used in your
project.

## The Code

There are 2 kind of source files: .c and .h.

The files with .c suffix includes the main code and compiler compiles those
files to a binary format. These binary files defines code that is going to be
executed, mostly.

.h files (also called as headers) in the other hand, can also include
definitions. But they are mostly used for including declarations. Those
declarations gets passed to .c files and they won't be putted in binaries; They
tell there should be some executable code matching that definition, somewhere in
the other binaries, to the compiler.

An example to this: Let's assume we need to create a program that accepts a
number as an input and outputs 2 times of itself. This is a very basic example
that can only be written with one .c file. But for the sake of this example,
let's divide it into 3 pieces:

1. `main.c`: Calls everything
2. `input.c`: Takes the input from user
3. `calculate.c`: Calculates and prints the output

This little example's source code will roughly look like this:

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

If we give all of the these files to compiler, some compilers will produce a
binary. This is called implicit declaration and is not legal[^2] in C standard.
GCC is some of the compilers that produces an output, with a warning:

```bash
$ gcc main.c input.c calculate.c
main.c: In function ‘main’:
main.c:3:17: warning: implicit declaration of function ‘get_input’ [-Wimplicit-function-declaration]
    3 |     int input = get_input();
      |                 ^~~~~~~~~
main.c:4:5: warning: implicit declaration of function ‘calculate’ [-Wimplicit-function-declaration]
    4 |     calculate(input);
      |     ^~~~~~~~~
```

You can link completely independent C sources into one binary. Because of that,
compiler wants to know if there is a function that you are trying to call. If
there isn't, compilation will fail.

This is where header files comes to stage. When we create a .c file, we better
off put public functions declarations to an .h file. After that, compiler won't
complain and compile just fine. This also helps other developers to use your
code as a library. So, let's add these 2 header files to our little project:

`input.h`:

```c
int get_input();
```

`calculate.h`:

```c
void calculate(int input);
```

We didn't create the `main.h` file because no other .c file uses any function or
other things in `main.c`.

Finally, we need to include these 2 headers to where they are called:

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

There are no warnings anymore and is compilant with the standard.

In a real world scenario, you might see a weird stuff in header files, that
looks like `#ifndef _INPUT_H`. This is a weird workaround for the language
design. They are called
[include guards](https://en.wikipedia.org/wiki/Include_guard) and they are a
must, most of the time.

### How To Compile Source Files?

If we take the last example, our project contains these files:

```bash
├── calculate.c
├── calculate.h
├── input.c
├── input.h
└── main.c
```

Assuming our C compiler is `gcc`, we can compile everything with one of these
commands:

```bash
gcc calculate.c input.c main.c
# Or
gcc *.c
```

Either way, compile times will get longer as the project gets bigger. And there
is a huge problem comes with it: We are compiling every source file in each
iteration even we changed only one source file.

To solve this issue, we can compile every .c file separately and link them
later. if we changed the contents of a file, we won't need to compile rest of
the program and our compilation times will get lower dramatically. We can do
this by using these commands:

```bash
gcc -c calculate.c
gcc -c input.c
gcc -c main.c
gcc *.o
```

The `-c` flag will compile the source files but does not link to an executable
(creates a .o file, a.k.a. object files). Linking all the .o files together, is
way faster than compiling everything over and over. But let's say we are working
on a bigger project with 100's or 1000's of source files that are scattered in
sub-directories. Are we really going to find all the source files and compile
one by one? Maybe writing a script would do the trick, eh? But a simple script
won't keep track of the changed files and will compile everything again.
And there are so many other compilation specific stuff that we don't want to
keep track of.

Any easy way to deal with this? Yes, let's invent multiple different build
systems!

## Build Systems

Lazy people who don't want to deal with this compilation turmoil, created build
systems. Again, there is no standard, so every lazy person decided that previous
build system sucked and created a new one. So we have a handful of build systems
now. Some of them are:

- Make
- Cmake
- Autotools
- Ninja
- Meson
- Other IDE specific ones (like Code::Blocks)

Probably the most popular one is `make`. And I can say, it is a pain in the ass
to write an useful `Makefile` (which is the `make` "recipe"). There is a high
chance to spend a day in order to write a `Makefile` after a C project gets
bigger.

There are higher level build system that creates `Makefile`'s: `cmake` and
`autotools` are the 2 examples of this. But don't think they are easier to use
or easier to learn. They are just one step further from `make`, The same story
can be applied to rest, I assume.

The point of these build systems is: Let the developer worry about the code and
not on compiling it. And I have to say, they fail. I mean,  look at Rust,
`cargo` just solves so many unnecessary issues that C introduces. I don't have
to deal with third party library compilation, compile time definitions or header
files. I just run `cargo` in the root directory and `cargo` will just compile
stuff. In order to have something like this in C world, build systems must force
some project structure rules to it's users. Either no one ever wanted to create
a tool like this or C people hate to be told what to do.

Maybe we need a one last build system built upon the mistakes of it's
predecessors, that solves all of our problems and agonies?

![Relevant xkcd: Standards https://xkcd.com/927](/posts/technical-writings/c-compiling-basics/standards.png)

## Stories

There are some stories I want to tell about compiling C programs:

### Installing GCC in Windows

Back in the day, I tried to install `gcc` to my friend's Windows laptop,
needless to say it was painful. Firstly, `gcc` is not natively supported on
Windows. So some other guys ported `gcc` to Windows and called it MinGW[^3]. If
you search it on the internet, you will most likely see SourceForge links at the
top of the page. What? I get that there was no official C website but this was
too much. At least put the binaries in Github or something. When I first
visited that site, I thought it was a virus site and left. After some searching,
I gave up and downloaded it from there. Luckily, it was not a virus. But the
torture was not yet to over.

I won't tell more about this. If you are a freshman, have fun spending the rest
of your day figuring out how to install the thing properly. Fortunately, there
are some better ways to install a C compiler in Windows today, through
[WSL](https://learn.microsoft.com/en-us/windows/wsl/install). But you need to
know your way around Linux to use this.

### Confusion Between Build Systems and Compiler

If you are using some old LTS Linux distro, like Ubuntu 20.04, your compiler
probably has an old version and won't have support for new standards.

One of my colleague (had little to none experience on C/C++ before her job
there) needed to compile an open source C++ project which uses `cmake` as the
build system. The compilation was failing and she had no clue why. When I looked
at it, I saw that project included a C++ 20 standard library header and her
compiler (`g++` on Ubuntu 20.04) wasn't supporting that standard. So, she tried
to upgrade `cmake`, as she thought it was the compiler naturally.

This made me realize again that compiling a C/C++ program is unnecessarily
complex and cumbersome. She was a software engineer and she compiled and used
some other projects in different languages. But with C/C++, it was another
story. So many people think C is an ancient language that needs to die, and they
don't even know this build system hell hole.

## Conclusion

We can say all the build systems for every language have their own problems and
quirks. But with C, there is little to none official documentation and smaller
communities on newbie friendly sites, like YouTube, is a problem for outsiders
and newbies.

C is everywhere and the whole world probably collapse without it. If we need to
use those important software, first we need to compile them. Fortunately, not
all people nor developers need to compile a C program. For those who need to
compile one or worse write a compiling instruction, good luck.

## Sources

[^1]: [https://en.wikipedia.org/wiki/C_(programming_language)#ANSI_C_and_ISO_C](https://en.wikipedia.org/wiki/C_(programming_language)#ANSI_C_and_ISO_C)
[^2]: [https://stackoverflow.com/a/9182835/11719950)](https://stackoverflow.com/a/9182835/11719950))
[^3]: [https://en.wikipedia.org/wiki/MinGW](https://en.wikipedia.org/wiki/MinGW)
