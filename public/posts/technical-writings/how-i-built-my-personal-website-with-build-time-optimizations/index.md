---
title: How I Built My Personal Website With Build Time Optimizations
description: Architectural details about how I re-built my personal website using Next.js
date: 2025-09-06
---

Couple of months ago, I decided to re-write my personal website. The reason I
decided to do that was the Jekyll, which [I was previously using](https://github.com/ceyhunsen/ceyhunsen.github.io)
to build my website, is technically limiting. It aims to provide a
straightforward and easy website creation experience and it does that very well.
But I started to have this itch of having more control on the build process and
how can I customize it because I wanted to have more complex pages. Maybe I
could've done all that with Jekyll, but at some point, I had to dive into Ruby.
And if I am going to learn a new language or a framework, it better be worth the
trouble. That's why I decided to re-build my website using JavaScript.

I needed a static website builder because I don't have any dynamic data to
show. I also don't want to load MBs of JS to a person's browser, just to show
a simple text based blog post. After some research, I decided that
[Next.js](https://nextjs.org/) was a great fit. I could do all the post
category pages with components. Also, there were some great stuff like
[image optimizers](https://nextjs.org/docs/pages/api-reference/components/image),
which I could definitely use for the planned [gallery page](/gallery/).

In summary, with Next.js, I did:

- Wrote a single component that builds all the categorized post listings and
  contents
- Made an optimized gallery page with very low bandwith usage
- Moved images to a third party storage provider but still managed to put them
  under my own domain to improve SEO

## Converting Everything From Jekyll to Next.js

Main content was in markdown format before and I really wanted to stick with
that format as long as possible: It is easy to write and supported everywhere.
Luckily, Next.js had an extension that can convert markdown files to HTML.

The real issue was converting CSS files. I like this simple design of my website.
That's why I was extra careful when moving CSS files to this project. I didn't
want to lose my design because working with CSS is PITA, honestly. So, I didn't
want to deal with CSS again.

Because I didn't had any web programming experience before, I put every CSS file
in the `public/` directory as is. It is what felt natural to me. You know, you
put your header files in `headers/` directory in C and put "data" in a single
directory, so that you can easily access them. But then I met the
[CSS modules](https://nextjs.org/docs/app/getting-started/css#css-modules). This
was a very nice experience. I didn't had to look for a specific class in a very
large CSS file, if I wanted to tweak small stuffs. There are also other
technical benefits, of course, but they are not really relevant to this post.

I also considered [Tailwind CSS](https://nextjs.org/docs/app/getting-started/css#tailwind-css)
but decided against using it because I didn't wanted to rewrite everything. I also
checked out the [inline CSS](https://nextjs.org/docs/app/guides/css-in-js)
option as well. But again, decided against it because it didn't look clean and
I didn't want to close the door for other frameworks that don't support this
feature.

## Layouts and Templates

I currently have three main category for posts: Blog, technical writings and
travel logs. These all three has the same post listing pages and post page
layouts. In Jekyll, I had to provide separate files for each category. Although,
you can probably get away with a single template file and include them in every other
file. With Next.js, I managed to get away with
[a single file for all these 3 categories](https://github.com/ceyhunsen/personal-website/pull/66),
thanks to [catch all segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#catch-all-segments).

There is one other page on the navigation bar: Gallery. I wanted to share the
pictures I took in this website within a gallery view. I just couldn't display
all the images in a single page because it would've cause extensive resource
usage on visitors' devices. That's why I needed to paginate available pictures.
To do that, I used the [optional catch all segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#optional-catch-all-segments)
feature.

![Diagram of the post categories and the gallery page]()

There is a single difference between these two segment types: One also captures
the url, as explained in the documentation. This was useful for me, because for
the post pages, I didn't want to have a parent route; They are based on the base
URL. But for the gallery page, route acts the same as the childs (`gallery/`
equals to `gallery/1`).

## Pagination

I couldn't find a way to paginate my post categories with Jekyll. Although I
didn't had "that" many posts to have the resource hogging issue at that time,
but it still bottered me. This was one of the big reasons I switched to the
Next.js.

I had to "misuse" [`generateStaticParams()`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
function to achieve pagination. Because I didn't want any other subpage
starting with something like `page/1` or use queries to achieve this in the
runtime. To be honest, using queries to do this at runtime is the most popular
way to do this. But because I don't have any dynamic data that needs to be
fetched from another source, doing so would only slowed my website. I had all
the posts in my repo and they can be known at the compile time.

So, when I was adding my post names to the list, I also added every single page
as an entry.

```js
[
  { posts: [ 'blog' ] },
  { posts: [ 'blog', 'i-crashed-my-motorcycle-and-broke-my-wrist' ] },
  { posts: [ 'blog', 'motivations-behind-having-a-personal-website' ] },
  { posts: [ 'blog', '1' ] },
  { posts: [ 'technical-writings' ] },
  {
    posts: [ 'technical-writings', 'how-did-i-build-my-personal-website' ]
  },
  { posts: [ 'technical-writings', 'c-compiling-basics' ] },
  { posts: [ 'technical-writings', '1' ] },
  { posts: [ 'travel-logs' ] },
  { posts: [ 'travel-logs', 'rotasiz-gezgin-koyu' ] },
  { posts: [ 'travel-logs', 'riva-avenue' ] },
  { posts: [ 'travel-logs', 'bangkok' ] },
  { posts: [ 'travel-logs', 'kuzuludere-goleti' ] },
  { posts: [ 'travel-logs', 'kapanca-ancient-harbor' ] },
  { posts: [ 'travel-logs', '1' ] }
]
```

With this trick, I can either display a post listing page for the ith page or
the actual post. All I needed to do is to determine if the slug is a number or
a post name, which is [very easy](https://github.com/ceyhunsen/personal-website/blob/fd72addc39168bcb466066ce7acc63d273169755/src/_components/posts/list_posts_by_category/index.tsx#L85).

## Image Optimization

At the start of this article, I stated that Next.js provides a component that
can optimize your image. Although it was true, I couldn't use that in my website
because of how it works. At compile time, it optimizes images for several screen
sizes and serves the correct image in the runtime depending on the client's
screen. This is very nice but my server, GitHub Pages, doesn't support this
feature. I didn't wanted to switch my hosting service because it is very
convinient and free. This left me a single choice: Doing my own image
optimization at compile time.

Because I didn't want to do any client-side operation, I just can't have the
same level of optimization as the Next.js. But, I can do compile time
optimizations for the average user.

![Optimized image, compared to the actual image]()

I managed to optimize images using [sharp](https://sharp.pixelplumbing.com/),
which Next.js also uses for the `Image` component I believe. Even though I serve
optimized and fractionally smaller images to the users by default, I didn't
hesitate to display the full images if the user wanted. Currently, I do this
only for gallery pages -which needs this more- but planning to implement this
for every image in my website, in the future.

```sh
# Example size differences between an optimized thumbnail and the real one
$ du -sh --human-readable 1_CDHsZgZus6kvjTNMDKq6INk6vzxzc7y.jpg thumbnails/1_CDHsZgZus6kvjTNMDKq6INk6vzxzc7y.webp 
14M     1_CDHsZgZus6kvjTNMDKq6INk6vzxzc7y.jpg
44K     thumbnails/1_CDHsZgZus6kvjTNMDKq6INk6vzxzc7y.webp
$ du -sh --human-readable 1lOAo-5YxqTq-yjTRj0yVG3m5MqIveH2j.jpg thumbnails/1lOAo-5YxqTq-yjTRj0yVG3m5MqIveH2j.webp 
1.8M    1lOAo-5YxqTq-yjTRj0yVG3m5MqIveH2j.jpg
28K     thumbnails/1lOAo-5YxqTq-yjTRj0yVG3m5MqIveH2j.webp
```

This optimization saved insane amount of bandwith. Even though I optimize images
only by 70% (by default), the images got 50 to 300 times more smaller! I think
that the difference in gain has to do something with the image format, most
probably.

## Storing Images

At the very beginning, I haven't even thought it could cause any problems to
push every image to GitHub. After several posts, I saw that pushing images to
GitHub was taking a while. And finally, I saw that a person that was cloning my
website had to wait couple of minutes because the repo was over 100 MBs and
their internet connection was slow. Also had the same issue myself actually,
when I had to clone this repo to my laptop using mobile data. I had to move my
images to somewhere else to fix that.

I though I could maybe move the images a third party storage provider and link
them there. But I read that having images under your own domain helps with SEO.
This left me with only one option: Downloading images at compile time. To do
that:

1. Moved my gallery images, which takes most of the space, to a third party
   storage provider.
2. Modified the gallery page, so that it only accepts URLs and downloads them.
3. Optimizes downloaded images and links the "thumbnails" with the full images.

This really decreased the repo size but I still had lots of images sitting
around. To also use URLs in posts, I had to check every `<img>` tags' source.
[Remark](https://remark.js.org/), which is the thing I used to convert markdown
into HTML, has the ability to let me define my own plugins. I was using this
feature to add captions for my images. All I had to do that was to check if an
`img`'s `src` attribute is an URL or not. This worked out really great and I
added a middleman that downloads and changes the `src` to the local source at
compile time.

After all these changes, the repo itself got shrunk. But still, if this repo was
cloned, `git` still downloaded the history of images. I had to
[remove the whole git history](https://stackoverflow.com/questions/13716658/how-to-delete-all-commit-history-in-github)
to fix that. Size went from hundreds of MBs to only ~5 MB. This was a huge
improvement.

```sh
$ du -sh --human-readable personal-website/
5.3M    personal-website/
```

## Conclusion

Switching to Next.js was a new experience. I previously tangled with Node.js
components in my old job while using React Native. So, I wasn't really new to
anything but still was an amateur. This re-write helped me learn lots of things.

I like doing things in compile time whether it is an embedded C project or a web
project like this. I really had hard times implementing pagination and image
optimization while doing them in compile time but it really was worth it.

I can't really tell if other alternatives to Next.js are better for making
static websites. But I can tell that this framework is very flexible, so that I
can do all these non-ordinary stuff. I don't have any regrets for switching.

Damn, I like static stuff that are dynamically built.
